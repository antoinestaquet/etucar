import * as cookie from "./front-cookies.js";

const deconnexion = document.querySelector("#deconnexion");

deconnexion.addEventListener("click", () => {
    document.cookie = 'token=; Max-Age=-999999999; path=/;';
    document.location.href = "index.html"
});