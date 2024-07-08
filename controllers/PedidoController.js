const Database = require("../database/db");

class PedidoController extends Database {
  async criar(request, response) {
    const dados = await request.body;
    // Validações
    if (!dados.client_id || typeof dados.client_id !== "number") {
      return response
        .status(400)
        .json({ mensagem: "Client ID é obrigatório e deve ser um número" });
    }

    if (!dados.address || typeof dados.address !== "string") {
      return response
        .status(400)
        .json({ mensagem: "Address é obrigatório e deve ser um texto" });
    }

    if (!Array.isArray(dados.products) || dados.products.length === 0) {
      return response
        .status(400)
        .json({
          mensagem: "Products é obrigatório e deve ser uma lista de produtos",
        });
    }

    for (let i = 0; i < dados.products.length; i++) {
      const item = dados.products[i];
      if (!item.product_id || typeof item.product_id !== "number") {
        return response
          .status(400)
          .json({
            mensagem: `Product ID do item ${i} é obrigatório e deve ser um número`,
          });
      }

      if (!item.amount || typeof item.amount !== "number") {
        return response
          .status(400)
          .json({
            mensagem: `Amount do item ${i} é obrigatório e deve ser um número`,
          });
      }
    }

    let total = 0;

    for (let i = 0; i < dados.products.length; i++) {
      const item = dados.products[i];
      console.log('item: ')
      console.log(item)

      const produtoAtual = await this.database.query(
        `
                SELECT price FROM products 
                WHERE id = $1
            `,
        [item.product_id]
      );

      total = total + produtoAtual.rows[0].price * item.amount;
    }

    // INSERIR o pedido
    const meuPedido = await this.database.query(
      `
            INSERT INTO orders (client_id, address, observations, total)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
      [dados.client_id, dados.address, dados.observations, total]
    );

    // INSERIR os items
    dados.products.forEach(async (item) => {
      const produtoAtual = await this.database.query(
        `
                SELECT price FROM products 
                WHERE id = $1
                `,
        [item.product_id]
      );

      this.database.query(
        `
                INSERT INTO orders_items (order_id, product_id, amount, price)
                VALUES ($1, $2, $3, $4)
                RETURNING *
                `,
        [
          meuPedido.rows[0].id,
          item.product_id,
          item.amount,
          produtoAtual.rows[0].price,
        ]
      );
    });

    response.status(201).json({ mensagem: "Criado com sucesso" });
  }
}

module.exports = new PedidoController();
