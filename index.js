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
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "type": "gen_station",
                "id": "g001"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.5507190227508545,
                    50.73543999773759
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "trans_cable",
                "id": "cab001"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.5507190227508545,
                        50.73543999773759
                    ],
                    [
                        -3.549152612686157,
                        50.73478472893004
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "trans_cable",
                "id": "cab002"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549152612686157,
                        50.73478472893004
                    ],
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "step_down",
                "id": "step001"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.549436926841736,
                    50.7337118337839
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable001"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.5498768091201782,
                        50.73335193307209
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp1"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.5498768091201782,
                    50.73335193307209
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable002"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.5500699281692505,
                        50.73316179573062
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable003"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.5505259037017822,
                        50.733066726770446
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable003"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.5507887601852417,
                        50.73308370338463
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable004"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.5510408878326416,
                        50.733110865954515
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable005"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.5504883527755733,
                        50.733508116739486
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable006"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.549104332923889,
                        50.73392913098803
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable006"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.5491204261779785,
                        50.7337457865385
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable007"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.5488736629486084,
                        50.73392234046567
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable008"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.5508960485458374,
                        50.733535279063275
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable009"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.5513949394226074,
                        50.733576022519415
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable0010"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.55057954788208,
                        50.733525093193705
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable0011"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.5506707429885864,
                        50.73346397792976
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable0012"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.551630973815918,
                        50.73365411404461
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable0013"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.5516738891601562,
                        50.733511512030844
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable0014"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.551706075668335,
                        50.73330779411519
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "underground_cable",
                "id": "u_cable0015"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -3.549436926841736,
                        50.7337118337839
                    ],
                    [
                        -3.5520225763320923,
                        50.73316179573062
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp2"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.550118207931518,
                    50.73316519104706
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp3"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.550536632537842,
                    50.73310747063415
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp4"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.5507994890213013,
                    50.733080308062284
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp5"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.5510462522506714,
                    50.73311426127465
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp6"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.549109697341919,
                    50.7337457865385
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp7"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.5488736629486084,
                    50.73392573572698
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp8"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.549104332923889,
                    50.73394271202982
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp9"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.551625609397888,
                    50.733657509325354
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp10"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.551684617996216,
                    50.733511512030844
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp11"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.551400303840637,
                    50.733586208377915
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp12"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.5509121417999268,
                    50.733535279063275
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp13"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.5506653785705566,
                    50.73347755910643
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp14"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.55057954788208,
                    50.733542069641764
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp15"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.550482988357544,
                    50.73351830261277
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp16"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.5517168045043945,
                    50.733321375337134
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "type": "service_point",
                "id": "sp17"},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -3.5520386695861816,
                    50.73316858636325
                ]
            }
        }
    ]
};

let vectorSource = new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(geojsonObject, {
        featureProjection: 'EPSG:3857'
    })
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
        center: ol.proj.transform([-3.5, 50.74], 'EPSG:4326', 'EPSG:3857'),
        zoom: 13
    })
});

function hideFeatures() {
    const features = vectorLayer.getSource().getFeatures();

    features.forEach(function(feature) {
        feature.style = {visibility: 'hidden'};
    });
    map.updateSize();
}

//modal code
setTimeout(function() {
    document.querySelector('#welcome-modal').addEventListener('btnModalPositiveClicked', function () {
        setTimeout(function() {
            document.querySelector('#file-upload-modal').style.display = 'block';
        }, 500)
    })
}, 100);

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