const fs = require('fs');

// Leer el archivo JSON
const jsonData = require('..\\data\\datosConcesionario.json');

// Función para generar CREATE TABLE
const generateCreateTable = (tableName, columns) => {
  const columnsSQL = columns.map(([name, type]) => `${name} ${type}`).join(",\n  ");
  return `CREATE TABLE ${tableName} (\n  ${columnsSQL}\n);\n`;
};

// Función para generar INSERT INTO
const generateInsertStatements = (tableName, data) => {
  const columns = Object.keys(data[0]).join(", ");
  const values = data.map(row =>
    `(${Object.values(row)
      .map(value => (typeof value === "string" ? `'${value}'` : value))
      .join(", ")})`
  );
  return `INSERT INTO ${tableName} (${columns}) VALUES\n${values.join(",\n")};\n`;
};

// Generar las tablas y los inserts
let sqlScript = "";

// Vehiculo
sqlScript += generateCreateTable("Vehiculo", [
  ["ID_Vehiculo", "INT PRIMARY KEY"],
  ["Marca", "VARCHAR(50)"],
  ["Modelo", "VARCHAR(50)"],
  ["Año", "INT"],
  ["Precio", "DECIMAL(10, 2)"],
  ["Combustible", "VARCHAR(50)"]
]);
sqlScript += generateInsertStatements("Vehiculo", jsonData.Vehiculo);

// Cliente
sqlScript += generateCreateTable("Cliente", [
  ["ID_Cliente", "INT PRIMARY KEY"],
  ["Nombre", "VARCHAR(50)"],
  ["Telefono", "VARCHAR(20)"],
  ["Direccion", "VARCHAR(100)"]
]);
sqlScript += generateInsertStatements("Cliente", jsonData.Cliente);

// Venta
sqlScript += generateCreateTable("Venta", [
  ["ID_Venta", "INT PRIMARY KEY"],
  ["Fecha_Venta", "DATE"],
  ["Total", "DECIMAL(10, 2)"]
]);
sqlScript += generateInsertStatements("Venta", jsonData.Venta.map(venta => ({
  ...venta,
  Fecha_Venta: `DATE(${venta.Fecha_Venta})`
})));

// Compra
sqlScript += generateCreateTable("Compra", [
  ["ID_Compra", "INT PRIMARY KEY"],
  ["Fecha_Compra", "DATE"],
  ["Precio_Compra", "DECIMAL(10, 2)"]
]);
sqlScript += generateInsertStatements("Compra", jsonData.Compra.map(compra => ({
  ...compra,
  Fecha_Compra: `DATE(${compra.Fecha_Compra})`
})));

// Guardar el script SQL
fs.writeFileSync('concesionario.sql', sqlScript);

console.log("Script SQL generado y guardado como 'concesionario.sql'.");
