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

function showBlackBG(){
  const background = document.getElementById("blackBG");
  background.style.display = 'inline';

}

function hideBlackBG(){
  const background = document.getElementById("blackBG");
  background.style.display = 'none';
}

function showElementInFront(id){
  const element = document.getElementById(id);
  element.style.zIndex = '1000';
}

function hideElementInFront(id){
  const element = document.getElementById(id);
  element.style.zIndex = '1';
}

function setPositionAndText(tutBox, text, top, bottom, left, right){
  if(typeof top != 'undefined'){
    tutBox.style.bottom = "";
    tutBox.style.top = top;
  }
  if(typeof bottom != 'undefined'){
    tutBox.style.top = "";
    tutBox.style.bottom = bottom;
  }
  if(typeof left != 'undefined'){
    tutBox.style.right = "";
    tutBox.style.left = left;
  }
  if(typeof right != 'undefined'){
    tutBox.style.left = "";
    tutBox.style.right = right;
  }
  document.getElementById("tutorialInfo").innerHTML = text;
}

function startTutorial(){
  const tutBox = document.getElementById('tutorialBox');
  tutBox.style.display = 'inline';
  showBlackBG();
  setPositionAndText(tutBox, "Bienvenue sur le site de la passerelle Forêt-Climat.<br><br>Cliquez sur « Suivant » pour suivre le tutoriel.<br> Vous pouvez aussi « Passer » à tout moment.", '50%', undefined, undefined,'50%');
  waitForNext().then(() => {
    accountTutorial();
  });

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