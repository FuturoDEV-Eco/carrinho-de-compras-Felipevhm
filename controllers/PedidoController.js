const Database = require("../database/db");

class PedidoController extends Database {
  async criar(request, response) {
    try {
      const dados = await request.body;

      // Condições de validação
      const isValidClientId = dados.client_id && typeof dados.client_id === "number";
      const isValidAddress = dados.address && typeof dados.address === "string";
      const isValidProducts = Array.isArray(dados.products) && dados.products.length > 0;

      let areValidProducts = true;

      for (let i = 0; i < dados.products.length; i++) {
        const item = dados.products[i];
        if (!item.product_id || typeof item.product_id !== "number" || !item.amount || typeof item.amount !== "number") {
          areValidProducts = false;
          break;
        }
      }

      // Verificação de todas as condições
      if (isValidClientId && isValidAddress && isValidProducts && areValidProducts) {

        // Verificar se o client_id existe
        const cliente = await this.database.query(
          `SELECT id FROM clients WHERE id = $1`,
          [dados.client_id]
        );

        if (cliente.rows.length === 0) {
          return response.status(400).json({ mensagem: "Client ID não encontrado" });
        }

        let total = 0;

        for (let i = 0; i < dados.products.length; i++) {
          const item = dados.products[i];
          console.log('item: ')
          console.log(item)

          const produtoAtual = await this.database.query(
            `SELECT price FROM products WHERE id = $1`,
            [item.product_id]
          );

          total = total + produtoAtual.rows[0].price * item.amount;
        }

        // INSERIR o pedido
        const meuPedido = await this.database.query(
          `INSERT INTO orders (client_id, address, observations, total)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [dados.client_id, dados.address, dados.observations, total]
        );

        // INSERIR os items
        for (const item of dados.products) {
          const produtoAtual = await this.database.query(
            `SELECT price FROM products WHERE id = $1`,
            [item.product_id]
          );

          await this.database.query(
            `INSERT INTO orders_items (order_id, product_id, amount, price)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [meuPedido.rows[0].id, item.product_id, item.amount, produtoAtual.rows[0].price]
          );
        }

        response.status(201).json({ mensagem: "Criado com sucesso" });
      } else {
        response.status(400).json({ mensagem: "Dados inválidos" });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }
}

module.exports = new PedidoController();
