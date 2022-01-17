const btnTrajet = document.querySelector("#btn-trajet")

btnTrajet.onclick = function() {
    console.log(btnTrajet.getAttribute('aria-expanded') )
    if( btnTrajet.getAttribute('aria-expanded')   === "false" ){
        btnTrajet.textContent = "Afficher plus"
    } else {
        btnTrajet.textContent = "Afficher moins"
    }
}