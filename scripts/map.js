const inputStart = document.querySelector("#start")
const inputEnd = document.querySelector("#end")
const form = document.querySelector("#form")

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

window.onload = async function () {
    let geoapifyKey = await fetchApiKey("geoapify-api");

    // Initialise leaflet
    let map = L.map('map').setView([50.35464734683432, 3.4878042404234377], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Recherche de route

    let trajetActuel = null;
    let startPosition = null;
    let endPosition = null;

    // Si une valeur est resté sur la page
    startPosition = await loadGeocode(inputStart, geoapifyKey);
    endPosition = await loadGeocode(inputEnd, geoapifyKey);

    form.addEventListener('submit', event => {
        event.preventDefault();
        generateRoute();
    })

    generateRoute()

    function generateRoute() {
        if (startPosition != null && endPosition != null) {
            let fromWaypoint = [startPosition.lat, startPosition.lon];
            let toWaypoint = [endPosition.lat, endPosition.lon];

            /* Ajout de marker */
            L.marker(fromWaypoint).addTo(map).bindPopup(`${startPosition.formatted}`);
            L.marker(toWaypoint).addTo(map).bindPopup(`${endPosition.formatted}`);

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
                        .bindPopup(`${result.features[0].properties.distance / 1000} kilomètres, environ ${Math.round(result.features[0].properties.time / 60)} minutes de trajet`)
                        .openPopup();
                })
        }
    }

    // Initiliase l'autocomplete pour les adresses
    addressAutocomplete(inputStart, (data) => { 
        startPosition = data;
        if(!startPosition){
            return;
        }
        map.flyTo(new L.LatLng(startPosition.lat, startPosition.lon), 12);
        L.marker(startPosition)
        .addTo(map)
        .bindPopup(startPosition.formatted)
        .openPopup();
        
    });
    addressAutocomplete(inputEnd, (data) => { 
        endPosition = data;
        if(!endPosition){
            return;
        }
        map.flyTo(new L.LatLng(endPosition.lat, endPosition.lon), 12);
        L.marker(endPosition)
        .addTo(map)
        .bindPopup(endPosition.formatted)
        .openPopup();
    });
}



