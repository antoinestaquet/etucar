/**
 * Validation du formulaire d'inscription
 */

const form = document.querySelector('#form')

// Permet de valider de façon réactive
window.onload = function() {
    document.querySelector('#nomVehicule').oninput = validationVehicule
    document.querySelector('#nombrePlace').onchange = validationVehicule
    document.querySelector('#motDePasse').oninput = validationMotDePasse
}

// Soit l'utilisateur ne rentre pas de véhicule, soit il doit compléter tous les champs
function validationVehicule(){
    const vehicule = document.querySelector('#nomVehicule')
    const nombrePlace = document.querySelector('#nombrePlace')

    if( (!vehicule.value && nombrePlace.value) ||
        (vehicule.value && !nombrePlace.value)) {
        vehicule.setCustomValidity("Veuillez compléter les deux champs si vous possédez un véhicule.")
        nombrePlace.setCustomValidity("Veuillez compléter les deux champs si vous possédez un véhicule.")
    } else {
        vehicule.setCustomValidity("")
        nombrePlace.setCustomValidity("")
    }
}

// Verification de longueur du mot de passe
function validationMotDePasse(){
    const motDePasse = document.querySelector('#motDePasse')
    const invalidMotDePasse = document.querySelector('#invalid-motDePasse')
    let longueurMotDePasse = motDePasse.value.length
    
    if(longueurMotDePasse < 6){
        invalidMotDePasse.textContent = "Votre mot de passe ne peut pas être inférieur à 6 caractères."
        motDePasse.setCustomValidity("Votre mot de passe ne peut pas être inférieur à 6 caractères.")
    } else {
        motDePasse.setCustomValidity("")
    }
}

/**
 * Nouvelle verification des règles supplémentaires.
 * Si le formulaise n'est pas correct, il ne s'envoie pas.
 */ 
form.addEventListener('submit', (e) => {

    validationVehicule()
    validationMotDePasse()
    if(!form.checkValidity()){
        e.preventDefault()
    }

    form.classList.add('was-validated')
}, false)