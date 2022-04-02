const form = document.querySelector("#recherche-form")
import * as cookie from "./front-cookies.js"

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let formdata = new FormData(form);
    let url = new URL('http://localhost:3000/trajet/recherche');
    let params = [...formdata];
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
            sessionStorage.setItem('trajets', JSON.stringify(data));
            document.location.href = "liste-trajet.html";
        })
        .catch((err) => {
            console.log(err);
        })

});