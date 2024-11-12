const express = require('express');
const xlsx = require("xlsx");
const jsonfile = require("jsonfile");
const bodyParser = require('body-parser')
const path = require("path");
const fs = require('fs');

const vehiculosRouter = require('./routes/vehiculoRouter')
const clientesRouter = require('./routes/clienteRouter')
const comprasRouter = require('./routes/compraRouter')
const ventasRouter = require('./routes/ventaRouter')

const app = express();
const port = process.env.SERVICE_PORT || 8000;

/**
 * Paths de los archivos
 */
const excelFilePath = path.join(__dirname, "doc\\EntidadRelacionVehiculosData.xlsx");
const jsonFilePath = path.join(__dirname, "data\\datosConcesionario.json");

// Carpeta public
app.use(express.static(path.join(__dirname, 'public')))

// Motor de vistas Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

// Routers
app.use('/vehiculos', vehiculosRouter)
app.use('/clientes', clientesRouter)
app.use('/compras', comprasRouter)
app.use('/ventas', ventasRouter)


/**
 * Funcion para convertir Excel en JSON y guardarlo
 */
function convertirExcelJson() {
    // Carga el archivo Excel
    const workbook = xlsx.readFile(excelFilePath);

    // Creamos un objeto para almacenar los datos de todas las hojas
    let allData = {};

    // Iteramos sobre todas las hojas del archivo Excel
    workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        
        // Convierte la hoja en formato JSON
        const sheetData = xlsx.utils.sheet_to_json(sheet);

        // Guardamos los datos de cada hoja usando el nombre de la hoja como clave
        allData[sheetName] = sheetData;
    });

    // Guarda los datos JSON en un archivo
    jsonfile.writeFile(jsonFilePath, allData, { spaces: 2 }, (err) => {
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

// Ruta de login
app.get('/', (req, res) => {
    res.render('index');
});

// Ruta de registro
app.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para registrar un nuevo usuario
app.post('/register', (req, res) => {
    const { usuario, contrasena } = req.body;

    // Verificar si el usuario ya existe
    db.query('SELECT * FROM Usuario WHERE Usuario = ?', [usuario], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            res.render('register', { error: 'El usuario ya existe.' });
        } else {
            // Encriptar la contraseña antes de guardarla
            bcrypt.hash(contrasena, 10, (err, hashedPassword) => {
                if (err) throw err;

                // Insertar el nuevo usuario en la base de datos
                db.query('INSERT INTO Usuario (Usuario, Contrasena) VALUES (?, ?)', [usuario, hashedPassword], (err, results) => {
                    if (err) throw err;

                    res.redirect('/');
                });
            });
        }
    });
});

// Ruta del dashboard (después del login)
app.get('/dashboard', (req, res) => {
    // Aquí podrías pasar datos como el usuario logueado, etc.
    res.render('dashboard', { usuario: 'admin' });
});

/**
 * Ruta para obtener los datos convertidos en JSON
 */
app.get('/datos', async (req, res) => {
    try {
        const data = await readJsonFile();
        res.json(data); // Envia los datos como respuesta en formato JSON
    } catch (err) {
        res.status(500).send("Error al leer el archivo JSON");
    }
});


app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`)
})