

document.addEventListener('DOMContentLoaded', () => {
  // Votre code Fetch et manipulation des données ici
  fetch('/users')
  .then(response => response.json())
  .then(data => {
    const userList = document.getElementById('userList');
    console.log(data);
    
    // Boucle sur les données pour afficher chaque utilisateur
    data.forEach(user => {
      const userElement = document.createElement('li');
      userElement.textContent = `ID : ${user.id} - Nom : ${user.nom}`;
      userList.appendChild(userElement);
    });
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
  });
});
