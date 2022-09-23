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
        if(document.documentElement.lang == "fr"){
            switch(aggregation){
                case "80% Lower Bound":
                    aggregation = "Borne inférieure 80%";
                    break;
                case "80% Upper Bound":
                    aggregation = "Borne supérieure 80%";
                    break;
                case "Average":
                    aggregation = "Moyenne";
                    break;
                case "Count":
                    aggregation = "Nombre";
                    break;
                case "Count Unique Values":
                    aggregation = "Nombre de valeurs uniques";
                    break;
                case "Count as Fraction of Columns":
                    aggregation = "Nombre en proportion de la colonne";
                    break;
                case "Count as Fraction of Rows":
                    aggregation = "Nombre en proportion de la ligne";
                    break;
                case "Count as Fraction of Total":
                    aggregation = "Nombre en proportion du totale";
                    break;
                case "First":
                    aggregation = "Premier";
                    break;
                case "Integer Sum":
                    aggregation = "Somme en entiers";
                    break;
                case "Last":
                    aggregation = "Dernier";
                    break;
                case "List Unique Values":
                    aggregation = "Liste de valeurs uniques";
                    break;
                case "Maximum":
                    aggregation = "Maximum";
                    break;
                case "Median":
                    // Not in french
                    aggregation = "Nombre";
                    break;
                case "Minimum":
                    aggregation = "Minimum";
                    break;
                case "Sample Standard Deviation":
                    // Not in french
                    aggregation = "Nombre";
                    break;
                case "Sample Variance":
                    // Not in french
                    aggregation = "Nombre";
                    break;
                case "Sum":
                    aggregation = "Somme";
                    break;
                case "Sum as Fraction of Columns":
                    aggregation = "Somme en proportion de la colonne";
                    break;
                case "Sum as Fraction of Rows":
                    aggregation = "Somme en proportion de la ligne";
                    break;
                case "Sum as Fraction of Total":
                    aggregation = "Somme en proportion du totale";
                    break;
                case "Sum over Sum":
                // Not in french
                    aggregation = "Nombre";
                    break;
            }

            switch(renderer){
                case "Table":
                    renderer = "Table";
                    break;
                case "Table Barchart":
                    renderer = "Table avec barres"
                    break;
                case "Heatmap":
                    renderer = "Carte de chaleur";
                    break;
                case "Row Heatmap":
                    renderer = "Carte de chaleur par ligne";
                    break;
                case "Col Heatmap":
                    renderer = "Carte de chaleur par colonne";
                    break;
                case "Horizontal Bar Chart":
                    renderer = "Graphique à barres horizontales superposées"
                    break;
                case "Horizontal Stacked Bar Chart":
                    renderer = "Graphique à barres horizontales";
                    break;
                case "Bar Chart":
                    renderer = "Graphique à barres";
                    break;
                case "Stacked Bar Chart":
                    renderer = "Graphique à barres superposées";
                    break;
                case "Line Chart":
                    renderer = "Graphique linéaire";
                    break;
                case "Area Chart":
                    renderer = "Graphique en aires";
                    break;
                case "Scatter Chart":
                    renderer = "Graphique en nuage de points";
                    break;
                case "Multiple Pie Chart":
                    renderer = "Graphiques circulaires multiples";
                    break;
            }
        }
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
                var renderers;
                if(document.documentElement.lang == "fr"){
                    renderers = $.extend($.pivotUtilities.locales.fr.renderers,
                        $.pivotUtilities.plotly_renderers);
                }else{
                    renderers = $.extend($.pivotUtilities.renderers,
                        $.pivotUtilities.plotly_renderers);
                }
                $("#chartContainer").pivotUI(input, {
                    renderers: renderers,
                    rendererOptions: {
                        
                    },
                    aggregatorName: aggregation,
                    rendererName: renderer,
                    rows: fieldNameY,
                    cols: fieldNameX,
                    unusedAttrsVertical: false
                }, true, document.documentElement.lang);
                //Overwrite is true
                addLabels();
                if(aggregationAttribute != ""){
                    waitForElementToDisplay(".pvtAttrDropdown", function(){
                        document.getElementsByClassName("pvtAttrDropdown")[0].value = aggregationAttribute;document.getElementsByClassName("pvtAttrDropdown")[0].dispatchEvent(new Event("change"));
                        }, 50, 5000) 
                }
            });
            
        })
    }

    function addLabels(){
        let newNode = document.createElement("p");
        if(document.documentElement.lang == "fr"){
            newNode.innerHTML = "Type de visualisation:";
        }else{
            newNode.innerHTML = "Visualization type:";
        }
        document.getElementsByClassName("pvtUiCell")[0].insertBefore(newNode, document.getElementsByClassName("pvtRenderer")[0]);

        newNode = document.createElement("p");
        newNode.style = "text-align: left;"
        if(document.documentElement.lang == "fr"){
            newNode.innerHTML = "Fonction d'agrégation:";
        }else{
            newNode.innerHTML = "Aggregator:";
        }
        document.getElementsByClassName("pvtUiCell")[0].insertBefore(newNode, document.getElementsByClassName("pvtAggregator")[0]);

        newNode = document.createElement("p");
        newNode.style = "display:inline;"
        if(document.documentElement.lang == "fr"){
            newNode.innerHTML = " Trier:";
        }else{
            newNode.innerHTML = " Sort:";
        }
        document.getElementsByClassName("pvtVals")[0].insertBefore(newNode, document.getElementsByClassName("pvtRowOrder")[0]);
    }

    //Fetches the different available tables for the layer select
    populateLayer();
    //Event listeners for the buttons and more
    document.getElementById("tableSelect").addEventListener("change", changeLayer);
    document.getElementById("tableCategorySelect").addEventListener("change", populateLayer);
    document.getElementById("tableInventorySelect").addEventListener("change", populateLayer);
    document.getElementById("switchTable").addEventListener("change", handleChangeTable);
    document.getElementById("switchTable").dispatchEvent(new Event("change"));
});


