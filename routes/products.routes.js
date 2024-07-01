const express = require("express");
const router = express.Router();
const productsController = require("./../controllers/ProductsController");

router.post("/products", productsController.createProduct);
router.get("/products", productsController.listProducts);
router.get("/products/:id", productsController.getProductDetails);
router.put("/products/:id", productsController.updateProduct);
router.delete("/products/:id", productsController.deleteProduct);

module.exports = router;
