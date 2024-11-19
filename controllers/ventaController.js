const express = require("express");
const db = require("../db");
const vehiculoController = require("./vehiculoController");
const clienteController = require("./clienteController");

/**
 * Función para listar todas las ventas
 * @param {*} req
 * @param {*} res
 */
exports.listarVentas = (req, res) => {
  // Primera consulta: obtener las ventas
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
        return res.status(500).send("ERROR al hacer la consulta");
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

      // Segunda consulta: obtener los clientes
      db.query("SELECT * FROM `Cliente`", (err, responseClientes) => {
        if (err) {
          console.error("Error al hacer la consulta de clientes: ", err);
          return res.status(500).send("ERROR al obtener los clientes");
        }

        // Tercera consulta: obtener los vehículos
        db.query("SELECT * FROM `Vehiculo`", (err, responseVehiculos) => {
          if (err) {
            console.error("Error al hacer la consulta de vehículos: ", err);
            return res.status(500).send("ERROR al obtener los vehículos");
          }

          // Renderizar la vista con ambas consultas
          res.render("ventas/list", { 
            ventas, 
            clientes: responseClientes, 
            vehiculos: responseVehiculos 
          });
        });
      });
    }
  );
};


/**
 * Función para mostrar el formulario de adición de venta
 * @param {*} req
 * @param {*} res
 */
exports.formularioVentaAdd = (req, res) => {
  db.query("SELECT * FROM Vehiculo", (errVehiculos, vehiculos) => {
    if (errVehiculos) {
      console.error("Error al obtener los vehículos: ", errVehiculos);
      res.send("ERROR AL OBTENER LOS VEHÍCULOS");
      return;
    }
    db.query("SELECT * FROM Cliente", (errClientes, clientes) => {
      if (errClientes) {
        console.error("Error al obtener los clientes: ", errClientes);
        res.send("ERROR AL OBTENER LOS CLIENTES");
        return;
      }
      res.render("ventas/add", { vehiculos, clientes });
    });
  });
};

/**
 * Función para añadir una venta
 * @param {*} req
 * @param {*} res
 */
exports.ventaAdd = (req, res) => {
  const { ID_Cliente, ID_Vehiculo, Fecha_Venta, Total } = req.body;
  db.query(
    `INSERT INTO Venta (ID_Cliente, ID_Vehiculo, Fecha_Venta, Total) VALUES (?, ?, ?, ?)`,
    [ID_Cliente, ID_Vehiculo, Fecha_Venta, Total],
    (error) => {
      if (error) {
        console.error("Error al insertar la venta: ", error);
        res.send("ERROR INSERTANDO VENTA");
        return;
      }
      res.redirect("/ventas");
    }
  );
};

/**
 * Función para mostrar el formulario de eliminación de venta
 * @param {*} req
 * @param {*} res
 */
exports.formularioVentaDel = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.send("PARÁMETROS INCORRECTOS");
  } else {
    db.query(
      "SELECT * FROM Venta WHERE ID_Venta=?",
      [id],
      (error, respuesta) => {
        if (error) {
          console.error("Error al intentar borrar venta: ", error);
          res.send("ERROR AL INTENTAR BORRAR VENTA");
          return;
        }
        if (respuesta.length > 0) {
          res.render("ventas/del", { venta: respuesta[0] });
        } else {
          res.send("ERROR AL INTENTAR BORRAR VENTA, NO EXISTE");
        }
      }
    );
  }
};

/**
 * Función para eliminar una venta
 * @param {*} req
 * @param {*} res
 */
exports.ventaDel = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.send("ERROR BORRANDO VENTA");
  } else {
    db.query(
      "DELETE FROM Venta WHERE ID_Venta=?",
      [id],
      (error, respuesta) => {
        if (error) {
          console.error("Error al eliminar la venta: ", error);
          res.send("ERROR AL ELIMINAR VENTA");
          return;
        }
        res.redirect("/ventas");
      }
    );
  }
};

/**
 * Función para mostrar el formulario de edición de venta
 * @param {*} req
 * @param {*} res
 */
exports.formularioVentaEdit = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.send("PARÁMETROS INCORRECTOS");
    return;
  }
  db.query(
    "SELECT * FROM Venta WHERE ID_Venta=?",
    [id],
    (error, respuesta) => {
      if (error) {
        console.error("Error al intentar editar venta: ", error);
        res.send("ERROR AL INTENTAR EDITAR VENTA");
        return;
      }
      if (respuesta.length > 0) {
        db.query("SELECT * FROM Vehiculo", (errVehiculos, vehiculos) => {
          if (errVehiculos) {
            console.error("Error al obtener los vehículos: ", errVehiculos);
            res.send("ERROR AL OBTENER LOS VEHÍCULOS");
            return;
          }
          db.query("SELECT * FROM Cliente", (errClientes, clientes) => {
            if (errClientes) {
              console.error("Error al obtener los clientes: ", errClientes);
              res.send("ERROR AL OBTENER LOS CLIENTES");
              return;
            }
            res.render("ventas/edit", { venta: respuesta[0], vehiculos, clientes });
          });
        });
      } else {
        res.send("ERROR AL INTENTAR EDITAR VENTA, NO EXISTE");
      }
    }
  );
};

/**
 * Función para editar una venta
 * @param {*} req
 * @param {*} res
 */
exports.ventaEdit = (req, res) => {
  const { ID_Cliente, ID_Vehiculo, Fecha_Venta, Total } = req.body; // Extraer valores del formulario
  const id = req.params.id; // ID de la venta desde la URL

  // Validar ID de la URL
  if (!id || isNaN(id)) {
    console.error("ID de venta inválido:", id);
    return res.status(400).send("ERROR: ID de venta inválido.");
  }

  // Validar datos del formulario
  if (!ID_Cliente || isNaN(ID_Cliente)) {
    console.error("ID_Cliente inválido o no proporcionado:", ID_Cliente);
    return res.status(400).send("ERROR: Cliente inválido o no proporcionado.");
  }

  if (!ID_Vehiculo || isNaN(ID_Vehiculo)) {
    console.error("ID_Vehiculo inválido o no proporcionado:", ID_Vehiculo);
    return res.status(400).send("ERROR: Vehículo inválido o no proporcionado.");
  }

  if (!Fecha_Venta || isNaN(Date.parse(Fecha_Venta))) {
    console.error("Fecha de venta inválida:", Fecha_Venta);
    return res.status(400).send("ERROR: Fecha de venta inválida.");
  }

  if (!Total || isNaN(Total)) {
    console.error("Total de venta inválido o no proporcionado:", Total);
    return res.status(400).send("ERROR: Total de venta inválido o no proporcionado.");
  }

  // Actualizar en la base de datos
  db.query(
    `UPDATE Venta SET 
      ID_Cliente = ?, 
      ID_Vehiculo = ?, 
      Fecha_Venta = ?, 
      Total = ? 
    WHERE ID_Venta = ?`,
    [ID_Cliente, ID_Vehiculo, Fecha_Venta, Total, id],
    (error, resultado) => {
      if (error) {
        console.error("Error al actualizar la venta:", error);
        return res.status(500).send("ERROR al actualizar la venta.");
      }
      console.log("Venta actualizada correctamente:", resultado);
      res.redirect("/ventas"); // Redirigir al listado de ventas después de la edición
    }
  );
};

/**
 * Función para listar ventas por cliente
 * @param {*} req
 * @param {*} res
 */

exports.listarVentasPorVehiculo = (req, res) => {
  // Consulta SQL para obtener compras del cliente con detalles del vehículo
  const query = `
    SELECT 
      Venta.ID_Venta, Venta.Fecha_Venta, Venta.Total,
      Cliente.ID_Cliente, Cliente.Nombre, Cliente.Telefono, Cliente.Direccion,
      Vehiculo.ID_Vehiculo, Vehiculo.Marca, Vehiculo.Modelo, Vehiculo.Anio, 
      Vehiculo.Precio, Vehiculo.Combustible
    FROM 
      Venta
    INNER JOIN Cliente ON Cliente.ID_Cliente = Venta.ID_Cliente
    INNER JOIN Vehiculo ON Vehiculo.ID_Vehiculo = Venta.ID_Vehiculo
    WHERE Cliente.ID_Cliente = ?;
  `;

  db.query(query, [req.params.id], (err, response) => {
    if (err) {
      console.error("Error al hacer la consulta: ", err);
      return res.status(500).send("ERROR al hacer la consulta");
    }

    // Verificamos si existen compras y obtenemos los datos del cliente
    const cliente = response.length > 0
      ? {
          ID_Cliente: response[0].ID_Cliente,
          Nombre: response[0].Nombre,
          Telefono: response[0].Telefono,
          Direccion: response[0].Direccion,
        }
      : null;

    // Mapeamos las compras y los detalles de los vehículos, ahora añadiendo el cliente
    const ventas = response.map((venta) => ({
      ID_Venta: venta.ID_Venta,
      Fecha_Venta: venta.Fecha_Venta,
      Total: parseFloat(venta.Total),
      Cliente: cliente,  // Ahora se incluye el objeto Cliente en cada venta
      Vehiculo: {
        ID_Vehiculo: venta.ID_Vehiculo,
        Marca: venta.Marca,
        Modelo: venta.Modelo,
        Anio: venta.Anio,
        Precio: parseFloat(venta.Precio),
        Combustible: venta.Combustible,
      },
    }));

    // Consulta adicional para obtener todos los vehículos disponibles
    db.query("SELECT * FROM `Vehiculo`", (err, vehiculos) => {
      if (err) {
        console.error("Error al hacer la consulta de vehículos: ", err);
        return res.status(500).send("ERROR al obtener los vehículos");
      }

      // Verificamos si hay vehículos y asignamos un mensaje en caso de no haber
      const mensaje = vehiculos.length === 0 ? "No hay vehículos disponibles." : undefined;

      // Renderizamos la vista con los datos obtenidos
      res.render("ventas/vehiculosPorVenta", { 
        ventas, 
        vehiculos,  // Vehículos disponibles para seleccionar
        mensaje     // Mensaje si no hay vehículos
      });
    });
  });
};

