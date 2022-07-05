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

  const map = new WebMap({
    portalItem: {
      // autocasts as new PortalItem()
      id: "8dacc82f02d94d24bb4a3c751ba4db34", // id is in the content page url
      portal: myPortal
    }
  });

  const view = new MapView({
    map: map,
    container: "viewDiv"
  });


  const IMLNU_PS = new FeatureLayer({
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
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/a58f1ad9d8434ed9856573e560481514/data"
          }
        },{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/f3bcceeda8374061b621c35fb9d9e09e/data"
          }
        }]
      }]
    })
  });

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
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/ee57708918ba4f1db1e84996e89e632c/data"
          }
        },{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/eacb6b50cdd3443ca1e01bd0b4c58f4c/data"
          }
        }]
      }]
    })
  });

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
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/281517611b064b8496dd57ee3e00ddf9/data"
          }
        },{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/485fbb1c6c3a4b359214a917904e7614/data"
          }
        }]
      }]
    })
  });

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
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/b8f4e9a778a542d2924d4d157fdb7af4/data"
          }
        },{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/28040139f18045e3a24778674b3ac9fe/data"
          }
        }]
      }]
    })
  });

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
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/5d658e17095e439ea7f796f21cb8cd4a/data"
          }
        },{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/957537c4d69f48b0aa8ce33bf8360195/data"
          }
        }]
      }]
    })
  });

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
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/957537c4d69f48b0aa8ce33bf8360195/data"
          }
        },{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/56725eed416b4e26b3359786e602e31d/data"
          }
        }]
      }]
    })
  });

  const search = new Search ({
    view: view,
    allPlaceholder: "<= Rechercher une couche ou un lieu",
    portal: myPortal, // https://enterprise.arcgis.com/fr/portal/latest/administer/windows/configure-portal-to-geocode-addresses.htm
    sources: [ //https://developers.arcgis.com/javascript/latest/sample-code/widgets--multiplesource/
      {
        layer: IMLNU_PS,
        exactMatch: false,
        name: "Points matière ligneuse non utilisée",
        placeholder: "Rechercher un point",
        Fields: ["objectid", "annee", "secteur"],
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: IMLNU_BLOC,
        exactMatch: false,
        name: "Polygones matière ligneuse non utilisée",
        placeholder: "Rechercher un polygone",
        outFields: ["*"],
        Fields: ["objectid", "annee", "secteur"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: INTER_PS,
        exactMatch: false,
        name: "Points intervention",
        placeholder: "Rechercher un point",
        Fields: ["objectid", "annee", "secteur"],
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: INTER_BLOC,
        exactMatch: false,
        name: "Polygones intervention",
        placeholder: "Rechercher un polygone",
        Fields: ["objectid", "annee", "secteur"],
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: REBOIS_PS,
        exactMatch: false,
        name: "Points qualité du reboisement",
        placeholder: "Rechercher un point",
        Fields: ["objectid", "annee", "secteur"],
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: REBOIS_BLOC,
        exactMatch: false,
        name: "Polygones qualité du reboisement",
        placeholder: "Rechercher un polygone",
        Fields: ["objectid", "annee", "secteur"],
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: RECOLTE_PS,
        exactMatch: false,
        name: "Points récolte",
        placeholder: "Rechercher un point",
        Fields: ["objectid", "annee", "secteur"],
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: RECOLTE_BLOC,
        exactMatch: false,
        name: "Polygones récolte",
        placeholder: "Rechercher un polygone",
        Fields: ["objectid", "annee", "secteur"],
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: REGEN_PS,
        exactMatch: false,
        name: "Points Régénération",
        placeholder: "Rechercher un point",
        Fields: ["objectid", "annee", "secteur"],
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: REGEN_BLOC,
        exactMatch: false,
        name: "Polygones régénération",
        placeholder: "Rechercher un polygone",
        Fields: ["objectid", "annee", "secteur"],
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: PLANT_PS,
        exactMatch: false,
        name: "Points suivi de plantation",
        placeholder: "Rechercher un point",
        Fields: ["objectid", "annee", "secteur"],
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: PLANT_BLOC,
        exactMatch: false,
        name: "Polygones suivi de plantation",
        placeholder: "Rechercher un polygone",
        Fields: ["objectid", "annee", "secteur"],
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      }
    ]
  });

  const toggle = new BasemapToggle({
    view: view,
    nextBasemap: "hybrid"
  });

  const locateWidget = new Locate({
    view: view
  });

  const compass = new Compass({
    view: view
  });

  const layerList = new LayerList({
    view: view,
    listItemCreatedFunction: function (event) {

      // The event object contains properties of the
      // layer in the LayerList widget.
  
      let item = event.item;
      let mySymbol = item.layer.renderer.symbol.clone();
      item.panel = {
        content: "",
        open: true
      }
      symbolUtils.renderPreviewHTML(mySymbol).then(renderedSymbol=>{
        item.panel.content = renderedSymbol;
      });
    }
  });

  
  map.addMany([PLANT_BLOC, REGEN_BLOC,  RECOLTE_BLOC, REGEN_BLOC, REBOIS_BLOC, INTER_BLOC,  IMLNU_BLOC, PLANT_PS, REGEN_PS, RECOLTE_PS, REGEN_PS, REBOIS_PS, INTER_PS, IMLNU_PS]);
  view.ui.add(["textBoxDiv", search], "top-left");
  // places the  widget in the top right corner of the view
  view.ui.add(["account"], "top-right");
  view.ui.add([toggle, layerList], "bottom-left");
  view.ui.add([locateWidget, compass], "bottom-right");
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
    changeUserInfoHTML(getCookieEmail());
    setUpNavMenu();
    addAccountEventListenerHome();
  }else{
    addAccountEventListenerSignIn();
  }
});
