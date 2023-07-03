/* Opens the rightside Nav menu */
function openNav() {
  document.getElementById("Sidenav").style.width = "300px";
}

/* Closes the rightside Nav menu */
function closeNav() {
  document.getElementById("Sidenav").style.width = "0px";
}

/* Changes to open or close depending on what it was */
function changeNav() {
  var e = document.getElementById("Sidenav");
  if (e.style.width.includes("0px")) {
    openNav();
  } else {
    closeNav();
  }
}

/* fetches cookie with specific name if it exists */
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/* Fetchs the esri_auth cookie and returns json */
function getCookieJSON(){
    return JSON.parse(getCookie("esri_auth"));
}

/* fetches email from esri_auth */
function getCookieEmail(){
    let json = getCookieJSON();
    if(typeof json.username !== 'undefined'){
      return json.username;
    }else{
      return json.email;
    }
}

/* Changes THUMBNAIL and greeting by fetching user's "data" as json */
function changeUserInfoHTML(email){
    let url = 'https://www.foretclimat.ca/portal/sharing/rest/community/users/' + email + '?f=pjson';
    jQuery.getJSON(url, function(data){
        if(data.thumbnail != null && document.getElementById("accountThumbnail") != null){
            thumbnailVar = "https://www.foretclimat.ca/portal/sharing/rest/community/users/" +
            getCookieEmail() + "/info/" + data.thumbnail;
            document.getElementById("accountThumbnail").src = thumbnailVar;
        }
        if(document.documentElement.lang == "en"){
          document.getElementById("greeter").innerHTML = "Hello, " + data.fullName + "!";
        }else{
          document.getElementById("greeter").innerHTML = "Bonjour, " + data.fullName + "!";
        }
    });
    
}

/* Changes the nav menu if the user is logged in */
function setUpNavMenu(){
    var userEl = document.getElementsByClassName("SidenavElement user");
    for (var i = 0; i < userEl.length; i++){
        userEl[i].style = "display:block;"
    }
    var anonymousEl = document.getElementsByClassName("SidenavElement anonymous");
    for (var i = 0; i < anonymousEl.length; i++){
        anonymousEl[i].style = "display:none;"
    }
}

/* Changes from signin.html to homepage */
function addAccountEventListenerSignIn(){
  document.getElementById('account').addEventListener("click", function() {
    window.location = "./signin.html";
  });
}

function addAccountEventListenerHome(){
  document.getElementById('account').addEventListener("click", function() {
    window.location = "./user.html";
  });
}

/* not used, sets language according to navigator settings */
function setLangUser(){
  var userLang = navigator.language || navigator.userLanguage;
  if (userLang.includes('fr')){
    window.location.href = "./index.html";
  }else if(userLang.includes('en')){
    window.location.href = "./index_en.html";
  }
}

/* Handles bottom-right Switch toggle changes. If it's checked => display every layer, otherwise => display layer for visitors */
function handleChangeLayersMode(){
  if(document.getElementById("switchLayers").checked){
    setResearchMode();
  }else{
    setPublicMode();
  }
}

/* Hides every layer from BD_Inventaires_Secteur_gdb and displays the rest */
function setPublicMode(){
  for (const layer of Window.map.allLayers.items){
    if (layer.url.includes("BD_Inventaires_Secteur_gdb") && !layer.url.includes("World_Imagery") && !layer.url.includes("cdn.arcgis.com")){
      layer.visible = false;
      layer.listMode = 'hide';
    }else{
      layer.visible = true;
      layer.listMode = 'show';
    }
  }
}

/* Makes every layer "showable" and makes every layer from BD_Inventaires_Secteur_gdb visible on the screen */
function setResearchMode(){
  for (const layer of Window.map.allLayers.items){
    if (layer.url.includes("BD_Inventaires_Secteur_gdb") || layer.url.includes("World_Imagery") || layer.url.includes("cdn.arcgis.com")){
      layer.visible = true;
    }else{
      layer.visible = false;
    }
    layer.listMode = 'show';
  }
}

/* Shows the 0.9 opacity black background to be used during the tutorial */
function showBlackBG(){
  const background = document.getElementById("blackBG");
  background.style.display = 'inline';

}

/* Hides the 0.9 opacity black background to be used during the tutorial */
function hideBlackBG(){
  const background = document.getElementById("blackBG");
  background.style.display = 'none';
}

/* Ends the tutorial (when you skip or at the end) it hides the box and the background */
function skipTutorial(){
  const tutBox = document.getElementById('tutorialBox');
  tutBox.style.display = 'none';
  let uiElements = document.getElementsByClassName("esri-ui-inner-container esri-ui-corner-container")[0];
  for(const element of uiElements.childNodes){
    element.style.zIndex = 'initial';
  }
  hideBlackBG();
}

/* Pauses the tutorial until you click on the "Next" Button */
function waitForNext(){
  var buttonNext = document.getElementById('tutorialNext');
  var buttonPrevious = document.getElementById('tutorialPrevious');
  var buttonSkip = document.getElementById('tutorialSkip');
  return new Promise(resolve => {
    buttonNext.addEventListener('click',
        async function handler(event) {
          buttonNext.removeEventListener('click', handler);
          buttonPrevious.removeEventListener('click', handler);
          buttonSkip.removeEventListener('click', handler);
          resolve("next")
        });
    buttonPrevious.addEventListener('click',
      async function handler(event) {
        buttonPrevious.removeEventListener('click', handler);
        buttonNext.removeEventListener('click', handler);
        buttonSkip.removeEventListener('click', handler);
        resolve("previous")
    });
    buttonSkip.addEventListener('click',
        async function handler(event) {
          buttonNext.removeEventListener('click', handler);
          buttonPrevious.removeEventListener('click', handler);
          buttonSkip.removeEventListener('click', handler);
          resolve("skip")
        });
  })   
}

/* Starts the tutorial scenario from the beginning */
function startTutorial(){
  const tutBox = document.getElementById('tutorialBox');
  tutBox.style.display = 'inline';
  showBlackBG();
  let previous = document.getElementById("tutorialPrevious");
  previous.style.display = "none"
  if(document.documentElement.lang == "en"){
    document.getElementById("tutorialInfo").innerHTML = "<p>Welcome to the Forêt-Climat website.<br></p><p>Click on \"Next\" to follow the tutorial.</p><p>You can also \"Skip\" at any moment.</p>";
  }else{
    document.getElementById("tutorialInfo").innerHTML = "<p>Bienvenue sur le site de la passerelle Forêt-Climat.<br></p><p>Cliquez sur « Suivant » pour suivre le tutoriel.</p><p>Vous pouvez aussi « Passer » à tout moment.</p>";
  }
  waitForNext().then((resolve) => {
    if(resolve == "next"){
      previous.style.display = "inline"
      controlsTutorial(tutBox);
    }
  });
}

/* 2nd step of tutorial (controls on the map) */
function controlsTutorial(tutBox){
  if(document.documentElement.lang == "en"){
    document.getElementById("tutorialInfo").innerHTML = "<p>Left click lets you naviguate the map.</p><p>Right click lets your rotate the map.</p><p>The mouse wheel controls the zoom.</p>";
  }else{
    document.getElementById("tutorialInfo").innerHTML = "<p>Le clique gauche permet de naviguer sur la carte.</p><p>Le clique droit permet de faire des rotations.</p><p>La molette de la souris permet de zoomer ou de dézoomer.</p>";
  }
  waitForNext().then((resolve) => {
    if(resolve == "next"){
      topRightTutorial(tutBox);
    }else if(resolve == "previous"){
      startTutorial(tutBox)
    }
  });
}
/*
// 3rd step of tutorial (Top left) 
function topLeftTutorial(tutBox){
  if(document.documentElement.lang == "en"){
    document.getElementById("tutorialInfo").innerHTML = "<p>There is the search bar.</p><p>You are able to select a specific layer for the search by clicking on the small arrow to the left.</p>";
  }else{
    document.getElementById("tutorialInfo").innerHTML = "<p>Voici la barre de recherche.</p><p>Il est possible de séléctionner une couche précise pour faire la recherche en cliquant sur la flèche à gauche.</p>";
  }
  let topElements = document.getElementsByClassName("esri-ui-top-left")[0];
  topElements.style.zIndex = 1000;
  waitForNext().then((bool) => {
    if(bool){
      topElements.style.zIndex = 'initial';
      topRightTutorial(tutBox);
    }
  });
}
*/

/* 4th step of tutorial (Top right) */
function topRightTutorial(tutBox){
  if(document.documentElement.lang == "en"){
    document.getElementById("tutorialInfo").innerHTML = "<p>Click on the profile icon to log in to your institution or your Forêt-Climat account.</p><p>Click on the menu to access the the rest of the site or the Storymaps.</p>";
  }else{
    document.getElementById("tutorialInfo").innerHTML = "<p>Cliquez sur l'icone de profil pour vous connecter avec votre compte d'établissement ou votre compte Forêt-Climat.</p><p>Cliquez sur le menu pour accéder au reste du site ou aux Storymaps.</p>";
  }
  let next = document.getElementById("tutorialNext");
  let topElements = document.getElementsByClassName("esri-ui-top-right")[0];
  topElements.style.zIndex = 1000;
  if(document.documentElement.lang == "en"){
    next.innerHTML = "Close";
  }else{
    next.innerHTML = "Terminer";
  }
  waitForNext().then((resolve) => {
    topElements.style.zIndex = 'initial';
    if(document.documentElement.lang == "en"){
      next.innerHTML = "Next";
    }else{
      next.innerHTML = "Suivant";
    }
    if(resolve == "next"){
      skipTutorial()
    }else if(resolve == "previous"){
      controlsTutorial(tutBox);
    }
  });
}

/*
// 5th step of tutorial (Bottom left) 
function bottomLeftTutorial(tutBox){
  if(document.documentElement.lang == "en"){
    document.getElementById("tutorialInfo").innerHTML = "<p>The bottom left map lets you change the basemap.</p>";
  }else{
    document.getElementById("tutorialInfo").innerHTML = "<p>La carte en bas à gauche permet de changer le fond de carte.</p>";
  }
  let bottomElements = document.getElementsByClassName("esri-ui-bottom-left")[0];
  bottomElements.style.zIndex = 1000;
  waitForNext().then((bool) => {
    if(bool){
      bottomElements.style.zIndex = 'initial';
      bottomRightTutorial(tutBox);
    }
  });
}
*/
/*
// 6th step of tutorial (Bottom right)
function bottomRightTutorial(tutBox){
  if(document.documentElement.lang == "en"){
    document.getElementById("tutorialInfo").innerHTML = "<p>You can find the legend at the bottom right. By clicking the eye, you can either hide or show the different layers.</p><p>The toggle switch lets you see additional layers</p><p>The « i » restarts the tutorial.</p><p>The compass reorients the view towards the north.</p><p>The localization button shows your location on the map and moves the view to where you are.</p><p>The buttons at the bottom control the zoom.</p>";
  }else{
    document.getElementById("tutorialInfo").innerHTML = "<p>En bas à droite se trouve la légende. En cliquant sur l'oeil, il est possible de masquer ou démasquer les différentes couches.</p><p>L'interrupteur permet de montrer des couches supplémentaires.</p><p>Le « i » permet de recommencer le tutoriel.</p><p>La boussole permet de réorienter la vue vers le nord.</p><p>Le bouton de localisation permet de voir votre emplacement sur la carte et de ramener la vue sur l'endroit où vous vous trouvez.</p><p>Les boutons du bas gèrent le zoom.</p>";
  }
  let next = document.getElementById("tutorialNext");
  let skip = document.getElementById("tutorialSkip");
  let bottomElements = document.getElementsByClassName("esri-ui-bottom-right")[0];
  bottomElements.style.zIndex = 1000;
  if(document.documentElement.lang == "en"){
    next.innerHTML = "Close";
  }else{
    next.innerHTML = "Terminer";
  }
  next.style.float = "";
  skip.style.display = "none";

  waitForNext().then(() => {
    bottomElements.style.zIndex = 'initial';
    skipTutorial()
    if(document.documentElement.lang == "en"){
      next.innerHTML = "Next";
    }else{
      next.innerHTML = "Suivant";
    }
    next.style.float = "left";
    skip.style.display = "initial";
  });
}
*/

/* Waits for an element to display to callback */
function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
          return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}

/* Displays or hides the FeatureTable according to the switch */
function handleChangeTable(){
    mySwitch = document.getElementById("switchTable");
    if(mySwitch.checked){
      showTable();
    }else{
      hideTable();
    }
}

/* Shows the table */
function showTable(){
    document.getElementById("tableContainer").style.display = "block";
}

/* Hides the tables */
function hideTable(){
    document.getElementById("tableContainer").style.display = "none";
}


if (getCookie("esri_auth") != "") {
  changeUserInfoHTML(getCookieEmail());
  setUpNavMenu();
}