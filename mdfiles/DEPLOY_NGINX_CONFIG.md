# 🚀 Инструкция по обновлению Nginx конфигурации

## Что было изменено в nginx.conf

### ✅ Добавлено в секцию `http` (глобально):
```nginx
# Лимит размера тела запроса до 1GB
client_max_body_size 1024M;

# Таймауты для больших файлов
client_body_timeout 300s;
client_header_timeout 300s;
proxy_read_timeout 300s;
proxy_connect_timeout 300s;
proxy_send_timeout 300s;

# Буферы для больших запросов
client_body_buffer_size 128k;
client_header_buffer_size 1k;
large_client_header_buffers 4 16k;
```

### ✅ Добавлено в секцию `server` (для вашего сайта):
```nginx
# Переопределяем для этого сервера
client_max_body_size 1024M;
client_body_timeout 300s;
client_header_timeout 300s;
```

### ✅ Создана специальная локация `/api/upload`:
```nginx
location /api/upload {
    # Специальные настройки для загрузки больших видео
    client_max_body_size 1024M;
    proxy_read_timeout 300s;
    proxy_request_buffering off;  # Важно!
    # ... остальные настройки
}
```

## 📋 Пошаговая инструкция по применению

### Шаг 1: Создайте бэкап текущей конфигурации

```bash
# Подключитесь к серверу по SSH
ssh your_user@zabkinokom.ru

# Создайте бэкап
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
sudo cp /path/to/your/nginx.conf /path/to/your/nginx.conf.backup

# Или если конфиг в Docker volume:
docker cp nginx_container:/etc/nginx/nginx.conf ./nginx.conf.backup
```

### Шаг 2: Загрузите новый конфиг на сервер

**Вариант A: Через SCP (если есть SSH доступ)**
```bash
# С вашего компьютера:
scp nginx.conf your_user@zabkinokom.ru:/tmp/nginx.conf
```

**Вариант B: Через Docker volume (если используете Docker)**
```bash
# Скопируйте файл в контейнер
docker cp nginx.conf nginx_container:/etc/nginx/nginx.conf
```

**Вариант C: Через панель управления хостингом**
- Откройте файловый менеджер
- Найдите `nginx.conf`
- Замените содержимое на новое

### Шаг 3: Проверьте конфигурацию

```bash
# Если Nginx установлен напрямую:
sudo nginx -t

# Если используете Docker:
docker exec nginx_container nginx -t
```

Вы должны увидеть:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

❌ **Если есть ошибки:**
- Проверьте, что все пути корректны (`/usr/share/nginx/html`)
- Убедитесь, что upstream `nextjs:3000` корректен
- Восстановите бэкап: `sudo cp /etc/nginx/nginx.conf.backup /etc/nginx/nginx.conf`

### Шаг 4: Перезагрузите Nginx

```bash
# Если Nginx установлен напрямую:
sudo systemctl reload nginx
# или
sudo nginx -s reload

# Если используете Docker:
docker restart nginx_container
# или
docker-compose restart nginx
```

### Шаг 5: Проверьте работу

1. **Откройте сайт:** https://zabkinokom.ru
   - Должен работать как обычно

2. **Проверьте загрузку:**
   - Зайдите в админку: https://zabkinokom.ru/admin
   - Перейдите в "Редактор контента"
   - Попробуйте загрузить видео 650MB

3. **Проверьте логи (если что-то не работает):**
   ```bash
   # Nginx логи
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/nginx/access.log
   
   # Или в Docker:
   docker logs -f nginx_container
   docker logs -f nextjs_container
   ```

## 🔍 Диагностика проблем

### Проблема: "413 Payload Too Large"

**Решение:**
```bash
# Проверьте, что конфиг применился:
sudo nginx -T | grep client_max_body_size

# Должно быть:
# client_max_body_size 1024M;

# Если нет, проверьте, что вы перезагрузили Nginx:
sudo systemctl reload nginx
```

### Проблема: "504 Gateway Timeout"

**Решение:**
```bash
# Проверьте таймауты:
sudo nginx -T | grep timeout

# Увеличьте еще больше, если нужно:
# В nginx.conf замените 300s на 600s
```

### Проблема: Next.js падает при загрузке

**Решение:**
```bash
# Проверьте логи Next.js:
docker logs nextjs_container

# Убедитесь, что контейнер имеет достаточно памяти:
docker stats nextjs_container

# Если нужно, увеличьте память в docker-compose.yml:
services:
  nextjs:
    deploy:
      resources:
        limits:
          memory: 2G
```

## 📦 Docker Compose (если используете)

Если у вас есть `docker-compose.yml`, убедитесь, что он выглядит примерно так:

```yaml
version: '3.8'

services:
  nextjs:
    build: ./web
    container_name: nextjs_container
    environment:
      - NODE_ENV=production
      - NODE_OPTIONS=--max-old-space-size=4096
    volumes:
      - ./web/public/uploads:/app/public/uploads
    deploy:
      resources:
        limits:
          memory: 2G
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: nginx_container
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./web/public/uploads:/usr/share/nginx/html/uploads:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - nextjs
    restart: unless-stopped
```

Затем:
```bash
docker-compose down
docker-compose up -d
```

## ✅ Чеклист после деплоя

- [ ] Сайт открывается (https://zabkinokom.ru)
- [ ] Админка работает
- [ ] Можно зайти в "Редактор контента"
- [ ] Загрузка видео до 100MB работает
- [ ] Загрузка видео 650MB работает
- [ ] PDF файлы открываются
- [ ] Изображения отображаются
- [ ] SSL сертификат работает

## 🆘 Откат изменений

Если что-то пошло не так:

```bash
# Восстановите бэкап:
sudo cp /etc/nginx/nginx.conf.backup /etc/nginx/nginx.conf

# Перезапустите:
sudo systemctl reload nginx

# Или в Docker:
docker cp nginx.conf.backup nginx_container:/etc/nginx/nginx.conf
docker restart nginx_container
```

## 📞 Дополнительная помощь

Если загрузка всё равно не работает, проверьте:

1. **Системные лимиты Linux:**
   ```bash
   ulimit -a
   # Если file size ограничен, увеличьте в /etc/security/limits.conf
   ```

2. **Место на диске:**
   ```bash
   df -h
   # Убедитесь, что есть минимум 2GB свободного места
   ```

3. **Права на папку uploads:**
   ```bash
   ls -la /usr/share/nginx/html/uploads/
   # Должны быть права на запись для nginx пользователя
   sudo chmod 755 /usr/share/nginx/html/uploads/
   ```

4. **Конфликт с другими настройками:**
   ```bash
   # Проверьте, нет ли других конфигов, которые переопределяют лимиты:
   sudo nginx -T | grep -i "client_max_body_size"
   ```

---

**Файл подготовлен:** `nginx.conf` (в корне проекта)  
**Дата:** 2025-01-16  
**Поддерживаемый размер видео:** до 1GB (1024MB)

