
function search_document() {
  let input = $('#searchbar').val().toLowerCase();

  $('.documents').each(function() {
    let documentTitle = $(this).find('a').text().toLowerCase();
    let authorName = $(this).find('.auteurs').text().toLowerCase();

    if (documentTitle.includes(input) || authorName.includes(input)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}



document.addEventListener('DOMContentLoaded', () => {
  fetch("/renderDocument/documents")
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    let userdoc = $('#userDocs');
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);
      userdoc.append(`
        <li class="documents" style="list-style-type: none; display: flex; align-items: center; justify-content: space-between; width: 90vw; margin: 10px auto;">
          <a href="/renderDocument/renderDocument/${data[i].idDocument}" style="text-decoration: none;">
            ${data[i].titre}
          </a>
          <span class="auteurs">Auteur : ${data[i].nomCompte} ${data[i].prenomCompte}</span>
          <div class="options-container">
            <button class="options-btn">Options</button>
            <div class="options-menu" style="display: none;">
              <a href="/renommer/${data[i].idDocument}">Renommer</a>
              <span style="margin: 0 5px;">|</span>
              <a href="/supprimer/${data[i].idDocument}">Supprimer</a>
            </div>
          </div>
        </li>
      `);
    }

    // Ajoutez l'événement de clic pour afficher/masquer les options
    $('.options-btn').on('click', function() {
      $(this).siblings('.options-menu').toggle();
    });
  })
  .catch(error => {
    console.error(error);
  });




});




// Votre code Fetch et manipulation des données ici
// fetch('/users')
// .then(response => response.json())
// .then(data => {
//   const userList = document.getElementById('userList');
//   console.log(data);

//   // Boucle sur les données pour afficher chaque utilisateur
//   data.forEach(user => {
//     const userElement = document.createElement('li');
//     userElement.textContent = `ID : ${user.id} - Nom : ${user.nom}`;
//     userList.appendChild(userElement);
//   });
// })
// .catch(error => {
//   console.error('Erreur lors de la récupération des utilisateurs :', error);
// });
