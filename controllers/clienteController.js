const jsonfile = require("jsonfile");
const path = require("path");

/**
 * Archivo JSON donde se encuentran todos los clientes
 */
const clientesFilePath = path.join(__dirname, "..\\data\\clientes.json");

/**
 * Fauncion parea obtener los clientes
 * @param {*} req 
 * @param {*} res 
 */
const getClientes = (req, res) => {
    jsonfile.readFile(clientesFilePath, (err, data) => {
        if (err) res.status(500).json({ error: "Error al leer los datos de clientes" });
        else res.json(data);
    });
};

// Función para crear un nuevo cliente
const createCliente = (req, res) => {
    const nuevoCliente = req.body;
    jsonfile.readFile(clientesFilePath, (err, data) => {
        if (err) return res.status(500).json({ error: "Error al leer los datos de clientes" });
        
        data.push(nuevoCliente); // Añade el nuevo cliente
        jsonfile.writeFile(clientesFilePath, data, { spaces: 2 }, (err) => {
            if (err) res.status(500).json({ error: "Error al guardar el nuevo cliente" });
            else res.status(201).json({ message: "Cliente creado exitosamente" });
        });
    });
};

module.exports = { getClientes, createCliente };
