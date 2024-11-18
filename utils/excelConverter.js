const xlsx = require("xlsx");
const jsonfile = require("jsonfile");
const config = require("../config");

module.exports = {
  convertirExcelJson: () => {
    const workbook = xlsx.readFile(config.excelFilePath);
    let allData = {};

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const sheetData = xlsx.utils.sheet_to_json(sheet);
      allData[sheetName] = sheetData;
    });

    jsonfile.writeFile(config.jsonFilePath, allData, { spaces: 2 }, (err) => {
      if (err) {
        console.error("Error al guardar el archivo JSON:", err);
      } else {
        console.log("Datos guardados en datosConcesionario.json");
      }
    });
  },

  readJsonFile: () => {
    return new Promise((resolve, reject) => {
      jsonfile.readFile(config.jsonFilePath, (err, data) => {
        if (err) {
          reject("Error al leer el archivo JSON:", err);
        } else {
          resolve(data);
        }
      });
    });
  },
};
