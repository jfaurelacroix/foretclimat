if(document.documentElement.lang=="fr"){
  var locale = "fr-FR";
}else{
  var locale = "en-CA";
}

require([
  "esri/config",
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/Search",
  "esri/widgets/BasemapToggle",
  "esri/widgets/Locate",
  "esri/portal/Portal",
  "esri/layers/FeatureLayer",
  "esri/intl",
  "esri/widgets/LayerList",
  "esri/Color",
  "esri/PopupTemplate",
  "esri/symbols/support/symbolUtils",
  "esri/widgets/Compass"
], (esriConfig, WebMap, MapView, Search, BasemapToggle, Locate, Portal, FeatureLayer, intl, LayerList, Color, PopupTemplate, symbolUtils, Compass) => {
  esriConfig.portalUrl = "https://www.foretclimat.ca/portal";
  intl.setLocale(locale);

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

  /* The map view is contained in the "viewDiv" of the HTML doc*/ 
  const view = new MapView({
    map: map,
    container: "viewDiv",
    /* Extent is based on FM_AB_BLOC */
    extent:{
      xmin: '-7935173.813346129',
      ymin: '5967391.847883448',
      xmax: '-7896652.048618149',
      ymax: '6032429.818627685',
      spatialReference:  {wkid:3857}
    }
  });

  /* Points IMLNU */
  const IMLNU_PS = new FeatureLayer(
    {
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/0",
    outFields: ["*"],
    title: "Points de matière ligneuse non utilisée",
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-marker",
        size: 4,
        color: new Color("rgb(255, 160, 0)")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "Inventaire de matière ligneuse non utilisée {annee}",
      content: [{
        type: "fields", // Autocasts as new FieldsContent()
        // Autocasts as new FieldInfo[]
        fieldInfos: [{
          fieldName: "relationships/0/mlnu_tot",
          label: "Matière ligneuse non utilisée totale",
          format: {
            places: 2,
            digitSeparator: true
          }
        },{
          fieldName: "relationships/0/evaor_tot",
          label: "Volume affectés par des opérations de récolte",
          format: {
            places: 2,
            digitSeparator: true
          }
        }]
      }]
    })
  });

  /* Polygons IMLNU */
  const IMLNU_BLOC = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/1",
    outFields: ["*"],
    title: "Polygones de matière ligneuse non utilisée",
    legendEnabled: false,
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-fill",
        color: new Color("rgba(255, 160, 0, 0.8)")
      },  // autocasts as new SimpleFillSymbol()
    },
    popupTemplate: new PopupTemplate({
      title: "Inventaire de matière ligneuse non utilisée {annee}",
      content: [{
        type: "media", //https://developers.arcgis.com/javascript/latest/api-reference/esri-popup-content-MediaContent.html 
        activeMediaInfoIndex: 1,
        mediaInfos: [{
          type: "image", // Autocasts as new ImageMediaInfo object
          value: {
            sourceURL: "media/graphs/0_area.png"
          }
        },{
          type: "image", // Autocasts as new ImageMediaInfo object
          value: {
            sourceURL: "media/graphs/IMLNU_Bloc_year.png"
          }
        }]
      }]
    })
  });

  /* Points Intervention */
  const INTER_PS =  new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/2",
    outFields: ["*"],
    title: "Points intervention",
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-marker",
        size: 4,
        color: new Color("rgb(133, 91, 207)")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "Intervention {annee}",
      content: [{
        type: "fields", // Autocasts as new FieldsContent()
        // Autocasts as new FieldInfo[]
        fieldInfos: [{
          fieldName: "relationships/4/traitement",
          label: "Traitement",
        },{
          fieldName: "relationships/5/essence",
          label: "Essence",
        },{
          fieldName: "relationships/7/haut_m",
          label: "Hauteur (m)"
        }]
      }]
    })
  });

  /* Polygons Intervention */
  const INTER_BLOC = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/3",
    outFields: ["*"],
    title: "Polygones intervention",
    legendEnabled: false,
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-fill",
        color: new Color("rgba(133, 91, 207, 0.8)")
      },  // autocasts as new SimpleFillSymbol()
    },
    popupTemplate: new PopupTemplate({
      title: "Intervention {annee}",
      content: [{
        type: "media", //https://developers.arcgis.com/javascript/latest/api-reference/esri-popup-content-MediaContent.html
        activeMediaInfoIndex: 1,
        mediaInfos: [{
          type: "image", // Autocasts as new ImageMediaInfo object
          value: {
            sourceURL: "media/graphs/1_area.png"
          }
        },{
          type: "image", // Autocasts as new ImageMediaInfo object
          value: {
            sourceURL: "media/graphs/Inter_Bloc_year.png"
          }
        }]
      }]
    })
  });

  /* Points Qualite Reboisement */
  const REBOIS_PS = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/4",
    outFields: ["*"],
    title: "Points de reboisement",
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-marker",
        size: 4,
        color: new Color("rgb(150, 255, 210)")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "Reboisement {annee}",
      content: [{
        type: "fields", // Autocasts as new FieldsContent()
        // Autocasts as new FieldInfo[]
        fieldInfos: [{
          fieldName: "relationships/11/plants_rebois_c",
          label: "plant",
        }]
      }]
    })
  });

  /* Polygons Qualite Reboisement */
  const REBOIS_BLOC = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/5",
    outFields: ["*"],
    title: "Polygones de reboisement",
    legendEnabled: false,
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-fill",
        color: new Color("rgba(150, 255, 210, 0.8)")
      },  // autocasts as new SimpleFillSymbol()
    },
    popupTemplate: new PopupTemplate({
      title: "Reboisement {annee}",
      content: [{
        type: "media", //https://developers.arcgis.com/javascript/latest/api-reference/esri-popup-content-MediaContent.html
        activeMediaInfoIndex: 1,
        mediaInfos: [{
          type: "image", // Autocasts as new ImageMediaInfo object
          value: {
            sourceURL: "media/graphs/2_area.png"
          }
        },{
          type: "image", // Autocasts as new ImageMediaInfo object
          value: {
            sourceURL: "media/graphs/QualRebois_Bloc_year.png"
          }
        }]
      }]
    })
  });

  /* Points Recolte */
  const RECOLTE_PS =  new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/6",
    outFields: ["*"],
    title: "Points de récolte",
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-marker",
        size: 4,
        color: new Color("rgb(255, 119, 113)")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "Récolte {annee}",
      content: [{
        type: "fields", // Autocasts as new FieldsContent()
        // Autocasts as new FieldInfo[]
        fieldInfos: [{}]
      }]
    })
  });

  /* Polygons Recolte */
  const RECOLTE_BLOC = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/8",
    outFields: ["*"],
    title: "Polygones de récolte",
    legendEnabled: false,
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-fill",
        color: new Color("rgba(255, 119, 113, 0.8)")
      },  // autocasts as new SimpleFillSymbol()
    },
    popupTemplate: new PopupTemplate({
      title: "Récolte {annee}",
      content: [{
        type: "media", //https://developers.arcgis.com/javascript/latest/api-reference/esri-popup-content-MediaContent.html
        activeMediaInfoIndex: 1,
        mediaInfos: [{
          type: "image", // Autocasts as new ImageMediaInfo object
          value: {
            sourceURL: "media/graphs/3_area.png"
          }
        },{
          type: "image", // Autocasts as new ImageMediaInfo object
          value: {
            sourceURL: "media/graphs/Recolte_Bloc_year.png"
          }
        }]
      }]
    })
  });

  /* Points Regeneration */
  const REGEN_PS = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/7",
    outFields: ["*"],
    title: "Points de régénération",
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-marker",
        size: 4,
        color: new Color("rgb(0, 131, 165)")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "Régénération {annee}",
      content: [{
        type: "fields", // Autocasts as new FieldsContent()
        // Autocasts as new FieldInfo[]
        fieldInfos: [{
          fieldName: "relationships/18/nb_sab_2",
          label: "Nombre de sapins baumiers",
        },{
          fieldName: "relationships/18/nb_epb_23",
          label: "Nombre d''épinettes blanches",
        },{
          fieldName: "relationships/18/nb_bop_2",
          label: "Nombre de bouleaux à papier",
        },{
          fieldName: "relationships/18/nb_pet_2",
          label: "Nombre de peupliers",
        }]
        //Add fields from Regen_Table1_CD ???
      }],
    })
  });

  /* Polygons Regeneration */
  const REGEN_BLOC = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/9",
    outFields: ["*"],
    title: "Polygones de régénération",
    legendEnabled: false,
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-fill",
        color: new Color("rgba(0, 131, 165, 0.8)")
      },  // autocasts as new SimpleFillSymbol()
    },
    popupTemplate: new PopupTemplate({
      title: "Régénération {annee}",
      content: [{
        type: "media", //https://developers.arcgis.com/javascript/latest/api-reference/esri-popup-content-MediaContent.html
        activeMediaInfoIndex: 1,
        mediaInfos: [{
          type: "image", // Autocasts as new ImageMediaInfo object
          value: {
            sourceURL: "media/graphs/4_area.png"
          }
        },{
          type: "image", // Autocasts as new ImageMediaInfo object
          value: {
            sourceURL: "media/graphs/Regen_Bloc_year.png"
          }
        }]
      }]
    })
  });

  /* Points SuiviPlantation */
  const PLANT_PS = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/10",
    outFields: ["*"],
    title: "Points de plantation",
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-marker",
        size: 4,
        color: new Color("rgb(202, 231, 55)")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "Suivi plantation {annee}",
      content: [{
        type: "fields", // Autocasts as new FieldsContent()
        // Autocasts as new FieldInfo[]
        fieldInfos: [{
          fieldName: "relationships/23/h_couv_cm",
          label: "Hauteur couv (cm)",
        },{
          fieldName: "relationships/23/h_res_cm",
          label: "Hauteur res (cm)",
        }]
      }]
      //Need to decide the fields
    })
  });

  /* Polygons SuiviPlantation */
  const PLANT_BLOC = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/12",
    outFields: ["*"],
    title: "Polygones de plantation",
    legendEnabled: false,
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-fill",
        color: new Color("rgba(202, 231, 55, 0.8)")
      },  // autocasts as new SimpleFillSymbol()
    },
    popupTemplate: new PopupTemplate({
      title: "Plantation {annee}",
      content: [{
        type: "media", //https://developers.arcgis.com/javascript/latest/api-reference/esri-popup-content-MediaContent.html
        activeMediaInfoIndex: 1,
        mediaInfos: [{
          type: "image", // Autocasts as new ImageMediaInfo object
          value: {
            sourceURL: "media/graphs/5_area.png"
          }
        },{
          type: "image", // Autocasts as new ImageMediaInfo object
          value: {
            sourceURL: "media/graphs/SuiviPlant_Bloc_year.png"
          }
        }]
      }]
    })
  });

  /* Layer about human constructions on site */
  const BATIMENTS_PS = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/FM_batiments/FeatureServer",
    outFields: ["*"],
    title: "Batiments",
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-marker",
        size: 4,
        color: new Color("#C84127")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "{NOM}",
      content: [{
        type: "fields", // Autocasts as new FieldsContent()
        // Autocasts as new FieldInfo[]
        fieldInfos: [{
          fieldName: "type",
          label: "Type de batiment",
        }]
      }]
    })
  })

  /* Layer about the roads and other paths */
  const CHEMINS_PL = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/Chemin_FM/FeatureServer",
    outFields: ["*"],
    title: "Chemins",
    renderer: {
      type: "unique-value",
      field: "CL_CHEM2",
      legendOptions:{title: "Classification du chemin"},
      defaultSymbol: { type: "simple-line", color: new Color("#79f45d")}, 
      uniqueValueInfos: [{
        value: "Chemin carrossable non pavé",
        symbol: {
          type: "simple-line",
          color: new Color("#FFCC33")
        }
      },{
        value: "Chemin non carrossable",
        symbol: {
          type: "simple-line",
          color: new Color("#FF9900")
        }
      },]
    },
    popupTemplate: new PopupTemplate({
      title: "Chemin #{NO_CHEM} {CHEMIN_NOM}",
      content: [{
        type: "fields", // Autocasts as new FieldsContent()
        // Autocasts as new FieldInfo[]
        fieldInfos: [{
          fieldName: "etat",
          label: "État",
        },{
          fieldName: "CL_CHEM2",
          label: "Classe du chemin",
        }]
      }]
    })
  })

  /* Layer about the walking paths */
  const SENTIERS_PL = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/Project_FM_sentiers/FeatureServer",
    outFields: ["*"],
    title: "Sentiers",
    renderer: {
      type: "unique-value",
      field: "Difficulte",
      legendOptions:{title: "Difficulté du sentier"},
      defaultSymbol: { type: "simple-line", color: new Color("#50CAE1"), style: "dash", width: '1.5px'}, 
      uniqueValueInfos: [{
        value: "facile",
        symbol: {
          type: "simple-line",
          style: "dash",
          color: new Color("#d7eaf3"),
          width: '1.5px'
        }
      },{
        value: "difficile",
        symbol: {
          type: "simple-line",
          style: "dash",
          color: new Color("#77b5d9"),
          width: '1.5px'
        }
      },{
        value: "très difficile",
        symbol: {
          type: "simple-line",
          style: "dash",
          color: new Color("#14397d"),
          width: '1.5px'
        }
      }]
    },
    popupTemplate: new PopupTemplate({
      title: "Sentier {Nom}",
      content: [{
        type: "fields", // Autocasts as new FieldsContent()
        // Autocasts as new FieldInfo[]
        fieldInfos: [{
          fieldName: "Difficulte",
          label: "Difficulté",
        },{
          fieldName: "Patin",
          label: "Patin",
        },{
          fieldName: "Usager",
          label: "Usage",
        }]
      }]
    })
  })

  /* Layer about the snowmobile club path */
  const MOTONEIGE_PL = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/Project_FM_motoneige/FeatureServer",
    outFields: ["*"],
    title: "Pistes de motoneige",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-line",
        color: new Color('#b132f1')
      }
    },
    popupTemplate: new PopupTemplate({
      title: "Piste de motoneige {NOM_CLUB}",
      content: [{
        type: "fields", // Autocasts as new FieldsContent()
        // Autocasts as new FieldInfo[]
        fieldInfos: [{
          fieldName: "NOM_CLUB",
          label: "Nom du club",
        },{
          fieldName: "NO_CLUB",
          label: "# du club",
        },{
          fieldName: "REGION_FCM",
          label: "Région",
        }]
      }]
    })
  })

  /* Layer delimiting zones A and B of Foret Montmorency */
  const FM_AB_BLOC = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/FM_poly_AB/FeatureServer",
    outFields: ["*"],
    title: "Délimitations de la Forêt Montmorency",
    renderer: {
      type: "unique-value",
      field: "id",
      legendOptions:{title: "Délimitations des zones"},
      defaultSymbol: { type: "simple-fill" }, 
      uniqueValueInfos: [{
        value: "A",
        symbol: {
          type: "simple-fill",
          style: "forward-diagonal",
          color: new Color("#fcdad4")
        }
      }, {
        value: "B",
        symbol: {
          type: "simple-fill",
          style: "forward-diagonal",
          color: new Color("#f69483")
        }
      }]
    },
    popupTemplate: new PopupTemplate({
      title: "Zone {ID}",
      content: [{
        type: "fields", // Autocasts as new FieldsContent()
        // Autocasts as new FieldInfo[]
        fieldInfos: [{
          fieldName: "area",
          label: "Aire",
        }]
      }]
    })
  })

  /* changes everything in english for the feature layers */
  if(document.documentElement.lang=="en"){
    IMLNU_PS.title = "Points of unused woody material";
    IMLNU_PS.popupTemplate.title = "Inventory of unused wood material {annee}";
    IMLNU_PS.popupTemplate.content[0].fieldInfos[0].label = "Unused woody material";
    IMLNU_PS.popupTemplate.content[0].fieldInfos[1].label = "Volume affected by harvesting operations";
    
    IMLNU_BLOC.title = "Points of unused woody material";
    IMLNU_BLOC.popupTemplate.title = "Inventory of unused wood material {annee}";
    IMLNU_BLOC.popupTemplate.content[0].mediaInfos[0].title = "";
    IMLNU_BLOC.popupTemplate.content[0].mediaInfos[0].caption = "";
    IMLNU_BLOC.popupTemplate.content[0].mediaInfos[1].title = "";
    IMLNU_BLOC.popupTemplate.content[0].mediaInfos[1].caption = "";
    /* TODO */
    BATIMENTS_PS.title = "Buildings";
    BATIMENTS_PS.popupTemplate.content[0].fieldInfos[0].label = "Building type";
  
    CHEMINS_PL.title = "Roads";
    CHEMINS_PL.renderer.legendOptions = {title: "Road classification"},
    CHEMINS_PL.popupTemplate.title = "Road #{NO_CHEM} {CHEMIN_NOM}";
    CHEMINS_PL.popupTemplate.content[0].fieldInfos[0].label = "Road condition";
    CHEMINS_PL.popupTemplate.content[0].fieldInfos[1].label = "Road classes";

    SENTIERS_PL.title = "Paths";
    SENTIERS_PL.renderer.legendOptions = {title: "Difficulty of the path"},
    SENTIERS_PL.popupTemplate.title = "Path {Nom}";
    SENTIERS_PL.popupTemplate.content[0].fieldInfos[0].label = "Difficulty";
    SENTIERS_PL.popupTemplate.content[0].fieldInfos[2].label = "Use";

    MOTONEIGE_PL.title = "Snowmobile path";
    MOTONEIGE_PL.popupTemplate.title = "Snowmobile path {NOM_CLUB}";
    MOTONEIGE_PL.popupTemplate.content[0].fieldInfos[0].label = "Name of the club";
    MOTONEIGE_PL.popupTemplate.content[0].fieldInfos[1].label = "Region";

    FM_AB_BLOC.title = "Delimitations of the Forêt Montmorency";
    FM_AB_BLOC.renderer.legendOptions = {title: "Delimitations of the zones"},
    FM_AB_BLOC.popupTemplate.content[0].fieldInfos[0].label = "Area";
  }

  /* Parameters used for each sources in the following search widget */
  let searchSourcesParam = {
    exactMatch: false,
    outFields: ["*"],
    maxResults: 6,
    maxSuggestions: 6,
    suggestionsEnabled: true,
    minSuggestCharacters: 0
  }

  /* Widget that is the search bar. Add each layer as a source */
  const search = new Search ({
    view: view,
    allPlaceholder: "Rechercher un lieu ou une couche",
    portal: myPortal, // https://enterprise.arcgis.com/fr/portal/latest/administer/windows/configure-portal-to-geocode-addresses.htm
    sources: [ //https://developers.arcgis.com/javascript/latest/sample-code/widgets--multiplesource/
      {
        layer: BATIMENTS_PS,
        name: "Batiments",
        placeholder: "Rechercher un batiment",
        searchFields: ["nom", "type"],
        displayField: "nom",
        searchSourcesParam
      },
      {
        layer: CHEMINS_PL,
        name: "Chemins",
        placeholder: "Rechercher un chemin",
        searchFields: ["chemin_nom", "etat"],
        displayField: "chemin_nom",
        searchSourcesParam
      },
      {
        layer: SENTIERS_PL,
        name: "Sentiers",
        placeholder: "Rechercher un sentier",
        searchFields: ["chemin_nom", "difficulte", "usage"],
        displayField: "chemin_nom",
        searchSourcesParam
      },
      {
        layer: MOTONEIGE_PL,
        name: "Piste de motoneige",
        placeholder: "Rechercher un club et ses pistes",
        searchFields: ["nom_club"],
        displayField: "nom_club",
        searchSourcesParam
      },
      {
        layer: IMLNU_PS,
        name: "Points matière ligneuse non utilisée",
        placeholder: "Rechercher un point",
        searchFields: ["objectid", "annee",  "ID_PE"],
        displayFields: ["ID_PE"],
        searchSourcesParam
      },
      {
        layer: IMLNU_BLOC,
        name: "Polygones matière ligneuse non utilisée",
        placeholder: "Rechercher un polygone",
        searchFields: ["objectid", "annee", "ID_BLOC"],
        displayFields: ["ID_BLOC"],
        searchSourcesParam
      },
      {
        layer: INTER_PS,
        name: "Points intervention",
        placeholder: "Rechercher un point",
        searchFields: ["objectid", "annee",  "ID_PE"],
        displayFields: ["ID_PE"],
        searchSourcesParam
      },
      {
        layer: INTER_BLOC,
        name: "Polygones intervention",
        placeholder: "Rechercher un polygone",
        searchFields: ["objectid", "annee", "ID_BLOC"],
        displayFields: ["ID_BLOC"],
        searchSourcesParam
      },
      {
        layer: REBOIS_PS,
        name: "Points qualité du reboisement",
        placeholder: "Rechercher un point",
        searchFields: ["objectid", "annee",  "ID_PE"],
        displayFields: ["ID_PE"],
        searchSourcesParam
      },
      {
        layer: REBOIS_BLOC,
        name: "Polygones qualité du reboisement",
        placeholder: "Rechercher un polygone",
        searchFields: ["objectid", "annee", "ID_BLOC"],
        displayFields: ["ID_BLOC"],
        searchSourcesParam
      },
      {
        layer: RECOLTE_PS,
        name: "Points récolte",
        placeholder: "Rechercher un point",
        searchFields: ["objectid", "annee",  "ID_PE"],
        displayFields: ["ID_PE"],
        searchSourcesParam
      },
      {
        layer: RECOLTE_BLOC,
        name: "Polygones récolte",
        placeholder: "Rechercher un polygone",
        searchFields: ["objectid", "annee", "ID_BLOC"],
        displayFields: ["ID_BLOC"],
        searchSourcesParam
      },
      {
        layer: REGEN_PS,
        name: "Points Régénération",
        placeholder: "Rechercher un point",
        searchFields: ["objectid", "annee",  "ID_PE"],
        displayFields: ["ID_PE"],
        searchSourcesParam
      },
      {
        layer: REGEN_BLOC,
        name: "Polygones régénération",
        placeholder: "Rechercher un polygone",
        searchFields: ["objectid", "annee", "ID_BLOC"],
        displayFields: ["ID_BLOC"],
        searchSourcesParam
      },
      {
        layer: PLANT_PS,
        name: "Points suivi de plantation",
        placeholder: "Rechercher un point",
        searchFields: ["objectid", "annee",  "ID_PE"],
        displayFields: ["ID_PE"],
        searchSourcesParam
      },
      {
        layer: PLANT_BLOC,
        name: "Polygones suivi de plantation",
        placeholder: "Rechercher un polygone",
        searchFields: ["objectid", "annee", "ID_BLOC"],
        displayFields: ["ID_BLOC"],
        searchSourcesParam
      }
    ]
  });

  /* Changes placeholders if page is in english */
  if(document.documentElement.lang=="en"){
    search.allPlaceholder = "Search for places or layers"
    search.allSources.items[0].name = "Buildings";
    search.allSources.items[0].placeholder = "Search for buildings";
    search.allSources.items[1].name = "Roads";
    search.allSources.items[1].placeholder = "Search for roads";
    search.allSources.items[2].name = "Paths";
    search.allSources.items[2].placeholder = "Search for paths";
    search.allSources.items[3].name = "Snowmobile paths";
    search.allSources.items[3].placeholder = "Search for snowmobile paths";
    search.allSources.items[4].name = "Points of unused wood material";
    search.allSources.items[4].placeholder = "Search for points";
    search.allSources.items[5].name = "Polygons of unused wood material";
    search.allSources.items[5].placeholder = "Search for polygons";
    search.allSources.items[6].name = "Points of intervention";
    search.allSources.items[6].placeholder = "Search for points";
    search.allSources.items[7].name = "Polygons of intervention";
    search.allSources.items[7].placeholder = "Search for polygons";
    search.allSources.items[8].name = "Points of reforestation";
    search.allSources.items[8].placeholder = "Search for points";
    search.allSources.items[9].name = "Polygons of reforestation";
    search.allSources.items[9].placeholder = "Search for polygons";
    search.allSources.items[10].name = "Points of harvest";
    search.allSources.items[10].placeholder = "Search for points";
    search.allSources.items[11].name = "Polygons of harvest";
    search.allSources.items[11].placeholder = "Search for polygons";
    search.allSources.items[12].name = "Points of regeneration";
    search.allSources.items[12].placeholder = "Search for points";
    search.allSources.items[13].name = "Polygons of regeneration";
    search.allSources.items[13].placeholder = "Search for polygons";
    search.allSources.items[14].name = "Points of planting";
    search.allSources.items[14].placeholder = "Search for points";
    search.allSources.items[15].name = "Polygons of planting";
    search.allSources.items[15].placeholder = "Search for polygons";
  }

  /* Widget to change the basemap */
  const toggle = new BasemapToggle({
    view: view,
    nextBasemap: "osm" //https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
  });

  /* Widget to locate the user on the map */
  const locateWidget = new Locate({
    view: view
  });

  /* Widget that acts as a compass */
  const compass = new Compass({
    view: view
  });

  /* Widget to let the user hide/show different layers, also acts as a legend */
  const layerList = new LayerList({
    view: view,
    listItemCreatedFunction: function (event) {

      // The event object contains properties of the
      // layer in the LayerList widget.
  
      let item = event.item;
      let mySymbol;
      item.panel = {
        content: "",
        open: true
      }
      /* If simple renderer: manually add the symbol to the content panel */
      if(item.layer.renderer.type == 'simple'){
        if(item.panel.content == ""){
          mySymbol = item.layer.renderer.symbol;
          symbolUtils.renderPreviewHTML(mySymbol).then(renderedSymbol=>{
            item.panel.content = renderedSymbol;
          });
        }
      /* Else the id string "legend" will automatically generate the legend for unique value renderers */
      }else{
        item.panel.content = "legend";
      }
    }
  });

  /* Defined to be used in utils.js */
  Window.map = map;

  /* Adds every layer to the map */
  map.addMany([FM_AB_BLOC, PLANT_BLOC, REGEN_BLOC,  RECOLTE_BLOC, REGEN_BLOC, REBOIS_BLOC, INTER_BLOC,  IMLNU_BLOC, PLANT_PS, REGEN_PS, RECOLTE_PS, REGEN_PS, REBOIS_PS, INTER_PS, IMLNU_PS, CHEMINS_PL, MOTONEIGE_PL, SENTIERS_PL, BATIMENTS_PS,]);

  /* Adds every item as esri-component but they are still positionned manually using position: fixed */
  view.ui.add(["logoPasserelle", search], "top-left");
  view.ui.add(["account", "sideburger"], "top-right");
  view.ui.add([toggle], "bottom-left");
  view.ui.add([locateWidget, compass, layerList, "tutorialHelp", "switch"], "bottom-right");

  view.ui.move(["zoom"], "bottom-right");

  // auto-dock https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Popup.html#dockOptions
  view.popup.dockOptions = {
    breakpoint: {
      width: 999999,
      height: 999999
    }
  }

  /* if user is logged in (esri_auth cookie is present) */
  if (getCookie("esri_auth") != "") {
    addAccountEventListenerHome();
  }else{
    addAccountEventListenerSignIn();
  }

  if(!localStorage.noFirstVisit){
    startTutorial();
    localStorage.noFirstVisit = true;
  }
  setPublicMode();
});
