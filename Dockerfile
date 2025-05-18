# Etapa 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copiar archivos e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código y construir la app
COPY . .
RUN npm run build

# Etapa 2: Servir con nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]