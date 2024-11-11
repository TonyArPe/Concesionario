const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/compraController');


router.get('/', comprasController.listarCompras);

router.get('/add', comprasController.formularioCompraAdd);
router.post('/add', comprasController.compraAdd);

router.get('/del/:id', comprasController.formularioCompraDel);
router.post('/del/:id', comprasController.compraDel);

router.get('/edit/:id', comprasController.formularioCompraEdit);
router.post('/edit/:id', comprasController.compraEdit);

// Listar los clientes que han comprado un vehiculo
router.get('/:id/clientes', comprasController.clientes);
// Formulario para añadir un cliente que ha comprado un vehiculo
router.get('/:id/clientes/add', comprasController.formularioClienteAdd);
// Añade un cliente de una compra con ID
router.post('/:id/clientes/add', comprasController.clientesAdd);
// Formulario para borrar un cliente de una compra con ese ID
router.get('/:id/clientes/del', comprasController.formularioClienteDel);
// Borra un cliente de esa compra con ese ID
router.post('/:id/clientes/del', comprasController.clienteDel);


module.exports = router;
