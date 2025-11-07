const mySql = require("mysql2");

const connection = mySql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "movie_db",
  
});

connection.connect((err) => {
  if (err) console.log("DB connection failed:", err.message);
  else console.log("Connessione con MySql!");
});

module.exports = connection;
