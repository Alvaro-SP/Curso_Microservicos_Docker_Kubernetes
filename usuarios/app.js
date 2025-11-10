const express = require('express'); // es un framework para aplicaciones web en Node.js
// express es minimalista, flexible, y posee Middleware (PILARES FUNDAMENTALES)
const app = express(); // instancia de express
// const http = require('http');
require('dotenv').config();

const PORT = process.env.PORT;

const usuarios = [
    { id: 1, nombre: 'Carlos', correo: 'carlos@edutek.com' },
    { id: 2, nombre: 'Ana', correo: 'ana@edutek.com' },
    { id: 3, nombre: 'Luis', correo: 'luis@edutek.com' },
    { id: 4, nombre: 'María', correo: 'maria@edutek.com' },
    { id: 5, nombre: 'Jorge', correo: 'jorge@edutek.com' }
];

// ENDPOINT: Obtener usuarios
app.get('/usuarios', (req, res) => {
    res.json({
        mensaje: 'Se han obtenido los usuarios del sistema correctamente.',
        data: usuarios
    });
});

app.get('/api/usuarios', (req, res) => {
    res.json({
        mensaje: 'Se han obtenido los usuarios del sistema correctamente.',
        data: usuarios
    });
});

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end("Hola mundo desde Docker y Node en Edutek");
// });

app.listen(PORT, () => {
    console.log(`Microservicio de usuarios en Node.js ejecutandose en http://localhost:${PORT}/`);
});


