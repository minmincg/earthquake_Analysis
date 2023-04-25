const URL= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Map object
let myMap = L.map("map",{
    center: [37.09,-95.71],
    zoom: 5
});

// Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
    "Street Map": streetmap
  };

  let allEarthquakes = new L.LayerGroup();

  let overlays = {
    "All Earthquakes": allEarthquakes
  };
  
  L.control.layers(baseMaps,overlays).addTo(myMap);

//depth and color
function depthColor(feature){
    let depth = feature.geometry.coordinates[2];
    if (depth <= 1) {
        return "#ff0000";
    } else if (depth <=2) {
        return "#00ff00";
    } else {
        return "#0000ff";
    }
}

// magnitude and size function!!!!!
function circleSize(feature){
    let magnitude = feature.properties.mag;
    return Math.sqrt(magnitude)*5;
}

function getSyleInfo(feature){
    let styleInfo = {
        opacity: 1,
        fillOpacity: 1,
        fillColor: depthColor(feature),
        color: "black",
        radius: circleSize(feature),  // function
        stroke: true,
        weight: 0.5
    };
    return styleInfo;
}

//
function pointToLayer(feature,latLong) {
    return L.circleMarker(latLong);
}

function makePopup(feature,layer){
    let earthID = feature.id;
    let text = feature.properties.place;
    layer.bindPopup(`<h1>Id: ${earthID}</h1> <hr> <h3> Place: ${text}</h3>`).addTo(myMap);
}

// earthquake layer
d3.json(URL).then((data) => {
    let options = {
        "pointToLayer": pointToLayer,
        "style": getSyleInfo,
        "onEachFeature": makePopup
    };

    L.geoJson(data,options).addTo(allEarthquakes);
    allEarthquakes.addTo(myMap);
});


