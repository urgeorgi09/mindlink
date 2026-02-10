# Етап 1: Build на React приложението
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Етап 2: Сервиране с Nginx
FROM nginx:stable-alpine
# Копираме готовия билд от папката /dist на Vite в папката на Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Копираме nginx конфигурацията
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]