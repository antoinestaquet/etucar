const formEmail = document.getElementById('email')
const formCode = document.getElementById('code')
const formReset = document.getElementById('reset')

const btnEmail = document.getElementById('btnemail')
const btnCode = document.getElementById('btncode')
const btnReset = document.getElementById('btnreset')

btnEmail.onclick = function() {
    var mail = document.getElementById('emailtxt').value
    if (mail.length > 2) {//à remplacer par "si le serveur retourne vrai car l'email correspond à un compte"
        formEmail.classList.add("d-none")
        formCode.classList.remove("d-none")
    }
}

btnCode.onclick = function() {
    var code = document.getElementById('txtcode').value
    if (true) {//à remplacer par "si le serveur retourne vrai car le code est le bon"
        formCode.classList.add("d-none")
        formReset.classList.remove("d-none")
        formReset.classList.add("d-display")
    }
}

btnReset.onclick = function() {
    var mdp = document.getElementById('mdp')
    var verif = document.getElementById('verif')
    if (mdp == verif){
        
    }
}