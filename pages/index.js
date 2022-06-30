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
      content: setContent
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
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/ea177e77f06e41608eb0eab7887902d7/data"
          }
        },{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/41874b9b00f5407ebfba40c706e0f5aa/data"
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
        // Pass in the fields to display
        type: "fields",
        fieldInfos: [{
          fieldName: "objectid",
          label: "ID"
        }, {
          fieldName: "annee",
          label: "Année"
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
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/ea177e77f06e41608eb0eab7887902d7/data"
          }
        },{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/d96cf3c2ec7c40d9b25666c70a491a71/data"
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
        color: new Color("rgb(106, 90, 205)")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "Reboisement {annee}",
      content: [{
        // Pass in the fields to display
        type: "fields",
        fieldInfos: [{
          fieldName: "objectid",
          label: "ID"
        }, {
          fieldName: "annee",
          label: "Année"
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
        color: new Color("rgba(106, 90, 205, 0.8)")
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
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/ea177e77f06e41608eb0eab7887902d7/data"
          }
        },{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/5508a5629129483c8f09302503452289/data"
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
        // Pass in the fields to display
        type: "fields",
        fieldInfos: [{
          fieldName: "objectid",
          label: "ID"
        }]
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
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/ea177e77f06e41608eb0eab7887902d7/data"
          }
        },{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/fb3c1a5f9ce24685892f75e4f65587bf/data"
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
        // Pass in the fields to display
        type: "fields",
        fieldInfos: [{
          fieldName: "objectid",
          label: "ID"
        }, {
          fieldName: "annee",
          label: "Année"
       }]
      }]
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
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/ea177e77f06e41608eb0eab7887902d7/data"
          }
        },{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/c11d08aa28484d3ba2097211b652ee4d/data"
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
        // Pass in the fields to display
        type: "fields",
        fieldInfos: [{
          fieldName: "objectid",
          label: "ID"
        }, {
          fieldName: "annee",
          label: "Année"
       }]
      }]
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
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/ea177e77f06e41608eb0eab7887902d7/data"
          }
        },{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/ec918180d71449b9bd067b9c796b6906/data"
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

  
  map.addMany([PLANT_BLOC, REGEN_BLOC,  RECOLTE_BLOC, REGEN_BLOC, INTER_BLOC,  IMLNU_BLOC, PLANT_PS, REGEN_PS, RECOLTE_PS, REGEN_PS, INTER_PS, IMLNU_PS]);
  view.ui.add(["textBoxDiv", search], "top-left");
  // places the  widget in the top right corner of the view
  view.ui.add(["account"], "top-right");
  view.ui.add([toggle, "partLogoDiv", layerList], "bottom-left");
  view.ui.add([locateWidget, compass], "bottom-right");
  view.ui.move(["zoom"], "bottom-right");

  // auto-dock https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Popup.html#dockOptions
  view.popup.dockOptions = {
    breakpoint: {
      width: 999999,
      height: 999999
    }
  }

  function setContent(feature){
    let graphic, attributes, content;
    graphic = feature.graphic;
    attributes = graphic.attributes;
    let relatedFeature = new FeatureLayer({
      url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/13"
    });
    let query = relatedFeature.createQuery();
    query.where = "id_pe = '" + attributes.id_pe + "'";
    query.outFields = ["mlnu_tot", "evaor_tot"];
    content = relatedFeature.queryFeatures(query).then(function(response){
      let fieldList = [response.fields[0].clone(), response.fields[1].clone()];
      let value = "";
      console.log(fieldList);
      for (let field of fieldList){
        if (field.length == -1){
          field.length = null;
        }
        value += field.name + " = " + field.length + "<br>";
      }
      return(value)
    });
    return content
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
