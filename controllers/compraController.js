const db = require("../db");
const clienteController = require("./clienteController");

exports.listarCompras = (req, res) => {
  // Primera consulta: obtener las compras
  db.query(
    `SELECT 
      Compra.ID_Compra, Compra.Fecha_Compra, Compra.Precio_Compra,
      Cliente.ID_Cliente, Cliente.Nombre, Cliente.Telefono, Cliente.Direccion,
      Vehiculo.ID_Vehiculo, Vehiculo.Marca, Vehiculo.Modelo, Vehiculo.Anio, 
      Vehiculo.Precio, Vehiculo.Combustible
    FROM 
      Compra
    INNER JOIN Cliente ON Cliente.ID_Cliente = Compra.ID_Cliente
    INNER JOIN Vehiculo ON Vehiculo.ID_Vehiculo = Compra.ID_Vehiculo`,
    (err, responseCompras) => {
      if (err) {
        console.error("Error al hacer la consulta de compras: ", err);
        res.send("ERROR al hacer la consulta");
        return;
      }

      // Procesar las compras
      const compras = responseCompras.map((compra) => ({
        ID_Compra: compra.ID_Compra,
        Fecha_Compra: compra.Fecha_Compra,
        Precio_Compra: parseFloat(compra.Precio_Compra),
        Cliente: {
          ID_Cliente: compra.ID_Cliente,
          Nombre: compra.Nombre,
          Telefono: compra.Telefono,
          Direccion: compra.Direccion,
        },
        Vehiculo: {
          ID_Vehiculo: compra.ID_Vehiculo,
          Marca: compra.Marca,
          Modelo: compra.Modelo,
          Anio: compra.Anio,
          Precio: parseFloat(compra.Precio),
          Combustible: compra.Combustible,
        },
      }));

      // Segunda consulta: obtener los clientes
      db.query("SELECT * FROM `Cliente`", (err, responseClientes) => {
        if (err) {
          console.error("Error al hacer la consulta de clientes: ", err);
          res.send("ERROR al obtener los clientes");
          return;
        }

        // Renderizar la vista con ambas consultas
        res.render("compras/list", { compras, clientes: responseClientes });
      });
    }
  );
};

// Función para mostrar el formulario de adición de compra
exports.formularioCompraAdd = (req, res) => {
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
      res.render("compras/add", { vehiculos, clientes });
    });
  });
};


// Función para añadir una compra
exports.compraAdd = (req, res) => {
  const { ID_Cliente, ID_Vehiculo, Fecha_Compra, Precio_Compra } = req.body;
  db.query(
    `INSERT INTO Compra (ID_Cliente, ID_Vehiculo, Fecha_Compra, Precio_Compra) VALUES (?, ?, ?, ?)`,
    [ID_Cliente, ID_Vehiculo, Fecha_Compra, Precio_Compra],
    (error) => {
      if (error) {
        console.error("Error al insertar la compra: ", error);
        res.send("ERROR INSERTANDO COMPRA");
        return;
      }
      res.redirect("/compras");
    }
  );
};


// Función para mostrar el formulario de eliminación de compra
exports.formularioCompraDel = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.send("PARÁMETROS INCORRECTOS");
  } else {
    db.query(
      "SELECT * FROM Compra WHERE ID_Compra=?",
      [id],
      (error, respuesta) => {
        if (error) {
          console.error("Error al intentar borrar compra: ", error);
          res.send("ERROR AL INTENTAR BORRAR COMPRA");
          return;
        }
        if (respuesta.length > 0) {
          res.render("compras/del", { compra: respuesta[0] });
        } else {
          res.send("ERROR AL INTENTAR BORRAR COMPRA, NO EXISTE");
        }
      }
    );
  }
};

// Función para eliminar una compra
exports.compraDel = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.send("ERROR BORRANDO COMPRA");
  } else {
    db.query(
      "DELETE FROM Compra WHERE ID_Compra=?",
      [id],
      (error, respuesta) => {
        if (error) {
          console.error("Error al eliminar la compra: ", error);
          res.send("ERROR AL ELIMINAR COMPRA");
          return;
        }
        res.redirect("/compras");
      }
    );
  }
};

// Función para mostrar el formulario de edición de compra
exports.formularioCompraEdit = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.send("PARÁMETROS INCORRECTOS");
    return;
  }
  db.query(
    "SELECT * FROM Compra WHERE ID_Compra=?",
    [id],
    (error, respuesta) => {
      if (error) {
        console.error("Error al intentar editar compra: ", error);
        res.send("ERROR AL INTENTAR EDITAR COMPRA");
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
            res.render("compras/edit", { compra: respuesta[0], vehiculos, clientes });
          });
        });
      } else {
        res.send("ERROR AL INTENTAR EDITAR COMPRA, NO EXISTE");
      }
    }
  );
};


// Función para editar una compra
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
        if (error) {
          console.error("Error al editar la compra: ", error);
          res.send("ERROR EDITANDO COMPRA");
          return;
        }
        res.redirect("/compras");
      }
    );
  }
};

// Función para listar compras por cliente
exports.listarComprasPorCliente = (req, res) => {
  const query = `
    SELECT 
      Compra.ID_Compra, Compra.Fecha_Compra, Compra.Precio_Compra,
      Cliente.ID_Cliente, Cliente.Nombre, Cliente.Telefono, Cliente.Direccion,
      Vehiculo.ID_Vehiculo, Vehiculo.Marca, Vehiculo.Modelo, Vehiculo.Anio, 
      Vehiculo.Precio, Vehiculo.Combustible
    FROM 
      Compra
    INNER JOIN Cliente ON Cliente.ID_Cliente = Compra.ID_Cliente
    INNER JOIN Vehiculo ON Vehiculo.ID_Vehiculo = Compra.ID_Vehiculo
    WHERE Cliente.ID_Cliente = ?;
  `;

  db.query(query, [req.params.id], (err, response) => {
    if (err) {
      console.error("Error al hacer la consulta: ", err);
      res.status(500).send("ERROR al hacer la consulta");
      return;
    }

    const cliente = response.length > 0
      ? {
          ID_Cliente: response[0].ID_Cliente,
          Nombre: response[0].Nombre,
          Telefono: response[0].Telefono,
          Direccion: response[0].Direccion,
        }
      : null;

    const compras = response.map((compra) => ({
      ID_Compra: compra.ID_Compra,
      Fecha_Compra: compra.Fecha_Compra,
      Precio_Compra: parseFloat(compra.Precio_Compra),
      Vehiculo: {
        ID_Vehiculo: compra.ID_Vehiculo,
        Marca: compra.Marca,
        Modelo: compra.Modelo,
        Anio: compra.Anio,
        Precio: parseFloat(compra.Precio),
        Combustible: compra.Combustible,
      },
    }));

    db.query("SELECT * FROM `Cliente`", (err, responseClientes) => {
      if (err) {
        console.error("Error al hacer la consulta de clientes: ", err);
        res.status(500).send("ERROR al obtener los clientes");
        return;
      }

      res.render("compras/comprasPorCliente", { compras, cliente, clientes: responseClientes });
    });
  });
};


