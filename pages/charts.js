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
    "dojox/charting/plot2d/ClusteredColumns",
    "dojox/charting/plot2d/Scatter",
    "dojox/charting/plot2d/Markers",
    "dojox/charting/plot2d/Areas",
    "dojox/charting/SimpleTheme",
    "dojox/charting/themes/common",
    "dojox/charting/widget/SelectableLegend",
    "dojox/charting/axis2d/Default",
  ], (esriConfig, FeatureTable, View, WebMap, Portal, FeatureLayer, Chart, Bars, Lines, ClusteredColumns, Scatter, Markers, Areas, SimpleTheme, theme, SelectableLegend) => {
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
            editingEnable: false,
        })
        return displayedTable;
    }

    /* Changes the displayed table and changes the options for the attribute selections*/
    async function changeLayer(){
        let selectedValue = document.getElementById("tableSelect").value;
        document.getElementById("tableContainer").innerHTML = null;
        featureTable(selectedValue);
        populateAllAttributes(selectedValue)
        generateInitialGraphOnChange();
        setInformativeText();
    }
    
    /* Adds the options to the select data table */
    function populateLayer(){
        const selection = document.getElementById("tableSelect");
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
            changeLayer();
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
        if(document.getElementById("aggregationSelect").value == 'none'){
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
        if(document.getElementById("aggregationSelect").value == 'none'){
            myQuery = {
                where: "1=1",
                outFields: [document.getElementById("attributesX").value].concat(outArray)
            }
        }else{
            myQuery = {
                where: "1=1",
                groupByFieldsForStatistics: [document.getElementById("attributesX").value],
                outStatistics: [{
                        "statisticType": document.getElementById("aggregationSelect").value,
                        "onStatisticField": outArray, 
                        "outStatisticFieldName": outArray
                    },
                ]
            }
        }
        return displayedLayer.queryFeatures(myQuery)
    }

    /* Returns the name for the Yaxis */
    function YaxisTitleMaker(featureSet){
        let titleYaxis = new Array(featureSet.fields.length - 1);
        if(document.getElementById("aggregationSelect").value == "none"){
            for (let i = 1; i < featureSet.fields.length; i++){
                titleYaxis[i -1] = featureSet.fields[i].name;
            }
        }else{
            titleYaxis[0] = featureSet.fields[0].name;
        }
        return titleYaxis
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
                let titleYaxis = YaxisTitleMaker(featureSet);
                switch(type)
                {
                    case "Lines":
                        chart.addAxis("x", {title: document.getElementById("attributesX").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {title: titleYaxis, vertical: true});
                        break;
                    case "ClusteredColumns":
                        chart.addAxis("x", {title: document.getElementById("attributesX").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {title: titleYaxis, vertical: true, min:0});
                        break;
                    /*case "Bars":
                        break;
                    */
                    case "Scatter":
                        chart.addAxis("x", {title: document.getElementById("attributesX").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {title: titleYaxis, vertical: true});
                        break;
                    case "Markers":
                        chart.addAxis("x", {title: document.getElementById("attributesX").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {title: titleYaxis, vertical: true});                    
                        break;
                    case "Areas":
                        chart.addAxis("x", {title: document.getElementById("attributesX").value, titleOrientation: "away", labels: xAxisLabels, minorTicks:!isUsingLabels, majorTicks:!isUsingLabels});
                        chart.addAxis("y", {title: titleYaxis, vertical: true, min:0});
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
                document.getElementById("chart").innerHTML = err;
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
            document.getElementById("chart").innerHTML = err;
        }
        
    }

    /* Adds the options to the attribute selectors */
    function populateAttribute(selectedValue, selector){
        selector.innerHTML = null;
        let url = "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/"+ selectedValue +"?f=pjson";
        return jQuery.getJSON(url, function(data){
            for (let i = 0; i < data.fields.length; i++){
                selector.innerHTML += "<option value='"+ data.fields[i].name +"'>"+ data.fields[i].name +"</option>";         
            }
        });
    }

    /* Calls populateAttribute for every attribute and returns the array of Promise */
    function populateAllAttributes(selectedValue){
        return new Promise(function(resolve, reject){
            let arrayOfPromise = [document.getElementsByClassName("attributesY").length + 1]
            arrayOfPromise[0] = populateAttribute(selectedValue, document.getElementById("attributesX"))
            for(let i = 1; i < document.getElementsByClassName("attributesY").length + 1; i++){
                arrayOfPromise[i] = populateAttribute(selectedValue, document.getElementsByClassName("attributesY")[i-1]);
            }
            Promise.all(arrayOfPromise).then(function(){resolve()})
        })  
    }

    /* Adds a new Y attribute when clicking on "+" button. calls populate on it */
    function addY(){
        document.getElementById("YAttributesDiv").innerHTML += '<a class="attrYString">Y<sub>' + (document.getElementsByClassName("attributesY").length + 1) + '</sub>:</a><select class="attributesY esri-select"></select> '
        populateAttribute(document.getElementById("tableSelect").value, document.getElementsByClassName("attributesY")[document.getElementsByClassName("attributesY").length - 1]);
    }

    /* Removes a Y attribute (there can't be less than 1) when clicking on "-" */
    function removeY(){
        if(document.getElementsByClassName("attributesY").length > 1){
            document.getElementsByClassName("attributesY")[document.getElementsByClassName("attributesY").length - 1].remove();
            document.getElementsByClassName("attrYString")[document.getElementsByClassName("attrYString").length - 1].remove();
        }
    }

    /* You can choose the default chart to be displayed for each Table */
    function setFieldsForChart(){
        var fieldNameY = "";
        var fieldNameX = "";
        var aggregation = "none";
        switch(document.getElementById("tableSelect").value){
            //IMLNU_Table1_SyntheseFI
            case "13":
                fieldNameY = "mlnu_tot";
                fieldNameX = "id_pe";
                break;
            //IMLNU_Table2_SyntheseR
            case "14":
                fieldNameY = "mlnu_tot";
                fieldNameX = "id_pe";
                break;
            //Inter_Table1_Diagnostic
            case "15":
                fieldNameY = "haut_moy_regen_cm";
                fieldNameX = "id_pe";
                break;
            //Inter_Table2_Dendro
            case "16":
                fieldNameY = "dhp";
                fieldNameX = "id_pe";
                break;
            //Inter_Table3_Gaules
            case "17":
                fieldNameY = "frequence";
                fieldNameX = "essence";
                aggregation = "count";
                break;
            //Inter_Table4_Regen
            case "18":
                fieldNameY = "objectid";
                fieldNameX = "essence";
                aggregation = "count";
                break;
            //Inter_Table5_Arbre
            case "19":
                fieldNameY = "haut_m";
                fieldNameX = "id_pe";
                break;
            //Inter_Table6_EspIndicatrices
            case "20":
                fieldNameY = "objectid";
                fieldNameX = "espece";
                aggregation = "count";
                break;
            //Inter_Table7_Calcul
            case "21":
                fieldNameY = "st_tot";
                fieldNameX = "id_pe";
                break;
            //QualRebois_Table1_A
            case "22":
                fieldNameY = "compact_faible";
                fieldNameX = "id_pe";
                aggregation = "none";  
                break;
            //QualRebois_Table1_BC
            case "23":
                fieldNameY = "plants_rebois_c";
                fieldNameX = "id_pe";
                break;
            //QualRebois_Table3_Grappe
            case "24":
                fieldNameY = "id_pe";
                fieldNameX = "plant_reboise";
                aggregation = "count";
                break;
            //Regen_Table1_CD
            case "25":
                fieldNameY = "haut_tige_avenir_cm";
                fieldNameX = "id_pe";
                break;
            //Regen_Table2_Denombre
            case "26":
                fieldNameY = "nb_sab_2";
                fieldNameX = "id_pe";
                break;
            //Regen_Table3_Recouvrement
            case "27":
                fieldNameY = "recouv";
                fieldNameX = "id_micro";
                aggregation = "avg";
                break;
            //Regen_Table4_Veterans
            case "28":
                fieldNameY = "nb_vet_bop";
                fieldNameX = "id_pe";
                break;
            //Regen_Table5_Calcul
            case "29":
                fieldNameY = "moy_haut_tige_avenir_cm";
                fieldNameX = "id_pe";
                break;
            //SuiviPlant_Table1_TigeAvenir
            case "30":
                fieldNameY = "h_couv_cm";
                fieldNameX = "id_pe";
                break;
            //SuiviPlant_Table2_Denombre
            case "31":
                fieldNameY = "res";
                fieldNameX = "id_pe";
                break;
            //SuiviPlant_Table3_Recouvrement
            case "32":
                fieldNameY = "recouv";
                fieldNameX = "espece";
                aggregation = "avg";
                break;
            //SuiviPlant_Table4_Veterans
            case "33":
                fieldNameY = "nb_vet_bop";
                fieldNameX = "id_pe";
                break;

        }
        document.getElementById("aggregationSelect").value = aggregation;
        // Waits for the "onChange" to apply then changes the fields and displays the chart.
        return new Promise(async function(resolve, reject){
            await aggregationSelectOnChange().then(function(){
                document.getElementsByClassName("attributesY")[0].value = fieldNameY;
                document.getElementById("attributesX").value = fieldNameX;
            })
            resolve();
        });
    }

    function setInformativeText(){
        var informativeText = "";
        switch(document.getElementById("tableSelect").value){
            //IMLNU_Table1_SyntheseFI
            case "13":
                informativeText = "";
                break;
            //IMLNU_Table2_SyntheseR
            case "14":
                informativeText = "";
                break;
            //Inter_Table1_Diagnostic
            case "15":
                informativeText = "";
                break;
            //Inter_Table2_Dendro
            case "16":
                informativeText = "";
                break;
            //Inter_Table3_Gaules
            case "17":
                informativeText = "";
                break;
            //Inter_Table4_Regen
            case "18":
                informativeText = "";
                break;
            //Inter_Table5_Arbre
            case "19":
                informativeText = "";
                break;
            //Inter_Table6_EspIndicatrices
            case "20":
                informativeText = "";
                break;
            //Inter_Table7_Calcul
            case "21":
                informativeText = "";
                break;
            //QualRebois_Table1_A
            case "22":
                informativeText = "";
                break;
            //QualRebois_Table1_BC
            case "23":
                informativeText = "";
                break;
            //QualRebois_Table3_Grappe
            case "24":
                informativeText = "";
                break;
            //Regen_Table1_CD
            case "25":
                informativeText = "";
                break;
            //Regen_Table2_Denombre
            case "26":
                informativeText = "";
                break;
            //Regen_Table3_Recouvrement
            case "27":
                informativeText = "";
                break;
            //Regen_Table4_Veterans
            case "28":
                informativeText = "";
                break;
            //Regen_Table5_Calcul
            case "29":
                informativeText = "";
                break;
            //SuiviPlant_Table1_TigeAvenir
            case "30":
                informativeText = "";
                break;
            //SuiviPlant_Table2_Denombre
            case "31":
                informativeText = "";
                break;
            //SuiviPlant_Table3_Recouvrement
            case "32":
                informativeText = "";
                break;
            //SuiviPlant_Table4_Veterans
            case "33":
                informativeText = "";
                break;
        }
        document.getElementById("tableTextInformation").innerHTML = informativeText;
    }

    /* Builds a default chart when changing the selected layer */
    async function generateInitialGraphOnChange(){
        document.getElementById("type").value = "ClusteredColumns";
        document.getElementById("attributesX").value = "id_pe";
        await setFieldsForChart();
        displayChart()
    }

    /* Changes the fields for the users when changing the aggregationSelect field */
    async function aggregationSelectOnChange(){
        let aggrSelect = document.getElementById("aggregationSelect");
        if(aggrSelect.value == 'none'){
            document.getElementById("attrXString").innerHTML = 'X:';
            document.getElementById("YAttributesDiv").innerHTML = '<a class="attrYString">Y<sub>1</sub>:</a><select class="attributesY esri-select"></select>';
            for(const button of [document.getElementById("addYButton"), document.getElementById("removeYButton")]){
                button.disabled = false;
                button.style.backgroundColor = "#0079c1";
                button.style.borderColor = "#000000"
            }
        }else{
            document.getElementById("attrXString").innerHTML = 'Group by:';
            document.getElementById("YAttributesDiv").innerHTML = '<a class="attrYString">'+ aggrSelect.options[aggrSelect.selectedIndex].innerHTML + ' attribute:</a><select class="attributesY esri-select"></select>';
            for(const button of [document.getElementById("addYButton"), document.getElementById("removeYButton")]){
                button.disabled = true;
                button.style.backgroundColor = "gray";
                button.style.borderColor = "gray"
            }
        }
        
        return new Promise(async function(resolve, reject) {
            await populateAllAttributes(document.getElementById("tableSelect").value)
            resolve()
        });
    }

    //Fetches the different available tables for the layer select
    populateLayer();
    //Event listeners for the buttons and more
    document.getElementById("tableSelectButton").addEventListener("click", changeLayer);
    document.getElementById("plotChartButton").addEventListener("click", displayChart);
    document.getElementById("addYButton").addEventListener("click", addY);
    document.getElementById("removeYButton").addEventListener("click", removeY);
    document.getElementById("aggregationSelect").addEventListener("change", aggregationSelectOnChange);     
});


