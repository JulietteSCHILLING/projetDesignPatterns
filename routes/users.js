const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    // Effectuer une requête à la base de données pour récupérer tous les utilisateurs
    connection = db.openDB();
    connection.query('SELECT * FROM User', (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des utilisateurs : ' + err);
        res.status(500).send('Erreur lors de la récupération des utilisateurs');
        return;
      }

      db.closeDB(connection);
      // Afficher la liste des utilisateurs dans la réponse
      res.json(results);
    });
  });
  

router.get('/new', (req, res) => {
  res.render('users/new');
});

router.post('/', (req, res) => {
  const nom = req.body.firstname; // Récupérez le prénom depuis le corps de la requête

  // Utilisez la méthode de placeholder ? pour sécuriser la requête SQL
  connection = db.openDB();
  connection.query('INSERT INTO User (nom) VALUES (?)', [nom], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion des données : ' + err);
      db.closeDB(connection);
      res.status(500).send('Erreur lors de l\'insertion des données');
    } else {
      console.log('Utilisateur inséré avec succès');
      db.closeDB(connection);

      res.send('Nouvel utilisateur créé avec succès');
    }
  });
});

router.get('/:id', (req, res) => {
  res.send(`User get avec son id ${req.params.id}`);
});

module.exports = router;
