'use strict';

window.onload = function(){
    const modal = document.getElementById('welcome-modal');
    modal.modalButtonClicked();
    //disabling Upload button until the file is checked
    document.getElementById('btnModalPositive').disabled = true;

    const fileUploader = document.querySelector('px-file-upload');
    fileUploader.addEventListener('px-file-upload-files-changed', function() {
        validateFile()
    });
    modal.addEventListener('btnModalPositiveClicked', function() {
        uploadFile();
    });
};

let styleCache = {};
let vectorLayer;

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

function createDataSource() {
    let vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(geojsonObject, {
            featureProjection: 'EPSG:3857'
        })
    });

    vectorLayer = new ol.layer.Vector({
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

function realTimeDataUpload() {
    const modal = document.getElementById('real-time-data-modal');
    modal.modalButtonClicked();
    modal.addEventListener('btnModalPositiveClicked', function() {
        uploadRealTimeData();
    });
}
let realTimeData;

function uploadRealTimeData() {
    const file = document.querySelectorAll('px-file-upload')[1].files[0];
    const reader = new FileReader();
    let realTimeContents;

    reader.onload = function(e) {
        realTimeContents = e.target.result;
        realTimeData = JSON.parse(realTimeContents);
        linkRealTimeData(realTimeData);
    };

    reader.readAsText(file, 'UTF-8');

}

function linkRealTimeData(data) {
    let features = geojsonObject.features;
    let realTimeFeatures = data.data;
    features.forEach(function(feature) {
        let featureID = feature.properties.id;
        if(realTimeFeatures[featureID] !== undefined) {
            let realTimeReadings = realTimeFeatures[featureID];
            feature.properties['realTimeData'] = realTimeReadings['readings']
        }
    });
    console.log(vectorLayer.getSource().getFeatures());
}

const overloadedCableStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'orange',
        width: 2
    })
});

const normalCableStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'green',
        width: 2
    })
});

const underloadedCableStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'blue',
        width: 2
    })
});


/*function playData() {
    const networkFeatures = vectorLayer.getSource().getFeatures();
    for(let i = 0; i < 24; i++){
        networkFeatures.forEach(function(feature) {
            if(feature.properties.type === 'underground_cable' && feature.properties.realTimeData) {
                const reading = feature.properties.realTimeData[i];
                if
            }
        })
    }
}*/

console.log(vectorLayer.getSource().getFeatures());
