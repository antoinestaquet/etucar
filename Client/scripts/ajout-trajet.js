import * as cookie from "./front-cookies.js";

const formAjout = document.querySelector("#form-verif");

// Regarde si l'utilisateur est connecté
window.addEventListener("load", () => {
    if(!cookie.getCookieJWT()){
        console.log("lol");
        document.location.href = "connexion.html";
    }
});
    
const sleep = ms => new Promise(r => setTimeout(r, ms));

formAjout.addEventListener("submit", (e) => {
    e.preventDefault();

    let token = cookie.parseJwt();
    console.log(token.userId);

    let data = new URLSearchParams(new FormData(formAjout));
    data.append("id_conducteur", token.userId);

    let url = new URL("http://localhost:3000/trajet");

    const init = {
        method: "POST",
        headers: new Headers({
            'Authorization': 'Bearer ' + cookie.getCookieJWT()
        }),
        body: data
    }

    fetch(url, init)
    .then((res) => {
        console.log(res);
        sleep(5000).then(() => {
            document.location.href = "index.html";
        });
    });
})