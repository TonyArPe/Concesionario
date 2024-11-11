const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculoController')

// RUTAS
router.get('/', vehiculosController.listarVehiculos)

router.get('/add', vehiculosController.formularioVehiculoAdd);

router.post('/add', vehiculosController.vehiculoAdd);

router.get('/del/:id', vehiculosController.formularioVehiculoDel);

router.post('/del/:id', vehiculosController.vehiculoDel);

router.get('/edit/:id', vehiculosController.formularioVehiculoEdit);

router.post('/edit/:id', vehiculosController.vehiculoEdit);

module.exports = router