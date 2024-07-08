const Database = require("../database/db");

class ProductController extends Database {
  constructor() {
    super();
    this.createProduct = this.createProduct.bind(this);
    this.listProducts = this.listProducts.bind(this);
    this.getProductDetails = this.getProductDetails.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  async createProduct(req, res) {
    const { name, amount, color, voltage, description, category_id, price } =
      req.body;
    try {
      const result = await this.database.query(
        "INSERT INTO products (name, amount, color, voltage, description, category_id, price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [name, amount, color, voltage, description, category_id, price]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listProducts(req, res) {
    try {
      const result = await this.database.query("SELECT * FROM products");
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductDetails(req, res) {
    const { id } = req.params;
    try {
      const result = await this.database.query(
        "SELECT products.*, categories.name as category_name FROM products " +
          "JOIN categories ON products.category_id = categories.id WHERE products.id = $1",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const { name, amount, color, voltage, description, category_id, price } =
      req.body;
    try {
      const result = await this.database.query(
        "UPDATE products SET name = $1, amount = $2, color = $3, voltage = $4, description = $5, category_id = $6, price = $7 WHERE id = $8 RETURNING *",
        [name, amount, color, voltage, description, category_id, price, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      const result = await this.database.query(
        "DELETE FROM products WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      res.status(200).json({ message: "Produto deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();
