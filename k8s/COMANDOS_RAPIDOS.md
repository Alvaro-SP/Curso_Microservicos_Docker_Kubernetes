# COMANDOS RAPIDOS EN K8S

# Desplegar
```bash
kubectl apply -f 01-namespace.yaml
kubectl apply -f 02-usuario-deployment.yaml
kubectl apply -f 03-usuario-service.yaml
```
# Desplegar todo
```bash
kubectl apply -f k8s/
```
# Validar que se haya desplegado
- ver todos los recursos
```bash
kubectl get all -n microservicios-app
```
- ver solo los pods
```bash
kubectl get pods -n microservicios-app
```
- ver los logs de un pod
```bash
kubectl logs -f <nombre-del-pod> -n microservicios-app
```




