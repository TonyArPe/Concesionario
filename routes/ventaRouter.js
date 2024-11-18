const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventaController');


router.get('/', ventasController.listarVentas);

router.get('/add', ventasController.formularioVentaAdd);
router.post('/add', ventasController.ventaAdd);

router.get('/del/:id', ventasController.formularioVentaDel);
router.post('/del/:id', ventasController.ventaDel);

router.get('/edit/:id', ventasController.formularioVentaEdit);
router.post('/edit/:id', ventasController.ventaEdit);

// Ruta para listar los vehículos de una venta específica
router.get('/vehiculos/:id', ventasController.listarVentasPorVehiculo);
router.post('/vehiculos/:id', ventasController.listarVentasPorVehiculo);


module.exports = router;
