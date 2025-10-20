FROM node:22.18.0-alpine AS base
WORKDIR /app

# Копируем package.json и lock
COPY package*.json ./

# Устанавливаем зависимости (с игнором peer deps)
RUN npm install --legacy-peer-deps

# Копируем весь проект
COPY . .

# Устанавливаем typescript (если нет)
RUN npm install --save-dev typescript --legacy-peer-deps

# Генерация Prisma клиента (без подключения к БД)
RUN npx prisma generate

# Продакшен окружение
ENV NODE_ENV=production
EXPOSE 3000

# Кастомный entrypoint
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

CMD ["/app/docker-entrypoint.sh"]
