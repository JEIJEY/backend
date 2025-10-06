
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Configurar dotenv
dotenv.config();

// Crear la aplicación Express
const app = express();

// Configurar middlewares
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Express está funcionando 🚀');
});

// Definir puerto
const port = process.env.PORT || 3000;

// Levantar servidor
app.listen(port, () => {
    console.log(`Mi app está corriendo en el puerto ${port}`);
});
