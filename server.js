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

let listUsers = [];

// Lorsqu'un utilisateur se connecte
wss.on('connection', (ws, req) => {
    console.log('Nouvelle connexion WebSocket');

    // Récupérer l'ID utilisateur depuis le cookie
    const userId = getUserIdFromCookie(req);
    listUsers.push(userId);
    console.log("userId = ", userId)

    // Envoyer la liste des utilisateurs actuels à tous les clients
    broadcastUserList();

    // Gérer la fermeture de la connexion WebSocket
    ws.on('close', () => {
        // Retirer l'utilisateur de la liste
        const index = listUsers.indexOf(userId);
        if (index !== -1) {
            listUsers.splice(index, 1);
            // Envoyer la liste mise à jour aux clients
            broadcastUserList();
        }
    });

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

// Lorsqu'un utilisateur se déconnecte
wss.on('disconnect', () => {
    // Envoyer la liste mise à jour aux clients
    broadcastUserList();
});

// Fonction pour envoyer la liste des utilisateurs à tous les clients
function broadcastUserList() {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'userList', users: listUsers }));
        }
    });
}

// Fonction pour extraire l'ID utilisateur du cookie
function getUserIdFromCookie(req) {
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
        const cookies = cookieHeader.split('; ');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === 'user') {
                return value;
            }
        }
    }
    return null; // Retournez null si le cookie n'est pas trouvé
}


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

app.listen(3000, () => {
    console.log('Serveur node en cours d\'écoute sur le port 3000');
});