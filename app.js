const express = require('express');
const xlsx = require("xlsx");
const jsonfile = require("jsonfile");
const path = require("path");

const app = express();
const port = process.env.SERVICE_PORT || 8000;

/**
 * Paths de los archivos
 */
const excelFilePath = path.join(__dirname, "doc/EntidadRelacionVehiculosData.xlsx");
const jsonFilePath = path.join(__dirname, "data/datosConcesionario.json");

/**
 * Funcion para convertir Excel en JSON y guardarlo
 */
function convertirExcelJson() {
    // Carga el archivo Excel
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convierte la hoja en formato JSON
    const data = xlsx.utils.sheet_to_json(sheet);

    // Guarda los datos JSON en un archivo
    jsonfile.writeFile(jsonFilePath, data, { spaces: 2 }, (err) => {
        if (err) {
            console.error("Error al guardar el archivo JSON:", err);
        } else {
            console.log("Datos guardados en datosConcesionario.json");
        }
    });
}

/**
 * Convierte el Excel a JSON solo si el archivo JSON no existe
 */
const fs = require('fs');
if (!fs.existsSync(jsonFilePath)) {
    convertirExcelJson();
}

/**
 * Función para leer el archivo JSON
 * @returns Devuelve el JSON
 */
function readJsonFile() {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(jsonFilePath, (err, data) => {
            if (err) {
                reject("Error al leer el archivo JSON:", err);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * Ruta principal
 */
app.get('/', (req, res) => {
    res.send("Bienvenido al Concesionario los Pallos");
});

/**
 * Inicio del servidor
 */
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
