const mysql = require('mysql2');
require('dotenv').config();

function openDB() {
  console.log('test')
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    port: process.env.PORT,
    connectTimeout: 60000
  });

  connection.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à la base de données : ' + err.stack);
      return null; // En cas d'erreur, renvoie null
    }
    console.log('Connecté à la base de données MySQL en tant qu ID ' + connection.threadId);
  });

  console.log("connexion : ", connection);

  return connection;
}

function closeDB(connection) {
  if (connection) {
    connection.end((err) => {
      if (err) {
        console.error('Erreur lors de la fermeture de la connexion à la base de données : ' + err.stack);
      } else {
        console.log('Connexion à la base de données fermée avec succès.');
      }
    });
  }
}

module.exports = { openDB, closeDB };
