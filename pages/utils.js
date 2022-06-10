/* Opens the rightside Nav menu */
function openNav() {
  document.getElementById("Sidenav").style.width = "250px";
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
    let username = getCookieJSON().email;
    return username;
}

/* Changes THUMBNAIL and greeting by fetching user's "data" as json */
function changeUserInfoHTML(email){
    let url = 'https://www.foretclimat.ca/portal/sharing/rest/community/users/' + email + '?f=pjson';
    jQuery.getJSON(url, function(data){
        console.log(data);
        if(data.thumbnail != null){
            thumbnailVar = "https://www.foretclimat.ca/portal/sharing/rest/community/users/" +
            getCookieEmail() + "/info/" + data.thumbnail;
            document.getElementById("accountThumbnail").src = thumbnailVar;
        }
        document.getElementById("greeter").innerHTML = "Hello, " + data.fullName + "!";
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