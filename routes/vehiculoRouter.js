const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculoController')

// RUTAS
router.get('/', vehiculosController.listarVehiculos)



//  get /vehiculos
// post /vehiculos/add
// get /vehiculos/del
// del vehiculos/
// get vehiculos

module.exports = router