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
      [datosUsuario.username, datosUsuario.password],
      (error, respuesta) => {
        if (error)
          res.render("register", { errorMsg: "Usuario ya registrado" });
        else res.redirect("login");
      }
    );
  } catch (error) {
    res.render("register", { errorMsg: "Error inesperado" });
  }
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
          if (bcrypt.compareSync(password, usuario.Contrasena)) {
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
