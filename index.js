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

let styleCache = {};
const styleFunction = function(feature) {
    let featureType = feature.get('type');

    if (!styleCache[featureType]) {
        switch (featureType) {
            case 'gen_station':
                styleCache[featureType] = new ol.style.Style({
                    image: new ol.style.Icon({
                        src: 'svgs/factory.png'
                    })
                });
                break;

            case 'step_down_transformer':
                styleCache[featureType] = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: null,
                        stroke: new ol.style.Stroke({color: 'red', width: 2})
                    })
                });
                break;

            case 'step_up_transformer':
                styleCache[featureType] = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: null,
                        stroke: new ol.style.Stroke({color: 'blue', width: 2})
                    })
                });
                break;

            case 'trans_cable':
                styleCache[featureType] = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'red',
                        width: 2
                    })
                });
                break;

            case 'underground_cable':
                styleCache[featureType] = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'green',
                        width: 2
                    })
                });
                break;

            case 'service_point':
                styleCache[featureType] = new ol.style.Style({
                    image: new ol.style.Icon({
                        src: 'svgs/service-point.svg',
                        scale: 0.05
                    })
                });
                break;
        }
    }
    return [styleCache[featureType]]
};

let geojsonObject;

function validateFile() {
    if (document.querySelector('px-file-upload').files.length > 0) {
        document.getElementById('btnModalPositive').disabled = false;
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

//popup code

/*
let popup = document.getElementById('popup');
let popupInfo = document.getElementById('popup-info');
let popupCloser = document.getElementById('closer');

let overlay = new ol.Overlay({
    element: popup,
    autoPan: true,
    autoPanAnimation: {
        duration: 200
    }
});
*/

/*popupCloser.onclick = function() {
    overlay.setPosition(undefined);
    return false;
};*/

/*const map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
    ],
    overlays: [overlay],
    target: 'map',
    view: new ol.View({
        center: ol.proj.transform([-3.5, 50.74], 'EPSG:4326', 'EPSG:3857'),
        zoom: 13
    })
});*/

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

/*
map.on('click', function(e) {
    let feature = map.forEachFeatureAtPixel(e.pixel, function(feat) {return feat;});

    if(feature) {
        console.log(popupInfo);
        console.log(document.getElementById('popup-info'));
        document.getElementById('popup-info').innerHTML = '<p>Feature Type:</p>' + feature.get('type');
        console.log(overlay);
        overlay.setPosition(e.coordinate);
    }
});*/
