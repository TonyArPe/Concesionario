const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clienteController')

// RUTAS
router.get('/', clientesController.listarClientes)

router.get('/add', clientesController.formularioClienteAdd);

router.post('/add', clientesController.clienteAdd);

router.get('/del/:id', clientesController.formularioClienteDel);

router.post('/del/:id', clientesController.clienteDel);

router.get('/edit/:id', clientesController.formularioClienteEdit);

router.post('/edit/:id', clientesController.clienteEdit);

module.exports = router