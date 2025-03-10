const express = require('express');
const Registro = require('../models/registro');
const moment = require('moment-timezone');
const router = express.Router();

// Función para obtener la fecha en la zona horaria de Bogotá
const obtenerFechaLocal = () => moment.tz("America/Bogota").subtract(5, 'hours').toDate();

// Ruta para registrar entrada con imagen
router.post('/entrada', async (req, res) => {
    const { userId, deviceID, cedula, ubicacion, imagenBase64 } = req.body;

    try {
        if (!imagenBase64) {
            return res.status(400).json({ msg: 'No se recibió ninguna imagen' });
        }

        const nuevoRegistro = new Registro({
            userId,
            deviceID,
            cedula,
            ubicacion,
            fecha: obtenerFechaLocal(),
            tipo: 'entrada',
            imagenBase64 // Guardamos la imagen en Base64
        });

        await nuevoRegistro.save();
        res.status(201).json({ msg: 'Entrada registrada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al registrar la entrada' });
    }
});

// Ruta para registrar salida con imagen
router.post('/salida', async (req, res) => {
    const { userId, deviceID, cedula, ubicacion, imagenBase64 } = req.body;

    try {
        if (!imagenBase64) {
            return res.status(400).json({ msg: 'No se recibió ninguna imagen' });
        }

        const nuevoRegistro = new Registro({
            userId,
            deviceID,
            cedula,
            ubicacion,
            fecha: obtenerFechaLocal(),
            tipo: 'salida',
            imagenBase64 // Guardamos la imagen en Base64
        });

        await nuevoRegistro.save();
        res.status(201).json({ msg: 'Salida registrada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al registrar la salida' });
    }
});

module.exports = router;
