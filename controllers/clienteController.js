const express = require('express');
const db = require('../db');

/**
 * Funcion la cual lista la lista de clientes
 * @param {*} req 
 * @param {*} res 
 */
exports.listarClientes = (req, res) => {
  db.query("SELECT * FROM `Cliente`", (err, response) => {
    if (err) res.send("ERROR al hacer la consulta");
    else res.render("clientes/list", { clientes: response });
  });
}

/**
 * Formulario para añadir un cliente a la lista
 * @param {*} req 
 * @param {*} res 
 */
exports.formularioClienteAdd = (req, res) => {
  res.render("clientes/add");
}

/**
 * Funcion para agregar un cliente a la lista
 * @param {*} req 
 * @param {*} res 
 */
exports.clienteAdd = (req, res) => {
  const { nombre, telefono, direccion } = req.body;
  db.query(
    `INSERT INTO Cliente (nombre, telefono, direccion) VALUES (?, ?, ?)`,
    [nombre, telefono, direccion],
    (error, respuesta) => {
      if (error) res.send("ERROR INSERTANDO CLIENTE");
      else res.redirect("/clientes");
    }
  );
};

/**
 * Formulario para borrar un cliente segun su id
 * @param {*} req 
 * @param {*} res 
 */
exports.formularioClienteDel = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send("PARÁMETROS INCORRECTOS");
  else {
    db.query("SELECT * FROM Cliente WHERE ID_Cliente=?", [id], (error, respuesta) => {
      if (error) res.send("ERROR AL INTENTAR BORRAR CLIENTE");
      else {
        if (respuesta.length > 0) {
          res.render("clientes/del", { cliente: respuesta[0] });
        } else {
          res.send("ERROR AL INTENTAR BORRAR CLIENTE, NO EXISTE");
        }
      }
    });
  }
};

/**
 * Borrar un cliente de la lista segun su id
 * @param {*} req 
 * @param {*} res 
 */
exports.clienteDel = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send("ERROR BORRANDO VEHÍCULO");
  else {
    db.query("DELETE FROM Cliente WHERE ID_Cliente=?", [id], (error, respuesta) => {
      if (error) res.send("ERROR AL ELIMINAR CLIENTE");
      else res.redirect("/clientes");
    });
  }
};

/**
 * Formulario para editar un cliente segun su id
 * @param {*} req 
 * @param {*} res 
 */
exports.formularioClienteEdit = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send("PARÁMETROS INCORRECTOS");
  else {
    db.query("SELECT * FROM Cliente WHERE ID_Cliente=?", [id], (error, respuesta) => {
      if (error) res.send("ERROR AL INTENTAR EDITAR CLIENTE");
      else {
        if (respuesta.length > 0) {
          res.render("clientes/edit", { cliente: respuesta[0] });
        } else {
          res.send("ERROR AL INTENTAR EDITAR CLIENTE, NO EXISTE");
        }
      }
    });
  }
};

/**
 * Editar un cliente de la lista segun su id
 * @param {*} req 
 * @param {*} res 
 */
exports.clienteEdit = (req, res) => {
  const { id, nombre, telefono, direccion } = req.body;
  const paramId = req.params["id"];

  if (isNaN(id) || isNaN(paramId) || id !== paramId) {
    res.send("ERROR EDITANDO ");
  } else {
    db.query(
      "UPDATE Cliente SET Nombre = ?, Telefono = ?, Direccion = ? WHERE ID_Cliente = ?",
      [nombre, telefono, direccion, id],
      (error, respuesta) => {
        if (error) res.send("ERROR EDITANDO CLIENTE");
        else res.redirect("/clientes");
      }
    );
  }
};

// Método para listar las compras de un cliente específico
exports.listarComprasPorCliente = async (req, res) => {
    const clienteId = req.params.id;

    try {
        const [compras] = await db.query(
            'SELECT * FROM Compras WHERE cliente_id = ?',
            [clienteId]
        );
        res.render('comprasPorCliente', { compras, clienteId });
    } catch (error) {
        console.error('Error al obtener compras del cliente:', error);
        res.status(500).send('Error en el servidor');
    }
};

// Método para listar las compras de un cliente específico
exports.listarComprasPorCliente = async (req, res) => {
  const clienteId = req.params.id;

  try {
      const [compras] = await db.query(
          'SELECT * FROM Compras WHERE cliente_id = ?',
          [clienteId]
      );
      res.render('comprasPorCliente', { compras, clienteId });
  } catch (error) {
      console.error('Error al obtener compras del cliente:', error);
      res.status(500).send('Error en el servidor');
  }
};
