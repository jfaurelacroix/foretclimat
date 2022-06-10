require([
  "esri/config",
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/Search",
  "esri/widgets/BasemapToggle",
  "esri/widgets/Locate",
  "esri/portal/Portal"
], (esriConfig, WebMap, MapView, Search, BasemapToggle, Locate, Portal) => {
  esriConfig.portalUrl = "https://www.foretclimat.ca/portal";

  const myPortal = new Portal({
    url: esriConfig.portalUrl
  });

  const map = new WebMap({
    portalItem: {
      // autocasts as new PortalItem()
      id: "4fd64f46127f43b79c4f977b10d97c57", // id is in the content page url
      portal: myPortal
    }
  });

  const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [288.88, 47.305], // location on the map
    zoom: 13 // zoom level
  });

  const search = new Search({
    view: view,
    portal: myPortal, // https://enterprise.arcgis.com/fr/portal/latest/administer/windows/configure-portal-to-geocode-addresses.htm
    sources: [] //https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html#sources
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
  view.ui.move(["zoom"], "bottom-right");
  view.ui.add(locateWidget, "bottom-right");

  document.getElementById("account").addEventListener("click", function() {
    /*var e = document.getElementById("sign-in-menu");
    if (e.style.visibility == "hidden") {
      e.style.visibility = "visible";
      e.style.opacity = "1";
    } else {
      e.style.opacity = "0";
      setTimeout(() => {
        e.style.visibility = "hidden";
      }, 500);*/

    /* The code above is used to display Login menu */
    document.getElementById("login").click();
  });

  //document.cookie = "esri_auth=cookiecontent"; for testing
  document.getElementById("login").addEventListener("click", function() {
    var e = document.getElementById("ddlInstitution");
    /* À compléter pour le futur */
    var strInstitution = e.value;
    window.location.href = "https://www.foretclimat.ca/portal/home/signin.html";
  });

  /* if user is logged in (esri_auth cookie is present) */
  if (getCookie("esri_auth") != "") {
    changeUserInfoHTML(getCookieEmail());
    setUpNavMenu();
    changeAccountHREF();
  }
});
