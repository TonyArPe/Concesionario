const bcrypt = require('bcrypt');
const db = require('../db');


exports.registerForm = (req, res) =>{
    res.render('register');
};

exports.register = (req, res) =>{
    const datosUsuario = req.body;
    datosUsuario.rol='cliente'
    datosUsuario.password= bcrypt.hashSync(datosUsuario.password, 10);
    try {
            // guardamos el usuario en la BBDD SIN ACTIVAR
        db.query(
            'INSERT INTO users (username, password, enabled) VALUES (?,?,?)',
            [datosUsuario.username, datosUsuario.password, 0],
            (error, respuesta) => {
                if (error) res.send('ERROR INSERTANDO usuario' + req.body)
                else res.render('mensaje', {tituloPagina:'Registro usuarios', mensajePagina: 'Usuario registrado'});
        }
      );                
    } catch (error) {
        res.render('mensaje', {tituloPagina:'ERROR', mensajePagina: 'Error ' + error});
    }   
};

exports.loginForm = (req, res) =>{
    res.render('login');
};

exports.login = (req, res)=>{
    const {username, password} = req.body;

    db.query(
        'SELECT * from users WHERE username=?',
        [username],
        (error, rsUsuario) => {
            if (error) {
               alert('Usuario no encontrado');
            } else {
                const usuario = rsUsuario[0];
                if (usuario) {
                    if (usuario.enabled==1 && bcrypt.compareSync(password, usuario.password)){
                        req.session.user = usuario.username;
                        res.redirect('/');
                    } else {                       
                        alert('Usuario desactivado')
                    }
                } else {
                     alert('Usuario no encontrado o credenciales inválidas');
                }
                console.log(res)
            }
        }
    )    
};

exports.logout = (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error('Error al destruir la sesión:', err);
                return res.status(500).send('Error al cerrar sesión');
            }
            res.redirect('/auth/login');
        });
    } else {
        res.redirect('/auth/login');
    }
};


