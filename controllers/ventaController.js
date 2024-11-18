const express = require('express');
const db = require('../db');
const vehiculoController = require("./vehiculoController");

/**
 * Función para listar todas las ventas
 * @param {*} req 
 * @param {*} res 
 */
exports.listarVentas = (req, res) => {
  // Primera consulta: obtener las compras
  db.query(
    `SELECT 
      Venta.ID_Venta, Venta.Fecha_Venta, Venta.Total,
      Cliente.ID_Cliente, Cliente.Nombre, Cliente.Telefono, Cliente.Direccion,
      Vehiculo.ID_Vehiculo, Vehiculo.Marca, Vehiculo.Modelo, Vehiculo.Anio, 
      Vehiculo.Precio, Vehiculo.Combustible
    FROM 
      Venta
    INNER JOIN Cliente ON Cliente.ID_Cliente = Venta.ID_Cliente
    INNER JOIN Vehiculo ON Vehiculo.ID_Vehiculo = Venta.ID_Vehiculo`,
    (err, responseVentas) => {
      if (err) {
        console.error("Error al hacer la consulta de ventas: ", err);
        res.send("ERROR al hacer la consulta");
        return;
      }

      // Procesar las ventas
      const ventas = responseVentas.map((venta) => ({
        ID_Venta: venta.ID_Venta,
        Fecha_Venta: venta.Fecha_Venta,
        Total: parseFloat(venta.Total),
        Cliente: {
          ID_Cliente: venta.ID_Cliente,
          Nombre: venta.Nombre,
          Telefono: venta.Telefono,
          Direccion: venta.Direccion,
        },
        Vehiculo: {
          ID_Vehiculo: venta.ID_Vehiculo,
          Marca: venta.Marca,
          Modelo: venta.Modelo,
          Anio: venta.Anio,
          Precio: parseFloat(venta.Precio),
          Combustible: venta.Combustible,
        },
      }));

      // Segunda consulta: obtener los vehiculos
      db.query("SELECT * FROM `Vehiculo`", (err, responseVehiculos) => {
        if (err) {
          console.error("Error al hacer la consulta de vehiculos: ", err);
          res.send("ERROR al obtener los vehiculos");
          return;
        }

        // Renderizar la vista con ambas consultas
        res.render("ventas/list", { ventas, vehiculos: responseVehiculos });
      });
    }
  );
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

// Función para listar ventas por vehículo
exports.listarVentasPorVehiculo = (req, res) => {
  const query = `
    SELECT 
      Venta.ID_Venta, Venta.Fecha_Venta, Venta.Total,
      Vehiculo.ID_Vehiculo, Vehiculo.Marca, Vehiculo.Modelo, Vehiculo.Anio, 
      Vehiculo.Combustible,
      Cliente.ID_Cliente, Cliente.Nombre, Cliente.Telefono, Cliente.Direccion
    FROM 
      Venta
    INNER JOIN Vehiculo ON Vehiculo.ID_Vehiculo = Venta.ID_Vehiculo
    INNER JOIN Cliente ON Cliente.ID_Cliente = Venta.ID_Cliente
    WHERE Vehiculo.ID_Vehiculo = ?;
  `;

  db.query(query, [req.params.id], (err, response) => {
    if (err) {
      console.error("Error al hacer la consulta: ", err);
      res.status(500).send("ERROR al hacer la consulta");
      return;
    }

    const vehiculo = response.length > 0
      ? {
          ID_Vehiculo: response[0].ID_Vehiculo,
          Marca: response[0].Marca,
          Modelo: response[0].Modelo,
          Anio: response[0].Anio,
          Combustible: response[0].Combustible,
        }
      : null;

    const ventas = response.map((venta) => ({
      ID_Venta: venta.ID_Venta,
      Fecha_Venta: venta.Fecha_Venta,
      Total: parseFloat(venta.Total),
      Cliente: {
        ID_Cliente: venta.ID_Cliente,
        Nombre: venta.Nombre,
        Telefono: venta.Telefono,
        Direccion: venta.Direccion,
      },
      Vehiculo: vehiculo,
    }));

    // Obtener los vehículos para el dropdown
    db.query("SELECT * FROM `Vehiculo`", (err, responseVehiculos) => {
      if (err) {
        console.error("Error al hacer la consulta de vehículos: ", err);
        res.status(500).send("ERROR al obtener los vehículos");
        return;
      }
    
      console.log("Vehículos obtenidos:", responseVehiculos);
      res.render("ventas/vehiculosPorVenta", { ventas, vehiculo, vehiculos: responseVehiculos });
    });
  });
};
