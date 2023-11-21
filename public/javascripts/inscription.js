
$(document).ready(function () {
    let form = $("#forminscription");
    
    form.on('submit', function (event) {
        // Empêcher le comportement par défaut du formulaire (envoi de la requête HTTP)
        event.preventDefault();
        
        // Votre logique de gestion du clic sur le bouton de soumission ici
        console.log('Le formulaire a été soumis !');
        const formData = new FormData();
        if(checkValue('firstname') && checkValue('lastname') && checkValue('mail')){
            console.log($("#lastname").val());
            formData.append("nomCompte", $("#lastname").val());
            formData.append("prenomCompte", $("#firstname").val());
            formData.append("mail", $("#mail").val());
            formData.append("login", $("#login").val());
            formData.append("mdp", $("#mdp").val());
            fetch("/users/new", {
                method : 'POST',
                body : formData
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.status);
                }
            }).then(data => {
                if (data.error) {
                    console.log(data.error);
                    // Gérez l'erreur côté client
                } else {
                    console.log('Opération réussie !');
                    alert("Compte créé avec succés !")
                    window.location.href = "/";
                }
            })
            .catch(error => {
                console.error('Erreur : ' + error.message);
                // Gérez l'erreur côté client
            });
                // switch (error.message){
                //   case "409":
                //     displayMessage(false, "Ce compte existe déjà.");
                //     break;
                
                //   case "400":
                //     displayMessage(false, "Veuillez rentrer toutes les informations nécessaires.");
                //     break;
                
                //   default:
                //     displayMessage(false, "Erreur lors de la création du compte.");
                //     break;
                // }
            // });
        }
    });
});


function checkValue(val){
    var variable = document.querySelector("input[name=" + val + "]");
    var regex;
    var bool = false;
    
    switch(val){
        case "firstname":
        regex = /^[A-Za-z\-' ]+$/;
        if (!regex.test(variable.value)){
            variable.style.setProperty("border", "1px solid #ff0000");
        } else {
            variable.style.setProperty("border", "1px solid #000000");
            bool = true;
        }
        break;
        
        case "lastname":
        regex = /^[A-Za-z\-' ]+$/;
        if (!regex.test(variable.value)){
            variable.style.setProperty("border", "1px solid #ff0000");
        } else {
            variable.style.setProperty("border", "1px solid #000000");
            bool = true;
        }
        break;
        
        
        case "mail":
        regex = /.+@.+\.[A-Za-z]{2,}/;
        if (!regex.test(variable.value)){
            variable.style.setProperty("border", "1px solid #ff0000");
        } else {
            variable.style.setProperty("border", "1px solid #000000");
            bool = true;
        }
        break;
        
        
        // case "mdp":
        // regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        // if (!regex.test(variable.value)){
        //     variable.style.setProperty("border", "1px solid #ff0000");
        // } else {
        //     variable.style.setProperty("border", "1px solid #000000");
        //     bool = true;
        // }
        // break;
        
    }
    
    console.log(val + " : " + bool);
    return bool;
}



