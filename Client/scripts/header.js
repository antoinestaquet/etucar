import * as cookie from './front-cookies.js';


window.addEventListener('load', (e) => {
    let header = document.getElementById('header');
    let headerlog = document.getElementById('headerlog');
    if (cookie.getCookieJWT()) {
        //Si un cookie d'authentification est disponible.
        header.remove();
        headerlog.classList.remove("d-none");
    } else {
        headerlog.remove();
    }

    const deconnexion = document.querySelector("#deconnexion");

    deconnexion.addEventListener("click", () => {
        document.cookie = 'token=; Max-Age=-999999999; path=/;';
        document.location.href = "index.html"
    });
})

