function openNav() {
  document.getElementById("Sidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("Sidenav").style.width = "0px";
}

function changeNav() {
  var e = document.getElementById("Sidenav");
  if (e.style.width.includes("0px")) {
    openNav();
  } else {
    closeNav();
  }
}

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

function getCookieJSON(){
    return JSON.parse(getCookie("esri_auth"));
}

function getCookieEmail(){
    let username = getCookieJSON().email;
    return username;
}

function getUserJSON(email){
    let url = '../sharing/rest/community/users/' + email + '?f=pjson';
    var answer = "";
    jQuery.getJSON(url, function(data){
        answer = data;
    });
    return answer;
}