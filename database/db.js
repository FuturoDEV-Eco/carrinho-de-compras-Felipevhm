const { Pool } = require("pg");

class Database {
  constructor() {
    this.database = new Pool({
      host: "localhost",
      user: "postgres",
      password: "postgres",
      database: "shopcart",
      port: 5432,
    });
  }
}

module.exports = Database;
