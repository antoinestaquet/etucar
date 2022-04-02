import * as cookie from "./front-cookies.js";

const deconnexion = document.querySelector("#deconnexion");

deconnexion.addEventListener("", () => {
    document.cookie = "";
    document.location.href = "index.html"
});