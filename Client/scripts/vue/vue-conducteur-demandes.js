import * as cookie from "../front-cookies.js"

Vue.createApp({
    data() {
        return {
            trajetsEnAttente: []
        }
    },
    beforeMount() {
        let decoded = cookie.parseJwt();
        
        if (decoded === false) {
            document.location.href = "index.html";
        }
        
        let id = decoded.userId;

        const init = {
            method: "GET",        
            headers: new Headers({
                'Authorization': 'Bearer ' + cookie.getCookieJWT()
            }),
        }

        fetch(`http://localhost:3000/trajet/demandes/${id}`, init)
            .then((res) => {
                if (res.status == 200) {
                    return res.json();
                } else {
                    throw new Error(res);
                }
            }).then((data) => {
                this.trajets = data;
            }).catch((err) => {
                console.log(err);
            })
    }
}).mount('#vue-conducteur-demandes')