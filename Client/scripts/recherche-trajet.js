const btn = document.getElementById("valid")
btn.onclick = function() {
    console.log("Trajet de "+document.getElementById("lieu_depart").value+
    " vers "+document.getElementById("destination").value+
    ", arrivée prévue à "+document.getElementById("heure_arrivee").value+
    " le "+document.getElementById("jour").value)
}