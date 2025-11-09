# Etapa de build
FROM node:20-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev
RUN npm install -g vite

COPY . .
RUN npm run build

# Etapa final
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
