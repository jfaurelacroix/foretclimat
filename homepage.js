require([
  "esri/identity/OAuthInfo",
  "esri/config",
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/Search",
  "esri/widgets/BasemapToggle"
], (OAuthInfo, esriConfig, WebMap, MapView, Search, BasemapToggle) => {
  esriConfig.portalUrl = "https://www.foretclimat.ca/portal";

  let auth = new OAuthInfo({
    portalUrl: esriConfig.portalUrl
  });

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
      setTimeout(() => {
        e.style.visibility = "hidden";
      }, 500);
    }
  });

  document.cookie = 'esri_auth=%7B%22portalApp%22%3Atrue%2C%22email%22%3A%22BRCAU5%40ulaval.ca%22%2C%22token%22%3A%22ONTnG8naWH5sJLyfxZNecZPk7j9ksT-iBAofQEgvFHWpMucD-XL6r5QpxRWUqDcWoeaRsMoMkeH5Nl6q3dfyr4pEeZyM_uWZOgMsl3iv6dr-dOBDhJDZe6VrouNs-SQ2Vq8S1zetNV5BvcjRD2_JZ9_TJDmgcf4C1-8mEDwCaExh78edjgVnYjR4v05ONw5rUw2nLeIx1d0SbacRFJ5LBHu8MDI8ccZqvboGPq5ZEUE.%22%2C%22expires%22%3A1656002922194%2C%22allSSL%22%3Atrue%2C%22persistent%22%3Afalse%2C%22created%22%3A1654798122194%2C%22culture%22%3A%22%22%2C%22region%22%3Anull%2C%22accountId%22%3A%220123456789ABCDEF%22%2C%22role%22%3A%22org_user%22%2C%22customBaseUrl%22%3A%22www.foretclimat.ca%2Fportal%22%7D';
  document.getElementById("login").addEventListener("click", function() {
    var e = document.getElementById("ddlInstitution");
    var strInstitution = e.value;
    window.location.href = "https://www.foretclimat.ca/portal/home/signin.html";
  });

  var thumbnail = "https://www.foretclimat.ca/portal/home/10.9.0/js/arcgisonline/css/images/no-user-thumb.jpg";
  if (getCookie("esri_auth") != "") {
    var userJSON = getUserJSON(getCookieEmail());
    if (userJSON != ""){
      if(userJSON.thumbnail != null){
      thumbnail =
        "https://www.foretclimat.ca/portal/sharing/rest/community/users/" +
        getCookieEmail() + "/info/" + userJSON.thumbnail;
      document.getElementById("greeter").innerHTML = "Hello, " + userJSON.fullName + "!";
      }
    }
  }

  document.getElementById("accountThumbnail").src = thumbnail;
});
