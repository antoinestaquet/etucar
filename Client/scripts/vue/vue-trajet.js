Vue.createApp({
    data() {
        return {
            trajet: []
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
        }
    },
    beforeMount() {
        this.trajet = JSON.parse(sessionStorage.getItem('trajet'));
        console.log("this");
        console.log(JSON.parse(sessionStorage.getItem('trajet')));
    }
}).mount('#vue-trajet')