'use strict';

//Actions to be taken when the app fully loads
window.onload = function() {
    const modal = document.getElementById('welcome-modal');
    modal.modalButtonClicked(); //This activates the modal
    //disabling Upload button until the file is checked
    document.getElementById('btnModalPositive').disabled = true;

    //Validate the GeoJSON file once it's uploaded
    const fileUploader = document.querySelector('px-file-upload');
    fileUploader.addEventListener('px-file-upload-files-changed', function() {
        validateFile()
    });

    //Uploading the GeoJSON file once it is validated
    modal.addEventListener('btnModalPositiveClicked', function() {
        uploadFile();
    });

    document.getElementById('reset-network').style.cursor = 'not-allowed'; //Disabling the Reset Network button
    document.getElementById('overlay').style.display = 'none'; //Hiding the initial overlay once the app loads
    document.querySelector('px-spinner').finished = true; //Hiding the loading spinner once the app loads
};

let geojsonObject; //The object that will store the loaded GeoJSON

let styleCache = {}; //An object to store the feature styles for efficiency
let vectorLayer; //Declaring the vectorLayer here so that it can be used by all the functions

//A function that is used to select the appropriate style for the feature based on its type
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

//A function to generate generic network information in the application's sidebar
function generateInfo(vectorLayer) {
    const numberOfFeatures = vectorLayer.getSource().getFeatures().length;
    document.getElementById('total-features').innerHTML = `Total Features: ${numberOfFeatures}`;
    const networkFeatures = geojsonObject.features;
    let servicePointCounter = 0;
    let cableCounter = 0;
    let stationCounter = 0;

    //This iterates through all the GeoJSON features and tracks how many of each there are
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

    document.getElementById('total-service-points').innerHTML = `Total Service Points: ${servicePointCounter}`;
    document.getElementById('total-cables').innerHTML = `Total Cables: ${cableCounter}`;
    document.getElementById('total-gen-stations').innerHTML = `Total Generating Stations: ${stationCounter}`;
}

//This function uses the GeoJSON stored in the geojsonObject by uploadFile() to put features on the Openlayers map
function createDataSource() {
    let vectorSource = new ol.source.Vector({ //This variable contains the data
        features: (new ol.format.GeoJSON()).readFeatures(geojsonObject, {
            featureProjection: 'EPSG:3857'
        })
    });

    vectorLayer = new ol.layer.Vector({ //Creating a layer with the above data
        source: vectorSource,
        style: styleFunction
    });

    map.addLayer(vectorLayer); //Adding the layer to the Openlayers map
    map.getView().fit(vectorSource.getExtent(), map.getSize()); //Updating the map's extents to fit all the data

    //Generating an information box at the top of the application
    document.getElementById('action-alert').style.display = 'block';
    document.getElementById('action-alert').message = 'The GeoJSON network file has been uploaded successfully. Now you ' +
        'can interact with the map and its features, as well as view generic network information in the sidebar. If ' +
        'you have a JSON file with real-time data, you can upload it using the Upload Real-Time Data button.';
    document.getElementById('network-legend').style.display = 'block';

    generateInfo(vectorLayer);
}

//Enabling the Upload button if a file has been selected
function validateFile() {
    if (document.querySelector('px-file-upload').files.length > 0) {
        document.getElementById('btnModalPositive').disabled = false;
    } else {
        document.getElementById('btnModalPositive').disabled = true;
    }
}

//Parsing the selected file using the native FileReader
function uploadFile() {
    const file = document.querySelector('px-file-upload').files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const fileContents = e.target.result;
        geojsonObject = JSON.parse(fileContents);
        createDataSource();
    };
    reader.readAsText(file, 'UTF-8');
}

//A function to link the real-time JSON data to the static GeoJSON network. If a feature has real-time data,
//its GeoJSON is updated by adding a 'realTimeData' key to its properties with the value being an array of real-time
//voltage readings
function linkRealTimeData(data) {
    let features = vectorLayer.getSource().getFeatures();
    let realTimeFeatures = data.data;

    //Going through the GeoJSON features and adding a realTimeData key to its properties if the feature's ID appears
    //in the real-time JSON data.
    features.forEach(function(feature) {
        let featureID = feature.get('id');
        if(realTimeFeatures[featureID] !== undefined) {
            let realTimeReadings = realTimeFeatures[featureID];
            feature.set('realTimeData', realTimeReadings['readings']);
        }
    });
    //Disabling the slider once the data has been linked. It is enabled once the user presses Play
    document.getElementById('slider-container').style.visibility = 'visible';
    document.querySelector('px-slider').disabled = true;

    //Once the data is linked, an information box is shown which tells the user what they've done.
    document.getElementById('real-time-alert').style.display = 'block';
    document.getElementById('real-time-alert').message = 'The real-time network readings have been uploaded and linked ' +
        'to the static network successfully. You may now play through the data and see how the network changes. The ' +
        'slider at the bottom of the map can be used to go to specific hours in the day, and the Reset Network button ' +
        'can be used to return the network to its original state';
}

let realTimeData; //A variable to store the real-time JSON data that is uploaded

//A function to parse the JSON data that is uploaded and store it in the above realTimeData variable
function uploadRealTimeData() {
    const file = document.querySelectorAll('px-file-upload')[1].files[0];
    const reader = new FileReader();
    let realTimeContents;

    //Parses the JSON file contents and links it to the existing network
    reader.onload = function(e) {
        realTimeContents = e.target.result;
        realTimeData = JSON.parse(realTimeContents);
        linkRealTimeData(realTimeData);

        //Disabling the Upload Real-Time Data button once JSON data has been uploaded
        document.getElementById('real-time-data-upload').disabled = true;
        document.getElementById('real-time-data-upload').style.cursor = 'not-allowed';
    };

    reader.readAsText(file, 'UTF-8');
}

//A function to show the file-loader once the user clicks the Upload Real-Time Data button
function parseRealTimeData() {
    const modal = document.getElementById('real-time-data-modal');
    //Since there are 2 instances of the px-file-upload element, we need to use document.querySelectorAll() to reference
    //the correct DOM element.
    const realTimeFileUpload = document.querySelectorAll('px-file-upload')[1];
    modal.modalButtonClicked();
    document.querySelectorAll('#btnModalPositive')[1].disabled = true;

    realTimeFileUpload.addEventListener('px-file-upload-files-changed', function() {
        if(realTimeFileUpload.files.length > 0) {
            document.querySelectorAll('#btnModalPositive')[1].disabled = false;
        }
    });

    modal.addEventListener('btnModalPositiveClicked', function() {
        uploadRealTimeData();
    });
}

//Defining the styles for under-loaded, over-loaded and normal cables.
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

//A function to calculate the average network voltage at the given hour
function calculateAverageVoltage(hour) {
    const networkFeatures = vectorLayer.getSource().getFeatures();
    let voltageValues = [];

    //Iterates over all the network features and extracts the voltage reading at the given hour
    networkFeatures.forEach(function(feature) {
        if(feature.get('type') === 'underground_cable' && feature.get('realTimeData')) {
            voltageValues.push(feature.get('realTimeData')[hour]);
        }
    });
    //Calculate the average voltage of all the cables
    const voltageSum = voltageValues.reduce(function(a, b) {
        return a + b;
    });

    return Math.round(voltageSum / voltageValues.length);
}

//A function to update the network feature styles when the slider is used to go to a specific hour
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

//A function to close the provided legend which appears on the top left of the map.
function closeLegend(legend) {
    document.getElementById(legend).style.display = 'none';
}

//The main function to play through a whole day's worth of data. The feature styles defined above are used to style the
//network features based on their voltage readings.
function playData() {
    const networkFeatures = vectorLayer.getSource().getFeatures();
    const alertMessage = document.getElementById('network-alert');
    const slider = document.querySelector('px-slider');
    slider.disabled = false;
    alertMessage.style.display = 'block';

    //Disabling the Reset Network button while the play-through is active
    document.getElementById('reset-network').disabled = true;
    document.getElementById('reset-network').style.cursor = 'not-allowed';

    //Closing the original network legend and displaying the real-time data legend instead.
    closeLegend('network-legend');
    document.getElementById('real-time-legend').style.display = 'block';
    document.getElementById('network-log-button').style.display = 'none';

    //The for loop mimics a 24-hour play-through. At each hour it updates the alert message in the sidebar with the
    //current network information, as well as the slider. The features that have a real-time component have their
    //styles updated based on their voltage reading at the current hour.
    for(let i = 0; i < 25; i++){
        setTimeout(function() { //setTimeout is used here to update the map every 2 seconds.
            alertMessage.message = `Current hour: ${i} | Average current voltage: ${calculateAverageVoltage(i)} kV.`;
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

            //Once the play-through finishes, the Reset Network and Generate Network Log buttons are enabled.
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

//This is executed when Reset Network is clicked. It returns the network styling to its original format, as well as
//resets the slider to 0.
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

//Creating a networkInfo.txt file with the provided data after the user clicks Generate Network Log. This creates a
//download link at the bottom of the sidebar, which opens a default 'save file' window.
function generateNetworkLogFile(text) {
    const data = new Blob([text], {type: 'text/plain'});

    const file = window.URL.createObjectURL(data);

    const link = document.getElementById('downloadlink');
    link.href = file;
    document.getElementById('network-info-text').style.display = 'block';
}

//A style for a connected cable
const connectedStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'yellow',
        width: 2
    })
});

//Running a connectivity analysis on the provided transformer. This goes through all underground cables and looks at
//which cables have the same starting coordinates as the transformer's location
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
                    setTimeout(function() { //The cable is turned yellow for 5 seconds
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

//A function to create the network information to be passed to the generateNetworkLogFile as a string.
//The network information contains the amount of all unique features, the connectivity analysis of the transformers
//and the average cable voltage readings for each hour over 24 hours.
function generateNetworkInformation() {
    const networkFeatures = vectorLayer.getSource().getFeatures();
    let infoString = ''; //A variable to store the information string
    let uniqueFeatures = {}; //An object to contain all unique features and their quantities
    let stepDownTransformers = []; //An array to contain all step-down transformers as Openlayers features
    let stepDownTransformerIDs = []; //An array to contain all step-down transformers' GeoJSON ID's
    let connectivityObject = {}; //An object to contain the step-down transformers as keys and the connected cables as
                                 //as the values.

    //Storing all unique network features
    networkFeatures.forEach(function(feature) {
        //Storing step-down transformers separately for connectivity analysis later on
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

    //Appending all unique network features and their quantities to the information string
    Object.keys(uniqueFeatures).forEach(function(key) {
        infoString += `\r\n ${key}: ${uniqueFeatures[key]}`;
    });

    //A connectivity analysis is ran for each step-down transformer in the network, with the analysis result being
    //added to the connectivityObject defined above.
    stepDownTransformers.forEach(function(transformer, index) {
        connectivityObject[stepDownTransformerIDs[index]] = runConnectivityAnalysis(transformer, 'info');
    });

    //The contents of the connectivityObject are appended to the information string
    infoString += '\r\n\r\n' + 'Connectivity analysis for the network\'s Step-Down Transformers:';
    Object.keys(connectivityObject).forEach(function(key) {
        infoString += `\r\n ${key}: ${connectivityObject[key]}`;
    });

    //Average voltages for each hour are calculated and stored in the averageVoltages array below. The result is then
    //appended to the information string.
    let averageVoltages = [];
    for(let i = 0; i<25; i++) {
        let averageNetworkVoltage = calculateAverageVoltage(i);
        averageVoltages.push(averageNetworkVoltage);
    }

    infoString += `\r\n\r\n Average voltages over 24 hours (kV): ${averageVoltages}`;

    //Now that the information string has been created, the network log file can be created.
    generateNetworkLogFile(infoString)
}

function hideLogText() {
    document.getElementById('network-info-text').style.display = 'none'
}
