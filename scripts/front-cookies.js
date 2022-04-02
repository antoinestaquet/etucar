//Ajoute un cookie Token de valeur cvalue.
function setCookieJWT(cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + (1000 * 60 * 20));
    let expires = "expires=" + d.toUTCString();
    document.cookie = "token=" + cvalue + ";" + expires + ";path=/";
}

//Permet d'obtenir le cookie Token s'il existe.
function getCookieJWT() {
    let name = "token=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//Vérifie la présence d'un cookie Token. True si un token JWT existe False sinon. 
//TODO: Vérifier la validité du token.
function checkCookie() {
    let token = getCookie("token");
    if (token != "") {
        return true;
    } else {
        return false;
    }
}