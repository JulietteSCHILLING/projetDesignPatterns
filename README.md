# projetDesignPatterns
Projet de dev mob en design patterns M1-S7


toutes les commandes que j'ai fais : 

- npm init -y (pas besoin du coup pour vous)
- npm i express
- npm i --save-dev nodemon
- npm i ejs
- npm install mysql2

et pour lancer le serveur : npm run devStart


Alors aussi pour que ça comprenne mieux, le dossier routes c'est comme notre dossier blueprints qu'on avait en python 
et donc après dans server.js on le require et on fait le blueprint sur lui. 

Le fichier views sert pour les fichiers html etc fin c'est notre frontend quoi et puis ensuite on fait les fichiers html qu'on veut avec les fichiers javascripts et c'est la même chose qu'en PPIL maintenant que ça a compris comment utiliser le serveur et le lancer etc.

Faudra surement rajouter les status aux réponses de nos requêtes mais je pense que le plus gros pour comprendre comment faire est là après c'est de la doc en plus à lire ou quoi sur google ou autre.

Les fichiers ejs c'est comme html sauf que c'est le serveur et non pas le client qui génère la page mais je sais pas si on va utiliser ça car avec ça j'ai pas trouvé de moyen de faire des fetchs mais on pouvait communiquer plus simplement en envoyant les données directement au fichier ejs par le fichier routes (donc users.js) en faisant un res.render("/users/list", {userList : results}) et puis dans le fichier list.ejs vous voyez comment on manipule.

Pour créer un nouveau user vous voyez que dans le form j'ai mis action = "/users" et donc je crois (fin jsuis meme sur) que ça va appeler le app.post("/") etc de users.js grâce au action = "/users". 
