const bcrypt = require("bcrypt");
const db = require("../db");

exports.registerForm = (req, res) => {
  res.render("register");
};

exports.register = (req, res) => {
  const datosUsuario = req.body;
  datosUsuario.password = bcrypt.hashSync(datosUsuario.password, 10);
  try {
    // guardamos el usuario en la BBDD SIN ACTIVAR
    db.query(
      "INSERT INTO Usuario (Usuario, Contrasena) VALUES (?,?)",
      [datosUsuario.username, datosUsuario.password, 0],
      (error, respuesta) => {
        if (error) res.send("ERROR INSERTANDO usuario" + req.body);
        else res.render("register", { errorMsg: "Usuario ya registrado" });
      }
    );
  } catch (error) {
    res.render("register", { errorMsg: "Error " + error });
  }
};

exports.loginForm = (req, res) => {
  res.render("login");
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  db.query(
    "INSERT INTO Usuario (Usuario, Contrasena) VALUES (?,?)",
    [datosUsuario.username, datosUsuario.password, 0],
    (error, respuesta) => {
      if (error) res.render("register", { errorMsg: `Usuario ya registrado` });
      else {
        res.redirect("/auth/login");
        res.render("login");
      }
    }
  );
};

exports.loginForm = (req, res) => {
  res.render("login");
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * from Usuario WHERE Usuario=?",
    [username],
    (error, rsUsuario) => {
      if (error) {
        res.render("login", { errorMsg: "Usuario no encontrado" });
      } else {
        const usuario = rsUsuario[0];
        if (usuario) {
          if (
            /*usuario.enabled==1 &&*/ bcrypt.compareSync(
              password,
              usuario.Contrasena
            )
          ) {
            req.session.user = usuario.Usuario;
            res.redirect("/");
          } else {
            res.render("login", { errorMsg: "Contraseña incorrecta" });
          }
        } else {
          res.render("login", {
            errorMsg: "Usuario no encontrado o credenciales inválidas",
          });
        }
      }
    }
  );
};

exports.logout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error al destruir la sesión:", err);
        return res.status(500).send("Error al cerrar sesión");
      }
      res.redirect("/auth/login");
    });
  } else {
    res.redirect("/auth/login");
  }
};

const MailerService = require('../mailer'); // Importar el servicio de correo

// Función para enviar correos electrónicos
exports.emailSender = (correo, username, token, passOrVerif)  => {
    const image = "https://lh3.googleusercontent.com/u/0/drive-viewer/AFGJ81o1ajGn_UGprefkKm6PoygC_IgznLP4ywipfl-223oUT7L6VJSV_1GbBo275A4K3jLx9XN4OFd9K5YIMHSzTke2RrcdIw=w1280-h1000";
    let subject = '';
    let mensaje = '';

    switch (passOrVerif) {
        case 0:
            // Mensaje para verificar la cuenta
            mensaje = `
                <body>
                    <header>
                        <img style="height: 200px" src="${image}" alt="">
                    </header>
                    <h1 style="padding-top:20px">Bienvenido/a ShinobiStore ${username}</h1>
                    <h1 style="padding-top:20px">Haz clic en el enlace para activar tu cuenta:</h1>
                    <p style="padding-top:50px; font-size: 50px">
                        <a href="http://localhost:3000/login/${token}">ShinobiStore verification</a>
                    </p>
                </body>`;
            subject = `Bienvenido a ShinobiStore ${username}`;
            break;
        case 1:
            // Mensaje para cambiar la contraseña
            mensaje = `
                <body>
                    <header>
                        <img style="height: 200px" src="${image}" alt="">
                    </header>
                    <h1 style="padding-top:20px">Has solicitado cambiar la contraseña</h1>
                    <h1 style="padding-top:20px">Haz clic en el enlace para cambiar tu contraseña:</h1>
                    <p style="padding-top:50px; font-size: 50px">
                        <a href="http://localhost:3000/reset/${token}">ShinobiStore verification</a>
                    </p>
                </body>`;
            subject = `Cambio de contraseña de ${username}`;
            break;
        default:
            console.error('Tipo de mensaje no válido');
            return 'Tipo de mensaje no válido';
    }

    // Enviar el correo utilizando el servicio de MailerService
    MailerService.sendEmail(correo, subject, mensaje)
        .then(() => console.log(`Correo enviado a ${correo}`))
        .catch((error) => console.error('Error al enviar el correo:', error));

    return 'Mensaje enviado';
}

                           