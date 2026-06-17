const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const Cancion = require('./models/cancion');

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB conectado");
})
.catch(err => {
    console.log("Error MongoDB:", err);
});

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        if (file.fieldname === "portada") {

            cb(null, path.join(__dirname, 'uploads', 'imagenes'));

        } else {

            cb(null, path.join(__dirname, 'uploads', 'audios'));

        }

    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + "-" + file.originalname
        );

    }

});

const upload = multer({ storage });

/* ===========================
   CREAR CANCIÓN
=========================== */

app.post(
'/api/canciones',

upload.fields([
    { name:'portada', maxCount:1 },
    { name:'audio', maxCount:1 }
]),

async (req,res) => {

try{

const nuevaCancion = new Cancion({

titulo: req.body.titulo,
artista: req.body.artista,
genero: req.body.genero,
album: req.body.album,

portadaUrl: req.files.portada[0].path.replace(/\\/g,"/"),
audioUrl: req.files.audio[0].path.replace(/\\/g,"/")

});

await nuevaCancion.save();

res.json({
    mensaje: 'Canción guardada correctamente'
});

}catch(error){

console.log(error);
res.status(500).json(error);

}

});

/* ===========================
   OBTENER TODAS LAS CANCIONES
=========================== */

app.get('/api/canciones', async (req,res)=>{

try{

const canciones = await Cancion.find().sort({
    fechaRegistro: -1
});

res.json(canciones);

}catch(error){

res.status(500).json(error);

}

});

/* ===========================
   EDITAR CANCIÓN
=========================== */

app.put('/api/canciones/:id', async (req,res)=>{

try{

await Cancion.findByIdAndUpdate(

req.params.id,

{
titulo: req.body.titulo,
artista: req.body.artista,
genero: req.body.genero,
album: req.body.album
}

);

res.json({
mensaje:'Canción actualizada correctamente'
});

}catch(error){

console.log(error);

res.status(500).json(error);

}

});

/* ===========================
   ELIMINAR CANCIÓN
=========================== */

app.delete('/api/canciones/:id', async (req,res)=>{

try{

await Cancion.findByIdAndDelete(
req.params.id
);

res.json({
mensaje:'Canción eliminada correctamente'
});

}catch(error){

console.log(error);

res.status(500).json(error);

}

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

console.log(
`Servidor ejecutándose en puerto ${PORT}`
);

});