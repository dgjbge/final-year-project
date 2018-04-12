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
    document.getElementById('reset-network').style.cursor = 'not-allowed';
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

    document.getElementById('action-alert').style.display = 'block';
    document.getElementById('action-alert').message = 'The GeoJSON network file has been uploaded successfully. Now you ' +
        'can interact with the map and its features, as well as view generic network information in the sidebar. If ' +
        'you have a JSON file with real-time data, you can upload it using the Upload Real-Time Data button.';
    document.getElementById('network-legend').style.display = 'block';
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
        document.getElementById('real-time-data-upload').disabled = true;
        document.getElementById('real-time-data-upload').style.cursor = 'not-allowed';
    };

    reader.readAsText(file, 'UTF-8');
}

function linkRealTimeData(data) {
    let features = vectorLayer.getSource().getFeatures();
    let realTimeFeatures = data.data;
    features.forEach(function(feature) {
        let featureID = feature.get('id');
        if(realTimeFeatures[featureID] !== undefined) {
            let realTimeReadings = realTimeFeatures[featureID];
            feature.set('realTimeData', realTimeReadings['readings']);
        }
    });
    document.getElementById('slider-container').style.visibility = 'visible';
    document.querySelector('px-slider').disabled = true;

    document.getElementById('real-time-alert').style.display = 'block';
    document.getElementById('real-time-alert').message = 'The real-time network readings have been uploaded and linked ' +
        'to the static network successfully. You may now play through the data and see how the network changes. The ' +
        'slider at the bottom of the map can be used to go to specific hours in the day, and the Reset Network button ' +
        'can be used to return the network to its original state';
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


function playData() {
    const networkFeatures = vectorLayer.getSource().getFeatures();
    const alertMessage = document.getElementById('network-alert');
    const slider = document.querySelector('px-slider');
    slider.disabled = false;
    alertMessage.style.display = 'block';
    document.getElementById('reset-network').disabled = true;
    document.getElementById('reset-network').style.cursor = 'not-allowed';
    closeLegend('network-legend');
    document.getElementById('real-time-legend').style.display = 'block';

    for(let i = 0; i < 25; i++){
        setTimeout(function() {
            alertMessage.message = 'Current hour: ' + i + ' | Average current voltage: ' + calculateAverageVoltage(i) + 'kV.';
            slider.value = i;
            networkFeatures.forEach(function(feature) {
                if(feature.get('type') === 'underground_cable' && feature.get('realTimeData')) {
                    const reading = feature.get('realTimeData')[i];
                    if(reading < 18) {
                        feature.setStyle(underloadedCableStyle);
                    } else if(reading < 25 && reading > 18) {
                        feature.setStyle(normalCableStyle);
                    } else {
                        feature.setStyle(overloadedCableStyle);
                    }
                }
            });

            if(i === 24) {
                document.getElementById('reset-network').disabled = false;
                document.getElementById('reset-network').style.cursor = 'pointer';
                document.getElementById('network-log-button').style.display = 'block';
            }
        }, 2000*i);
    }
    slider.addEventListener('value-changed', function(e) {
        updateNetwork(e.detail.value);
    })
}

function updateNetwork(hour) {
    const networkFeatures = vectorLayer.getSource().getFeatures();
    document.getElementById('network-alert').message = 'Current hour: ' + hour + ' | Average current voltage: ' +
        calculateAverageVoltage(hour) + 'kV.';

    networkFeatures.forEach(function(feature) {
        if(feature.get('type') === 'underground_cable' && feature.get('realTimeData')) {
            const reading = feature.get('realTimeData')[hour];
            if(reading < 18) {
                feature.setStyle(underloadedCableStyle);
            } else if(reading < 25 && reading > 18) {
                feature.setStyle(normalCableStyle);
            } else {
                feature.setStyle(overloadedCableStyle);
            }
        }
    });
}

function resetNetwork() {
    const networkFeatures = vectorLayer.getSource().getFeatures();
    const alertMessage = document.getElementById('network-alert');

    networkFeatures.forEach(function(feature) {
        if(feature.get('type') === 'underground_cable') {
            feature.setStyle(normalCableStyle);
        }
        document.querySelector('px-slider').value = 0;
        alertMessage.style.display = 'none';
    });
}

function calculateAverageVoltage(hour) {
    const networkFeatures = vectorLayer.getSource().getFeatures();
    let voltageValues = [];
    networkFeatures.forEach(function(feature) {
        if(feature.get('type') === 'underground_cable' && feature.get('realTimeData')) {
            voltageValues.push(feature.get('realTimeData')[hour]);
        }
    });
    const voltageSum = voltageValues.reduce(function(a, b) {
        return a + b;
    });

    return Math.round(voltageSum / voltageValues.length);
}

function closeLegend(legend) {
    document.getElementById(legend).style.display = 'none';
}

function generateNetworkInformation() {
    let infoString = '';
    const networkFeatures = vectorLayer.getSource().getFeatures();
    let uniqueFeatures = {};
    let stepDownTransformers = [];
    let stepDownTransformerIDs = [];
    let connectivityObject = {};

    networkFeatures.forEach(function(feature) {
        if(feature.get('type') === 'step_down_transformer') {
            stepDownTransformers.push(feature);
            stepDownTransformerIDs.push(feature.get('id'));
        }
        if(uniqueFeatures.hasOwnProperty(feature.get('type'))) {
            uniqueFeatures[feature.get('type')] += 1;
        } else {
            uniqueFeatures[feature.get('type')] = 1;
        }
    });

    infoString += 'All unique network features:';

    Object.keys(uniqueFeatures).forEach(function(key) {
        infoString += '\r\n' + key + ': ' + uniqueFeatures[key];
    });

    stepDownTransformers.forEach(function(transformer, index) {
        connectivityObject[stepDownTransformerIDs[index]] = runConnectivityAnalysis(transformer, 'info');
    });

    infoString += '\r\n\r\n' + 'Connectivity analysis for the network\'s Step-Down Transformers:';
    Object.keys(connectivityObject).forEach(function(key) {
        infoString += '\r\n' + key + ': ' + connectivityObject[key];
    });

    let averageVoltages = [];
    for(let i = 0; i<25; i++) {
        let averageNetworkVoltage = calculateAverageVoltage(i);
        averageVoltages.push(averageNetworkVoltage);
    }

    infoString += '\r\n\r\n' + 'Average voltages over 24 hours (kV): ' + averageVoltages;

    generateNetworkLogFile(infoString)
}
function generateNetworkLogFile(text) {
    const data = new Blob([text], {type: 'text/plain'});
    let file = null;

    file = window.URL.createObjectURL(data);

    const link = document.getElementById('downloadlink');
    link.href = file;
    document.getElementById('network-info-text').style.display = 'block';

}

function hideLogText() {
    document.getElementById('network-info-text').style.display = 'none'
}

const connectedStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'yellow',
        width: 2
    })
});

function runConnectivityAnalysis(transformer, usage) {
    const networkFeatures = vectorLayer.getSource().getFeatures();
    const transformerLocation = transformer.getGeometry().getCoordinates();
    const transformerLonLat = ol.proj.transform(transformerLocation, 'EPSG:3857', 'EPSG:4326');
    let connectedCables = [];

    networkFeatures.forEach(function(feature) {
        if(feature.get('type') === 'underground_cable') {
            let cableStart = feature.getGeometry().getCoordinates()[0];
            cableStart =  ol.proj.transform(cableStart, 'EPSG:3857', 'EPSG:4326');

            if(cableStart[0] === transformerLonLat[0] && cableStart[1] === transformerLonLat[1]) {
                if(usage === 'click') {
                    feature.setStyle(connectedStyle);
                    setTimeout(function() {
                        feature.setStyle(normalCableStyle);
                    }, 5000);
                } else {
                    connectedCables.push(feature.get('id'));
                }
            }
        }
    });
    return connectedCables;
}