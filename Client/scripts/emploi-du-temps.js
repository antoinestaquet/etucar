/*
    Ne remplace en aucun cas la validation côté serveur
*/

const extension_autorise = ['ics']

function valider_EmploiDuTemps(fichier){
    let extension = fichier.split('.').pop().toLowerCase();
    let valide = false

    extension_autorise.forEach( element => {
        if(element === extension){
            valide = true
        }
    })
    
    return valide;
}