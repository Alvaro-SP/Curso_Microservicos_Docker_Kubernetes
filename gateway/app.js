require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT;

const targets = {
    usuarios: `http://${process.env.USUARIOS_HOST}:${process.env.USUARIOS_PORT}`,
    pedidos: `http://${process.env.PEDIDOS_HOST}:${process.env.PEDIDOS_PORT}`
}
app.use('/api/usuarios', 
    createProxyMiddleware({
        target: targets.usuarios,
        chageOrigin: true,
        pathRewrite: {'^/api/usuarios': '/usuarios'},
        onError(err, req, res){
            res.status(502).json({error: 'Bad Gateway', message: 'gateway usuarios fallo'});
        }
    })
)
app.use('/api/pedidos', 
    createProxyMiddleware({
        target: targets.pedidos,
        chageOrigin: true,
        pathRewrite: {'^/api/pedidos': '/pedidos'},
        onError(err, req, res){
            res.status(502).json({error: 'Bad Gateway', message: 'gateway pedidos fallo'});
        }
    })
)
app.get('/', (req,res) => {
    res.json({
        mensaje: 'API Gateway is running',
        rutas: ['/api/usuarios','api/pedidos']
    });
});


app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});