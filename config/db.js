const mysql = require('mysql2');
require('dotenv').config();

function openDB() {
  const connection = mysql.createConnection({
    host: 'bmj1gu2eyjwsyoazvqrq-mysql.services.clever-cloud.com',
    user: 'uyk5bwif3comdnfr',
    password: 'O0943YoE1OxpaemYSbeP',
    database: 'bmj1gu2eyjwsyoazvqrq',
    port: 3306,
    connectTimeout: 60000
  });

  connection.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à la base de données : ' + err.stack);
      return null; // En cas d'erreur, renvoie null
    }
    console.log('Connecté à la base de données MySQL en tant qu ID ' + connection.threadId);
  });

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
