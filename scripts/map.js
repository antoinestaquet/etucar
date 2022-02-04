const inputStart = document.querySelector("#start")
const inputEnd = document.querySelector("#end")
const formTrajet = document.querySelector("#form-trajet")
const formSupp = document.querySelector("#form-info")
const formVerif = document.querySelector("#form-verif")

// Constante requete geoapify
const MIN_ADDRESS_LENGTH = 3
const REQUEST_DELAY = 800
const MIN_CONFIDENCE = 0.95

// Charge une clef api suivant le paramètre
async function fetchApiKey(nameApi) {
    const response = await fetch("settings/keys.json")
    const json = await response.json()
    return json[nameApi]
}

/*
 AddressAutocomplete
 https://apidocs.geoapify.com/samples/autocomplete/autocomplete-tutorial
 Code adapté à notre besoin
*/

async function addressAutocomplete(inputElement, callback) {

    let geoapifyKey = await fetchApiKey("geoapify-api");

    /* Ecoute quand un utilisateur écrit dans le champ */
    let currentTimeout = null;
    let currentPromiseReject;
    let currentItems;

    inputElement.addEventListener("input", async function (e) {
        const currentValue = inputElement.value;

        // evite de faire un appel à chaque touche enfonce
        if (currentTimeout) {
            clearTimeout(currentTimeout)
        }

        // Cancel previous request promise
        if (currentPromiseReject) {
            currentPromiseReject({
                canceled: true
            });
        }

        // Si il n'y a pas assez d'information, on ne fait d'appel
        if (!currentValue || currentValue.length < MIN_ADDRESS_LENGTH) {
            return false;
        }

        // Attend avant de faire une requète à l'API
        currentTimeout = setTimeout(() => {
            currentTimeout = null;

            const promise = new Promise((resolve, reject) => {
                currentPromiseReject = reject;

                // L'url de la requète
                let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&format=json&limit=5&apiKey=${geoapifyKey}`;

                fetch(url)
                    .then(response => {
                        if (response.ok) {
                            response.json().then(data => resolve(data))
                        } else {
                            response.json().then(data => reject(data))
                        }
                    })
            })

            promise.then((data) => {
                // Gestion de la reponse
                currentItems = data.results;

                const autocompleteItems = document.createElement("div");
                autocompleteItems.setAttribute("class", "autocomplete-items");
                inputElement.parentNode.appendChild(autocompleteItems);

                data.results.forEach((result, index) => {
                    const item = document.createElement("div");
                    item.innerHTML = result.formatted;
                    autocompleteItems.appendChild(item);

                    // change la valeur de l'input avec celui selectionné
                    item.addEventListener("click", function (e) {
                        inputElement.value = data.results[index].formatted;
                        callback(currentItems[index]);
                        /* Close the list of autocompleted values: */
                        closeDropDownList(inputElement);
                    });


                })


            }, (err) => {
                console.log(err)
            })

        }, REQUEST_DELAY);

    });

    /* Item ayant le focus dans la liste. Sert pour naviguer avec des boutons */
    let focusedItemIndex = 0;

    /* Permet de naviguer dans la liste */
    inputElement.addEventListener("keydown", function (e) {
        let autocompleteItems = inputElement.parentNode.querySelector(".autocomplete-items");
        if (autocompleteItems) {
            var itemElements = autocompleteItems.querySelectorAll("div");
            if (e.keyCode == 40) {
                e.preventDefault();
                /*Si la flèche du bas est appuyé, incrémenter de 1 le focus:*/
                focusedItemIndex = focusedItemIndex !== itemElements.length - 1 ? focusedItemIndex + 1 : 0;
                /*Et donne le focus à l'élément*/
                setActive(itemElements, focusedItemIndex);
            } else if (e.keyCode == 38) {
                e.preventDefault();

                /*Si la flèche du haut est appuyé, décrémenter de 1 le focus:*/
                focusedItemIndex = focusedItemIndex !== 0 ? focusedItemIndex - 1 : focusedItemIndex = (itemElements.length - 1);
                /*Et donne le focus à l'élément*/
                setActive(itemElements, focusedItemIndex);
            } else if (e.keyCode == 13) {
                /* Si la touche entree est appuyé et que la valeur est choisi, fermer la liste */
                e.preventDefault();
                if (focusedItemIndex > -1) {
                    closeDropDownList();
                }
            }
        } else {
            if (e.keyCode == 40) {
                /* Ouvre la liste à nouveau */
                var event = document.createEvent('Event');
                event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                inputElement.dispatchEvent(event);
            }
        }
    });

    function setActive(items, index) {
        if (!items || !items.length) return false;

        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove("autocomplete-active");
        }

        /* Add class "autocomplete-active" to the active element*/
        items[index].classList.add("autocomplete-active");

        // Change input value and notify
        inputElement.value = currentItems[index].formatted;
    }

    function closeDropDownList() {
        let autocompleteItems = inputElement.parentNode.querySelector(".autocomplete-items");
        if (autocompleteItems) {
            inputElement.parentNode.removeChild(autocompleteItems);
        }
        focusedItemIndex = -1;
    }

    // Ajout d'un input pour effacer le champ
    const clearButton = document.createElement("div");
    clearButton.classList.add("clear-button");
    addIcon(clearButton);
    clearButton.addEventListener("click", (e) => {
        e.stopPropagation();
        inputElement.value = '';
        callback(null);
        clearButton.classList.remove("visible");
        closeDropDownList();
    });
    inputElement.parentNode.appendChild(clearButton);

    /* Process a user input: */
    inputElement.addEventListener("input", function (e) {

        if (!inputElement.value) {
            clearButton.classList.remove("visible");
        }

        // Show clearButton when there is a text
        clearButton.classList.add("visible");

    });

    /* Ferme le menu deroulant quand l'utilisateur clique en dehors du document.
    */
    document.addEventListener("click", function (e) {
        if (e.target !== inputElement) {
            closeDropDownList();
        } else if (!inputElement.parentNode.querySelector(".autocomplete-items")) {
            // open dropdown list again
            var event = document.createEvent('Event');
            event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            inputElement.dispatchEvent(event);
        }
    });
}


function addIcon(buttonElement) {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svgElement.setAttribute('viewBox', "0 0 24 24");
    svgElement.setAttribute('height', "24");

    const iconElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    iconElement.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
    iconElement.setAttribute('fill', 'currentColor');
    svgElement.appendChild(iconElement);
    buttonElement.appendChild(svgElement);
}

/* Regarde la valeur de l'input et retourne la premiere addresse tel que sa confiance > MIN_CONFIDENCE 
    Sinon, retourne null
    */
async function loadGeocode(inputName, geoapifyKey) {
    let reponse = null;
    if (inputName.value.length >= MIN_ADDRESS_LENGTH) {
        reponse = fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(inputName.value)}&apiKey=${geoapifyKey}`)
            .then(resp => resp.json())
            .then((geocodingResult) => {
                if (geocodingResult.length === 0) {
                    return null;
                }
                const address = geocodingResult["features"];
                for (let i = 0; i < address.length; i++) {
                    if (address[i]["properties"]["rank"]["confidence"] >= MIN_CONFIDENCE) {
                        return address[i]["properties"];
                    }
                }
                return null
            });
    }
    return reponse;
}

/*
    Retourne la location associee aux coordonnee 
*/
async function reverseGeocode(lat, lon, geoapifyKey) {
    let reponse = null;
    reponse = fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${geoapifyKey}`)
        .then(response => response.json())
        .then(result => {
            if (result.features.length) {
                return result.features[0].properties;
            } else {
                return null;
            }
        });
    return reponse;
}

/**
 * Fonction demandant à l'utilisateur s'il souhaite continuer avec le trajet actuel
 */

function validerTrajet() {

}


window.onload = async function () {
    // Permet de passer outre les verifications | A enlever en production
    const DEBUG = true;
    
    let geoapifyKey = await fetchApiKey("geoapify-api");

    // Initialise leaflet
    let map = L.map('map').setView([50.35464734683432, 3.4878042404234377], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.geoapify.com/term-and-conditions">Powered by Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Recherche de route

    let trajetActuel = null;
    let startPosition = null; let startMarker = null;
    let endPosition = null; let endMarker = null;


    // Si une valeur est resté sur la page
    startPosition = await loadGeocode(inputStart, geoapifyKey);
    endPosition = await loadGeocode(inputEnd, geoapifyKey);

    // Ecouteur d'evenement sur le formulaire depart / arrivee
    formTrajet.addEventListener('submit', event => {
        event.preventDefault();

        // Passer au prochain formulaire
        if (trajetActuel || DEBUG) {
            const sectTrajet = document.querySelector("#trajet");
            sectTrajet.setAttribute("class", "d-none");
            const infoSupp = document.querySelector("#info-supp");
            infoSupp.classList.remove("d-none")
        } else {
            const alertTrajet = document.querySelector("#alert-trajet")
            alertTrajet.textContent = "Veuillez d'abord choisir un trajet s'il vous plait!"
            alertTrajet.classList.add("alert", "alert-info", "text-center")
            setTimeout(() => {
                alertTrajet.removeAttribute("class");
                alertTrajet.textContent = ""
            }, 5000)
        }
    })

    function generateRoute() {
        if (startPosition != null && endPosition != null) {
            let fromWaypoint = [startPosition.lat, startPosition.lon];
            let toWaypoint = [endPosition.lat, endPosition.lon];

            map.fitBounds([
                fromWaypoint,
                toWaypoint
            ])

            fetch(`https://api.geoapify.com/v1/routing?waypoints=${fromWaypoint.join(',')}|${toWaypoint.join(',')}&mode=drive&apiKey=${geoapifyKey}`)
                .then(res => res.json())
                .then(result => {
                    // S'il existe déjà un trajet, on le supprime :
                    if (trajetActuel) {
                        map.removeLayer(trajetActuel)
                    }

                    trajetActuel = L.geoJSON(result, {
                        style: (feature) => {
                            return {
                                color: "rgba(20, 137, 255, 0.7)",
                                weight: 5
                            };
                        }
                    }).addTo(map)
                        .bindPopup(() => {
                            // Round pour enlever les secondes
                            let minute = result.features[0].properties.time / 60;
                            let heure = 0;
                            let duree = "";
                            if (minute > 60) {
                                heure = minute / 60;
                                minute -= heure * 60;
                                heure = Math.round(heure);
                            }
                            minute = Math.round(minute);
                            if (heure != 0) {
                                if (minute == 0) {
                                    duree = `${heure} h`;
                                } else {
                                    duree = `${heure} h ${minute} min`;
                                }

                            } else {
                                duree = `${minute} min`;
                            }

                            return `<h1 class="fs-3"> ${duree} </h1> <div class="text-muted">${Math.round(result.features[0].properties.distance / 1000)} kilomètres</div> `
                        })
                        .openPopup();
                })
        }
    }


    function ajoutLocation(input) {
        // Initialise l'autocomplete pour les adresses
        return addressAutocomplete(input, (data) => {
            // Execute quand une nouvelle addresse a ete selectionnee
            if (!data) {
                return;
            }
            map.flyTo(new L.LatLng(data.lat, data.lon), 12);

            if (input.id.toLowerCase().localeCompare("start") == 0) {

                if (startMarker != undefined) {
                    startMarker.setLatLng(data);
                    startMarker.setPopupContent(data.formatted);
                } else {
                    startMarker = L.marker(data, { draggable: 'true' })
                        .addTo(map)
                        .bindPopup(data.formatted)
                        .openPopup();

                    startMarker.on('dragend', function (event) {
                        let newMarker = event.target;
                        let newPosition = newMarker.getLatLng();

                        reverseGeocode(newPosition.lat, newPosition.lng, geoapifyKey).then((data) => {
                            startMarker.setPopupContent(data.formatted)
                            startPosition = data;
                            generateRoute();
                        });

                        startMarker.setLatLng(new L.LatLng(newPosition.lat, newPosition.lng));

                    })
                }

                startPosition = data;
            } else {

                if (endMarker != undefined) {
                    endMarker.setLatLng(data);
                    endMarker.setPopupContent(data.formatted);
                } else {
                    endMarker = L.marker(data, { draggable: 'true' })
                        .addTo(map)
                        .bindPopup(data.formatted)
                        .openPopup();

                    endMarker.on('dragend', function (event) {
                        let newMarker = event.target;
                        let newPosition = newMarker.getLatLng();

                        reverseGeocode(newPosition.lat, newPosition.lng, geoapifyKey ).then(data => {
                            endMarker.setPopupContent(data.formatted)
                            endPosition = data;
                            generateRoute();
                        });
                        endMarker.setLatLng(new L.LatLng(newPosition.lat, newPosition.lng));
                    })
                }

                endPosition = data;
            }

            // Tente de generer une route si possible 
            generateRoute();
            return data
        });

    }

    ajoutLocation(inputStart);
    ajoutLocation(inputEnd);

    // Ecouteur d'evenement sur le formulaire d'information supplémentaire
    formSupp.addEventListener('submit', event => {
        event.preventDefault();

        if(formSupp.checkValidity()){
            
            const infoSupp = document.querySelector("#info-supp");
            infoSupp.classList.add("d-none")
            const verfication = document.querySelector("#verification");
            verfication.classList.remove("d-none");

            // remplir la form de validation :

            const verifDepart  = document.querySelector("#verif-depart");
            verifDepart.value  = startPosition.formatted;
            const verifArrivee = document.querySelector("#verif-arrivee");
            verifArrivee.value = endPosition.formatted;
            const verifPrix = document.querySelector("#verif-prix");
            verifPrix.value = document.querySelector("#prix").value;
            const verifPlace = document.querySelector("#verif-place");
            verifPlace.value = document.querySelector("#nombre-place").value;
            const verifInfoPassager = document.querySelector("#verif-info-passager");
            verifInfoPassager.value = document.querySelector("#info-pour-passager").value;


        }
        
        formSupp.classList.add("was-validated")
    })

    // Partie verification

    // Si l'utilisateur ne valide pas 
    const bouttonAnnuler = document.querySelector("#btn-annuler-verif")
    bouttonAnnuler.onclick = function() {
        formTrajet.reset();
        formSupp.reset();
        formVerif.reset();
        window.location.assign("index.html")
    }


}



