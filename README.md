# etucar
Projet universitaire autour d'une application de covoiturage

## Page ajout-trajet
Necessité d'avoir deux clefs API (obtenable gratuitement) :
- [Geoapify](https://www.geoapify.com/) en demandant une clef API pour l'adress autocomplete
- [Mapquest](https://www.mapquest.com/) pour le service de navigation

Une fois les clefs obtenus, il suffit de les mettres dans settings/keys.json en suivant la structure suivante :
```json
{
    {
    "mapquest-api": "Votre clef API",
    "geoapify-api": "Votre clef API"
    }
}
```
