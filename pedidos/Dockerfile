FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY app.js .
EXPOSE 5001
CMD ["node", "app.js"]

# docker build -t pedidos .
# docker run -p 5001:5001 --name pedidos pedidos