const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/renderNew', (req, res) => {
    res.render('users/new');
});

router.get('/renderConnexion', (req, res) => {
    res.render('users/connexion');
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

module.exports = router;