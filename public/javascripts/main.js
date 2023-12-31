

let userCookie = getCookie('user');

let idUsersShare = [];

function search_document() {
  let input = $('#searchbar').val().toLowerCase();
  
  $('.documents').each(function () {
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
  if (userCookie) {
    $('#connexion').hide();
    $('#inscription').hide();
    let usermenu = $("#userMenu");
    let boutonDeconnexion = $("<button>")
    .text("Déconnexion") // Définissez le texte du bouton
    .on("click", function () {
      // Gérez l'événement de clic du bouton de déconnexion ici
      // Par exemple, vous pouvez déclencher une fonction de déconnexion
      
      supprimerCookie('user');
      location.reload();
      
    });
    usermenu.append(boutonDeconnexion);
  }else{
    $(".addSpreadsheet").hide();
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
    if (data.length == 0) {
      userdoc.append(`<h3>Aucun document créé par vous pour le moment.</h3>`);
    }
    else {
      userdoc.append('<h3>Vos documents :</h3>');
      for (let i = 0; i < data.length; i++) {
        userdoc.append(`
        <li class="documents">
        <a href="/renderDocument/renderDocument/${data[i].idDocument}" style="text-decoration: none;">
        ${data[i].titre}
        </a>
        <span class="auteurs">Auteur : ${data[i].nomCompte} ${data[i].prenomCompte}</span>
        <div class="options-container">
        <button class="options-btn"> <span class="icon"><i class="fas fa-ellipsis-v"></i></span></button>
        
        
        
        <div class="options-menu">
        <a onclick="renameDocument('${data[i].idDocument}')"><button>Renommer</button></a>
        <button onclick="openUserListModal('${data[i].idDocument}')">  Partager </button>
        <a onclick="confirmDelete('${data[i].idDocument}')"><button>Supprimer</button></a>
        </div>
        </div>
        </li>
        `);
      }
    }
    
    
    // Ajoutez l'événement de clic pour afficher/masquer les options
    $('.options-btn').on('click', function () {
      $(this).siblings('.options-menu').toggle();
    });
  })
  .catch(error => {
    console.error(error);
  });
  
  
  fetch("/renderDocument/documentsPartagesByCompte")
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }).then(data => {
    if(data.length === 0){
      userdoc.append('<h3>Aucun document partagé avec vous pour le moment.</h3>');
    }else{
      userdoc.append('<h3>Documents partagés avec vous :</h3>');
    }
    for (let i = 0; i < data.length; i++) {
      fetch(`/users/usersCreateur/${data[i].idCreateur}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      }).then(donnees => {
        userdoc.append(`
        <li class="documents">
        <a href="/renderDocument/renderDocument/${data[i].idDocument}" style="text-decoration: none;">
        ${data[i].titre}
        </a>
        <span class="auteurs">Auteur : ${donnees[0].nomCreateur} ${donnees[0].prenomCreateur}</span>
        <div class="options-container">
        <button class="options-btn"> <span class="icon"><i class="fas fa-ellipsis-v"></i></span></button>
        
        <div class="options-menu">
        <a onclick="renameDocument('${data[i].idDocument}')"><button>Renommer</button></a>
        </div>
        </div>
        </li>
        `);
        //<button class="options-btn-share-${data[i].idDocument}">Options</button>
        
        $(`.options-btn-share-${data[i].idDocument}`).on('click', function () {
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
  fetch(`/users/docsPartages/${idDocument}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then(data => {
    const ul = $('<ul id="usershare"></ul>');
    data.forEach(user => {
      if (userCookie != user.id) {
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



function partagerDocument(idDocument, idUser) {
  let ul = $('<ul id="usershare"></ul>');
  fetch('/document/partagerDocument', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      documentId: idDocument,
      compteId: idUser
    }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      const modal = $('.modal');
      modal.css('display', 'none');
      // Traiter les autres données si nécessaire
    } else {
      console.error('Erreur lors du partage du document:', data.message);
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
  });
}


function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // Vérifie si le nom du cookie correspond à celui recherché
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1); // Renvoie la valeur du cookie
    }
  }
  return null; // Renvoie null si le cookie n'est pas trouvé
}

function supprimerCookie(nomCookie) {
  document.cookie = nomCookie + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function createNewSpreadsheet(){
  let modal = $("#myModal");
  
  modal.css('display', 'block');
  
  
}

$(".close2").click(function(){
  $("#myModal").hide();
  $('#documentTitle').val('');
});

$("#saveButton").click(function(){
  let title = $('#documentTitle').val();
  console.log(title);
  let formData = new FormData();
  formData.append("titre", title);
  fetch('/document/new', {
    method : 'POST',
    body : formData
  }).then(response => {
    if(!response.ok){
      throw new Error(response.statusText);
    }
    return response.json();
  }).then(data => {
    $("#myModal").css("display", 'none');
    fetchAndDisplayDocuments()
    
  }).catch(error => {
    console.error(error);
  })
});