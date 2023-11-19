INSERT INTO COMPTE(nomCompte, prenomCompte, mail, login, mdp) VALUES ('Schilling', 'Juliette', 'mailJuliette@mail.com', 'loginJ', 'mdpJ');
INSERT INTO COMPTE(nomCompte, prenomCompte, mail, login, mdp) VALUES ('Nicolas', 'Romain', 'mailRomain@mail.com', 'loginR', 'mdpR');

INSERT INTO DOCUMENT(idCompte, titre, dateCreation, dateDernModif) VALUES (1, 'Doc1', STR_TO_DATE('22/10/2023', '%d/%m/%Y'), STR_TO_DATE('10/11/2023', '%d/%m/%Y'));
INSERT INTO CASEDOC(idDocument, texte, ligne, colonne) VALUES (1, "", 1, 1);
INSERT INTO CASEDOC(idDocument, texte, ligne, colonne) VALUES (1, "", 1, 2);
INSERT INTO CASEDOC(idDocument, texte, ligne, colonne) VALUES (1, "", 2, 1);
INSERT INTO CASEDOC(idDocument, texte, ligne, colonne) VALUES (1, "", 2, 2);
INSERT INTO CASEDOC(idDocument, texte, ligne, colonne) VALUES (1, "", 1, 3);
INSERT INTO CASEDOC(idDocument, texte, ligne, colonne) VALUES (1, "", 3, 1);
INSERT INTO CASEDOC(idDocument, texte, ligne, colonne) VALUES (1, "", 2, 3);
INSERT INTO CASEDOC(idDocument, texte, ligne, colonne) VALUES (1, "", 3, 2);
INSERT INTO CASEDOC(idDocument, texte, ligne, colonne) VALUES (1, "", 3, 3);