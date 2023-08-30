//Fetch IP
       
$.getJSON("https://api.ipify.org?format=json", function(data) {

    data.ip;
                
        $("#newInstance").on("click", function(){
        //Créer instance Paraview rc si existe pas deja pour cette ip
        fetch("https://www.foretclimat.dev/paraview/createinstance", {
        method: "POST",
        body: JSON.stringify({
            userIp: data.ip,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        })
        .then((response) => response.json())
        .then((json) => $("infoInstance").text("Un serveur Paraview Client/Serveur reverse connection a été lancé. Vous pouvez vous y connecter au port suivant:" + json.port.toString() + "<br> avec l'id de connection suivant: " + json.id.toString()));
    })
})
//Donner le port et le id connection à l'utilisateur