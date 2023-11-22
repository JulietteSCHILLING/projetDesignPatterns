


let test = getCookie('user');


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
  if(test){
    $('#connexion').hide();
    $('#inscription').hide();
    let usermenu = $("#userMenu");
    let boutonDeconnexion = $("<button>")
    .text("Déconnexion") // Définissez le texte du bouton
    .on("click", function() {
      // Gérez l'événement de clic du bouton de déconnexion ici
      // Par exemple, vous pouvez déclencher une fonction de déconnexion
      
      supprimerCookie('user');
      location.reload();
      
    });
    usermenu.append(boutonDeconnexion);
  }
  fetchAndDisplayDocuments();
});

function renameDocument(documentId) {
  const newDocumentName = prompt("Nouveau nom du document :");
  if (newDocumentName !== null) {
    fetch('/document/renommer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentId: documentId,
        newDocumentName: newDocumentName,
      }),
    })
    .then(fetchAndDisplayDocuments())
    .catch(error => {
      console.error('Erreur lors du renommage du document', error);
    });
  }
}

function confirmDelete(documentId) {
  const isConfirmed = confirm("Êtes-vous sûr de vouloir supprimer ce document ?");
  if (isConfirmed) {
    fetch('/document/supprimer', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentId: documentId,
      }),
    })
    .then(fetchAndDisplayDocuments())
    .catch(error => {
      console.error('Erreur lors de la suppression du document', error);
    });
    fetchAndDisplayDocuments();
    
  }
}

function fetchAndDisplayDocuments() {
  let userdoc = $('#userDocs');
  userdoc.empty();
  fetch("/renderDocument/documentsByCompte")
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then(data => {
    if(data.length == 0){
      userdoc.append(`<h3>Aucun document pour le moment</h3>`);
    }
    else{
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
        <a onclick="renameDocument('${data[i].idDocument}')"><button>Renommer</button></a>
        <span style="margin: 0 5px;">|</span>
        <button onclick="openUserListModal('${data[i].idDocument}')">Partager</button>
        <span style="margin: 0 5px;">|</span>
        <a onclick="confirmDelete('${data[i].idDocument}')"><button>Supprimer</button></a>
        </div>
        </div>
        </li>
        `);
      }
    }
    
    
    // Ajoutez l'événement de clic pour afficher/masquer les options
    $('.options-btn').on('click', function() {
      $(this).siblings('.options-menu').toggle();
    });
  })
  .catch(error => {
    console.error(error);
  });
  
  
  fetch("/renderDocument/documentsPartagesByCompte")
  .then(response =>{
    if(!response.ok){
      throw new Error(response.statusText);
    }
    return response.json();
  }).then(data => {
    console.log(data);
    for(let i = 0; i < data.length ; i++){
      console.log(data[i].idCreateur);
      fetch(`/renderUsers/usersCreateur/${data[i].idCreateur}`)
      .then(response => {
        if(!response.ok){
          throw new Error(response.statusText);
        }
        return response.json();
      }).then(donnees => {
        console.log(donnees);
        userdoc.append(`
        <li class="documents" style="list-style-type: none; display: flex; align-items: center; justify-content: space-between; width: 90vw; margin: 10px auto;">
        <a href="/renderDocument/renderDocument/${data[i].idDocument}" style="text-decoration: none;">
        ${data[i].titre}
        </a>
        <span class="auteurs">Auteur : ${donnees[0].nomCreateur} ${donnees[0].prenomCreateur}</span>
        <div class="options-container">
        <button class="options-btn-share-${data[i].idDocument}">Options</button>
        <div class="options-menu" style="display: none;">
        <a onclick="renameDocument('${data[i].idDocument}')"><button>Renommer</button></a>
        </div>
        </div>
        </li>
        `);

        $(`.options-btn-share-${data[i].idDocument}`).on('click', function() {
          $(this).siblings('.options-menu').toggle();
        });
        
        
      }).catch(error => {
        console.error(error);
      });
    }
  })
}


function openUserListModal(idDocument) {
  const modal = $('.modal');
  fetch("/users")
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then(data => {
    const ul = $('<ul id="usershare"></ul>');
    data.forEach(user => {
      if(test != user.id){
        let listItem = $(`<li id = "${user.id}"></li>`).text(`${user.nomCompte} ${user.nom} : ${user.mail}`);
        listItem.append(`<button class="listUsersShare" onclick="partagerDocument(${idDocument}, ${user.id})">Add</button>`);
        ul.append(listItem);
      }
      
    });
    
    const searchInput = $('<input type="text" placeholder="Rechercher un utilisateur" id="userSearchInput">');
    searchInput.on('input', filterUsers);
    
    // Nettoie le contenu existant de la modal
    modal.empty();
    
    // Ajoute les éléments nécessaires à la modal
    modal.append('<h2>Liste des Utilisateurs</h2>');
    modal.append(searchInput);
    modal.append(ul);
    
    // Ajoute la croix pour fermer la fenêtre
    const closeButton = $('<span class="close">&times;</span>');
    closeButton.on('click', closeUserListModal);
    modal.append(closeButton);
    
    // Affiche la fenêtre modale
    modal.css('display', 'block');
  })
  .catch(error => {
    console.error(error);
  });
}

// Fonction pour fermer la fenêtre modale de la liste des utilisateurs
function closeUserListModal() {
  const modal = $('.modal');
  modal.css('display', 'none');
}

function filterUsers() {
  const filter = $(this).val().toUpperCase();
  const userList = $('#usershare');
  const users = userList.find('li');
  
  users.each(function () {
    const textValue = $(this).text().toUpperCase();
    
    if (textValue.indexOf(filter) > -1) {
      $(this).css('display', '');
    } else {
      $(this).css('display', 'none');
    }
  });
}



function partagerDocument(idDocument, idUser){
  
  console.log(idUser);
  console.log(idDocument);
  fetch('/document/partagerDocument', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      documentId: idDocument,
      compteId : idUser
    }),
  })
  .then(response => {
    if(!response.ok){
      throw new Error(response.statusText);
    }
    return response.json();
  }).then(data => {
    console.log(data);
    
  }).catch(error => {
    console.error(error);
  })
  
}

// $(document).on('click', '.listUsersShare', function(){
//   let id = $(this).attr('id');
//   console.log(id);
// });







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
