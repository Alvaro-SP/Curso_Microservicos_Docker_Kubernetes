require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const promClient = require('prom-client');

const register = new promClient.Registry(); //para el registro de metricas

promClient.collectDefaultMetrics({ register }); // recolectar metricas por defecto

// metricas personalizadas
// contador de requests
const httpRequestsTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total de peticiones HTTP de mi gateway',
    labelNames: ['method', 'path', 'status'],
    registers: [register],
})
// duracion de requests
const httpRequestDuration = new promClient.Counter({
    name: 'http_request_duration_seconds',
    help: 'Duración de las peticiones HTTP de mi gateway en segundos',
    labelNames: ['method', 'path', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5], //sirve para crear de mejor manera mi histograma
    registers: [register],
})

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const path = req.route ? req.route.path : req.path;
    httpRequestsTotal.inc({ method: req.method, path: path, status: res.statusCode });
    httpRequestDuration.observe({ method: req.method, path: path, status: res.statusCode }, duration);
  });
  next();
})
// endpoint de metricas que utilizara prometheus para monitorear los servicios
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

const app = express();
const PORT = process.env.PORT;

const targets = {
    usuarios: process.env.USUARIOS_URL,
    pedidos: process.env.PEDIDOS_URL,
    inventario: process.env.INVENTARIO_URL,
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

// Middleware de logging para todas las peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const usuariosProxy = createProxyMiddleware({
  target: targets.usuarios,
  changeOrigin: true,
  pathRewrite: {
    '^/': '/api/usuarios' // Convierte '/' a '/api/usuarios'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] Redirigiendo a ${targets.usuarios}${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('[Proxy Error - Usuarios]', err.message);
    res.status(502).json({ mensaje: 'Gateway: usuarios no disponible', error: err.message });
  },
});

app.use('/api/usuarios', usuariosProxy);


const pedidosProxy = createProxyMiddleware({
  target: targets.pedidos,
  changeOrigin: true,
  pathRewrite: {
    '^/': '/api/pedidos' // Convierte '/' a '/api/pedidos'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] Redirigiendo a ${targets.pedidos}${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('[Proxy Error - Pedidos]', err.message);
    res.status(502).json({ mensaje: 'Gateway: pedidos no disponible', error: err.message });
  },
});

app.use('/api/pedidos', pedidosProxy);

// Proxy hacia inventario (C# .NET)
const inventarioProxy = createProxyMiddleware({
  target: targets.inventario,
  changeOrigin: true,
  pathRewrite: (path,req) => {
    return '/inventario' + path;
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] Redirigiendo a ${targets.inventario}${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('[Proxy Error - Inventario]', err.message);
    res.status(502).json({ mensaje: 'Gateway: inventario no disponible', error: err.message });
  },
})

app.use('/api/inventario', inventarioProxy);

app.get('/health', (req,res) => {
    res.json({
        status: 'ok',
        service: 'API Gateway',
        timestamp: new Date().toISOString(),
    });
});


app.get('/', (req,res) => {
    res.json({
        data: true,
        mensaje: 'API Gateway esta corriendo correctamente!',
        rutas: ['/api/usuarios','api/pedidos']
    });
});


app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});