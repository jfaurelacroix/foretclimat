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
    "dojox/charting/widget/SelectableLegend",
    "dojox/charting/axis2d/Default",
  ], (esriConfig, FeatureTable, View, WebMap, Portal, FeatureLayer, Chart, Bars, Lines, Columns, Scatter, Markers, Areas, SimpleTheme, theme, SelectableLegend) => {
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

    
    var displayedTable;

    var displayedLayer;

    /* Changes to and returns the selected FeatureLayer */
    var featureLayer = (selectedId) => {
        displayedLayer = new FeatureLayer({
            url: layerBaseUrl + selectedId
        })
        return displayedLayer;
    }

    /* Changes to and returns the selected FeatureTable */
    var featureTable = (selectedId) => {
        displayedTable = new FeatureTable({
            view: view,
            layer: featureLayer(selectedId),
            container: document.getElementById("tableContainer"),
            editingEnable: false
        })
        return displayedTable;
    }
    

    /* Changes the displayed table and changes the options for the attribute selections*/
    function changeLayer(){
        let selectedValue = document.getElementById("layerSelect").value;
        document.getElementById("tableContainer").innerHTML = null;
        featureTable(selectedValue);
        populateAllAttributes(selectedValue);
    }
    
    /* Adds the options to the select data table */
    function populateLayer(){
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

    /* Initialize the chart variable (will be overridden each time a graph is created) */
    var chart = new Chart("chart");
    var myTheme = new SimpleTheme({
		colors: [
			"#A4CE67",
			"#739363",
			"#6B824A",
			"#343434",
			"#636563"
		]
	});
    chart.setTheme(myTheme);
    var selectableLegend = new SelectableLegend({chart: chart, outline: true}, "selectableLegend");
    
    /* Formats the data to plot with dojox charting */
    function createSerie(features){
        let attrYArray = document.getElementsByClassName("attributesY");
        let mySeries = new Array(attrYArray.length);
        for (let i = 0; i < attrYArray.length; i++){
            mySeries[i] = new Array(features.length);
            for(let k = 0; k < features.length; k++){
                mySeries[i][k] = {
                    x : features[k].attributes[document.getElementById("attributesX").value],
                    y : features[k].attributes[attrYArray[i].value]
                }
            }
        }
        for(const array of mySeries){
            array.sort(function(a,b){
                if(a.x < b.x) return -1;
                if(a.x > b.x) return 1;
                return 0;
            })
        }
        return mySeries;
    }

    /* Changes fields to integers and returns which integer corresponds to which string */
    function transformStringsToInt(featureSet){
        let uniqueStringArray = [];
        let labels = [];
        if(document.getElementById("aggregation").value == 'none'){
            if(featureSet.fields[0].type == 'string'){
                for (let i = 0; i < featureSet.features.length; i++){
                    let valueOfAttribute = featureSet.features[i].attributes[document.getElementById("attributesX").value];
                    if(valueOfAttribute == '' || valueOfAttribute == null){
                        valueOfAttribute = 'NULL'
                    }
                    if(!uniqueStringArray.includes(valueOfAttribute)){
                        uniqueStringArray.push(valueOfAttribute);
                        labels.push({value: uniqueStringArray.length - 1, text: valueOfAttribute});
                        featureSet.features[i].attributes[document.getElementById("attributesX").value] = uniqueStringArray.length - 1;
                    }else{
                        featureSet.features[i].attributes[document.getElementById("attributesX").value] = uniqueStringArray.indexOf(valueOfAttribute );
                    }
                    
                }
            }
        }else{
            if(featureSet.fields[1].type == 'string'){
                for (let i = 0; i < featureSet.features.length; i++){
                    let valueOfAttribute = featureSet.features[i].attributes[document.getElementById("attributesX").value];
                    if(valueOfAttribute == '' || valueOfAttribute == null){
                        valueOfAttribute = 'NULL'
                    }
                    if(!uniqueStringArray.includes(valueOfAttribute)){
                        uniqueStringArray.push(valueOfAttribute);
                        labels.push({value: uniqueStringArray.length - 1, text: valueOfAttribute});
                        featureSet.features[i].attributes[document.getElementById("attributesX").value] = uniqueStringArray.length - 1;
                    }else{
                        featureSet.features[i].attributes[document.getElementById("attributesX").value] = uniqueStringArray.indexOf(valueOfAttribute );
                    }
                    
                }
            }
        }
        return labels;
    }

    /* Query the data for the chart being created */
    function queryForChart(){
        let myQuery;
        let outArray = [document.getElementsByClassName("attributesY").length]
        for (let i = 0; i < document.getElementsByClassName("attributesY").length; i++){
            outArray[i] = document.getElementsByClassName("attributesY")[i].value;
        }
        if(document.getElementById("aggregation").value == 'none'){
            myQuery = {
                where: "1=1",
                outFields: [document.getElementById("attributesX").value].concat(outArray)
            }
        }else{
            myQuery = {
                where: "1=1",
                groupByFieldsForStatistics: [document.getElementById("attributesX").value],
                outStatistics: [{
                        "statisticType": document.getElementById("aggregation").value,
                        "onStatisticField": outArray, 
                        "outStatisticFieldName": outArray
                    },
                ]
            }
        }
        return displayedLayer.queryFeatures(myQuery)
    }

    /* Creates a new chart from the parameters */
    function createChart(type){
        chart.destroy();
        chart = new Chart("chart");
        chart.setTheme(myTheme);
        chart.addPlot("default",{
            // Add the chart type
            type: type,
            gap: 20,
            hAxis: "x",
            vAxis: "y"
        });

        queryForChart().then((featureSet) => {
            try{
                let xAxisLabels = transformStringsToInt(featureSet);
                let myData = createSerie(featureSet.features);
                let isUsingLabels = true;
                if(xAxisLabels.length == 0) {
                    xAxisLabels = null;
                    isUsingLabels = false;
                }; 
                switch(type)
                {
                    case "Lines":
                        chart.addAxis("x", {title: document.getElementById("attributesX").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {vertical: true});
                        break;
                    case "Columns":
                        chart.addAxis("x", {title: document.getElementById("attributesX").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", { vertical: true, min:0});
                        break;
                    /*case "Bars":
                        break;
                    */
                    case "Scatter":
                        chart.addAxis("x", {title: document.getElementById("attributesX").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {vertical: true});
                        break;
                    case "Markers":
                        chart.addAxis("x", {title: document.getElementById("attributesX").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {vertical: true});                    
                        break;
                    case "Areas":
                        chart.addAxis("x", {title: document.getElementById("attributesX").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {vertical: true, min:0});
                }
                let index = 1
                for(let el of myData){
                    chart.addSeries("Serie"+index, el);
                    index += 1;
                }
                chart.render();
                selectableLegend.chart = chart;
                selectableLegend.refresh();
            } catch (err){
                document.getElementById("chart").innerHTML = err.stack;
            }
            
        })
    }
    
    /* Validates that it can create a graph and creates it */
    function displayChart(){
        let type = document.getElementById("type").value;
        // Field validation
        try {
            for(let el of document.getElementsByClassName("attributesY")){
                if(document.getElementById("attributesX").value == el.value) throw "Impossible. Même attribut";
            }
            createChart(type);
        } catch(err) {
            document.getElementById("chart").innerHTML = err.stack;
        }
        
    }

    /* Adds the options to the attribute selectors */
    function populateAttribute(selectedValue, selector){
        selector.innerHTML = null;
        let url = "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/"+ selectedValue +"?f=pjson";
        jQuery.getJSON(url, function(data){
            for (let i = 0; i < data.fields.length; i++){
                selector.innerHTML += "<option value='"+ data.fields[i].name +"'>"+ data.fields[i].name +"</option>";         
            }
        });
    }

    function populateAllAttributes(selectedValue){
    populateAttribute(selectedValue, document.getElementById("attributesX"))
    for(let el of document.getElementsByClassName("attributesY")){
        populateAttribute(selectedValue, el);
    }
    }

    function addY(){
        document.getElementById("YAttributesDiv").innerHTML += '<a class="attrYString">Y<sub>' + (document.getElementsByClassName("attributesY").length + 1) + '</sub>:</a><select class="attributesY esri-select"></select> '
        console.log(document.getElementsByClassName("attributesY")[document.getElementsByClassName("attributesY").length - 1])
        populateAttribute(document.getElementById("layerSelect").value, document.getElementsByClassName("attributesY")[document.getElementsByClassName("attributesY").length - 1]);
    }


    featureTable("13")
    populateAllAttributes("13");
    populateLayer();
    document.getElementById("layerSelectButton").addEventListener("click", changeLayer);
    document.getElementById("plotChartButton").addEventListener("click", displayChart);
    document.getElementById("addYButton").addEventListener("click", addY);
    let aggrSelect = document.getElementById("aggregationSelect");
    aggrSelect.addEventListener("change", function() {
        if(aggrSelect.value == 'none'){
            document.getElementById("attrXString").innerHTML = 'X:';
            document.getElementById("YAttributesDiv").innerHTML = '<a class="attrYString">Y<sub>1</sub>:</a><select class="attributesY esri-select"></select>';
        }else{
            document.getElementById("attrXString").innerHTML = 'Group by:';
            document.getElementById("YAttributesDiv").innerHTML = '<a class="attrYString">'+ aggrSelect.options[aggrSelect.selectedIndex].innerHTML + ' attribute:</a><select class="attributesY" class="esri-select"></select>';
        }
        populateAllAttributes(document.getElementById("layerSelect").value);
    });
});


