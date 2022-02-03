const mailForm = document.getElementById("email");
const codeMailForm = document.getElementById("code");
const validMailForm = document.getElementById("validmail");
const telForm = document.getElementById("tel");
const telValidForm = document.getElementById("validtel");
const adresseForm = document.getElementById("adresse");
const adresseValidForm = document.getElementById("validAdresse")
const passwordForm = document.getElementById("password")
const passwordValidForm = document.getElementById("validpassword")


//Mail
mailForm.addEventListener('submit', (e) => {
    var mail = String(document.getElementById('emailtxt').value)
    mail = mail.toLowerCase()
    var verif = String(document.getElementById('emailconfirm').value)
    verif = verif.toLowerCase()
    e.preventDefault();
    if (mailForm.checkValidity() && (mail.localeCompare(verif) == 0)) {
        console.log("ok");
        mailForm.classList.add("d-none")
        codeMailForm.classList.remove("d-none")
    }
    mailForm.classList.add("was-validated")
})

codeMailForm.addEventListener('submit', (e) => {
    var code = document.getElementById('txtcode').value
    e.preventDefault()
    if (codeMailForm.checkValidity()) {//à remplacer par "si le serveur retourne vrai car le code est le bon"
        codeMailForm.classList.add("d-none")
        validMailForm.classList.remove("d-none")
    }
    codeMailForm.classList.add("was-validated")
})

//Tel
telForm.addEventListener('submit', (e) => {
    var tel = String(document.getElementById('numtel').value)
    tel.toLowerCase()
    var telverif = String(document.getElementById('numtelconfirm'))
    telverif.toLowerCase()
    e.preventDefault()
    if (tel.localeCompare(telverif) && !(/[a-z]/i.test(tel)) && tel.length > 0){
        telForm.classList.add("d-none")
        telValidForm.classList.remove("d-none")
    }
})

//Adresse
adresseForm.addEventListener('submit', (e) => {
    var adresse = String(document.getElementById("inputAdresse").value);
    var ville = String(document.getElementById("inputVille").value);
    var pays = String(document.getElementById("inputPays").value);
    var zipPostal = String(document.getElementById("inputZipPostal").value);
    e.preventDefault();
    if (true || (adresse.checkValidity() && ville.checkValidity() &&  pays.checkValidity() && zipPostal.checkValidity())){ //Remplacer par "vérifier si l'adresse est correcte"
        adresseForm.classList.add("d-none");
        adresseValidForm.classList.remove("d-none")
    }
})

//MDP
passwordForm.addEventListener('submit', (e) => {
    var old_mdp = String(document.getElementById("oldpassword").value)
    var new_mdp = String(document.getElementById("newpassword").value)
    var confirm_mdp = String(document.getElementById("confirmpassword").value)
    e.preventDefault();
    if (new_mdp.localeCompare(confirm_mdp)){//Remplacer par "l'ancien mdp correspond, et le nouveau mdp est identique et valide"
        passwordForm.classList.add("d-none")
        passwordValidForm.classList.remove("d-none")
    }
})