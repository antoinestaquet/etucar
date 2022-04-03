

Vue.createApp({
    data() {
        return {
            src: [{
                "nom": "toto",
                "prenom": "tata",
                "note": "0",
                "id_conducteur": "3",
                "date_depart": "2020-01-01",
                "date_arrivee": "2069-01-01",
                "lieu_depart": "Bureau de ridet",
                "lieu_arrivee": "enfer",
                "prix": "5000"
            },
            {
                "nom": "toto",
                "prenom": "tata",
                "note": "0",
                "id_conducteur": "3",
                "date_depart": "2020-01-01",
                "date_arrivee": "2069-01-01",
                "lieu_depart": "Bureau de ridet",
                "lieu_arrivee": "enfer",
                "prix": "5000"
            }]
        }
    }
}).mount('#vue-conducteur-demandes')