FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Forma para copiar variables ENV para DESARROLLO
COPY .env .env

# ENV USUARIOS_HOST=usuarios \
#     USUARIOS_PORT=5000 \
#     PORT=5001 \
#     DATA_DIR='/data'


# -----Persistencia en volumen------
    # creacion de carpeta de datos como VOLUME para que
    # quede afuera del contenedor y persista la informacion.

RUN mkdir -p /data
VOLUME /data
# ---------------------------
EXPOSE 5001
CMD ["node", "app.js"]

# docker build -t pedidos .
# docker run -p 5001:5001 --name pedidos pedidos -e "USUARIOS_HOST=host.docker.internal" -e "USUARIOS_PORT=5000" -e "DATA_DIR=/data"