const express = require("express");
const bodyParser = require("body-parser");
const clientRoutes = require("./routes/clients.routes");
const productsRoutes = require("./routes/products.routes");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/api", clientRoutes);
app.use("/api", productsRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
