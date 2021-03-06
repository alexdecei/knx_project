var vitesse = "500";
var knx = require("knx");
var tps = 1000;
var secTime = 0;
var boolChenillard = false;
var boolChenillardInverse = false;

function recupVitesse() {
  vitesse = document.getElementById("vTemps").value;
  if (parseInt(vitesse) < 500 || isNaN(parseInt(vitesse))) {
    vitesse = "500";
  }
  document.getElementById("vTemps2").innerHTML = "Vitesse en ms: " + vitesse;
  tps = parseInt(vitesse);
}

function changeSens() {
  if (boolChenillard == true) {
    boolChenillard = false;
    wait(secTime, "arrière");
  } else if (boolChenillardInverse == true) {
    boolChenillardInverse = false;
    wait(secTime, "avant");
  }
}

function demandeConnexion() {
  document.getElementById("idconnexion").innerHTML =
    "<strong> Déconnecté <strong>";

  connect();
}

function connectGlobal() {
  console.log("Tentative de connexion...");

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
        document.getElementById("idconnexion").innerHTML =
          "<strong> Connecté <strong>";
        console.log("Connexion à la plateforme KNX réussie !");
        console.log(
          "______________________________________________________________________________"
        );
      },
      // get notified for all KNX events:
      event: function(evt, src, dest, value) {
        console.log(
          "event: %s, src: %j, dest: %j, value: %j",
          evt,
          src,
          dest,
          value
        );

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

async function chenillard() {
  boolChenillard = true;
  while (boolChenillard) {
    secTime = 4 * tps;
    connection.write("0/1/1", 1);
    await sleepSYNC(tps);
    secTime -= tps;
    connection.write("0/1/1", 0);
    connection.write("0/1/2", 1);
    await sleepSYNC(tps);
    secTime -= tps;
    connection.write("0/1/2", 0);
    connection.write("0/1/3", 1);
    await sleepSYNC(tps);
    secTime -= tps;
    connection.write("0/1/3", 0);
    connection.write("0/1/4", 1);
    await sleepSYNC(tps);
    secTime -= tps;
    connection.write("0/1/4", 0);
  }
}

async function chenillardInverse() {
  boolChenillardInverse = true;
  while (boolChenillardInverse) {
    secTime = 4 * tps;
    connection.write("0/1/4", 1);
    await sleepSYNC(tps);
    secTime -= tps;
    connection.write("0/1/4", 0);
    connection.write("0/1/3", 1);
    await sleepSYNC(tps);
    secTime -= tps;
    connection.write("0/1/3", 0);
    connection.write("0/1/2", 1);
    await sleepSYNC(tps);
    secTime -= tps;
    connection.write("0/1/2", 0);
    connection.write("0/1/1", 1);
    await sleepSYNC(tps);
    secTime -= tps;
    connection.write("0/1/1", 0);
  }
}

async function init() {
  connection.write("0/1/1", 0);
  connection.write("0/1/2", 0);
  connection.write("0/1/3", 0);
  connection.write("0/1/4", 0);
  await sleepSYNC(500);
  connection.write("0/1/1", 1);
  await sleepSYNC(500);
  connection.write("0/1/2", 1);
  await sleepSYNC(500);
  connection.write("0/1/3", 1);
  await sleepSYNC(500);
  connection.write("0/1/4", 1);
  await sleepSYNC(1000);
  connection.write("0/1/1", 0);
  connection.write("0/1/2", 0);
  connection.write("0/1/3", 0);
  connection.write("0/1/4", 0);
  await sleepSYNC(500);
}

async function wait(temps, sens) {
  await sleepSYNC(temps);
  if (sens == "avant") {
    chenillard();
  } else if (sens == "arrière") {
    chenillardInverse();
  }
}

function sleepSYNC(temps) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve("fini");
    }, temps);
  });
}

process.stdin.on("readable", () => {
  process.stdin.resume();
  process.stdin.setEncoding("UTF8");
  const chunk = process.stdin.read();
  const cmd = chunk.toString().substring(0, chunk.toString().length - 2); // On élimine le /r/n
  if (cmd !== null) {
    if (cmd.indexOf("/") != -1) {
      // Si il y a un /, on traite la commande différemment
      var opt = cmd.split("/")[1]; // On garde ce qui est après le /
      switch (true) {
        case opt == "disconnect":
          connection.Disconnect(); // Ligne à garder, fondement de la déconnexion
          console.log(
            "Déconnexion réussie. Merci de votre passage chez KNX. Veuillez taper CTRL+C pour terminer la session."
          );
          break;
      }
    }
  }
});
