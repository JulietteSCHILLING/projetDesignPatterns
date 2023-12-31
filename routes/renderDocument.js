const express = require('express');
const router = express.Router();
const db = require('../config/db');



// Route pour afficher le document
router.get('/renderDocument/:idDoc', (req, res) => {
    const connection = db.openDB();
    connection.query(`SELECT 
    DOCUMENT.idDocument,
    DOCUMENT.idCompte,
    DOCUMENT.titre,
    DOCUMENT.dateCreation,
    DOCUMENT.dateDernModif,
    CASEDOC.idCase,
    CASEDOC.texte,
    CASEDOC.ligne,
    CASEDOC.colonne
    FROM 
    DOCUMENT
    INNER JOIN CASEDOC ON DOCUMENT.idDocument = CASEDOC.idDocument
    WHERE 
    DOCUMENT.idDocument = ${req.params.idDoc}
    ORDER BY
    CASEDOC.ligne, CASEDOC.colonne;`, (err, document) => {
        db.closeDB(connection);
        if (err) {
            console.error('Erreur lors de la récupération du document : ' + err);
            res.status(500).send('Erreur lors de la récupération du document');
        } else {
            // Rendez le fichier EJS et passez les données du document à la vue
            //console.log(document);
            res.render('document/document', { document: document });
        }
    });
});


router.get('/renderCreateDocument', (req, res) => {
    res.render('document/new');
});




router.get("/documents", (req, res)=> {
    const connection = db.openDB();
    connection.query('SELECT * from DOCUMENT inner join COMPTE on DOCUMENT.idCompte = COMPTE.idCompte', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs : ' + err);
            res.status(500).send('Erreur lors de la récupération des utilisateurs');
            return;
        }
        db.closeDB(connection);
        res.json(results);
    });
});

router.get("/documentsByCompte", (req, res)=> {
    const idCompte = req.cookies.user;
    
    const connection = db.openDB();
    connection.query('SELECT * from DOCUMENT inner join COMPTE on DOCUMENT.idCompte = COMPTE.idCompte WHERE COMPTE.idCompte = ?', [idCompte], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs : ' + err);
            res.status(500).send('Erreur lors de la récupération des utilisateurs');
            return;
        }
        db.closeDB(connection);
        res.json(results);
    });
});

router.get("/documentsPartagesByCompte", (req,res) => {
    let idCompte = req.cookies.user;
    let connection = db.openDB();

    connection.query('SELECT DOCUMENT.idDocument, DOCUMENT.idCompte as idCreateur, titre from DOCUMENT INNER JOIN ACCES on DOCUMENT.idDocument = ACCES.idDocument INNER JOIN COMPTE on ACCES.idCompte = COMPTE.idCompte WHERE COMPTE.idCompte = ?', [idCompte], (err, results)=>{
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs : ' + err);
            res.status(500).send('Erreur lors de la récupération des utilisateurs');
            return;
        }else{
            // for(let i = 0 ; i < results.length; i++){
            //     console.log(results[i].idCreateur);
            //     connection.query('Select nomCompte as nomCreateur, prenomCompte as prenomCreateur from COMPTE where idCompte = ?', [results[i].idCreateur], (err,res) => {
            //         if(err){
            //             console.error('Erreur lors de la récupération des utilisateurs : ' + err);
            //             res.status(500).send('Erreur lors de la récupération des utilisateurs');
            //             return;
            //         }else{
            //             console.log(res);
            //             results[i].add(res);
            //         }
            //     })
            // } 
            //connection.query('Select * from COMPTE')
            db.closeDB(connection);
            res.json(results);
        }
        
    });
})



module.exports = router;