const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

/**
 * Funcion para mostrar el login
 * @param {*} req 
 * @param {*} res 
 */
exports.showLogin = (req, res) => {
    res.render('index');
};

/**
 * Funcion la cual compara y comprueba los datos del usuario
 * @param {*} req 
 * @param {*} res 
 */
exports.login = (req, res) => {
    const {usuario, contrasena} = req.body;

    db.query("SELECT * FROM Usuario WHERE Usuario = ?", [usuario], (err, results) => {
        if(err)
            throw err

        if(results.length > 0){
            bcrypt.compare(contrasena, results[0].Contrasena, (err, isMatch) => {
                if(err)
                    throw err
                if(isMatch === true)
                    res.redirect("/dashboard")
                else
                    res.render("index", {error: "Contraseña Incorrecta"})
            })
        }
        else
            res.render("index", {error: "Usuario no encontrado"})
    })
}

/**
 * Funcion para mostrar el formulario de registro
 * @param {*} req 
 * @param {*} res 
 */
exports.showRegister = (req, res) => {
    res.render('register');
};

exports.register = (req, res) => {
    const {usuario, contrasena} = req.body

    db.query("SELECT * FROM Usuario WHERE Usuario = ?", [usuario], (err,results) => {
        if(err)
            throw err
        if(results.length > 0)
            bcrypt.hash(contrasena, 10, (err, hashedPassword) => {
        if(err)
            throw err
        db.query("INSERT INTO Usuario (Usuario, Contrasena) VALUES (?, ?)",
                {Usuario: usuario, Contrasena: hashedPassword}, (err, result) => {
                    if(err)
                        throw err
                    else
                        res.render("/")
            })
        })
    });
}