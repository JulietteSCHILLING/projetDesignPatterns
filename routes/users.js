const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    // Effectuer une requête à la base de données pour récupérer tous les utilisateurs
    connection = db.openDB();
    connection.query('SELECT idCompte as id, prenomCompte as nom FROM COMPTE', (err, results) => {
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
  

router.get('/renderNew', (req, res) => {
  res.render('users/new');
});


// Route pour afficher le formulaire de suppression
router.get('/renderDelete', (req, res) => {
  const connection = db.openDB();
  connection.query('SELECT idCompte as id, prenomCompte as nom FROM COMPTE', (err, users) => {
      db.closeDB(connection);
      if (err) {
          console.error('Erreur lors de la récupération des utilisateurs : ' + err);
          res.status(500).send('Erreur lors de la récupération des utilisateurs');
      } else {
          // Rendez le fichier EJS et passez les données des utilisateurs à la vue
          res.render('users/delete', { users: users });
      }
  });
});

router.post('/new', (req, res) => {
  console.log('Requête POST reçue');
  const nom = req.body.lastname;
  const prenom = req.body.firstname;
  const mail = req.body.mail;
  const login = req.body.login;
  const mdp = req.body.mdp;

  // Utilisez la méthode de placeholder ? pour sécuriser la requête SQL
  connection = db.openDB();
  connection.query('INSERT INTO COMPTE (prenomCompte, nomCompte, mail, login, mdp) VALUES (?, ?, ?, ?, ?)', [prenom, nom, mail, login, mdp], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion des données : ' + err);
      db.closeDB(connection);
      res.status(500).send('Erreur lors de l\'insertion des données');
    } else {
      console.log('Utilisateur inséré avec succès');
      db.closeDB(connection);

      res.send('Nouvel utilisateur créé avec succès. Cliquez sur le bouton ci-dessous pour revenir à la page d\'accueil.<br><a href="/"><button>Retour à l\'accueil</button></a>');
    }
  });
});



// Route pour supprimer un utilisateur par son ID
router.post('/delete', (req, res) => {
  const userId = req.body.userId; // Récupérez l'ID de l'utilisateur à supprimer depuis les paramètres de l'URL
  
  // Effectuez une requête à la base de données pour supprimer l'utilisateur
  const connection = db.openDB();
  connection.query('DELETE FROM COMPTE WHERE idCompte = ?', [userId], (err, result) => {
    db.closeDB(connection);
    if (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur : ' + err);
      res.status(500).send('Erreur lors de la suppression de l\'utilisateur');
    } else {
      if (result.affectedRows > 0) {
        console.log('Utilisateur supprimé avec succès');
        res.send(`Utilisateur avec l'ID ${userId} a été supprimé avec succès. Cliquez sur le bouton ci-dessous pour revenir à la page d\'accueil.<br><a href="/"><button>Retour à l\'accueil</button></a>'`);
      } else {
        console.log('Utilisateur non trouvé');
        res.status(404).send(`Utilisateur avec l'ID ${userId} non trouvé`);
      }
    }
  });
});


router.get('/:id', (req, res) => {
  res.send(`COMPTE get avec son id ${req.params.id}`);
});


module.exports = router;
