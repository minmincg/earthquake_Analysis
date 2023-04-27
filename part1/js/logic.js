const URL= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Map object
let myMap = L.map("map",{
    center: [37.09,-95.71],
    zoom: 3
});

// Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

streetmap.addTo(myMap);
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
    if (depth >= -10 && depth <= 10 ) {
        return "#99ff66";
    } else if (depth >= 10 && depth <= 30 ) {
        return "#D4EE00";
    } else if (depth >= 30 && depth <= 50 ) {
        return "#EECC00";
    } else if (depth >= 50 && depth <= 70 ) {
        return "#EE9C00";
    } else if (depth >= 70 && depth <= 90 ) {
        return "#EA822C";
    } else {
        return "#EA2C2C";
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
        fillOpacity: 0.7,
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
    let location = feature.properties.place;
    let mag = feature.properties.mag;
    let dep = feature.geometry.coordinates[2];
    layer.bindPopup(`<h1>Location: ${location}</h1> <hr> <h3> Magnitude: ${mag}</h3> <hr> <h3> Depth: ${dep}</h3>`).addTo(myMap);
}

//   CREATE LEGEND
 // Here we create a legend control object.
 var legend = L.control({
    position: "bottomright"
  });
  // Then add all the details for the legend
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "#99ff66",
      "#D4EE00",
      "#EECC00",
      "#EE9C00",
      "#EA822C",
      "#EA2C2C"
    ];
    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  

// earthquake layer
d3.json(URL).then((data) => {
    let options = {
        "pointToLayer": pointToLayer,
        "style": getSyleInfo,
        "onEachFeature": makePopup
    };

    L.geoJson(data,options).addTo(allEarthquakes);
    allEarthquakes.addTo(myMap);
    legend.addTo(myMap);
});