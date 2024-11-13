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
router.get('/:id/vehiculos', ventasController.listarVehiculosPorVenta);

// Listar los vehiculos que han vendido a un cliente
// router.get('/:id/vehiculos', ventasController.listarVehiculos);
// // Formulario para añadir un vehiculo que ha vendido un cliente
// router.get('/:id/vehiculos/add', ventasController.formularioVehiculoAdd);
// // Añade un vehiculo de una venta con ID
// router.post('/:id/vehiculos/add', ventasController.vehiculoAdd);
// // Formulario para borrar un vehiculo de una venta con ese ID
// router.get('/:id/vehiculos/del', ventasController.formularioVehiculoDel);
// // Borra un vehiculo de esa venta con ese ID
// router.post('/:id/vehiculos/del', ventasController.VehiculoDel);


module.exports = router;
