require('dotenv').config();
const express = require('express');
const xlsx = require("xlsx");
const session = require('express-session');
const jsonfile = require("jsonfile");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require("path");
const fs = require('fs');
const MailerService = require('./mailer'); // Importar el servicio de correo

const app = express();
const port = process.env.SERVICE_PORT || 8000;

const vehiculosRouter = require('./routes/vehiculoRouter');
const clientesRouter = require('./routes/clienteRouter');
const comprasRouter = require('./routes/compraRouter');
const ventasRouter = require('./routes/ventaRouter');
const authRouter = require('./routes/authRouter');

const excelFilePath = path.join(__dirname, "doc/EntidadRelacionVehiculosData.xlsx");
const jsonFilePath = path.join(__dirname, "data/datosConcesionario.json");

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'misupersecretoquenadiesabe',
  resave: true,
  saveUninitialized: false,
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  if (!req.session.user) {
    if (req.path.startsWith('/auth/login') || req.path.startsWith('/auth/register')) {
      next();
    } else {
      return res.redirect('/auth/login');
    }
  } else {
    next();
  }
});

// Routers
app.use('/vehiculos', vehiculosRouter);
app.use('/clientes', clientesRouter);
app.use('/compras', comprasRouter);
app.use('/ventas', ventasRouter);
app.use('/auth', authRouter);

// Ruta para registrar un nuevo usuario y enviar correo de bienvenida
app.post('/register', (req, res) => {
  const { usuario, contrasena, email } = req.body;

  // Verificar si el usuario ya existe
  db.query('SELECT * FROM Usuario WHERE Usuario = ?', [usuario], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.render('register', { error: 'El usuario ya existe.' });
    } else {
      bcrypt.hash(contrasena, 10, async (err, hashedPassword) => {
        if (err) throw err;

        db.query('INSERT INTO Usuario (Usuario, Contrasena) VALUES (?, ?)', [usuario, hashedPassword], async (err, results) => {
          if (err) throw err;

          // Enviar un correo de bienvenida
          try {
            await MailerService.sendEmail(
              email,
              'Bienvenido a Shinobi Store',
              `<h1>Hola, ${usuario}!</h1><p>Gracias por registrarte en Shinobi Store.</p>`
            );
            console.log(`Correo de bienvenida enviado a ${email}`);
          } catch (error) {
            console.error('Error al enviar el correo:', error);
          }

          res.redirect('/');
        });
      });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
