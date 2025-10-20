# 🚨 КРИТИЧНО: Next.js контейнер убивается (OOM Killer)

## Проблема
```
nextjs_app  | Killed
```

**"Killed"** = Linux OOM Killer убил процесс из-за нехватки памяти.

## Что происходит

1. Начинается загрузка видео 652MB
2. FormData парсится Next.js
3. Память контейнера заканчивается
4. Linux kernel убивает процесс (`Killed`)
5. Контейнер перезапускается
6. Nginx видит, что upstream пропал → 502 Bad Gateway

---

## 🚀 СРОЧНОЕ РЕШЕНИЕ

### Вариант 1: Увеличить memory limit в docker-compose.yml (РЕКОМЕНДУЕТСЯ)

Найдите ваш `docker-compose.yml` на сервере и добавьте:

```yaml
services:
  nextjs:  # или web, или как у вас называется
    # ... существующие настройки ...
    
    # ⭐ ДОБАВЬТЕ ЭТО:
    deploy:
      resources:
        limits:
          memory: 3G        # ⚠️ КРИТИЧНО! Минимум 3GB для 650MB файлов
          cpus: '2.0'
        reservations:
          memory: 1G
    
    environment:
      # ⭐ ДОБАВЬТЕ ЭТО:
      - NODE_OPTIONS=--max-old-space-size=2048  # Node.js heap 2GB
      # ... остальные переменные ...
```

**Применение:**
```bash
cd /path/to/your/project
docker-compose down
docker-compose up -d

# Проверка:
docker inspect nextjs_app | grep -i memory
# Должно показать: "Memory": 3221225472 (3GB в байтах)
```

---

### Вариант 2: Docker run с флагами (если не используете compose)

```bash
docker stop nextjs_app
docker rm nextjs_app

docker run -d \
  --name nextjs_app \
  --memory="3g" \
  --memory-swap="3g" \
  --cpus="2.0" \
  -e NODE_OPTIONS="--max-old-space-size=2048" \
  -e NODE_ENV=production \
  -v /path/to/uploads:/app/public/uploads \
  -p 3000:3000 \
  --restart unless-stopped \
  your-nextjs-image:latest
```

---

### Вариант 3: Временный фикс (если нет доступа к docker-compose)

Увеличьте общий лимит памяти Docker:

```bash
# Проверьте текущие лимиты
docker system info | grep -i memory

# В /etc/docker/daemon.json добавьте:
{
  "default-memory": "3G",
  "default-memory-swap": "3G"
}

# Перезапустите Docker
sudo systemctl restart docker
docker-compose up -d
```

---

## 📊 Требования к памяти

| Действие | Требуемая память |
|----------|------------------|
| Next.js base | ~300-500MB |
| FormData parse (650MB file) | ~700-1000MB |
| Streaming processing | ~50-100MB |
| Buffer + резерв | ~500MB |
| **ИТОГО минимум** | **~2-3GB** |

**Рекомендация: 3GB** для комфортной работы с файлами до 1GB.

---

## 🔍 Проверка текущих лимитов

```bash
# 1. Проверьте лимиты контейнера
docker inspect nextjs_app | grep -i memory

# Вы увидите что-то вроде:
# "Memory": 536870912,  ← Это 512MB (МАЛО! ❌)

# 2. Проверьте реальное использование
docker stats nextjs_app

# Должно быть:
# MEM USAGE / LIMIT
# 450MiB / 3GiB  ✅  (хорошо)
# 490MiB / 512MiB ❌ (плохо - на пределе!)

# 3. Проверьте логи OOM killer
sudo dmesg | grep -i "killed process"
# Если есть строки с nextjs/node - это OOM killer убил процесс
```

---

## ⚡ Быстрый фикс (если срочно нужно)

Если у вас нет времени менять docker-compose:

### Вариант A: Используйте внешнее хранилище
1. Загрузите видео на **Cloudflare R2** или **AWS S3**
2. Получите публичный URL
3. Используйте поле "URL видео" в админке (вместо загрузки файла)

### Вариант B: Сожмите видео
```bash
# Сожмите 650MB → 200-300MB
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -vf scale=1920:-2 -c:a aac -b:a 128k output.mp4

# Теперь файл влезет в 1GB лимит
```

---

## 🎯 Пошаговая инструкция

### ШАГ 1: Найдите docker-compose.yml на сервере

```bash
# Подключитесь к серверу
ssh user@zabkinokom.ru

# Найдите файл
find ~ -name "docker-compose.yml" 2>/dev/null
# Или
find /opt -name "docker-compose.yml" 2>/dev/null
find /var/www -name "docker-compose.yml" 2>/dev/null
```

### ШАГ 2: Отредактируйте файл

```bash
nano /path/to/docker-compose.yml

# Добавьте в секцию nextjs/web:
deploy:
  resources:
    limits:
      memory: 3G
environment:
  - NODE_OPTIONS=--max-old-space-size=2048

# Сохраните: Ctrl+O, Enter, Ctrl+X
```

### ШАГ 3: Примените изменения

```bash
cd /path/to/docker-compose/directory
docker-compose down
docker-compose up -d

# Проверьте логи
docker-compose logs -f nextjs
```

### ШАГ 4: Проверьте лимиты

```bash
docker stats nextjs_app

# Должно показать:
# MEM USAGE / LIMIT
# 450MiB / 3GiB  ✅
```

### ШАГ 5: Попробуйте загрузить видео

Откройте https://zabkinokom.ru/admin/site и загрузите 652MB файл.

**Ожидаемые логи:**
```bash
docker logs -f nextjs_app

# Должно быть:
✅ Uploaded: video.mp4 (652.00 MB)
POST /api/upload 200 in 287456ms
```

**БЕЗ строки "Killed"!**

---

## 📋 Checklist

- [ ] Найден docker-compose.yml на сервере
- [ ] Добавлен `memory: 3G` в deploy/resources/limits
- [ ] Добавлен `NODE_OPTIONS=--max-old-space-size=2048`
- [ ] Выполнен `docker-compose down && docker-compose up -d`
- [ ] Проверены лимиты: `docker inspect nextjs_app | grep Memory`
- [ ] Проверено использование: `docker stats nextjs_app`
- [ ] Попробована загрузка видео
- [ ] В логах НЕТ "Killed"
- [ ] В логах ЕСТЬ "✅ Uploaded: video.mp4"
- [ ] Status code: 200 (не 502!)

---

## 🆘 Если не можете найти docker-compose.yml

Проверьте, как запущен контейнер:

```bash
# Посмотрите команду запуска
docker inspect nextjs_app | grep -A 30 "Cmd"

# Если контейнер запущен через docker run, пересоздайте его:
docker stop nextjs_app
docker rm nextjs_app

docker run -d \
  --name nextjs_app \
  --memory="3g" \
  --memory-swap="3g" \
  -e NODE_OPTIONS="--max-old-space-size=2048" \
  # ... остальные параметры из docker inspect ...
  your-image:latest
```

---

## 📞 Дополнительная помощь

Если нужна помощь, пришлите вывод команд:

```bash
# 1. Текущие лимиты
docker inspect nextjs_app | grep -i memory

# 2. Содержимое docker-compose.yml (если есть)
cat /path/to/docker-compose.yml

# 3. Логи OOM killer
sudo dmesg | grep -i "out of memory" | tail -20
```

---

**Дата:** 2025-10-16  
**Критичность:** 🚨 КРИТИЧНО  
**Проблема:** OOM Killer убивает Next.js при загрузке 650MB  
**Решение:** Увеличить memory limit до 3GB  
**Приоритет:** СРОЧНО  
**Статус:** ⚠️ ТРЕБУЕТ ПРИМЕНЕНИЯ НА СЕРВЕРЕ

