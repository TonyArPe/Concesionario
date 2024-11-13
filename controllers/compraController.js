const express = require('express');
const db = require('../db');

/**
 * Función para listar todas las compras
 * @param {*} req 
 * @param {*} res 
 */
exports.listarCompras = (req, res) => {
  const query = `
    SELECT 
      Compra.ID_Compra, Compra.Fecha_Compra, Compra.Precio_Compra,
      Cliente.ID_Cliente, Cliente.Nombre, Cliente.Telefono, Cliente.Direccion,
      Vehiculo.ID_Vehiculo, Vehiculo.Marca, Vehiculo.Modelo, Vehiculo.Anio, 
      Vehiculo.Precio, Vehiculo.Combustible
    FROM 
      Compra
    INNER JOIN Cliente ON Cliente.ID_Cliente = Compra.ID_Cliente
    INNER JOIN Vehiculo ON Vehiculo.ID_Vehiculo = Compra.ID_Vehiculo;
  `;

  db.query(query, (err, response) => {
    if (err) {
      res.status(500).send("ERROR al hacer la consulta");
      return;
    }

    
    const compras = response.map((compra) => ({
      ID_Compra: compra.ID_Compra,
      Fecha_Compra: compra.Fecha_Compra,
      Precio_Compra: parseFloat(compra.Precio_Compra),
      Cliente: {
        ID_Cliente: compra.ID_Cliente,
        Nombre: compra.Nombre,
        Telefono: compra.Telefono,
        Direccion: compra.Direccion
      },
      Vehiculo: {
        ID_Vehiculo: compra.ID_Vehiculo,
        Marca: compra.Marca,
        Modelo: compra.Modelo,
        Anio: compra.Anio,
        Precio: parseFloat(compra.Precio),
        Combustible: compra.Combustible
      }
    }));

   
    res.render("compras/list", { compras });
    
  });
};


/**
 * Formulario para añadir una nueva compra
 * @param {*} req 
 * @param {*} res 
 */
exports.formularioCompraAdd = (req, res) => {
  db.query("SELECT * FROM `Vehiculo`", (err, vehiculos) => {
    if (err) res.send("ERROR al obtener los vehículos");
    else res.render("compras/add", { vehiculos });
  });
};

/**
 * Función para agregar una nueva compra
 * @param {*} req 
 * @param {*} res 
 */
exports.compraAdd = (req, res) => {
  const { ID_Vehiculo, Fecha_Compra, Precio_Compra } = req.body;
  db.query(
    `INSERT INTO Compra (ID_Vehiculo, Fecha_Compra, Precio_Compra) VALUES (?, ?, ?)`,
    [ID_Vehiculo, Fecha_Compra, Precio_Compra],
    (error, respuesta) => {
      if (error) res.send("ERROR INSERTANDO COMPRA");
      else res.redirect("/compras");
    }
  );
};

/**
 * Formulario para borrar una compra según su id
 * @param {*} req 
 * @param {*} res 
 */
exports.formularioCompraDel = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send("PARÁMETROS INCORRECTOS");
  else {
    db.query("SELECT * FROM Compra WHERE ID_Compra=?", [id], (error, respuesta) => {
      if (error) res.send("ERROR AL INTENTAR BORRAR COMPRA");
      else {
        if (respuesta.length > 0) {
          res.render("compras/del", { compra: respuesta[0] });
        } else {
          res.send("ERROR AL INTENTAR BORRAR COMPRA, NO EXISTE");
        }
      }
    });
  }
};

/**
 * Función para borrar una compra según su id
 * @param {*} req 
 * @param {*} res 
 */
exports.compraDel = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send("ERROR BORRANDO COMPRA");
  else {
    db.query("DELETE FROM Compra WHERE ID_Compra=?", [id], (error, respuesta) => {
      if (error) res.send("ERROR AL ELIMINAR COMPRA");
      else res.redirect("/compras");
    });
  }
};

/**
 * Formulario para editar una compra según su id
 * @param {*} req 
 * @param {*} res 
 */
exports.formularioCompraEdit = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send("PARÁMETROS INCORRECTOS");
  else {
    db.query("SELECT * FROM Compra WHERE ID_Compra=?", [id], (error, respuesta) => {
      if (error) res.send("ERROR AL INTENTAR EDITAR COMPRA");
      else {
        if (respuesta.length > 0) {
          db.query("SELECT * FROM Vehiculo", (err, vehiculos) => {
            if (err) res.send("ERROR AL OBTENER LOS VEHÍCULOS");
            else res.render("compras/edit", { compra: respuesta[0], vehiculos });
          });
        } else {
          res.send("ERROR AL INTENTAR EDITAR COMPRA, NO EXISTE");
        }
      }
    });
  }
};

/**
 * Función para editar una compra según su id
 * @param {*} req 
 * @param {*} res 
 */
exports.compraEdit = (req, res) => {
  const { id, ID_Vehiculo, Fecha_Compra, Precio_Compra } = req.body;
  const paramId = req.params["id"];

  if (isNaN(id) || isNaN(paramId) || id !== paramId) {
    res.send("ERROR EDITANDO COMPRA");
  } else {
    db.query(
      "UPDATE Compra SET ID_Vehiculo = ?, Fecha_Compra = ?, Precio_Compra = ? WHERE ID_Compra = ?",
      [ID_Vehiculo, Fecha_Compra, Precio_Compra, id],
      (error, respuesta) => {
        if (error) res.send("ERROR EDITANDO COMPRA");
        else res.redirect("/compras");
      }
    );
  }
};
