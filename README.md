# Curso_Microservicos_Docker_Kubernetes
Dominar los fundamentos del desarrollo moderno mediante microservicios, Docker y Kubernetes, comprendiendo su arquitectura y logrando realizar despliegues (deployments) eficientes en entornos locales y en la nube.

## Conectar 2 contenedores Docker a la misma red
- Tener guardados los nombres de los contenedores (usuarios y pedidos)
```bash
docker run -p 5000:5000 --name usuarios usuarios
docker run -p 5001:5001 --name pedidos pedidos
```

- Crear una red Docker llamada red_micro
```bash
docker network create red_micro
docker network connect red_micro usuarios
docker network connect red_micro pedidos
```

- Verificar que ambos contenedores están en la misma red
```bash
docker network inspect red_micro
```