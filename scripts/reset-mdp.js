/**
 *  if(!formEmail.checkValidity())
 * preventDefault() permet : d'éviter de submit le formulaire
 * et par conséquent permet d'éviter le refresh de la page 
 * (cela risque de poser problème car à chaque submit on reviendrait
 * à l'état initial => possible solution : réaliser l'opération dynamiquement
 * côté serveur)
 */

const formEmail = document.getElementById('email')
const formCode = document.getElementById('code')
const formReset = document.getElementById('reset')

formEmail.addEventListener('submit', (e) => {
    var mail = document.getElementById('emailtxt').value
    e.preventDefault();
    if (formEmail.checkValidity()) {//à remplacer par "si le serveur retourne vrai car l'email correspond à un compte"
        formEmail.classList.add("d-none")
        formCode.classList.remove("d-none")
    }
    formEmail.classList.add("was-validated")
})

formCode.addEventListener('submit', (e) => {
    var code = document.getElementById('txtcode').value
    //if(!formEmail.checkValidity())
    e.preventDefault()
    if (formCode.checkValidity()) {//à remplacer par "si le serveur retourne vrai car le code est le bon"
        formCode.classList.add("d-none")
        formReset.classList.remove("d-none")
        formReset.classList.add("d-display")
    }
    formCode.classList.add("was-validated")
})

function validationMotDePasse() {
    var mdp = document.getElementById('mdp')
    var verif = document.getElementById('verif')
    if(mdp.value.localeCompare(verif.value) != 0){
        mdp.setCustomValidity("Les mots de passes ne correspondent pas.")
        verif.setCustomValidity("Les mots de passes ne correspondent pas.")
    } else {
        mdp.setCustomValidity("")
        verif.setCustomValidity("")
    }
}

formReset.addEventListener('submit', (e) => {

    var err = document.getElementById('mdperr')
    //if(!formEmail.checkValidity())
    e.preventDefault()
    document.getElementById('mdp').oninput = validationMotDePasse
    document.getElementById('verif').oninput = validationMotDePasse
    validationMotDePasse()

    if (formReset.checkValidity()) { //Implémenter vérification serveur
        var btnRedirection = document.getElementById('redirection')
        btnRedirection.classList.remove("d-none")
        setTimeout(() => {
            window.location.replace("connexion.html")
        }, 5000);
    }
    formReset.classList.add("was-validated")
})


