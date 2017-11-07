//TO-DO: look at map stretch, simple click events, file loading

'use strict';

window.onload = function(){
   const modal = document.getElementById('welcome-modal');
   modal.modalButtonClicked();
};

let image = new ol.style.Circle({
    radius: 5,
    fill: null,
    stroke: new ol.style.Stroke({color: 'black', width: 1})
});

const styles = {
    'Point': new ol.style.Style({
        image: image
    }),
    'LineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'green',
            width: 2
        })
    }),
    'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'green',
            width: 1
        })
    }),
    'Circle': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'black'
        })
    })
};

const styleFunction = function(feature) {
    return styles[feature.getGeometry().getType()];
};

const geojsonObject = {
    'type': 'FeatureCollection',
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.551030158996582,
                    50.73908964330854
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.5509872436523438,
                        50.73908964330854
                    ],
                    [
                        -3.549485206604004,
                        50.73373899598955
                    ],
                    [
                        -3.5582399368286133,
                        50.73360318480381
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549485206604004,
                        50.73376615817945
                    ],
                    [
                        -3.557467460632324,
                        50.73167462346925
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549485206604004,
                        50.73376615817945
                    ],
                    [
                        -3.5561370849609375,
                        50.73056091104024
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.5495710372924805,
                        50.73373899598955
                    ],
                    [
                        -3.549056053161621,
                        50.72637746198987
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.5490989685058594,
                        50.72640462844848
                    ],
                    [
                        -3.55682373046875,
                        50.72577979591549
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549056053161621,
                        50.72635029551553
                    ],
                    [
                        -3.5488414764404297,
                        50.72080800536808
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.5490989685058594,
                        50.72640462844848
                    ],
                    [
                        -3.5544633865356445,
                        50.722438158756084
                    ]
                ]
            }
        }
    ]
};


let vectorSource = new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
});

const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: styleFunction
});

const map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
        vectorLayer
    ],
    target: 'map',
    view: new ol.View({
        center: [-3.5, 50.74],
        zoom: 13,
        projection: 'EPSG:4326'
    })
});

let element = document.getElementById('popup');

let popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false
});

map.addOverlay(popup);

map.on('click', function(e) { //bind to map features
    const coordinate = e.coordinate;
    console.log(coordinate)
});