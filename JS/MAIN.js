var vitesse = "500";
var sensInverse = false;

function recupVitesse() {
  vitesse = document.getElementById("vTemps").value;
  if (parseInt(vitesse) < 500 || isNaN(parseInt(vitesse))) {
    vitesse = "500";
  }
  document.getElementById("vTemps2").innerHTML = "Vitesse en ms: " + vitesse;
}

function changeSens() {
  sensInverse = !sensInverse;
}

function demandeConnexion() {
  document.getElementById("idconnexion").innerHTML =
    "<strong> Déconnecté <strong>";

  // if(CONNEXIONETABLIE){
  //   document.getElementById("idconnexion").innerHTML =
  //     "<strong> Connecté <strong>";
  // }
}

function connect() {
  var knx = require("knx");
  console.log("Tentative de connexion...");

  var tps = 1000;
  var secTime = 0;
  var boolChenillard = false;
  var boolChenillardInverse = false;

  var connection = new knx.Connection({
    // ip address and port of the KNX router or interface
    ipAddr: "192.168.0.5",
    ipPort: 3671,
    // set the log level for messsages printed on the console. This can be 'error', 'warn', 'info' (default), 'debug', or 'trace'.
    loglevel: "info",

    // define your event handlers here:
    handlers: {
      // wait for connection establishment before sending anything!
      connected: function() {
        init();
        console.log("Connexion à la plateforme KNX réussie !");
        console.log(
          "______________________________________________________________________________"
        );
      },
      // get notified for all KNX events:
      event: function(evt, src, dest, value) {
        //console.log(
        //  "event: %s, src: %j, dest: %j, value: %j",
        //  evt, src, dest, value
        //);

        // Allumage et extinction du chenillard
        if (dest == "0/3/1") {
          if (boolChenillard == false && boolChenillardInverse == false) {
            boolChenillardInverse = false;
            chenillard();
          } else {
            boolChenillard = false;
            boolChenillardInverse = false;
          }
        }

        // Augmente le délai
        if (dest == "0/3/2") {
          tps += 100;
          console.log(tps);
        }

        // Diminue le délai
        if (dest == "0/3/3") {
          if (tps <= 500) {
            // La limite temporelle des relais est de 500 ms.
            console.log(
              "Impossible de descendre en dessous de 500 ms. Limite atteinte."
            );
          } else {
            tps -= 100;
          }
          console.log(tps);
        }

        // Inverse le sens du chenillard
        if (dest == "0/3/4") {
          if (boolChenillard == true) {
            boolChenillard = false;
            wait(secTime, "arrière");
          } else if (boolChenillardInverse == true) {
            boolChenillardInverse = false;
            wait(secTime, "avant");
          }
        }
      },
      // get notified on connection errors
      error: function(connstatus) {
        console.log("**** ERROR: %j", connstatus);
      }
    }
  });
}
