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
  //esriConfig.portalUrl = "https://www.foretclimat.ca/portal";
  esriConfig.portalUrl = "https://ulaval.maps.arcgis.com/";
  intl.setLocale("fr-FR");

  const myPortal = new Portal({
    url: esriConfig.portalUrl
  });

  const map = new WebMap({
    portalItem: {
      // autocasts as new PortalItem()
      id: "111d03a57a604f18a46b85eecb634f30", // id is in the content page url
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
    sources: [ //https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html#sources
      {
        layer: new FeatureLayer({
          url: "https://services2.arcgis.com/RkhyeW7cqOfSjlQG/arcgis/rest/services/myMap_WFL1/FeatureServer",
          outFields: ["*"]
        }),
        popupTemplate: {
          
        },
        exactMatch: false,
        outFields: ["*"],
        name: "Données Forêt Montmorency",
        placeholder: "Chercher des couches ou des données",
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
