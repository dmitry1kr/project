# Используем официальный образ Node.js
FROM node:21-bullseye

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package.json package-lock.json ./

# Копируем все файлы из текущей директории внутрь контейнера
COPY . .

# Устанавливаем зависимости через npm
RUN npm i

# билдим
RUN npm run build

# Определяем команду для запуска приложения
CMD ["npm", "start"]
#CMD ["tail", "-f", "/dev/null"]

# Открываем порт 3000, если ваше приложение использует этот порт
EXPOSE 3000