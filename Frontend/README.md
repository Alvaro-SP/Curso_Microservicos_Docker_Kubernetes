# Dashboard Frontend - Microservicios

Frontend React moderno para visualizar usuarios y pedidos consumiendo el API Gateway.

## 🎨 Características

- ✅ **Diseño Moderno**: UI atractiva con gradientes y animaciones
- ✅ **Responsive**: Adaptado para móvil, tablet y desktop
- ✅ **Dashboard en Tiempo Real**: Muestra estadísticas de usuarios y pedidos
- ✅ **Consumo de API Gateway**: Se conecta al gateway en puerto 8080
- ✅ **Docker Ready**: Incluye Dockerfile multi-stage con nginx
- ✅ **Proxy Configurado**: Nginx hace proxy al API Gateway

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool rápido
- **React Router** - Navegación SPA
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilos component-scoped
- **Nginx** - Servidor web en producción

## 📦 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Header.jsx      # Header con botón refresh
│   │   ├── StatsCard.jsx   # Tarjetas de estadísticas
│   │   ├── UsuariosCard.jsx # Lista de usuarios
│   │   └── PedidosCard.jsx  # Lista de pedidos
│   ├── pages/
│   │   └── Dashboard.jsx   # Página principal del dashboard
│   ├── App.jsx             # Componente raíz
│   ├── main.jsx            # Entry point
│   └── index.css           # Estilos globales
├── Dockerfile              # Multi-stage build
├── nginx.conf              # Configuración nginx con proxy
├── vite.config.js          # Config de Vite
└── package.json
```

## 🚀 Desarrollo y Despliegue

### Opción 1: Docker Compose (Recomendado)

El frontend ya está incluido en `docker-compose.yml`. Solo ejecuta:

```powershell
# Desde la raíz del proyecto
docker network create red_microservicios
docker-compose up -d --build
```

Abre http://localhost:3000/dashboard en tu navegador.

### Opción 2: Docker Manual

```powershell
# Construir imagen
docker build -t dashboard-frontend:1.0 .\frontend

# Ejecutar contenedor
docker run --rm -d --name dashboard --network red_microservicios -p 3000:80 dashboard-frontend:1.0
```

**📋 Ver todos los comandos disponibles**: Revisa el archivo `COMANDOS_DOCKER.txt` en esta carpeta.

### Opción 3: Desarrollo Local (Node.js)

Si quieres desarrollar sin Docker:

```powershell
cd frontend
npm install
npm run dev
```

Abre http://localhost:3000 en tu navegador.

**Nota**: Asegúrate de que el API Gateway esté corriendo en http://localhost:8080

## 🌐 Rutas de la Aplicación

| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a `/dashboard` |
| `/dashboard` | Dashboard principal con usuarios y pedidos |

## 🔌 Endpoints del API Gateway

El frontend consume estos endpoints:

```javascript
GET http://localhost:8080/api/usuarios
// Respuesta: { mensaje: string, data: Usuario[] }

GET http://localhost:8080/api/pedidos
// Respuesta: { mensaje: string, data: Pedido[] }
```

## 🎨 Personalización

### Cambiar colores del tema

Edita las variables CSS en `src/index.css`:

```css
:root {
  --primary: #3b82f6;       /* Color primario */
  --secondary: #10b981;     /* Color secundario */
  --danger: #ef4444;        /* Color de error */
  --warning: #f59e0b;       /* Color de advertencia */
}
```

### Cambiar URL del API Gateway

Opción 1 - Edita `src/pages/Dashboard.jsx`:

```javascript
const API_URL = 'http://tu-gateway:puerto/api'
```

Opción 2 - Usa variables de entorno en `vite.config.js`:

```javascript
export default defineConfig({
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8080/api')
  }
})
```

## 📊 Vista Previa del Dashboard

El dashboard muestra:

### Tarjetas de Estadísticas (Top)
- 📊 Total de usuarios
- 📦 Total de pedidos
- 📅 Fecha del último pedido
- ✅ Estado del gateway

### Panel de Usuarios (Izquierda)
- Tabla con ID, nombre y correo
- Avatares con iniciales
- Diseño de tarjeta con scroll

### Panel de Pedidos (Derecha)
- Lista de pedidos con información del usuario
- Fecha y hora de creación
- Estado del pedido
- Diseño de tarjeta con scroll

## 🔧 Scripts Disponibles

```powershell
npm run dev      # Servidor de desarrollo (puerto 3000)
npm run build    # Build de producción
npm run preview  # Preview del build de producción
```

## 🐛 Solución de Problemas

### Error: Cannot GET /api/usuarios

**Causa**: El API Gateway no está corriendo o no es accesible.

**Solución**:
```powershell
# Verifica que el gateway esté corriendo
docker ps | Select-String "gateway"

# Prueba el endpoint directamente
Invoke-RestMethod http://localhost:8080/api/usuarios
```

### Error: CORS policy

**Causa**: Problemas de CORS entre frontend y backend.

**Solución**: El proxy de nginx ya maneja esto. Si usas `npm run dev`, Vite tiene configurado el proxy en `vite.config.js`.

### Página en blanco

**Causa**: Build incorrecto o rutas mal configuradas.

**Solución**:
```powershell
# Reconstruye la imagen
docker build --no-cache -t dashboard-frontend:1.0 .\frontend

# Verifica los logs
docker logs dashboard
```

## 📚 Para los Alumnos

### Conceptos Aprendidos

1. **React con Hooks**: useState, useEffect para gestión de estado
2. **Consumo de APIs REST**: Axios para llamadas HTTP
3. **React Router**: Navegación SPA
4. **CSS Moderno**: Flexbox, Grid, variables CSS
5. **Docker Multi-Stage**: Build optimizado
6. **Nginx como Proxy**: Configuración de proxy reverso
7. **Responsive Design**: Media queries

### Ejercicios Propuestos

1. **Agregar filtros**: Implementa búsqueda de usuarios por nombre
2. **Paginación**: Agrega paginación a las tablas
3. **Gráficos**: Integra Chart.js para visualizar datos
4. **Tema oscuro**: Implementa toggle de tema claro/oscuro
5. **WebSockets**: Actualización en tiempo real
6. **Manejo de errores**: Mejora los mensajes de error
7. **Loading states**: Skeletons mientras carga

## 📖 Recursos

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)
- [Nginx Docs](https://nginx.org/en/docs/)

---

**Creado para el curso de Microservicios con Docker y Kubernetes**  
Dashboard moderno para visualizar la arquitectura de microservicios
