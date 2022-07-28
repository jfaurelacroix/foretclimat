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
        generatePivotChart();
        setInformativeText();
    }
    
    /* Adds the options to the select data table */
    function populateLayer(){
        const selection = document.getElementById("tableSelect");
        let url = "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer?f=pjson";
        jQuery.getJSON(url, function(data){
            if(data.tables != null){
                selection.innerHTML += "<optgroup label='Tables'>";
                for (const table of data.tables){
                    selection.innerHTML += "<option value='"+ table.id +"'>"+ table.name +"</option>";
                }  
                selection.innerHTML += "</optgroup>";
                selection.innerHTML += "<optgroup label='Layers'>";
                for (const layer of data.layers){
                    selection.innerHTML += "<option value='"+ layer.id +"'>"+ layer.name +"</option>"; 
                } 
                selection.innerHTML += "</optgroup>";      
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
    function generatePivotChart(){
        myQuery = {
            where: "1=1",
            outFields: ['*']
        }
        let featureQuery = displayedLayer.queryFeatures(myQuery).then((data) => {
            google.load("visualization", "1", {packages:["corechart", "charteditor"]});
            $(function(){
                let input = new Array(data.features.length);
                for (let i = 0; i < data.features.length; i++){
                    input[i] = data.features[i].attributes;
                }
                var derivers = $.pivotUtilities.derivers;
                console.log(input)
                var renderers = $.extend($.pivotUtilities.renderers,
                    $.pivotUtilities.gchart_renderers);
                    $("#chart").pivotUI(input, {
                        renderers: renderers,
                        rendererOptions: { gchart: {width: 800, height: 600}},
                        rows: data.fields,
                        columns: data.fields
                    });
            });
        })
        
    }
    //Fetches the different available tables for the layer select
    populateLayer();
    //Event listeners for the buttons and more
    document.getElementById("tableSelectButton").addEventListener("click", changeLayer);
});


