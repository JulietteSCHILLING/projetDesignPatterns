const express = require('express');
const app = express();
const db = require('./config/db');
const multer = require('multer');
const storage = multer.memoryStorage(); // Vous pouvez ajuster le stockage selon vos besoins
const upload = multer({ storage: storage });
app.use(upload.any());
const path = require('path');
const cookieParser = require('cookie-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));





const userRouter = require('./routes/users');
app.use("/users", userRouter);

const docRouter = require('./routes/document');
app.use("/document", docRouter);

const renderUserRouter = require('./routes/renderUsers');
app.use("/renderUsers", renderUserRouter);

const renderDocumentRouter = require('./routes/renderDocument');
app.use("/renderDocument", renderDocumentRouter);

app.listen(3000);



// app.get("/", (req,res)=> {
//     console.log("here");
//     // //res.sendStatus(500);
//     // db.query('SELECT * FROM User', (err, results, fields) => {
//     //     if (err) {
//     //       console.error('Erreur de requête : ' + err);
//     //       res.status(500).send('Erreur lors de la requête à la base de données');
//     //       return;
//     //     }

//     //     let user = results[0];
//     //     console.log(user);
//     //     let nom = user.nom;
//     //     res.render("index", {name : nom})
        
//     //     //res.json(results);
//     //   });
//     res.render("index", {name : "Romain"});

// });