const form = document.querySelector("#recherche-form")

form.addEventListener("submit", (e) => {
    e.preventDefault();

    var formdata = new FormData(form);
    var url = new URL('http://localhost:3000/trajet/recherche');
    var params = [...formdata];
    url.search = new URLSearchParams(params).toString();

    fetch(url, {
        method: "GET"
    })
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                throw new Error("Erreur");
            }
        })
        .then((data) => {
            sessionStorage.setItem('trajets', data);
            document.location.href = "liste-trajet.html";
        })
        .catch((err) => {
            console.log(err);
        })

});