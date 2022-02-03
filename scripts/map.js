// Charge la clef api de mapquest
async function fetchApiKey() {
    const response = await fetch("settings/mapquest.json")
    const json = await response.json()
    return json["api-key"]
}

window.onload = async function() {
    // Initialise leaflet
    L.mapquest.key = await fetchApiKey()

    let map = L.mapquest.map('map', {
        center: [37.7749, -122.4194],
        layers: L.mapquest.tileLayer('map'),
        zoom: 12
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

