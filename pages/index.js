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
  "esri/widgets/Legend",
  "esri/Color",
  "esri/PopupTemplate"
], (esriConfig, WebMap, MapView, Search, BasemapToggle, Locate, Portal, FeatureLayer, intl, LayerList, Legend, Color, PopupTemplate) => {
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
    title: "ILMNU_POINTS",
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-marker",
        size: 4,
        color: new Color("rgb(255, 160, 0)")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "IMLNU",
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

  const IMLNU_BLOC = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/1",
    outFields: ["*"],
    title: "ILMNU_POLYGONES",
    legendEnabled: false,
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-fill",
        color: new Color("rgba(255, 160, 0, 0.8)")
      },  // autocasts as new SimpleFillSymbol()
    },
    popupTemplate: new PopupTemplate({
      title: "IMLNU",
      content: [{
        type: "media", //https://developers.arcgis.com/javascript/latest/api-reference/esri-popup-content-MediaContent.html 
        activeMediaInfoIndex: 1,
        mediaInfos: [{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/130af69915c24157900dbc915a8963d3/data"
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
    title: "INTER_POINTS",
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-marker",
        size: 4,
        color: new Color("rgb(133, 91, 207)")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "Intervention",
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
    title: "INTER_POLYGONES",
    legendEnabled: false,
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-fill",
        color: new Color("rgba(133, 91, 207, 0.8)")
      },  // autocasts as new SimpleFillSymbol()
    },
    popupTemplate: new PopupTemplate({
      title: "INTER",
      content: [{
        type: "media", //https://developers.arcgis.com/javascript/latest/api-reference/esri-popup-content-MediaContent.html
        activeMediaInfoIndex: 1,
        mediaInfos: [{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/130af69915c24157900dbc915a8963d3/data"
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
    title: "REBOIS_POINTS",
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-marker",
        size: 4,
        color: new Color("rgb(106, 90, 205)")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "Reboisement",
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
    title: "REBOIS_POLYGONES",
    legendEnabled: false,
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-fill",
        color: new Color("rgba(106, 90, 205, 0.8)")
      },  // autocasts as new SimpleFillSymbol()
    },
    popupTemplate: new PopupTemplate({
      title: "REBOIS",
      content: [{
        type: "media", //https://developers.arcgis.com/javascript/latest/api-reference/esri-popup-content-MediaContent.html
        activeMediaInfoIndex: 1,
        mediaInfos: [{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/130af69915c24157900dbc915a8963d3/data"
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
    title: "RECOLTE_POINTS",
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-marker",
        size: 4,
        color: new Color("rgb(255, 119, 113)")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "Récolte",
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

  const RECOLTE_BLOC = new FeatureLayer({
    url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/8",
    outFields: ["*"],
    title: "RECOLTE_POLYGONES",
    legendEnabled: false,
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-fill",
        color: new Color("rgba(255, 119, 113, 0.8)")
      },  // autocasts as new SimpleFillSymbol()
    },
    popupTemplate: new PopupTemplate({
      title: "RECOLTE",
      content: [{
        type: "media", //https://developers.arcgis.com/javascript/latest/api-reference/esri-popup-content-MediaContent.html
        activeMediaInfoIndex: 1,
        mediaInfos: [{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/130af69915c24157900dbc915a8963d3/data"
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
    title: "REGEN_POINTS",
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-marker",
        size: 4,
        color: new Color("rgb(0, 131, 165)")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "Régénération",
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
    title: "REGEN_POLYGONES",
    legendEnabled: false,
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-fill",
        color: new Color("rgba(0, 131, 165, 0.8)")
      },  // autocasts as new SimpleFillSymbol()
    },
    popupTemplate: new PopupTemplate({
      title: "REGEN",
      content: [{
        type: "media", //https://developers.arcgis.com/javascript/latest/api-reference/esri-popup-content-MediaContent.html
        activeMediaInfoIndex: 1,
        mediaInfos: [{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/130af69915c24157900dbc915a8963d3/data"
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
    title: "PLANT_POINTS",
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-marker",
        size: 4,
        color: new Color("rgb(202, 231, 55)")
      },
    },
    popupTemplate: new PopupTemplate({
      title: "Suivi plantation",
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
    title: "PLANT_POLYGONES",
    legendEnabled: false,
    renderer: {
      type: "simple", 
      symbol: {
        type: "simple-fill",
        color: new Color("rgba(202, 231, 55, 0.8)")
      },  // autocasts as new SimpleFillSymbol()
    },
    popupTemplate: new PopupTemplate({
      title: "PLANT",
      content: [{
        type: "media", //https://developers.arcgis.com/javascript/latest/api-reference/esri-popup-content-MediaContent.html
        activeMediaInfoIndex: 1,
        mediaInfos: [{
          title: "<b>title</b>",
          type: "image", // Autocasts as new ImageMediaInfo object
          caption: "summary",
          value: {
            sourceURL: "https://www.foretclimat.ca/portal/sharing/rest/content/items/130af69915c24157900dbc915a8963d3/data"
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

  const search = new Search({
    view: view,
    portal: myPortal, // https://enterprise.arcgis.com/fr/portal/latest/administer/windows/configure-portal-to-geocode-addresses.htm
    sources: [ //https://developers.arcgis.com/javascript/latest/sample-code/widgets-search-multiplesource/
      {
        layer: IMLNU_PS,
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: IMLNU_BLOC,
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: INTER_PS,
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: INTER_BLOC,
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: REBOIS_PS,
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: REBOIS_BLOC,
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: RECOLTE_PS,
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: RECOLTE_BLOC,
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: REGEN_PS,
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: REGEN_BLOC,
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: PLANT_PS,
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: PLANT_BLOC,
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      }
    ],
  });

  const toggle = new BasemapToggle({
    view: view,
    nextBasemap: "hybrid"
  });

  const locateWidget = new Locate({
    view: view
  });

  const layerList = new LayerList({
    view: view,
  });

  const legend = new Legend({
    view: view
  })
  
  map.addMany([PLANT_BLOC, REGEN_BLOC,  RECOLTE_BLOC, REGEN_BLOC, INTER_BLOC,  IMLNU_BLOC, PLANT_PS, REGEN_PS, RECOLTE_PS, REGEN_PS, INTER_PS, IMLNU_PS]);
  view.ui.add(["textBoxDiv", search], "top-left");
  // places the search widget in the top right corner of the view
  view.ui.add(["account"], "top-right");
  view.ui.add([toggle, "partLogoDiv", layerList], "bottom-left");
  view.ui.add([locateWidget, legend], "bottom-right");
  view.ui.move(["zoom"], "bottom-right");
  
  /*
  document.getElementById("account").addEventListener("click", function() {
    var e = document.getElementById("sign-in-menu");
    if (e.style.visibility == "hidden") {
      e.style.visibility = "visible";
      e.style.opacity = "1";
    } else {
      e.style.opacity = "0";
      setTimeout(() => {
        e.style.visibility = "hidden";
      }, 500);
    }
  });
  */

  /* if user is logged in (esri_auth cookie is present) */
  if (getCookie("esri_auth") != "") {
    changeUserInfoHTML(getCookieEmail());
    setUpNavMenu();
    addAccountEventListenerHome();
  }else{
    addAccountEventListenerSignIn();
  }
});
