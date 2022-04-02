const form = document.querySelector("#recherche-form")

form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Trajet de "+document.getElementById("lieu_depart").value+
    " vers "+document.getElementById("destination").value+
    ", arrivée prévue "+document.getElementById("jour").value);

    var formdata = new FormData(form);
    
    var url = new URL('http://localhost:3000/trajet/recherche');
    var params = [...formdata];
    url.search = new URLSearchParams(params).toString();

    fetch(url,{
        method: "GET"
    })
    .then((res) => {
        
    })
    .then((data)=>console.log(data));

});