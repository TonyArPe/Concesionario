const path = require("path");

module.exports = {
  port: process.env.SERVICE_PORT || 8000,
  excelFilePath: path.join(__dirname, "doc\\EntidadRelacionVehiculosData.xlsx"),
  jsonFilePath: path.join(__dirname, "data\\datosConcesionario.json"),
};
