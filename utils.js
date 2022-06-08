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
