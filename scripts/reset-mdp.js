const formEmail = document.getElementById('email')
const formCode = document.getElementById('code')
const formReset = document.getElementById('reset')

const btnEmail = document.getElementById('btnemail')

btnEmail.onclick = function() {
    var mail = new String(document.getElementById('email').value)
    if (mail.length > 2) {//à remplacer par "si le serveur retourne vrai car l'email correspond à un compte"
        var bsCollapse = new bootstrap.Collapse(formEmail, {hide : true})
        console.log("ok")
    }
}
