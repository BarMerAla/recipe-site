# Этап 1: билд фронта

FROM node:20-alpine as build

WORKDIR /frontend

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Этап 2: продакшн nginx

FROM nginx:alpine

# Копируем собранные файлы во внутренний html каталог nginx
COPY --from=build /frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]