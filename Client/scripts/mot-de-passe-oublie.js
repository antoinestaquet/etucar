import * as cookie from "./front-cookies.js"

/**
 *  if(!formEmail.checkValidity())
 * preventDefault() permet : d'éviter de submit le formulaire
 * et par conséquent permet d'éviter le refresh de la page 
 * (cela risque de poser problème car à chaque submit on reviendrait
 * à l'état initial => possible solution : réaliser l'opération dynamiquement
 * côté serveur)
 */

const formEmail = document.getElementById('email');
const formModify = document.getElementById('modify-pass');

let validMail = null;

function validationMotDePasse() {
    var mdp = document.getElementById('mdp')
    var verif = document.getElementById('verif')
    if (mdp.value.localeCompare(verif.value) != 0) {
        mdp.setCustomValidity("Les mots de passes ne correspondent pas.")
        verif.setCustomValidity("Les mots de passes ne correspondent pas.")
        return false;
    } else {
        mdp.setCustomValidity("")
        verif.setCustomValidity("")
        return true;
    }
}

formEmail.addEventListener('submit', (e) => {
    var mail = document.getElementById('emailtxt').value
    const data = new URLSearchParams();
    data.append("mail", mail);
    e.preventDefault();
    if (formEmail.checkValidity()) {//à remplacer par "si le serveur retourne vrai car l'email correspond à un compte"

        const init = {
            method: "PUT",
            body: data
        };

        let status = null;
        fetch(`http://localhost:3000/utilisateur/motDePasse/oublie`, init)
            .then((res) => {
                if (res.status == 200 ) {
                    validMail = mail;
                    return res.json();
                } else if (res.status == 401) {
                    alert("Pas de compte existant avec ce mail.");
                    throw new Error(res);
                } else {
                    throw new Error(res);
                }
            }).then((data) => {
                if(data.codeEnvoye){
                    alert(data.message)
                }
                
                formEmail.classList.add("d-none")
                formModify.classList.remove("d-none")
            }).catch((err) => {
                console.log(err);
            })


    }
    formEmail.classList.add("was-validated")
})

formModify.addEventListener('submit', (e) => {
    var code = document.getElementById('txtcode').value;


    e.preventDefault()
    if (formModify.checkValidity() && validationMotDePasse()) {//à remplacer par "si le serveur retourne vrai car le code est le bon"

        const data = new URLSearchParams(new FormData(formModify));
        data.append("mail", validMail);

        const init = {
            method: "PUT",
            body: data
        };

        fetch(`http://localhost:3000/utilisateur/motDePasse/modifierAvecCode`, init)
            .then((res) => {
                if (res.status == 200) {
                    return res.json();
                } else {
                    throw new Error(res);
                }
            }).then((data) => {
                document.querySelector("#redirection").classList.remove("d-none");
                setTimeout(() => {
                    document.location.href = "index.html";
                }, 5000);
            }).catch((err) => {
                alert("Echec de changement du mot de passe");
            })
    }
    formModify.classList.add("was-validated")
})



