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
  "esri/widgets/LayerList"
], (esriConfig, WebMap, MapView, Search, BasemapToggle, Locate, Portal, FeatureLayer, intl, LayerList) => {
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

  const layerList = new LayerList({
    view: view
  });
  const search = new Search({
    view: view,
    portal: myPortal, // https://enterprise.arcgis.com/fr/portal/latest/administer/windows/configure-portal-to-geocode-addresses.htm
    sources: [ //https://developers.arcgis.com/javascript/latest/sample-code/widgets-search-multiplesource/
      {
        layer: new FeatureLayer({
          url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/0",
          outFields: ["*"]
        }),
        name: "Points inventaire de matière ligneuse non utilisée",
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: new FeatureLayer({
          url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/1",
          outFields: ["*"]
        }),
        name: "Polygones inventaire de matière ligneuse non utilisée",
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: new FeatureLayer({
          url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/2",
          outFields: ["*"]
        }),
        name: "Points inventaire d'intervention",
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: new FeatureLayer({
          url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/3",
          outFields: ["*"]
        }),
        name: "Polygones inventaire d'intervention'",
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: new FeatureLayer({
          url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/4",
          outFields: ["*"]
        }),
        name: "Points inventaire de reboisement",
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: new FeatureLayer({
          url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/5",
          outFields: ["*"]
        }),
        name: "Polygones inventaire de reboisement",
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: new FeatureLayer({
          url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/6",
          outFields: ["*"]
        }),
        name: "Points inventaire de récolte",
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: new FeatureLayer({
          url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/8",
          outFields: ["*"]
        }),
        name: "Polygones inventaire de récolte",
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: new FeatureLayer({
          url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/7",
          outFields: ["*"]
        }),
        name: "Points inventaire de régénération",
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: new FeatureLayer({
          url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/9",
          outFields: ["*"]
        }),
        name: "Polygones inventaire de régénération",
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: new FeatureLayer({
          url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/10",
          outFields: ["*"]
        }),
        name: "Points inventaire de suivi de plantation",
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: new FeatureLayer({
          url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/12",
          outFields: ["*"]
        }),
        name: "Polygones inventaire de suivi de plantation",
        exactMatch: false,
        outFields: ["*"],
        maxResults: 6,
        maxSuggestions: 6,
        suggestionsEnabled: true,
        minSuggestCharacters: 0
      },
      {
        layer: new FeatureLayer({
          url: "https://www.foretclimat.ca/server/rest/services/Hosted/BD_Inventaires_Secteur_gdb/FeatureServer/11",
          outFields: ["*"]
        }),
        name: "Secteur",
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

  view.ui.add(["textBoxDiv", search], "top-left");
  // places the search widget in the top right corner of the view
  view.ui.add(["account"], "top-right");
  view.ui.add([toggle, "partLogoDiv", layerList], "bottom-left");
  view.ui.add([locateWidget], "bottom-right");
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
