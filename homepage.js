require([
  "esri/config",
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/Search",
  "esri/widgets/BasemapToggle"
], (esriConfig, WebMap, MapView, Search, BasemapToggle) => {
  esriConfig.portalUrl = "https://www.foretclimat.ca/portal";
  const map = new WebMap({
    portalItem: {
      // autocasts as new PortalItem()
      id: "4fd64f46127f43b79c4f977b10d97c57" // id is in the content page url
    }
  });

  const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [288.88, 47.305], // location on the map
    zoom: 13 // zoom level
  });

  const search = new Search({
    view: view
  });

  const toggle = new BasemapToggle({
    view: view,
    nextBasemap: "hybrid"
  });

  view.ui.add(["textBoxDiv", "partLogoDiv"], "manual");
  // places the search widget in the top right corner of the view
  view.ui.add(search, "manual");
  view.ui.add(toggle, "bottom-left");
  view.ui.move(["zoom", view], "bottom-right");
  document.getElementById("account").addEventListener("click", function() {
    var e = document.getElementById("sign-in-menu");
    if (e.style.visibility == "hidden") {
      e.style.visibility = "visible";
      e.style.opacity = "1";
    } else {
      e.style.opacity = "0";
      setTimeout(() => {  e.style.visibility = "hidden"; }, 500);
    }
  });

  document.getElementById("login").addEventListener("click", function() {
    var e = document.getElementById("ddlInstitution");
    var strInstitution = e.value;
    window.location.href = "https://www.foretclimat.ca/portal/home/signin.html";
  });


});
