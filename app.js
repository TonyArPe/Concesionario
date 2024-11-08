const express = require('express');
const db = require('./db');
const path = require('path');
const bodyParser = require('body-parser');



const app = express();
const port = process.env.SERVICE_PORT || 8000;



// Motor de vistas Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`)
})



app.get('/', (req, res) => {
    res.render('index')
})

