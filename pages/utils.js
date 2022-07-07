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
        if(data.thumbnail != null){
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
    window.location = "./home.html";
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

function handleChange(mySwitch){
  if(mySwitch.checked){
    setResearchMode();
  }else{
    setPublicMode();
  }
}


function setPublicMode(){
  for (const layer of Window.map.allLayers.items){
    if (layer.url.includes("BD_Inventaires_Secteur_gdb") && !layer.url.includes("World_Imagery")){
      layer.visible = false;
      layer.listMode = 'hide';
    }else{
      layer.visible = true;
      layer.listMode = 'show';
    }
  }
}

function setResearchMode(){
  for (const layer of Window.map.allLayers.items){
    if (layer.url.includes("BD_Inventaires_Secteur_gdb") || layer.url.includes("World_Imagery")){
      layer.visible = true;
    }else{
      layer.visible = false;
    }
    layer.listMode = 'show';
  }

}

function showBlackBG(){
  const background = document.getElementById("blackBG");
  background.style.display = 'inline';

}

function hideBlackBG(){
  const background = document.getElementById("blackBG");
  background.style.display = 'none';
}

function skipTutorial(){
  const tutBox = document.getElementById('tutorialBox');
  tutBox.style.display = 'none';
  hideBlackBG();
}

function waitForNext(){
  var myButton = document.getElementById('tutorialNext');
  return new Promise(resolve => {
    myButton.addEventListener('click',
        async function handler(event) {
            myButton.removeEventListener('click', handler);
            resolve(true)
        });
      })
}

function startTutorial(){
  const tutBox = document.getElementById('tutorialBox');
  tutBox.style.display = 'inline';
  showBlackBG();
  document.getElementById("tutorialInfo").innerHTML = "<p>Bienvenue sur le site de la passerelle Forêt-Climat.<br></p><p>Cliquez sur « Suivant » pour suivre le tutoriel.</p><p>Vous pouvez aussi « Passer » à tout moment.</p>";
  waitForNext().then(() => {
    controlsTutorial(tutBox);
  });
}

function controlsTutorial(tutBox){
  document.getElementById("tutorialInfo").innerHTML = "<p>Le clique gauche permet de naviguer sur la carte.</p><p>Le clique droit permet de faire des rotations.</p><p>La molette de la souris permet de zoomer ou de dézoomer.</p>";
  waitForNext().then(() => {
    topLeftTutorial(tutBox);
  });
}

function topLeftTutorial(tutBox){
  document.getElementById("tutorialInfo").innerHTML = "<p>Voici la barre de recherche.</p><p>Il est possible de séléctionner une couche précise pour faire la recherche en cliquant sur la flèche à gauche.</p>";
  let topElements = document.getElementsByClassName("esri-ui-top-left")[0];
  topElements.style.zIndex = 1000;
  waitForNext().then(() => {
    topElements.style.zIndex = 'initial';
    topRightTutorial(tutBox);
  });
}

function topRightTutorial(tutBox){
  document.getElementById("tutorialInfo").innerHTML = "<p>Cliquez sur le profil pour vous connecter avec votre compte d'établissement ou votre compte Forêt-Climat.</p><p>Cliquez sur le menu pour accéder au reste du site ou aux Storymaps.</p>";
  let topElements = document.getElementsByClassName("esri-ui-top-right")[0];
  topElements.style.zIndex = 1000;
  waitForNext().then(() => {
    topElements.style.zIndex = 'initial';
    bottomLeftTutorial(tutBox);
  });
}

function bottomLeftTutorial(tutBox){
  document.getElementById("tutorialInfo").innerHTML = "<p>Il est possible de changer le fond de carte en cliquant en bas à droite.</p>";
  let bottomElements = document.getElementsByClassName("esri-ui-bottom-left")[0];
  bottomElements.style.zIndex = 1000;
  waitForNext().then(() => {
    bottomElements.style.zIndex = 'initial';
    bottomRightTutorial(tutBox);
  });
}

function bottomRightTutorial(tutBox){
  document.getElementById("tutorialInfo").innerHTML = "<p>Voici la légende. En cliquant sur l'oeil, il est possible de masquer/montrer les différentes couches.</p><p>L'interrupteur permet de montrer des couches supplémentaires avec des données intéressantes.</p><p>Le « i » permet de recommencer le tutoriel.</p><p>La boussole permet de réorienter la vue selon le nord.</p><p>Le bouton en dessous permet de vous localiser sur la carte et de ramener la vue sur votre emplacement.</p><p>Les derniers boutons permettent de gérer le zoom.</p>";
  let next = document.getElementById("tutorialNext");
  let skip = document.getElementById("tutorialSkip");
  let bottomElements = document.getElementsByClassName("esri-ui-bottom-right")[0];
  bottomElements.style.zIndex = 1000;
  next.innerHTML = "Terminer";
  next.style.float = "";
  skip.style.display = "none";

  waitForNext().then(() => {
    bottomElements.style.zIndex = 'initial';
    skipTutorial()
    next.innerHTML = "Suivant";
    next.style.float = "left";
    skip.style.display = "initial";
  });
}