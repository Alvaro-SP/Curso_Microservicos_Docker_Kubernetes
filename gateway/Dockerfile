FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

COPY . .

COPY .env .env

ENV PORT=8080 \
    USUARIOS_URL=http://usuarios:5000 \
    PEDIDOS_URL=http://pedidos:5001

EXPOSE 8080

CMD ["npm", "start"]