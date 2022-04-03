import * as cookie from "../front-cookies.js"

Vue.createApp({
    data() {
        return {
            profil: {
            }
        }
    },
    methods: {
        isBlank(str) {
            return (!str || /^\s*$/.test(str));
        }
    },
    beforeMount() {
        
        const init = {
            method: "GET"
        }

        let decoded = cookie.parseJwt();

        if(decoded === false){
            document.location.href = "index.html";
        }

        let id = decoded.userId;

        fetch(`http://localhost:3000/utilisateur/${id}`, init)
            .then((res) => {
                if(res.status == 200){
                    return res.json();
                } else {
                    throw new Error(res);
                }
            }).then((data) => {
                this.profil = data;
            }).catch((err) => {
                console.log(err);
            })
    }
}).mount('#vue-profil')