// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const config = require('./config');
const sessionMiddleware = require('./middleware/sessionMiddleware');
const authRouter = require('./routes/authRouter');
const vehiculosRouter = require('./routes/vehiculoRouter');
const clientesRouter = require('./routes/clienteRouter');
const comprasRouter = require('./routes/compraRouter');
const ventasRouter = require('./routes/ventaRouter');
const { convertirExcelJson, readJsonFile } = require('./utils/excelConverter');

const app = express();

// Configuración de middlewares
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'misupersecretoquenadiesabe',
  resave: true,
  saveUninitialized: false,
}));

// Middleware de sesión
app.use(sessionMiddleware);

// Rutas
app.use('/auth', authRouter);
app.use('/vehiculos', vehiculosRouter);
app.use('/clientes', clientesRouter);
app.use('/compras', comprasRouter);
app.use('/ventas', ventasRouter);

// Funciones para leer y convertir el Excel
if (!fs.existsSync(config.jsonFilePath)) {
  convertirExcelJson();
}

app.get('/', (req, res) => {
  if (req.session.user) {
    res.render('dashboard', { user: req.session.user });
  } else {
    res.redirect('/auth/login');
  }
});

app.get('/datos', async (req, res) => {
  try {
    const data = await readJsonFile();
    res.json(data);
  } catch (err) {
    res.status(500).send("Error al leer el archivo JSON");
  }
});

app.listen(config.port, () => {
  console.log(`Servidor iniciado en http://localhost:${config.port}`);
});
