FROM node:18-alpine
WORKDIR /app
COPY app.js .
COPY package*.json ./

RUN npm ci --only=production || npm install --only=production
COPY . .
COPY .env .env
EXPOSE 5000
CMD ["npm", "start"]

# docker build -t usuarios .
# docker run -p 5000:5000 --name usuarios usuarios

























# # Imagen base de Node.js
# FROM node:18-alpine

# # Directorio de trabajo
# WORKDIR /usr/src/app

# # Copiar archivos necesarios
# COPY package*.json ./
# RUN npm install

# COPY . .

# # Exponer puerto
# EXPOSE 3000

# # Comando de ejecución
# CMD ["npm", "start"]


# Construir imagen
# docker build -t microservicio-usuarios .

# Ejecutar contenedor
# docker run -p 3000:3000 microservicio-usuarios