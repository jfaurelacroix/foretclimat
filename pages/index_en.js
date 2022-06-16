require([
    "esri/config",
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/Search",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Locate",
    "esri/portal/Portal",
    "esri/layers/FeatureLayer",
    "esri/intl"
  ], (esriConfig, WebMap, MapView, Search, BasemapToggle, Locate, Portal, FeatureLayer, intl) => {
    esriConfig.portalUrl = "https://www.foretclimat.ca/portal";
    intl.setLocale("en-CA");
  
    const myPortal = new Portal({
      url: esriConfig.portalUrl
    });
  
    const map = new WebMap({
      portalItem: {
        // autocasts as new PortalItem()
        id: "b74d05881ff84f45a1ecb1c7eb17e5b1", // id is in the content page url
        portal: myPortal
      }
    });
  
    const view = new MapView({
      map: map,
      container: "viewDiv"
    });
  
    const popupQualRebois = {
      "title": "Reboisement",
      "content": "<b>ID:</b> {OBJECTID}<br><b>Realise:</b> {REALISE}<br><b>YEAR:</b> {ANNEE}<br>"
    }

    const featureQualRebois = new FeatureLayer({
      url: "https://www.foretclimat.ca/server/rest/services/Index_MIL1/MapServer/0",
      outFields: ["OBJECTID", "REALISE", "ANNEE"],
      popupTemplate: popupQualRebois
    });

    const popupRegen = {
      "title": "Regeneration",
      "content": "<b>ID:</b> {OBJECTID}<br><b>COMMENT:</b> {COMMENT}<br><b>DATE:</b> {DATE}<br>"
    }

    const featureRegen = new FeatureLayer({
      url: "https://www.foretclimat.ca/server/rest/services/Index_MIL1/MapServer/1",
      outFields: ["OBJECTID", "COMMENT", "DATE"],
      popupTemplate: popupRegen
    });

    map.add(featureQualRebois);
    map.add(featureRegen);

    const search = new Search({
      view: view,
      portal: myPortal, // https://enterprise.arcgis.com/fr/portal/latest/administer/windows/configure-portal-to-geocode-addresses.htm
      sources: [ //https://developers.arcgis.com/javascript/latest/sample-code/widgets-search-multiplesource/
        {
          layer: featureQualRebois,
          exactMatch: false,
          outFields: ["*"],
          maxResults: 6,
          maxSuggestions: 6,
          suggestionsEnabled: true,
          minSuggestCharacters: 0
        },
        {
          layer: featureRegen,
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
    view.ui.add([toggle, "partLogoDiv"], "bottom-left");
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

    /*Adds signout*/
    document.getElementById("signout").addEventListener("click", function(){
      signOut();
      window.location.href="./index.html";
    });

});
  