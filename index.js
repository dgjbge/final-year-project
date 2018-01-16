//TO-DO: look at map stretch, simple click events, file loading

'use strict';

window.onload = function(){
    const modal = document.getElementById('welcome-modal');
    modal.modalButtonClicked();
    //disabling Upload button until the file is checked
    document.getElementById('btnModalPositive').disabled = true;

    const fileUploader = document.querySelector('px-file-upload');
    fileUploader.addEventListener('px-file-upload-files-changed', function() {
        console.log('file!!');
        validateFile()
    });
    modal.addEventListener('btnModalPositiveClicked', function() {
        uploadFile();
    });
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

let geojsonObject;

function validateFile() {
    let currentFile;
    let fileExtension;
    if(document.querySelector('px-file-upload').files.length > 0) {
         currentFile = document.querySelector('px-file-upload').files[0];

        fileExtension = currentFile.name.split('.').pop();

        if (fileExtension === 'geojson') {
            document.getElementById('btnModalPositive').disabled = false;
        }
    } else {
        document.getElementById('btnModalPositive').disabled = true;
    }
}

function uploadFile() {
    const file = document.querySelector('px-file-upload').files[0];
    const reader = new FileReader();
    let fileContents;
    reader.onload = function(e) {
        fileContents = e.target.result;
        geojsonObject = JSON.parse(fileContents);
        createDataSource();
    };

    reader.readAsText(file, 'UTF-8');

}

const map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
    ],
    target: 'map',
    view: new ol.View({
        center: ol.proj.transform([-3.5, 50.74], 'EPSG:4326', 'EPSG:3857'),
        zoom: 13
    })
});

function createDataSource() {
    let vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(geojsonObject, {
            featureProjection: 'EPSG:3857'
        })
    });

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: styleFunction
    });

    map.addLayer(vectorLayer);
    map.getView().fit(vectorSource.getExtent(), map.getSize());

    generateInfo(vectorLayer);
}

function generateInfo(vectorLayer) {
    const numberOfFeatures = vectorLayer.getSource().getFeatures().length;
    document.getElementById('total-features').innerHTML = "Total Features: " + numberOfFeatures;
    const networkFeatures = geojsonObject.features;
    let servicePointCounter = 0;
    let cableCounter = 0;
    let stationCounter = 0;

    networkFeatures.forEach(function(feature) {
        switch(feature.properties.type) {
            case 'gen_station':
                stationCounter += 1;
                break;

            case 'underground_cable' || 'trans_cable':
                cableCounter += 1;
                break;

            case 'service_point':
                servicePointCounter += 1;
                break;
        }
    });

    document.getElementById('total-service-points').innerHTML = "Total Service Points: " + servicePointCounter;
    document.getElementById('total-cables').innerHTML = "Total Cables: " + cableCounter;
    document.getElementById('total-gen-stations').innerHTML = "Total Generating Stations: " + stationCounter;

}


/*function hideFeatures() {
    const features = vectorLayer.getSource().getFeatures();

    features.forEach(function(feature) {
        feature.style = {visibility: 'hidden'};
    });
    map.updateSize();
}*/

/*//modal code
setTimeout(function() {
    document.querySelector('#welcome-modal').addEventListener('btnModalPositiveClicked', function () {
        setTimeout(function() {
            document.querySelector('#file-upload-modal').style.display = 'block';
        }, 500)
    })
}, 100);*/

/*
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
});*/
