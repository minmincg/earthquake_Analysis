let myMap = L.map("map",{
    center: [37.09,-95.71],
    zoom: 5
});

//Adding tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the earthquake data
let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

let geojson;

d3.json(earthquakeData).then(function(data){
    // Create a new choropleth layer.
    geojson = L.choropleth(data,{

        // Define which property in the features to use.
        valueProperty: "DP03_16E",

        // Set the color scale.
        scale: ["#aef359", "#ed2939"],
        
        // Number of breaks in the step range 
        steps: 5,

        // q for quartile, e equidistant, k for k-means.
        mode:"q",

        style: {
            // Border color
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.value)
        }
    }).addTo(myMap);
    // Set up legend
    let legend = L.control({position: " bottomright"});
    // add minimum and maximum.
    legend.onAdd = function() {
        let div = L.DomUtil.create ("div" , "info legend");
        let limits = geojson.options.limits;
        let colors = geojson.options.colors;
        let labels = [];
        // Add the minimum and maximum
        let legendInfo = "<h1>Earthquake's depth</h1>" +
        "<div class=\labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length -1] + "</div>" +
        "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit,index) {
            labels.push("<li style=\"background-color: " +colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    
})