Vue.createApp({
    data() {
        return {
            trajets: []
        }
    },
    methods: {
        formaterDate(trajet, attribut) {
            return new Date(trajet[attribut]).toLocaleDateString("fr-FR", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric"
            });
        },
        getTrajet(id) {

            const init = {
                method: "GET"
            }

            fetch(`http://localhost:3000/trajet/${id}`, init)
                .then((res) => {
                    console.log(res);
                    if(res.status == 200){
                        return res.json();
                    } else {
                        throw new Error(res);
                    }
                }).then((data) => {
                    sessionStorage.setItem('trajet', JSON.stringify(data));
                    document.location.href = "acceptation-trajet.html";
                }).catch((err) => {
                    console.log(err);
                })
        }
    },
    beforeMount() {
        this.trajets = JSON.parse(sessionStorage.getItem('trajets'));
    }
}).mount('#vue-trajets')