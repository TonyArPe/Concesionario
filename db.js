const mysql = require('mysql2')
require('dotenv').config({path: './stack/.env'})

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 33307,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_ROOT_PASSWORD || '1234',
    database: process.env.MYSQL || 'concesionario'
})

db.connect( err => {
    if (err) {
        console.error(' Error al conectar a MySQL: ', err)
        return
    }
    console.log('Conexion existosa a la base de datos MySQL')
})

module.exports = db