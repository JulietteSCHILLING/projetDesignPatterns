const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.post('/new', (req, res) => {
    // Utilisez req.cookies pour accéder aux cookies
    const idCompte = req.cookies.user;
    const titre = req.body.titre;
    const date = Date.now();

    connection = db.openDB();
    
    // Insérer le document initial
    connection.query('INSERT INTO DOCUMENT (idCompte, titre, dateCreation, dateDernModif) VALUES (?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))', [idCompte, titre, date / 1000, date / 1000], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'insertion des données : ' + err);
            db.closeDB(connection);
            res.status(500).send('Erreur lors de l\'insertion des données');
        } else {
            console.log('Document inséré avec succès');

            // Récupérer l'ID du document inséré
            const idDocument = results.insertId;

            // Insérer les cases associées de 1 à 26 en colonne et ligne avec du texte vide ("")
            for (let ligne = 1; ligne <= 26; ligne++) {
                for (let colonne = 1; colonne <= 26; colonne++) {
                    connection.query('INSERT INTO CASEDOC (idDocument, texte, ligne, colonne) VALUES (?, "", ?, ?)', [idDocument, ligne, colonne], (err) => {
                        if (err) {
                            console.error('Erreur lors de l\'insertion des cases : ' + err);
                        }
                    });
                }
            }

            db.closeDB(connection);

            res.send('Nouveau document créé avec succès. Cliquez sur le bouton ci-dessous pour revenir à la page d\'accueil.<br><a href="/"><button>Retour à l\'accueil</button></a>');
        }
    });
});


router.post('/updateCase', (req, res) => {
    const caseId = req.body.caseId;
    const newText = req.body.newText;

    connection = db.openDB();

    // Effectuez la mise à jour dans la base de données avec la nouvelle valeur
    connection.query('UPDATE CASEDOC SET texte = ? WHERE idCase = ?', [newText, caseId], (err) => {
        if (err) {
            db.closeDB(connection);
            console.error('Erreur lors de la mise à jour de la case : ' + err);
            res.status(500).send('Erreur lors de la mise à jour de la case');
        } else {
            db.closeDB(connection);
            console.log('Case mise à jour avec succès');
            res.status(200).send('Case mise à jour avec succès');
        }
    });
});


router.post('/renommer', (req, res) => {
    const docId = req.body.documentId;
    const newName = req.body.newDocumentName;

    connection = db.openDB();

    // Effectuez la mise à jour dans la base de données avec la nouvelle valeur
    connection.query('UPDATE DOCUMENT SET titre = ? WHERE idDocument = ?', [newName, docId], (err) => {
        if (err) {
            db.closeDB(connection);
            console.error('Erreur lors de la mise à jour du doc : ' + err);
            res.status(500).send('Erreur lors de la mise à jour du doc');
        } else {
            db.closeDB(connection);
            console.log('Doc mis à jour avec succès');
            res.status(200).send('Doc mis à jour avec succès');
        }
    });
});

router.delete('/supprimer', (req, res) => {
    const docId = req.body.documentId;

    connection = db.openDB();

    // Effectuez la mise à jour dans la base de données avec la nouvelle valeur
    connection.query('DELETE FROM DOCUMENT WHERE idDocument = ?', [docId], (err) => {
        if (err) {
            db.closeDB(connection);
            console.error('Erreur lors de la suppression du doc : ' + err);
            res.status(500).send('Erreur lors de la suppression du doc');
        } else {
            db.closeDB(connection);
            console.log('Doc supprimé avec succès');
            res.status(200).send('Doc supprimé avec succès');
        }
    });
});

module.exports = router;