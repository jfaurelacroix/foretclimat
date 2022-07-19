require([
    "esri/config",
    "esri/widgets/FeatureTable",
    "esri/views/View",
    "esri/WebMap",
    "esri/portal/Portal",
    "esri/layers/FeatureLayer",
    "dojox/charting/Chart",
    "dojox/charting/plot2d/Bars",
    "dojox/charting/plot2d/Lines",
    "dojox/charting/plot2d/Columns",
    "dojox/charting/plot2d/Scatter",
    "dojox/charting/plot2d/Markers",
    "dojox/charting/plot2d/Areas",
    "dojox/charting/SimpleTheme",
    "dojox/charting/themes/common",
    "dojox/charting/axis2d/Default",
  ], (esriConfig, FeatureTable, View, WebMap, Portal, FeatureLayer, Chart, Bars, Lines, Columns, Scatter, Markers, Areas, SimpleTheme, theme) => {
    esriConfig.portalUrl = "https://www.foretclimat.ca/portal";

    const myPortal = new Portal({
      url: esriConfig.portalUrl
    });
  
    /* The Portal WebMap */
    const map = new WebMap({
      portalItem: {
        // autocasts as new PortalItem()
        id: "8dacc82f02d94d24bb4a3c751ba4db34", // id is in the content page url
        portal: myPortal
      }
    });

    const view = new View({
        view: map,
        container: "viewDiv"
    })

    const layerBaseUrl = "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/"

    let displayedTable;

    let displayedLayer;

    let featureLayer = (selectedId) => {
        displayedLayer = new FeatureLayer({
            url: layerBaseUrl + selectedId
        })
        return displayedLayer;
    }

    let featureTable = (selectedId) => {
        displayedTable = new FeatureTable({
            view: view,
            layer: featureLayer(selectedId),
            container: document.getElementById("tableContainer"),
            editingEnable: false
        })
        return displayedTable;
    }
    

    function changeLayer(){
        let selectedValue = document.getElementById("layerSelect").value;
        document.getElementById("tableContainer").innerHTML = null;
        featureTable(selectedValue);
        populateAttributes(selectedValue);
    }
    
    function populateSelect(){
        const selection = document.getElementById("layerSelect");
        let url = "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer?f=pjson";
        jQuery.getJSON(url, function(data){
            if(data.tables != null){
                /*for (const layer of data.layers){
                    selection.innerHTML += "<option value='"+ layer.id +"'>"+ layer.name +"</option>"; 
                }*/
                for (const table of data.tables){
                    selection.innerHTML += "<option value='"+ table.id +"'>"+ table.name +"</option>";
                } 
            }
        });
    }

    let chart = new Chart("chart");
    let myTheme = new SimpleTheme({
		colors: [
			"#A4CE67",
			"#739363",
			"#6B824A",
			"#343434",
			"#636563"
		]
	});
    chart.setTheme(myTheme);

    function createSerie(features){
        let mySerie = new Array(features.length);
        for (let i = 0; i < features.length; i++){
            mySerie[i] = {
                x : features[i].attributes[document.getElementById("attributes1").value],
                y : features[i].attributes[document.getElementById("attributes2").value]
            }

        }
        mySerie.sort(function(a,b){
            if(a.x < b.x) return -1;
            if(a.x > b.x) return 1;
            return 0;
        })
        return mySerie;
    }

    function fieldsValidation(featureSet, chartType){
        let uniqueStringArray = [];
        let labels = [];
        if(document.getElementById("aggregation").value == 'none'){
            if(featureSet.fields[0].type == 'string'){
                for (let i = 0; i < featureSet.features.length; i++){
                    let valueOfAttribute = featureSet.features[i].attributes[document.getElementById("attributes1").value];
                    if(valueOfAttribute == '' || valueOfAttribute == null){
                        valueOfAttribute = 'NULL'
                    }
                    if(!uniqueStringArray.includes(valueOfAttribute)){
                        uniqueStringArray.push(valueOfAttribute);
                        labels.push({value: uniqueStringArray.length - 1, text: valueOfAttribute});
                        featureSet.features[i].attributes[document.getElementById("attributes1").value] = uniqueStringArray.length - 1;
                    }else{
                        featureSet.features[i].attributes[document.getElementById("attributes1").value] = uniqueStringArray.indexOf(valueOfAttribute );
                    }
                    
                }
            }
        }else{
            if(featureSet.fields[1].type == 'string'){
                for (let i = 0; i < featureSet.features.length; i++){
                    let valueOfAttribute = featureSet.features[i].attributes[document.getElementById("attributes1").value];
                    if(valueOfAttribute == '' || valueOfAttribute == null){
                        valueOfAttribute = 'NULL'
                    }
                    if(!uniqueStringArray.includes(valueOfAttribute)){
                        uniqueStringArray.push(valueOfAttribute);
                        labels.push({value: uniqueStringArray.length - 1, text: valueOfAttribute});
                        featureSet.features[i].attributes[document.getElementById("attributes1").value] = uniqueStringArray.length - 1;
                    }else{
                        featureSet.features[i].attributes[document.getElementById("attributes1").value] = uniqueStringArray.indexOf(valueOfAttribute );
                    }
                    
                }
            }
        }
        return labels;
    }

    function createChart(type){
        chart.destroy();
        chart = new Chart("chart");
        chart.setTheme(myTheme);
        chart.addPlot("default",{
            // Add the chart type
            type: type,
            hAxis: "x",
            vAvis: "y",
            gap: 20
        });

       
        let myQuery;
        if(document.getElementById("aggregation").value == 'none'){
            myQuery = {
                where: "1=1",
                outFields: [document.getElementById("attributes1").value, document.getElementById("attributes2").value]
            }
        }else{
            myQuery = {
                where: "1=1",
                groupByFieldsForStatistics: [document.getElementById("attributes1").value],
                outStatistics: [{
                        "statisticType": document.getElementById("aggregation").value,
                        "onStatisticField": document.getElementById("attributes2").value, 
                        "outStatisticFieldName": document.getElementById("attributes2").value
                    },
                ]
            }
        }
        displayedLayer.queryFeatures(myQuery).then((featureSet) => {
            try{
                let xAxisLabels = fieldsValidation(featureSet, type);
                let myData = createSerie(featureSet.features);
                let isUsingLabels = true;
                if(xAxisLabels.length == 0) {
                    xAxisLabels = null
                    isUsingLabels = false;
                }; 
                switch(type)
                {
                    case "Lines":
                        chart.addAxis("x", {title: document.getElementById("attributes1").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {title: document.getElementById("attributes2").value, vertical: true});
                        break;
                    case "Columns":
                        chart.addAxis("x", {title: document.getElementById("attributes1").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {title: document.getElementById("attributes2").value, vertical: true, min:0});
                        break;
                    /*case "Bars":
                        chart.addAxis("x", {title: document.getElementById("attributes1").value, titleOrientation: "away", min:0, });
                        chart.addAxis("y", {title: document.getElementById("attributes2").value, vertical: true});
                        break;
                    */
                    case "Scatter":
                        chart.addAxis("x", {title: document.getElementById("attributes1").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {title: document.getElementById("attributes2").value, vertical: true});
                        break;
                    case "Markers":
                        chart.addAxis("x", {title: document.getElementById("attributes1").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {title: document.getElementById("attributes2").value, vertical: true});
                        break;
                    case "Areas":
                        chart.addAxis("x", {title: document.getElementById("attributes1").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {title: document.getElementById("attributes2").value, vertical: true, min:0});
                        break;
                }
                chart.addSeries("data", myData);
                chart.render();
            } catch (err){
                document.getElementById("chart").innerHTML = err;
            }
            
        })
    }
    
    function displayChart(){
        let type = document.getElementById("type").value;
        try {
            if(document.getElementById("attributes1").value == document.getElementById("attributes2").value) throw "Impossible. Même attribut";
            createChart(type);
        } catch(err) {
            document.getElementById("chart").innerHTML = err;
        }
        
    }

    function populateAttributes(selectedValue){
        let attr1 = document.getElementById("attributes1");
        let attr2 = document.getElementById("attributes2");
        attr1.innerHTML = null;
        attr2.innerHTML = null;
        let url = "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/"+ selectedValue +"?f=pjson";
        jQuery.getJSON(url, function(data){
            for (let i = 0; i < data.fields.length; i++){
                attr1.innerHTML += "<option value='"+ data.fields[i].name +"'>"+ data.fields[i].name +"</option>";
                attr2.innerHTML += "<option value='"+ data.fields[i].name +"'>"+ data.fields[i].name +"</option>";
            }
        });
    }

    featureTable("13")
    populateAttributes("13")
    populateSelect();
    document.getElementById("layerSelectButton").addEventListener("click", changeLayer);
    document.getElementById("plotChart").addEventListener("click", displayChart);
    let aggrSelect = document.getElementById("aggregation");
    aggrSelect.addEventListener("change", function() {
        if(aggrSelect.value == 'none'){
            document.getElementById("attr1String").innerHTML = 'X:';
            document.getElementById("attr2String").innerHTML = 'Y:';
        }else{
            document.getElementById("attr1String").innerHTML = 'Group by:';
            document.getElementById("attr2String").innerHTML = aggrSelect.options[aggrSelect.selectedIndex].innerHTML + " attribute:";
        }
    });
    });


