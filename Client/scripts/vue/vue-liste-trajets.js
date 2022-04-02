Vue.createApp({
    data() {
        return {
            trajets:[]
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
        this.trajets = JSON.parse(sessionStorage.getItem('trajets'));
        console.log(this.trajets);
    }
}).mount('#vue-trajet')