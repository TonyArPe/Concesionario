const express = require('express');
const db = require('../db');

/**
 * Función para listar todas las ventas
 * @param {*} req 
 * @param {*} res 
 */
exports.listarVentas = (req, res) => {
  const query = `
    SELECT 
      Venta.ID_Venta, Venta.Fecha_Venta, Venta.Total,
      Cliente.ID_Cliente, Cliente.Nombre, Cliente.Telefono, Cliente.Direccion,
      Vehiculo.ID_Vehiculo, Vehiculo.Marca, Vehiculo.Modelo, Vehiculo.Anio, 
      Vehiculo.Precio, Vehiculo.Combustible
    FROM 
      Venta
    INNER JOIN Cliente ON Cliente.ID_Cliente = Venta.ID_Cliente
    INNER JOIN Vehiculo ON Vehiculo.ID_Vehiculo = Venta.ID_Vehiculo;
  `;

  db.query(query, (err, response) => {
    if (err) {
      res.status(500).send("ERROR al hacer la consulta");
      return;
    }

    
    const ventas = response.map((venta) => ({
      ID_Venta: venta.ID_Venta,
      Fecha_Venta: venta.Fecha_Venta,
      Total: parseFloat(venta.Total), 
      Cliente: {
        ID_Cliente: venta.ID_Cliente,
        Nombre: venta.Nombre,
        Telefono: venta.Telefono,
        Direccion: venta.Direccion
      },
      Vehiculo: {
        ID_Vehiculo: venta.ID_Vehiculo,
        Marca: venta.Marca,
        Modelo: venta.Modelo,
        Anio: venta.Anio,
        Precio: parseFloat(venta.Precio), 
        Combustible: venta.Combustible
      }
    }));
  
    res.render("ventas/list", { ventas });
    
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

// Método para listar los vehículos de una venta específica
exports.listarVehiculosPorVenta = async (req, res) => {
  const ventaId = req.params.id;

  try {
      const [vehiculos] = await db.query(
          'SELECT * FROM Vehiculos WHERE ID_Venta = ?',
          [ventaId]
      );
      res.render('vehiculosPorVenta', { vehiculos, ventaId });
  } catch (error) {
      console.error('Error al obtener vehículos de la venta:', error);
      res.status(500).send('Error en el servidor');
  }
};
