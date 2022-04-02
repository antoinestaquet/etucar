import * as cookie from "./front-cookies.js";

const form = document.querySelector("#form");

form.addEventListener('submit', (e) => {

    e.preventDefault()

    if (form.checkValidity()) {

        // Le formulaire est valide
        const data = new URLSearchParams(new FormData(form));
        let url = new URL("http://localhost:3000/utilisateur/connexion");

        const init = {
            method: "POST",
            body: data,
            redirect: 'follow'
        }

        fetch(url, init)
            .then((res) => {
                if(res.status == 200){
                    return res.json();
                } else if (res.status == 401) {
                    alert("L'email n'existe pas et/ou le mot de passe est incorrect")
                    throw new Error("L'email n'existe pas et/ou le mot de passe est incorrect");
                } else {
                    throw new Error("Erreur serveur");
                }
            })
            .then((data) => {
                console.log("data");
                cookie.setCookieJWT(data['token']);
                window.location.href = "index.html";
            })
            .catch((err) => console.log(err));
    }
}, false);