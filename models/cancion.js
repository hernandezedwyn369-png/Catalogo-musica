const mongoose = require('mongoose');

const CancionSchema = new mongoose.Schema({

    titulo: {
        type: String,
        required: true,
        trim: true
    },

    artista: {
        type: String,
        required: true,
        trim: true
    },

    genero: {
        type: String,
        required: true,
        trim: true
    },

    album: {
        type: String,
        trim: true
    },

    portadaUrl: {
        type: String,
        required: true
    },

    audioUrl: {
        type: String,
        required: true
    },

    fechaRegistro: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Cancion', CancionSchema);