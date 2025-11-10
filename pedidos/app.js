require('dotenv').config();

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const app = express();

const PORT = process.env.PORT;

// const USUARIOS_HOST = 'usuarios';
const USUARIOS_HOST = process.env.USUARIOS_HOST;
const USUARIOS_PORT = process.env.USUARIOS_PORT;

const USUARIOS_URL = process.env.USUARIOS_URL || `http://${USUARIOS_HOST || 'usuarios'}:${USUARIOS_PORT || 5000}`;
// ruta para persistir datos en un volumen
// se monta como volumen para que veamos como funciona la persistencia de datos
const DATA_DIR = process.env.DATA_DIR;
const PEDIDOS_FILE = path.join(DATA_DIR, 'pedidos.json');

function asegurarDirectoriodeDatos(){
    if(!fs.existsSync(DATA_DIR)){
        fs.mkdirSync(DATA_DIR, {recursive: true});
    }
}

app.get('/pedidos', async (req, res) => {
    const url = `${USUARIOS_URL}/usuarios`;
    try {
        const response = await axios.get(url);
        console.log(response);
        const usuarios = response.data?.data || [];
        
        //generar pedidos
        const pedidos = usuarios.slice(0, 5).map((u, idx) => ({
            pedido_id: idx + 1,
            usuario: u.nombre,
            fecha: new Date().toISOString(),
        }));

        // persistir los pedidos en un archivo dentro del contenedor y volumen
        try{
            asegurarDirectoriodeDatos();
            await fsp.writeFile(PEDIDOS_FILE, JSON.stringify(pedidos, null, 2));
        }catch(err){
            console.warn('No podemos persistir pedidos en el volumen', err.message);
        }

        res.json({
            mensaje: 'Se han obtenido los pedidos del sistema correctamente.',
            data: pedidos,
            origenUsuarios: url,
            persistidoEn: PEDIDOS_FILE,
            data_dir: DATA_DIR,
        })
    } catch (error) {
        console.error('Error al obtener pedidos:', error.message);
        res.status(500).json({
            mensaje: 'Error al obtener pedidos desde el microservicio de pedidos.',
            error: error.message,
            origenUsuarios: url,
            persistidoEn: PEDIDOS_FILE,
            data_dir: DATA_DIR,
        });
    }
})


app.get('/api/pedidos', async (req, res) => {
    const url = `http://${USUARIOS_HOST}:${USUARIOS_PORT}/api/usuarios`;
    try {
        const response = await axios.get(url);
        console.log(response);
        const usuarios = response.data?.data || [];
        
        //generar pedidos
        const pedidos = usuarios.slice(0, 5).map((u, idx) => ({
            pedido_id: idx + 1,
            usuario: u.nombre,
            fecha: new Date().toISOString(),
        }));

        // persistir los pedidos en un archivo dentro del contenedor y volumen
        try{
            asegurarDirectoriodeDatos();
            await fsp.writeFile(PEDIDOS_FILE, JSON.stringify(pedidos, null, 2));
        }catch(err){
            console.warn('No podemos persistir pedidos en el volumen', err.message);
        }

        res.json({
            mensaje: 'Se han obtenido los pedidos del sistema correctamente.',
            data: pedidos,
            origenUsuarios: url,
            persistidoEn: PEDIDOS_FILE,
            data_dir: DATA_DIR,
        })
    } catch (error) {
        console.error('Error al obtener pedidos:', error.message);
        res.status(500).json({
            mensaje: 'Error al obtener pedidos desde el microservicio de pedidos.',
            error: error.message,
            origenUsuarios: url,
            persistidoEn: PEDIDOS_FILE,
            data_dir: DATA_DIR,
        });
    }
})

// Endpoint auxiliar para inspeccionar lo último persistido:
app.get('/pedidos/persistidos', async (req, res) => {
  try {
    const contenido = await fsp.readFile(PEDIDOS_FILE, 'utf8');
    const json = JSON.parse(contenido);
    res.json({ mensaje: 'Últimos pedidos persistidos', data: json, archivo: PEDIDOS_FILE });
  } catch (err) {
    res.status(404).json({ mensaje: 'No hay pedidos persistidos aún', error: err.message });
  }
});


app.listen(PORT, () => {
    console.log(`Microservicio de Pedidos en Node.js ejecutandose en http://localhost:${PORT}/`);
});
