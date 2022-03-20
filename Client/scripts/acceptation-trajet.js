var btn = document.querySelector("#demande-trajet")

btn.onclick = function() {
    btn.setAttribute("disabled", "")
    btn.textContent = "En attente de validation"
    btn.blur()
}