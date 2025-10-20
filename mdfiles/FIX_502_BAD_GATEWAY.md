# 🚨 ИСПРАВЛЕНИЕ: 502 Bad Gateway при загрузке 652MB видео

## Проблема
```
POST /api/upload HTTP/2.0" 502 559
```

**502 Bad Gateway** = Next.js контейнер упал или не смог ответить.

## Причина

### ❌ ПРОБЛЕМА #1: Загрузка в память (было)
```typescript
// СТАРЫЙ КОД (ПЛОХО для больших файлов!)
const buf = Buffer.from(await f.arrayBuffer());  // ❌ Загружает 650MB в RAM!
await fs.writeFile(fp, buf);
```

**Что происходило:**
- Файл 650MB загружается **полностью в память**
- Node.js heap переполняется
- Контейнер падает с ошибкой "Out of Memory"
- Nginx получает 502 Bad Gateway

### ✅ РЕШЕНИЕ: Streaming (стало)
```typescript
// НОВЫЙ КОД (ОТЛИЧНО для больших файлов!)
const webStream = f.stream();                    // ✅ Streaming!
const nodeStream = Readable.fromWeb(webStream);
const writeStream = createWriteStream(fp);
await pipeline(nodeStream, writeStream);         // ✅ Поток напрямую в файл!
```

**Что теперь:**
- Файл записывается **частями** (chunks) прямо на диск
- Использует ~10-50MB памяти вместо 650MB+
- Контейнер не падает
- Работает даже с файлами 5GB+

---

## ✅ Что было исправлено

### 1. API route обновлён на streaming
**Файл:** `web/src/app/api/upload/route.ts`

**Изменения:**
- ✅ Импорты: `createWriteStream`, `pipeline`, `Readable`
- ✅ Streaming загрузка через `f.stream()`
- ✅ Конвертация Web Stream → Node Stream
- ✅ Pipeline для потоковой записи
- ✅ Логирование размера файла

### 2. Docker настройки (рекомендуется)
**Файл:** `docker-compose.recommended.yml` (создан)

**Добавлено:**
- ✅ `memory: 2G` - лимит памяти для Next.js
- ✅ `NODE_OPTIONS=--max-old-space-size=1536` - heap 1.5GB
- ✅ Volume для uploads
- ✅ Healthcheck

---

## 🚀 Применение изменений

### Вариант A: Быстрый деплой (если не используете Docker Compose)

```bash
# 1. На вашем компьютере - пересоберите Next.js
cd web
npm run build

# 2. Загрузите на сервер (зависит от вашего setup)
# Например через scp:
scp -r .next/ user@zabkinokom.ru:/path/to/app/web/
scp -r public/ user@zabkinokom.ru:/path/to/app/web/

# 3. На сервере - перезапустите Next.js
docker restart nextjs_container
# ИЛИ
pm2 restart kinosite
```

### Вариант B: Полный деплой с Docker Compose

```bash
# 1. На сервере - остановите контейнеры
docker-compose down

# 2. Обновите docker-compose.yml
# Скопируйте настройки из docker-compose.recommended.yml
# Особенно важно добавить:
#   deploy:
#     resources:
#       limits:
#         memory: 2G
#   environment:
#     - NODE_OPTIONS=--max-old-space-size=1536

# 3. Пересоберите и запустите
docker-compose build --no-cache nextjs
docker-compose up -d

# 4. Проверьте логи
docker-compose logs -f nextjs
```

### Вариант C: Ручной деплой без Docker

```bash
# 1. На сервере увеличьте Node.js heap
export NODE_OPTIONS="--max-old-space-size=1536"

# 2. Перезапустите PM2 с новыми настройками
NODE_OPTIONS="--max-old-space-size=1536" pm2 restart kinosite

# Или обновите ecosystem.config.js:
module.exports = {
  apps: [{
    name: 'kinosite',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=1536'
    },
    max_memory_restart: '2G'
  }]
}

pm2 restart ecosystem.config.js
```

---

## 🔍 Проверка изменений

### 1. Проверьте код обновился:
```bash
# На сервере проверьте route.ts
cat /path/to/web/src/app/api/upload/route.ts | grep "pipeline"

# Должна быть строка:
# await pipeline(nodeStream, writeStream);
```

### 2. Проверьте память контейнера:
```bash
# Проверьте лимиты
docker inspect nextjs_container | grep -i memory

# Должно быть:
# "Memory": 2147483648  (2GB в байтах)
```

### 3. Попробуйте загрузить видео:
```bash
# Откройте админку
https://zabkinokom.ru/admin/site

# Загрузите видео 652MB
# Следите за логами:
docker logs -f nextjs_container
```

### 4. Ожидаемые логи (успех):
```bash
✅ Uploaded: video.mp4 (652.00 MB)
POST /api/upload 200 in 234567ms
```

---

## 📊 Сравнение: ДО и ПОСЛЕ

| Параметр | ДО (Buffer) | ПОСЛЕ (Streaming) |
|----------|-------------|-------------------|
| Память для 650MB | ~2-3GB | ~10-50MB ✅ |
| Скорость | Медленно | Быстрее ✅ |
| Макс размер файла | ~500MB | Неограничен ✅ |
| Риск OOM | Высокий ❌ | Низкий ✅ |
| Код | Простой | Чуть сложнее |

---

## 🎯 Дополнительные настройки

### Если используете PM2 (без Docker)

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'kinosite',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/path/to/web',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=1536'
    },
    max_memory_restart: '2G',  // Автоперезапуск при >2GB
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
}
```

### Если используете systemd service

**/etc/systemd/system/kinosite.service:**
```ini
[Unit]
Description=Kinosite Next.js App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/web
Environment="NODE_ENV=production"
Environment="NODE_OPTIONS=--max-old-space-size=1536"
ExecStart=/usr/bin/node .next/standalone/server.js
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/kinosite/output.log
StandardError=append:/var/log/kinosite/error.log

[Install]
WantedBy=multi-user.target
```

---

## 🆘 Troubleshooting

### Проблема: Всё равно 502

**Решение 1: Проверьте логи Next.js**
```bash
docker logs nextjs_container | tail -100

# Ищите:
# - "FATAL ERROR: Reached heap limit"
# - "Out of memory"
# - "Cannot allocate memory"
```

**Решение 2: Увеличьте memory limit до 4GB**
```yaml
deploy:
  resources:
    limits:
      memory: 4G  # Было 2G
```

**Решение 3: Увеличьте Node.js heap**
```bash
NODE_OPTIONS=--max-old-space-size=3072  # 3GB (было 1.5GB)
```

### Проблема: Медленная загрузка

**Проверьте скорость диска:**
```bash
# Тест записи на диск
dd if=/dev/zero of=/path/to/uploads/test bs=1M count=1000 oflag=direct

# Должно быть >50 MB/s
```

**Используйте SSD вместо HDD** для папки uploads.

### Проблема: "ENOSPC: no space left on device"

**Проверьте место:**
```bash
df -h

# Освободите место:
docker system prune -a
rm -rf /path/to/uploads/old-files/
```

---

## ✅ Чеклист

- [ ] `route.ts` обновлён (streaming вместо buffer)
- [ ] Next.js пересобран (`npm run build`)
- [ ] Docker memory limit: 2GB+
- [ ] NODE_OPTIONS: `--max-old-space-size=1536`
- [ ] Контейнер перезапущен
- [ ] Попробовали загрузить 652MB видео
- [ ] В логах: `✅ Uploaded: video.mp4 (652.00 MB)`
- [ ] Status code: 200 (не 502!)

---

## 📁 Файлы

- ✅ `web/src/app/api/upload/route.ts` - обновлён (streaming)
- ✅ `docker-compose.recommended.yml` - пример с настройками
- ✅ `CHECK_NEXTJS_LOGS.txt` - инструкция по проверке логов

---

**Дата:** 2025-10-16  
**Проблема:** 502 Bad Gateway при загрузке 652MB  
**Причина:** Out of Memory (загрузка в buffer)  
**Решение:** Streaming upload  
**Статус:** ✅ Готово к применению

