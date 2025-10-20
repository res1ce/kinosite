#!/bin/bash
# ═══════════════════════════════════════════════════════
# 🚨 СКРИПТ: Быстрое исправление OOM Killer
# ═══════════════════════════════════════════════════════
# 
# ИНСТРУКЦИЯ:
# 1. Загрузите этот файл на сервер
# 2. Сделайте исполняемым: chmod +x DOCKER_MEMORY_FIX_COMMANDS.sh
# 3. Запустите: ./DOCKER_MEMORY_FIX_COMMANDS.sh
#
# ═══════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════════"
echo "🔍 ДИАГНОСТИКА: Проверка текущих лимитов памяти"
echo "═══════════════════════════════════════════════════════"

# Находим Next.js контейнер
NEXTJS_CONTAINER=$(docker ps --format '{{.Names}}' | grep -E 'nextjs|web|app' | head -1)

if [ -z "$NEXTJS_CONTAINER" ]; then
    echo "❌ Контейнер Next.js не найден!"
    echo "Запущенные контейнеры:"
    docker ps --format "table {{.Names}}\t{{.Status}}"
    exit 1
fi

echo "✅ Найден контейнер: $NEXTJS_CONTAINER"
echo ""

# Проверяем текущий лимит памяти
echo "📊 Текущий лимит памяти:"
CURRENT_MEMORY=$(docker inspect $NEXTJS_CONTAINER --format='{{.HostConfig.Memory}}')
if [ "$CURRENT_MEMORY" = "0" ]; then
    echo "   Лимит не установлен (неограничен)"
else
    MEMORY_GB=$(echo "scale=2; $CURRENT_MEMORY / 1024 / 1024 / 1024" | bc)
    echo "   $MEMORY_GB GB"
    
    if (( $(echo "$MEMORY_GB < 2" | bc -l) )); then
        echo "   ⚠️  МАЛО! Нужно минимум 3GB"
    fi
fi

echo ""
echo "📊 Реальное использование памяти:"
docker stats $NEXTJS_CONTAINER --no-stream --format "table {{.Container}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🔧 РЕШЕНИЕ: Увеличение лимита памяти до 3GB"
echo "═══════════════════════════════════════════════════════"

# Ищем docker-compose.yml
echo "🔍 Ищем docker-compose.yml..."
COMPOSE_FILE=$(find /opt /var/www /home ~ -name "docker-compose.yml" 2>/dev/null | head -1)

if [ -n "$COMPOSE_FILE" ]; then
    echo "✅ Найден: $COMPOSE_FILE"
    echo ""
    echo "📝 Создаём бэкап..."
    cp "$COMPOSE_FILE" "${COMPOSE_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    echo "   Бэкап: ${COMPOSE_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    
    echo ""
    echo "⚠️  ВНИМАНИЕ! Необходимо вручную отредактировать файл:"
    echo "   $COMPOSE_FILE"
    echo ""
    echo "Добавьте в секцию nextjs/web:"
    echo ""
    echo "  deploy:"
    echo "    resources:"
    echo "      limits:"
    echo "        memory: 3G"
    echo "  environment:"
    echo "    - NODE_OPTIONS=--max-old-space-size=2048"
    echo ""
    echo "Затем выполните:"
    echo "  cd $(dirname $COMPOSE_FILE)"
    echo "  docker-compose down"
    echo "  docker-compose up -d"
    
else
    echo "⚠️  docker-compose.yml не найден"
    echo ""
    echo "═══════════════════════════════════════════════════════"
    echo "🔄 АЛЬТЕРНАТИВА: Пересоздание контейнера с новыми лимитами"
    echo "═══════════════════════════════════════════════════════"
    
    echo ""
    echo "📋 Получаем параметры текущего контейнера..."
    
    IMAGE=$(docker inspect $NEXTJS_CONTAINER --format='{{.Config.Image}}')
    PORTS=$(docker inspect $NEXTJS_CONTAINER --format='{{range $p, $conf := .NetworkSettings.Ports}}{{$p}} {{end}}')
    VOLUMES=$(docker inspect $NEXTJS_CONTAINER --format='{{range .Mounts}}{{.Source}}:{{.Destination}} {{end}}')
    ENV_VARS=$(docker inspect $NEXTJS_CONTAINER --format='{{range .Config.Env}}{{println "-e" .}}{{end}}')
    
    echo ""
    echo "Обнаружено:"
    echo "  Image: $IMAGE"
    echo "  Ports: $PORTS"
    echo "  Volumes: $VOLUMES"
    
    echo ""
    read -p "❓ Пересоздать контейнер с memory limit 3GB? (yes/no): " CONFIRM
    
    if [ "$CONFIRM" = "yes" ]; then
        echo ""
        echo "🛑 Останавливаем контейнер..."
        docker stop $NEXTJS_CONTAINER
        
        echo "🗑️  Удаляем контейнер..."
        docker rm $NEXTJS_CONTAINER
        
        echo "🚀 Создаём новый контейнер с memory limit 3GB..."
        
        # Базовая команда
        CMD="docker run -d \
          --name $NEXTJS_CONTAINER \
          --memory=3g \
          --memory-swap=3g \
          --cpus=2.0 \
          -e NODE_OPTIONS='--max-old-space-size=2048' \
          -e NODE_ENV=production"
        
        # Добавляем volumes если есть
        if [ -n "$VOLUMES" ]; then
            for vol in $VOLUMES; do
                CMD="$CMD -v $vol"
            done
        fi
        
        # Добавляем image
        CMD="$CMD --restart unless-stopped $IMAGE"
        
        echo ""
        echo "Выполняется команда:"
        echo "$CMD"
        echo ""
        
        eval $CMD
        
        if [ $? -eq 0 ]; then
            echo "✅ Контейнер успешно пересоздан!"
            echo ""
            echo "📊 Проверка новых лимитов:"
            docker stats $NEXTJS_CONTAINER --no-stream --format "table {{.Container}}\t{{.MemUsage}}\t{{.MemPerc}}"
        else
            echo "❌ Ошибка при создании контейнера"
            echo "Восстановите старый контейнер из бэкапа!"
        fi
    else
        echo "❌ Операция отменена"
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "📋 Проверка логов OOM Killer"
echo "═══════════════════════════════════════════════════════"

if command -v dmesg &> /dev/null; then
    echo "🔍 Ищем записи об OOM kills..."
    OOM_LINES=$(sudo dmesg | grep -i "killed process" | grep -i "node\|nextjs" | tail -5)
    
    if [ -n "$OOM_LINES" ]; then
        echo "⚠️  Найдены записи об убитых процессах:"
        echo "$OOM_LINES"
    else
        echo "✅ Записей об OOM kills не найдено (или нет прав для dmesg)"
    fi
else
    echo "⚠️  dmesg недоступен (требуются права sudo)"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ ГОТОВО!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "📝 Следующие шаги:"
echo "1. Проверьте логи контейнера:"
echo "   docker logs -f $NEXTJS_CONTAINER"
echo ""
echo "2. Попробуйте загрузить видео:"
echo "   https://zabkinokom.ru/admin/site"
echo ""
echo "3. В логах должно быть:"
echo "   ✅ Uploaded: video.mp4 (652.00 MB)"
echo "   БЕЗ строки 'Killed'!"
echo ""
echo "═══════════════════════════════════════════════════════"

