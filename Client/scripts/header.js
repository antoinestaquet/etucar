import * as cookie from './front-cookies.js';

window.addEventListener('load', (e) => {
    let header = document.getElementById('header');
    let headerlog = document.getElementById('headerlog');
    if (!cookie.checkCookieJWT()) {
        //Si un cookie d'authentification est disponible.
        header.remove();
        headerlog.classList.remove("d-none");
    } else {
        headerlog.remove();
    }
})

