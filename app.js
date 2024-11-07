const express = require('express');

const app = express();
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`)
})

app.get('/', (req, res) => {
    res.send("Bienvenido al Concesionario los Pallos")
})