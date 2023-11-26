const express = require('express');
const app = express();
const db = require('./config/db');
const multer = require('multer');
const storage = multer.memoryStorage(); // Vous pouvez ajuster le stockage selon vos besoins
const upload = multer({ storage: storage });
app.use(upload.any());
const path = require('path');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));



wss.on('connection', (ws) => {
    console.log('Nouvelle connexion WebSocket');

    // Écoute des messages du client
    ws.on('message', (message) => {
        console.log(`Reçu: ${message}`);
        // Envoyer le message à tous les clients connectés (broadcast)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

server.listen(6061, () => {
    console.log('Serveur WebSocket en cours d\'écoute sur le port 6061');
});


const userRouter = require('./routes/users');
app.use("/users", userRouter);

const docRouter = require('./routes/document');
app.use("/document", docRouter);

const renderUserRouter = require('./routes/renderUsers');
app.use("/renderUsers", renderUserRouter);

const renderDocumentRouter = require('./routes/renderDocument');
app.use("/renderDocument", renderDocumentRouter);

app.listen(3000);