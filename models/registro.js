const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    deviceID: { type: String, required: true },
    cedula: { type: String, required: true }, 
    ubicacion: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    fecha: { type: Date, default: Date.now }, 
    tipo: { type: String, required: true }, // 'entrada' o 'salida'
    imagenBase64: { type: String, required: true } // Nuevo campo para almacenar la imagen en Base64
});

module.exports = mongoose.model('Registro', registroSchema);
