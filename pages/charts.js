require([
    "esri/config",
    "esri/widgets/FeatureTable",
    "esri/views/View",
    "esri/WebMap",
    "esri/portal/Portal",
    "esri/layers/FeatureLayer",
  ], (esriConfig, FeatureTable, View, WebMap, Portal, FeatureLayer) => {
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
        setFieldsForChart();
        generatePivotChart();
        setInformativeText();
    }


    /* Adds the options to the select data table */
    function populateLayer(){
        const selection = document.getElementById("tableSelect");
        selection.innerHTML = null;
        let url = "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer?f=pjson";
        jQuery.getJSON(url, function(data){
            if(data.tables != null){
                for (const table of data.tables.concat(data.layers)){
                    if(table.name.includes(document.getElementById("tableCategorySelect").value) && table.name.startsWith(document.getElementById("tableInventorySelect").value)){
                        selection.innerHTML += "<option value='"+ table.id +"'>"+ table.name +"</option>";
                    }
                }  
            }
            changeLayer();
        });
        
    }

    var fieldNameX = [];
    var fieldNameY = [];
    var aggregation = "Count";
    var renderer = "Table";
    var aggregationAttribute = "";

    /* You can choose the default chart to be displayed for each Table */
    function setFieldsForChart(){
        fieldNameX = [];
        fieldNameY = [];
        aggregation = "Count";
        renderer = "Bar Chart";
        aggregationAttribute = "";
        switch(document.getElementById("tableSelect").value){
            //IMLNU_PS
            case "0":
                fieldNameX = ["bloc"];
                fieldNameY = ["annee"];
                aggregation = "Count";
                renderer = "Bar Chart";
                break;
            //IMLNU_Bloc
            case "1":
                fieldNameX = [];
                fieldNameY = ["bloc"];
                aggregation = "Average";
                aggregationAttribute = "SHAPE__Area";
                renderer = "Multiple Pie Chart";
                break;
            //Inter_PS
            case "2":
                fieldNameX = ["id_bloc"];
                fieldNameY = [];
                aggregation = "Count";
                renderer = "Bar Chart";
                break;
            //Inter_Bloc
            case "3":
                fieldNameX = [];
                fieldNameY = ["bloc"];
                aggregation = "Average";
                aggregationAttribute = "SHAPE__Area";
                renderer = "Bar Chart";
                break;
            //QualRebois_PS
            case "4":
                fieldNameX = ["id_bloc"];
                fieldNameY = ["realise"];
                aggregation = "Count";
                renderer = "Bar Chart";
                break;
            //QualRebois_Bloc
            case "5":
                fieldNameX = ["an_perturb"];
                fieldNameY = ["bloc"];
                aggregation = "Count";
                renderer = "Scatter Plot";
                break;
            //Recolte_PS
            case "6":
                fieldNameX = ["pe"];
                fieldNameY = ["annee"];
                aggregation = "Count";
                renderer = "Stacked Bar Chart";
                break;
            //Regen_PS
            case "7":
                fieldNameX = ["annee"];
                fieldNameY = [];
                aggregation = "Count";
                renderer = "Bar Chart";
                break;
            //Recolte_Bloc
            case "8":
                fieldNameX = ["annee"];
                fieldNameY = ["bloc"];
                aggregation = "Count";
                renderer = "Scatter Chart";
                break;
            //Regen_Bloc
            case "9":
                fieldNameX = ["bloc"];
                fieldNameY = ["annee"];
                aggregation = "Count";
                renderer = "Bar Chart";
                break;
            //SuiviPlant_PS
            case "10":
                fieldNameX = ["pe"];
                fieldNameY = ["annee"];
                aggregation = "Count";
                renderer = "Stacked Bar Chart";
                break;
            //SuiviPlant_Bloc
            case "12":
                fieldNameX = ["annee"];
                fieldNameY = ["an_origine"];
                aggregation = "Count";
                renderer = "Bar Chart";
                break;
            //IMLNU_Table1_SyntheseFI
            case "13":
                fieldNameX = [];
                fieldNameY = ["id_pe"];
                aggregation = "Sum";
                aggregationAttribute = "mlnu_tot";
                renderer = "Row Heatmap";
                break;
            //IMLNU_Table2_SyntheseR
            case "14":
                fieldNameX = ["id_pe"];
                fieldNameY = [];
                aggregation = "Sum";
                aggregationAttribute = "mlnu_tot";
                renderer = "Line Chart";
                break;
            //Inter_Table1_Diagnostic
            case "15":
                fieldNameX = ["chablis_partiel"];
                fieldNameY = [];
                aggregation = "Average";
                aggregationAttribute = "haut_moy_regen_cm"
                renderer = "Bar Chart";
                break;
            //Inter_Table2_Dendro
            case "16":
                fieldNameX = [];
                fieldNameY = ["essence"];
                aggregation = "Average";
                aggregationAttribute = "dhp"
                renderer = "Horizontal Bar Chart";
                break;
            //Inter_Table3_Gaules
            case "17":
                fieldNameX = ["classe"];
                fieldNameY = ["essence"];
                aggregation = "Count";
                renderer = "Stacked Bar Chart";
                break;
            //Inter_Table4_Regen
            case "18":
                fieldNameX = ["essence"];
                fieldNameY = [];
                aggregation = "Count";
                renderer = "Bar Chart";
                break;
            //Inter_Table5_Arbre
            case "19":
                fieldNameX = ["age"];
                fieldNameY = [];
                aggregation = "Average";
                aggregationAttribute = "haut_m"
                renderer = "Bar Chart";
                break;
            //Inter_Table6_EspIndicatrices
            case "20":
                fieldNameX = [];
                fieldNameY = ["espece"];
                aggregation = "Count";
                renderer = "Horizontal Bar Chart";
                break;
            //Inter_Table7_Calcul
            case "21":
                fieldNameX = ["st_tot"];
                fieldNameY = [];
                aggregation = "Count";
                renderer = "Bar Chart";
                break;
            //QualRebois_Table1_A
            case "22":
                fieldNameX = ["compact_faible"];
                fieldNameY = ["verticalite"];
                aggregation = "Count";
                renderer = "Row Heatmap";
                break;
            //QualRebois_Table1_BC
            case "23":
                fieldNameX = [];
                fieldNameY = ["id_pe"];
                aggregation = "Sum";
                aggregationAttribute = "plants_rebois_c"
                renderer = "Horizontal Bar Chart";
                break;
            //QualRebois_Table3_Grappe
            case "24":
                fieldNameX = ["plant_reboise"];
                fieldNameY = [];
                aggregation = "Count";
                renderer = "Bar Chart";
                break;
            //Regen_Table1_CD
            case "25":
                fieldNameX = ["id_pe"];
                fieldNameY = ["brout_r"];
                aggregation = "Average";
                aggregationAttribute = "haut_tige_avenir_cm";
                renderer = "Bar Chart";
                break;
            //Regen_Table2_Denombre
            case "26":
                fieldNameX = ["id_pe"];
                fieldNameY = [];
                aggregation = "Sum";
                aggregationAttribute = "nb_sab_2"
                renderer = "Bar Chart";
                break;
            //Regen_Table3_Recouvrement
            case "27":
                fieldNameX = ["espece"];
                fieldNameY = ["recouv"];
                aggregation = "Average";
                aggregationAttribute = "recouv"
                renderer = "Bar Chart";
                break;
            //Regen_Table4_Veterans
            case "28":
                fieldNameX = [];
                fieldNameY = ["nb_vet_bop"];
                aggregation = "Count";
                renderer = "Bar Chart";
                break;
            //Regen_Table5_Calcul
            case "29":
                fieldNameX = [];
                fieldNameY = ["moy_haut_tige_avenir_cm"];
                aggregation = "Count";
                renderer = "Bar Chart";
                break;
            //SuiviPlant_Table1_TigeAvenir
            case "30":
                fieldNameX = ["id_pe"];
                fieldNameY = ["ta_r_60_sab"];
                aggregation = "Average";
                aggregationAttribute = "h_couv_cm"
                renderer = "Line Chart";
                break;
            //SuiviPlant_Table2_Denombre
            case "31":
                fieldNameX = ["id_pe"];
                fieldNameY = [];
                aggregation = "Sum";
                aggregationAttribute = "res"
                renderer = "Bar Chart";
                break;
            //SuiviPlant_Table3_Recouvrement
            case "32":
                fieldNameX = ["espece"];
                fieldNameY = [];
                aggregation = "Average";
                aggregationAttribute = "recouv"
                renderer = "Bar Chart";
                break;
            //SuiviPlant_Table4_Veterans
            case "33":
                fieldNameX = ["id_pe"];
                fieldNameY = [];
                aggregation = "Average";
                aggregationAttribute = "nb_vet_bop"
                renderer = "Bar Chart";
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
            $(function(){
                let input = new Array(data.features.length);
                for (let i = 0; i < data.features.length; i++){
                    input[i] = data.features[i].attributes;
                }
                var derivers = $.pivotUtilities.derivers;
                var renderers = $.extend($.pivotUtilities.renderers,
                    $.pivotUtilities.plotly_renderers);
                $("#chartContainer").pivotUI(input, {
                    renderers: renderers,
                    rendererOptions: { gchart: {width: 800, height: 600}},
                    rows: fieldNameY,
                    cols: fieldNameX
                }, true);
                //Overwrite is true
                document.getElementsByClassName("pvtAggregator")[0].value = aggregation;
                document.getElementsByClassName("pvtRenderer")[0].value = renderer;
                if(aggregationAttribute != ""){
                    waitForElementToDisplay(".pvtAttrDropdown", function(){
                        document.getElementsByClassName("pvtAttrDropdown")[0].value = aggregationAttribute;document.getElementsByClassName("pvtAttrDropdown")[0].dispatchEvent(new Event("change"))
                    }, 500, 5000) 
                }
            });
            
        })
    }

    function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
        var startTimeInMs = Date.now();
        (function loopSearch() {
          if (document.querySelector(selector) != null) {
            callback();
            return;
          }
          else {
            setTimeout(function () {
              if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                return;
              loopSearch();
            }, checkFrequencyInMs);
          }
        })();
      }

    function handleChangeTable(){
        mySwitch = document.getElementById("switchTable");
        if(mySwitch.checked){
          showTable();
        }else{
          hideTable();
        }
    }

    function showTable(){
        document.getElementById("tableContainer").style.display = "block";
    }

    function hideTable(){
        document.getElementById("tableContainer").style.display = "none";
    }

    //Fetches the different available tables for the layer select
    populateLayer();
    //Event listeners for the buttons and more
    document.getElementById("tableSelect").addEventListener("change", changeLayer);
    document.getElementById("tableCategorySelect").addEventListener("change", populateLayer);
    document.getElementById("tableInventorySelect").addEventListener("change", populateLayer);
    document.getElementById("switchTable").addEventListener("change", handleChangeTable);
});


