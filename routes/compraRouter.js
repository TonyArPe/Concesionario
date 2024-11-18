const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/compraController');


router.get('/', comprasController.listarCompras);
router.post('/', comprasController.listarComprasPorCliente);

router.get('/add', comprasController.formularioCompraAdd);
router.post('/add', comprasController.compraAdd);

router.get('/del/:id', comprasController.formularioCompraDel);
router.post('/del/:id', comprasController.compraDel);

router.get('/edit/:id', comprasController.formularioCompraEdit);
router.post('/edit/:id', comprasController.compraEdit);

// Ruta para listar las compras de un cliente específico
router.get('/clientes/:id', comprasController.listarComprasPorCliente);
router.post('/clientes/:id', comprasController.listarComprasPorCliente);


module.exports = router;
