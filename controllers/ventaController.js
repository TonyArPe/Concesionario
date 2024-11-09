const express = require('express');
const db = require('../db');

/**
 * Función para listar todas las ventas
 * @param {*} req 
 * @param {*} res 
 */
exports.listarVentas = (req, res) => {
  db.query("SELECT * FROM `Venta`", (err, response) => {
    if (err) res.send("ERROR al hacer la consulta");
    else res.render("ventas/", { ventas: response });
  });
};

/**
 * Formulario para añadir una nueva venta
 * @param {*} req 
 * @param {*} res 
 */
exports.formularioVentaAdd = (req, res) => {
  db.query("SELECT * FROM `Vehiculo`", (err, vehiculos) => {
    if (err) res.send("ERROR al obtener los vehículos");
    else {
      db.query("SELECT * FROM `Cliente`", (err, clientes) => {
        if (err) res.send("ERROR al obtener los clientes");
        else res.render("ventas/add", { vehiculos, clientes });
      });
    }
  });
};

/**
 * Función para agregar una nueva venta
 * @param {*} req 
 * @param {*} res 
 */
exports.ventaAdd = (req, res) => {
  const { ID_Vehiculo, ID_Cliente, Fecha_Venta, Total } = req.body;
  db.query(
    `INSERT INTO Venta (ID_Vehiculo, ID_Cliente, Fecha_Venta, Total) VALUES (?, ?, ?, ?)`,
    [ID_Vehiculo, ID_Cliente, Fecha_Venta, Total],
    (error, respuesta) => {
      if (error) res.send("ERROR INSERTANDO VENTA");
      else res.redirect("/ventas");
    }
  );
};

/**
 * Formulario para borrar una venta según su id
 * @param {*} req 
 * @param {*} res 
 */
exports.formularioVentaDel = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send("PARÁMETROS INCORRECTOS");
  else {
    db.query("SELECT * FROM Venta WHERE ID_Venta=?", [id], (error, respuesta) => {
      if (error) res.send("ERROR AL INTENTAR BORRAR VENTA");
      else {
        if (respuesta.length > 0) {
          res.render("ventas/del", { venta: respuesta[0] });
        } else {
          res.send("ERROR AL INTENTAR BORRAR VENTA, NO EXISTE");
        }
      }
    });
  }
};

/**
 * Función para borrar una venta según su id
 * @param {*} req 
 * @param {*} res 
 */
exports.ventaDel = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send("ERROR BORRANDO VENTA");
  else {
    db.query("DELETE FROM Venta WHERE ID_Venta=?", [id], (error, respuesta) => {
      if (error) res.send("ERROR AL ELIMINAR VENTA");
      else res.redirect("/ventas");
    });
  }
};

/**
 * Formulario para editar una venta según su id
 * @param {*} req 
 * @param {*} res 
 */
exports.formularioVentaEdit = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send("PARÁMETROS INCORRECTOS");
  else {
    db.query("SELECT * FROM Venta WHERE ID_Venta=?", [id], (error, respuesta) => {
      if (error) res.send("ERROR AL INTENTAR EDITAR VENTA");
      else {
        if (respuesta.length > 0) {
          db.query("SELECT * FROM Vehiculo", (err, vehiculos) => {
            if (err) res.send("ERROR AL OBTENER LOS VEHÍCULOS");
            else {
              db.query("SELECT * FROM Cliente", (err, clientes) => {
                if (err) res.send("ERROR AL OBTENER LOS CLIENTES");
                else res.render("ventas/edit", { venta: respuesta[0], vehiculos, clientes });
              });
            }
          });
        } else {
          res.send("ERROR AL INTENTAR EDITAR VENTA, NO EXISTE");
        }
      }
    });
  }
};

/**
 * Función para editar una venta según su id
 * @param {*} req 
 * @param {*} res 
 */
exports.ventaEdit = (req, res) => {
  const { id, ID_Vehiculo, ID_Cliente, Fecha_Venta, Total } = req.body;
  const paramId = req.params["id"];

  if (isNaN(id) || isNaN(paramId) || id !== paramId) {
    res.send("ERROR EDITANDO VENTA");
  } else {
    db.query(
      "UPDATE Venta SET ID_Vehiculo = ?, ID_Cliente = ?, Fecha_Venta = ?, Total = ? WHERE ID_Venta = ?",
      [ID_Vehiculo, ID_Cliente, Fecha_Venta, Total, id],
      (error, respuesta) => {
        if (error) res.send("ERROR EDITANDO VENTA");
        else res.redirect("/ventas");
      }
    );
  }
};
