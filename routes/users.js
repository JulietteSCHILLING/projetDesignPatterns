const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    // Effectuer une requête à la base de données pour récupérer tous les utilisateurs
    connection = db.openDB();
    connection.query('SELECT idCompte as id, prenomCompte as nom, nomCompte, mail FROM COMPTE', (err, results) => {
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
  

router.post('/new', (req, res) => {
  console.log('Requête POST reçue');
  console.log(req.body);
  const nom = req.body.nomCompte;
  const prenom = req.body.prenomCompte;
  const mail = req.body.mail;
  const login = req.body.login;
  const mdp = req.body.mdp;

  // Utilisez la méthode de placeholder ? pour sécuriser la requête SQL
  connection = db.openDB();
  connection.query('INSERT INTO COMPTE (prenomCompte, nomCompte, mail, login, mdp) VALUES (?, ?, ?, ?, ?)', [prenom, nom, mail, login, mdp], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion des données : ' + err);
      db.closeDB(connection);
      res.status(500).json({ error: 'Une erreur s\'est produite côté serveur' });
    } else {
      console.log('Utilisateur inséré avec succès');
      db.closeDB(connection);

      res.json({ success: true });
    }
  });
});

//Route pour récupérer le nom d'un utilisateur avec son id dans les cookies
router.get('/getNomPrenom', (req, res) => {
  const idCompte = req.cookies.user;

  const connection = db.openDB();
  connection.query('SELECT nomCompte, prenomCompte FROM COMPTE WHERE idCompte = ?', [idCompte], (err, result) => {
    db.closeDB(connection);
    if (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur : ' + err);
      res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
    } else {
      console.log('Utilisateur récupéré avec succès');
      res.json(result)
    }
  });
});


//Route pour récupérer le nom d'un utilisateur avec son id
router.get('/getNomPrenomId/:id', (req, res) => {
  const idCompte = req.params.id; // Récupérez l'ID de l'utilisateur à supprimer depuis les paramètres de l'URL

  const connection = db.openDB();
  connection.query('SELECT nomCompte, prenomCompte FROM COMPTE WHERE idCompte = ?', [idCompte], (err, result) => {
    db.closeDB(connection);
    if (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur : ' + err);
      res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
    } else {
      console.log('Utilisateur récupéré avec succès');
      res.json(result)
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

router.post('/connexion', (req, res) => {
  const login = req.body.login;
  const mdp = req.body.mdp;

  // Effectuer une requête à la base de données pour récupérer tous les utilisateurs
  connection = db.openDB();
  connection.query('SELECT idCompte as id FROM COMPTE WHERE login = ? AND mdp = ?', [login, mdp], (err, results) => {
      db.closeDB(connection);

      if (err) {
          console.error('Erreur lors de la récupération de l\'utilisateur : ' + err);
          res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
          return;
      }

      if (results.length === 0) {
          // Aucun utilisateur trouvé avec le login et le mot de passe fournis
          res.render('users/connexion', { error: 'Login ou mot de passe incorrect' });
          return;
      }

      // Utilisateur trouvé avec succès
      const id = results[0].id;

      // Le cookie s'expire en 1 jour
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);

      res.cookie("user", id, { maxAge: expirationDate });

      //res.send('Utilisateur connecté avec succès. Cliquez sur le bouton ci-dessous pour revenir à la page d\'accueil.<br><a href="/"><button>Retour à l\'accueil</button></a>');
      res.redirect("/");
  });
});



// router.get('/:id', (req, res) => {
//   res.send(`COMPTE get avec son id ${req.params.id}`);
// });


module.exports = router;