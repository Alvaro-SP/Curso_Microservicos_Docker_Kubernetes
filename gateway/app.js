require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT;

const targets = {
    usuarios: process.env.USUARIOS_URL,
    pedidos: process.env.PEDIDOS_URL
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