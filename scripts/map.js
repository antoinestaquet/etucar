// Charge la clef api de mapquest
async function fetchApiKey(nameApi) {
    const response = await fetch("settings/keys.json")
    const json = await response.json()
    return json[nameApi]
}

/*
 AddressAutocomplete
 https://apidocs.geoapify.com/samples/autocomplete/autocomplete-tutorial/#step-3
*/

async function addressAutocomplete() {
    /* Active request promise reject function. To be able to cancel the promise when a new request comes */
    var currentPromiseReject;

    /* Execute a function when someone writes in the text field: */
    inputElement.addEventListener("input", function (e) {
        var currentValue = this.value;

        // Cancel previous request promise
        if (currentPromiseReject) {
            currentPromiseReject({
                canceled: true
            });
        }

        if (!currentValue) {
            return false;
        }

        /* Create a new promise and send geocoding request */
        var promise = new Promise((resolve, reject) => {
            currentPromiseReject = reject;

            var apiKey = await fetchApiKey("geoapify-api");
            var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&limit=5&apiKey=${apiKey}`;

            fetch(url)
                .then(response => {
                    // check if the call was successful
                    if (response.ok) {
                        response.json().then(data => resolve(data));
                    } else {
                        response.json().then(data => reject(data));
                    }
                });
        });

        promise.then((data) => {
            
            var currentItems;

            


        }, (err) => {
            if (!err.canceled) {
                console.log(err);
            }
        });
    });
}

window.onload = async function () {
    // Recupère la clef api de mapquest
    let mqKey = await fetchApiKey("mapquest-api")

    // Initialise leaflet
    L.mapquest.key = mqKey

    let map = L.mapquest.map('map', {
        center: [50.37608548949636, 3.5002565295512666],
        layers: L.mapquest.tileLayer('map'),
        zoom: 12
    });

    let directions = L.mapquest.directions();

    directions.setLayerOptions({
        startMarker: {
            icon: 'marker',
        },
        endMarker: {
            icon: 'marker',
        },
    });

    directions.route({
        start: 'Valenciennes, FR',
        end: 'Lille, FR'
    });
}



/* L.marker([37.7749, -122.4194],{
        icon: L.mapquest.icons.marker({
            primaryColor: '#22407F',
            secondaryColor: '#3B5998',
            shadow: true,
            size: 'md',
            symbol: 'A'
        }),
        draggable: true
    } ).addTo(map) */

