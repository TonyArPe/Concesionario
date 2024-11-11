const express = require('express');
const db = require('../db');

/**
 * Funcion la cual lista la lista de vehiculos
 * @param {*} req 
 * @param {*} res 
 */
exports.listarVehiculos = (req, res) => {
  db.query("SELECT * FROM `Vehiculo`", (err, response) => {
    if (err) res.send("ERROR al hacer la consulta");
    else res.render("vehiculos/list", { vehiculos: response });
  });
}

/**
 * Formulario para añadir un vehiculo a la lista
 * @param {*} req 
 * @param {*} res 
 */
exports.formularioVehiculoAdd = (req, res) => {
  res.render("vehiculos/add");
}

/**
 * Funcion para agregar un vehiculo a la lista
 * @param {*} req 
 * @param {*} res 
 */
exports.vehiculoAdd = (req, res) => {
  const { marca, modelo, anio, precio, combustible } = req.body;
  db.query(
    `INSERT INTO Vehiculo (Marca, Modelo, Anio, Precio, Combustible) VALUES (?, ?, ?, ?, ?)`,
    [marca, modelo, anio, precio, combustible],
    (error, respuesta) => {
      if (error) res.send("ERROR INSERTANDO VEHÍCULO");
      else res.redirect("/vehiculos");
    }
  );
};

/**
 * Formulario para borrar un vehiculo segun su id
 * @param {*} req 
 * @param {*} res 
 */
exports.formularioVehiculoDel = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send("PARÁMETROS INCORRECTOS");
  else {
    db.query("SELECT * FROM Vehiculo WHERE ID_Vehiculo=?", [id], (error, respuesta) => {
      if (error) res.send("ERROR AL INTENTAR BORRAR VEHÍCULO");
      else {
        if (respuesta.length > 0) {
          res.render("vehiculos/del", { vehiculo: respuesta[0] });
        } else {
          res.send("ERROR AL INTENTAR BORRAR VEHÍCULO, NO EXISTE");
        }
      }
    });
  }
};

/**
 * Borrar un vehiculo de la lista segun su id
 * @param {*} req 
 * @param {*} res 
 */
exports.vehiculoDel = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send("ERROR BORRANDO VEHÍCULO");
  else {
    db.query("DELETE FROM Vehiculo WHERE ID_Vehiculo=?", [id], (error, respuesta) => {
      if (error) res.send("ERROR AL ELIMINAR VEHÍCULO");
      else res.redirect("/vehiculos");
    });
  }
};

/**
 * Formulario para editar un vehiculo segun su id
 * @param {*} req 
 * @param {*} res 
 */
exports.formularioVehiculoEdit = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send("PARÁMETROS INCORRECTOS");
  else {
    db.query("SELECT * FROM Vehiculo WHERE ID_Vehiculo=?", [id], (error, respuesta) => {
      if (error) res.send("ERROR AL INTENTAR EDITAR VEHÍCULO");
      else {
        if (respuesta.length > 0) {
          res.render("vehiculos/edit", { vehiculo: respuesta[0] });
        } else {
          res.send("ERROR AL INTENTAR EDITAR VEHÍCULO, NO EXISTE");
        }
      }
    });
  }
};

/**
 * Editar un vehiculo de la lista segun su id
 * @param {*} req 
 * @param {*} res 
 */
exports.vehiculoEdit = (req, res) => {
  const { id, marca, modelo, anio, precio, combustible } = req.body;
  const paramId = req.params["id"];
  
  if (isNaN(id) || isNaN(paramId) || id !== paramId) {
    res.send("ERROR EDITANDO VEHÍCULO");
  } else {
    db.query(
      "UPDATE Vehiculo SET Marca = ?, Modelo = ?, Anio = ?, Precio = ?, Combustible = ? WHERE ID_Vehiculo = ?",
      [marca, modelo, anio, precio, combustible, id],
      (error, respuesta) => {
        if (error) res.send("ERROR EDITANDO VEHÍCULO");
        else res.redirect("/vehiculos");
      }
    );
  }
};
