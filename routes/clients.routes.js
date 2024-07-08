const express = require('express');
const router = express.Router();
const ClientController = require('./../controllers/ClientController');

router.post('/clients', ClientController.createClient);
router.get('/clients', ClientController.listClients);
router.get('/clients/:id', ClientController.getClientById);
router.put('/clients/:id', ClientController.updateClient);
router.delete('/clients/:id', ClientController.deleteClient);

module.exports = router;
