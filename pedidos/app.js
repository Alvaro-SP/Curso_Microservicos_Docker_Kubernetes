const express = require('express');
const axios = require('axios'); // Client HTTP para realizar peticiones a otros servicios
const app = express();
const PORT = 5001;

// const USUARIOS_HOST = 'usuarios';
const USUARIOS_HOST = 'usuarios';
const USUARIOS_PORT = 5000;

app.get('/pedidos', async (req, res) => {
    try{
    const url = `http://${USUARIOS_HOST}:${USUARIOS_PORT}/obtenerUsuarios`;
    const response = await axios.get(url);
    console.log(response);
    const usuarios = response.data?.data || [];
    
    //generar pedidos
    const pedidos = usuarios.slice(0, 5).map((u, idx) => ({
        pedido_id: idx + 1,
        usuario: u.nombre,
    }));

    res.json({
        mensaje: 'Se han obtenido los pedidos del sistema correctamente.',
        data: pedidos,
        origenUsuarios: url,
    })
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(500).json({
            mensaje: 'Error al obtener usuarios desde el microservicio de usuarios.',
            error: error.message,
        });
    }
})

app.listen(PORT, () => {
    console.log(`Microservicio de Pedidos en Node.js ejecutandose en http://localhost:${PORT}/`);
});
