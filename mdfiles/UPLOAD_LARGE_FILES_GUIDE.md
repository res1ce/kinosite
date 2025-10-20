# Руководство по загрузке больших видео файлов (до 1GB)

## Что было настроено

Система теперь поддерживает загрузку видео файлов размером до **1GB** (1000MB).

## Изменённые файлы

### 1. Next.js конфигурация (`web/next.config.ts`)
```typescript
experimental: {
  serverActions: {
    bodySizeLimit: '1000mb', // Лимит для Server Actions
  },
}
```

### 2. API роут загрузки (`web/src/app/api/upload/route.ts`)
```typescript
export const maxDuration = 300; // 5 минут на загрузку
export const dynamic = 'force-dynamic';
```

### 3. Vercel конфигурация (`web/vercel.json`)
Создан файл для настройки Vercel:
- `maxDuration`: 300 секунд (5 минут)
- `memory`: 3008MB (максимум для Pro плана)

### 4. Компонент VideoUploader
Обновлена подсказка: "Максимальный размер: до 1GB"

## Настройка хостинга

### Для Vercel

**ВАЖНО:** На Vercel есть ограничения в зависимости от плана:
- **Hobby (бесплатный)**: максимум 50MB
- **Pro**: максимум 100MB для функций
- **Enterprise**: до 1GB с настройками

Если у вас Vercel Hobby/Pro план, рекомендуется:

#### Вариант 1: Использовать внешнее хранилище
Загружайте большие видео на:
- **AWS S3** + CloudFront
- **Cloudflare R2** (бесплатный для разумных объёмов)
- **DigitalOcean Spaces**
- **Backblaze B2**

#### Вариант 2: Перейти на VPS/Dedicated хостинг

### Для VPS/Dedicated сервера (с Nginx)

1. **Обновите конфигурацию Nginx:**
   ```bash
   sudo nano /etc/nginx/nginx.conf
   ```

2. **Добавьте в `http` блок:**
   ```nginx
   client_max_body_size 1024M;
   client_body_timeout 300s;
   client_header_timeout 300s;
   ```

3. **Перезапустите Nginx:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Файл с примером конфигурации:**
   См. `nginx-upload-config.conf`

### Для Apache

Создайте/обновите `.htaccess`:
```apache
# Увеличиваем лимит загрузки до 1GB
php_value upload_max_filesize 1024M
php_value post_max_size 1024M
php_value max_execution_time 300
php_value max_input_time 300
php_value memory_limit 512M

# Таймауты
RequestReadTimeout body=300
```

### Для Node.js standalone сервера

Используйте переменные окружения:
```bash
# В .env или при запуске
NODE_OPTIONS="--max-old-space-size=4096"
```

## PM2 конфигурация (для production)

Создайте `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'kinosite',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=4096'
    },
    max_memory_restart: '2G',
    instances: 1,
    exec_mode: 'cluster'
  }]
}
```

## Проверка настроек

### 1. Локальная разработка
```bash
cd web
npm run dev
```
Попробуйте загрузить файл 650MB в админке.

### 2. Production build
```bash
cd web
npm run build
npm start
```

### 3. Проверка размера файла
В браузерной консоли при загрузке вы увидите процесс загрузки.

## Оптимизация видео

Для лучшей производительности рекомендуется сжимать видео перед загрузкой:

### С помощью FFmpeg
```bash
# Сжатие с сохранением качества (H.264, разумный битрейт)
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4

# Для веба (быстрая загрузка)
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset fast -vf scale=1920:-2 -c:a aac -b:a 96k output.mp4

# WebM формат (лучше для веба)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 96k output.webm
```

### Онлайн инструменты
- [HandBrake](https://handbrake.fr/) (бесплатно, десктоп)
- [CloudConvert](https://cloudconvert.com/) (онлайн)
- [FFmpeg.app](https://ffmpeg.app/) (в браузере)

## Рекомендации

### Размер видео
- **До 200MB**: загружается быстро, работает везде
- **200-500MB**: нормально для большинства хостингов
- **500MB-1GB**: требует специальной настройки хостинга

### Формат
1. **MP4 (H.264)** - лучшая совместимость
2. **WebM (VP9)** - меньший размер, новые браузеры
3. **OGG** - открытый формат, но менее популярен

### Качество
- 1920x1080 (Full HD) - оптимально
- 1280x720 (HD) - для мобильных устройств
- Битрейт видео: 3-5 Mbps для 1080p
- Битрейт аудио: 128 kbps достаточно

## Troubleshooting

### Ошибка "Payload too large"
- Проверьте `next.config.ts`
- Проверьте настройки Nginx/Apache
- Проверьте лимиты хостинга

### Таймаут при загрузке
- Увеличьте `maxDuration` в `route.ts`
- Проверьте настройки Nginx timeout
- Используйте более быстрый интернет

### Ошибка памяти (Out of Memory)
- Увеличьте `NODE_OPTIONS="--max-old-space-size=4096"`
- Используйте сервер с большей RAM (минимум 2GB)
- Сожмите видео перед загрузкой

### На Vercel не работает
- Vercel Hobby/Pro имеет жёсткие лимиты
- Используйте внешнее хранилище (S3, R2)
- Или перейдите на VPS хостинг

## Альтернативные решения

### 1. Chunked Upload (загрузка частями)
Для файлов > 1GB можно реализовать загрузку по частям:
- Frontend разбивает файл на чанки по 50MB
- Отправляет последовательно
- Backend собирает обратно

### 2. Direct Upload к CDN
- Загрузка напрямую в S3/R2 из браузера
- Получение signed URL от сервера
- Экономия трафика сервера

### 3. Внешние видео
- Используйте YouTube, Vimeo, Rutube
- Вставляйте ссылку в поле "URL видео"
- Не занимает место на хостинге

## Дополнительная информация

### Стоимость хранения (примерная)

**Cloudflare R2:**
- Хранение: $0.015/GB/месяц
- 650MB видео ≈ $0.01/месяц
- Первые 10GB бесплатно

**AWS S3:**
- Хранение: $0.023/GB/месяц
- 650MB видео ≈ $0.015/месяц

**VPS (Hetzner, DigitalOcean):**
- 40GB SSD диск ≈ $4-6/месяц
- Неограниченный трафик (обычно)

## Контакты и поддержка

Если возникли проблемы с загрузкой больших файлов на вашем конкретном хостинге, свяжитесь с их поддержкой для увеличения лимитов.

