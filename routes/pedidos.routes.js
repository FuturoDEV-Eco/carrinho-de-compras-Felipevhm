const { Router } = require("express");
const PedidoController = require("../controllers/PedidoController");

const pedidosRoutes = new Router();

pedidosRoutes.post("/pedidos", PedidoController.criar.bind(PedidoController));

module.exports = pedidosRoutes;
