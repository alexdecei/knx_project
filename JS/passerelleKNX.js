var knx = require('knx');
console.log("Tentative de connexion...");

var tps = 1000;
var boolChenillard = false;
var boolChenillardInverse = false;

var tableauLampes = [0,0,0,0];        // Donne l'état instantanné des lampes
var tableauChenillard = [1,2,3,4];    // Tableau qui donne le numéro des lampes à allumer

var connection = new knx.Connection( {
  // ip address and port of the KNX router or interface
  ipAddr: '192.168.1.5', ipPort: 3671,
  // set the log level for messsages printed on the console. This can be 'error', 'warn', 'info' (default), 'debug', or 'trace'.
  loglevel: 'info',


  // define your event handlers here:
  handlers: {
    // wait for connection establishment before sending anything!
    connected: function() {
      init();
      console.log('Connexion à la plateforme KNX réussie !');
      console.log('______________________________________________________________________________');
    },
    // get notified for all KNX events:
    event: function(evt, src, dest, value) {

      // 
      if (dest == "0/2/1") {
        let obj = JSON.parse(JSON.stringify(value));
        tableauLampes[0]=obj.data[0];
        printTableauLampes();
      }
      if (dest == "0/2/2") {
        let obj = JSON.parse(JSON.stringify(value));
        tableauLampes[1]=obj.data[0];
        printTableauLampes();
      }
      if (dest == "0/2/3") {
        let obj = JSON.parse(JSON.stringify(value));
        tableauLampes[2]=obj.data[0];
        printTableauLampes();
      }
      if (dest == "0/2/4") {
        let obj = JSON.parse(JSON.stringify(value));
        tableauLampes[3]=obj.data[0];
        printTableauLampes();
      }

      // Allumage et extinction du chenillard
      if (dest=="0/3/1") {
        if (boolChenillard == false && boolChenillardInverse == false) {
          tableauChenillard = [1,2,3,4];
          boolChenillardInverse = false;
          chenillard();
        }
        else {
          tableauChenillard = [0,0,0,0];
          boolChenillard = false;
          boolChenillardInverse = false;
        }
      }

      // Augmente le délai
      if (dest=="0/3/2") {
        tps+=100;
        console.log(tps);
      }

      // Diminue le délai
      if (dest=="0/3/3") {
        if (tps<=500) { // La limite temporelle des relais est de 500 ms.
          console.log("Impossible de descendre en dessous de 500 ms. Limite atteinte.")
        }
        else {
          tps-=100;
        }
        console.log(tps);
      }

      // Inverse le sens du chenillard
      if (dest=="0/3/4") {
        if (boolChenillard) {
          boolChenillard = false;
          boolChenillardInverse = true;
        }
        else if (boolChenillardInverse) {
          boolChenillardInverse = false;
          boolChenillard = true;
        }
      }
    },
    // get notified on connection errors
    error: function(connstatus) {
      console.log("**** ERROR: %j", connstatus);
    }
  }
});


function printTableauLampes() {
  tempStr = "État des lampes :\n  ";
  for (var i=0; i<tableauLampes.length;i++) {
    if (tableauLampes[i]==0) {
      tempStr+="◌ ";
    }
    else if (tableauLampes[i]==1) {
      tempStr+="● ";
    }
    else {
      tempStr+="✘ ";
    }
  }
  console.log(tempStr);
}


async function chenillard(){
  boolChenillard = true;
  while(boolChenillard || boolChenillardInverse) {
    for (i=0;i<tableauChenillard.length;) {
      connection.write("0/1/"+tableauChenillard[i],1);
      await sleepSYNC(tps);
      connection.write("0/1/"+tableauChenillard[i],0);
      if (boolChenillard) {
        i++;
      }
      else if(boolChenillardInverse) {
        i--;
      }
    }
  }
}

async function pari(numeroChoisi) {
  var tableauPari = [1,2,3,4];
  var length = tableauPari.length;
  
  allLightsOn();
  await sleepSYNC(2000);
  
  for(var i=0;i<length-1;i++) {
    var rand = Math.floor(Math.random() * tableauPari.length);
    console.log(rand, tableauPari);
    connection.write("0/1/"+tableauPari[rand],0);
    tableauPari.splice(rand,1);
    await sleepSYNC(750);
    console.log(rand, tableauPari);
  }

  if (tableauPari[0]==numeroChoisi) {
    console.log("GAGNÉ ! Vous avez GAGNÉ le droit de REJOUER !");
    return true;
  }
  else {
    console.log("PERDU... Ce jeu est peu marrant...")
    return false;
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

function allLightsOn() {
  connection.write("0/1/1", 1);
  connection.write("0/1/2", 1);
  connection.write("0/1/3", 1);
  connection.write("0/1/4", 1);
}

function allLightsOff() {
  connection.write("0/1/1", 0);
  connection.write("0/1/2", 0);
  connection.write("0/1/3", 0);
  connection.write("0/1/4", 0);
}

function sleepSYNC(temps){
  return new Promise(function(resolve, reject) { setTimeout(function() { resolve('fini');}, temps);});
}

// Lecture ligne de commande
process.stdin.on('readable', () => {
	process.stdin.resume();
	process.stdin.setEncoding('UTF8');
  const chunk = process.stdin.read();
  const cmd = chunk.toString().substring(0,chunk.toString().length-2); // On élimine le /r/n
  if (cmd!== null) {
		if (cmd.indexOf('/')!=-1) 			// Si il y a un /, on traite la commande différemment
		{
      var opt = cmd.split('/')[1].toLowerCase();	// On garde ce qui est après le /
			switch(true) {
				case (opt=='disconnect'):
          connection.Disconnect(); // Ligne à garder, fondement de la déconnexion
          console.log('Déconnexion réussie. Merci de votre passage chez KNX. Veuillez taper CTRL+C pour terminer la session.');
          break;

        case (opt=='chenillard'):
          if (boolChenillard == false && boolChenillardInverse == false) {
            tableauChenillard = [1,2,3,4];
            boolChenillardInverse = false;
            chenillard();
          }
          else {console.log('Le chenillard est déjà en cours de fonctionnement.');}
          break;

        case (opt=='stop'):
          if (!(boolChenillard == false && boolChenillardInverse == false)) {            
            tableauChenillard = [0,0,0,0];
            boolChenillard = false;
            boolChenillardInverse = false;
          }
          else {console.log('Le chenillard n\'est pas allumé');}
          break;

        case (opt=='inverse'):
          if (boolChenillard) {
            boolChenillard = false;
            boolChenillardInverse = true;
          }
          else if (boolChenillardInverse) {
            boolChenillardInverse = false;
            boolChenillard = true;
          }
          break;

        case (opt=='vitesse'):
          var speed = cmd.split('/')[2];
          if (speed<500) { // La limite temporelle des relais est de 500 ms.
            console.log("Impossible de descendre en dessous de 500 ms. Limite atteinte.")
          }
          else {
            tps=speed;
          }
          break;
        
        case (opt=='lampe'):
          var numero = cmd.split('/')[2];
          var OnOff = cmd.split('/')[3].toLowerCase();
          if (numero in ['1','2','3','4']) {
            if (OnOff=='on') {
              connection.write("0/1/"+numero, 1);
            }
            else if (OnOff=='off') {
              connection.write("0/1/"+numero, 0);
            }
            else {console.log('Option non reconnue.')}
          }
          else {console.log("La lampe n'existe pas.")}
          break;

        case (opt=='alllights'):
          var OnOff = cmd.split('/')[2].toLowerCase();
          if (OnOff=='on') {
            allLightsOn();
          }
          else if (OnOff=='off') {
            allLightsOff();
          }
          else {console.log('Option non reconnue.')}
          break;

        case (opt=='pari'):
          var numeroChoisi = cmd.split('/')[2]
          pari(numeroChoisi);
          break;
        
        default:
          console.log("Commande inconnue. Veuillez recommencer.")
          console.log("Liste des options disponibles :   \n\t[chenillard]\t\t\tEnclenche le chenillard.           \n\t[stop]\t\t\t\tArrête le chenillard.           \n\t[inverse]\t\t\tInverse le sens du chenillard.           \n\t[vitesse/<vitesse>]\t\tSpécifie la vitesse du chenillard.           \n\t[lampe/<n°lampe>/<on/off>]\tAllume ou éteint la lampe spécifiée.           \n\t[alllights/<on/off>]\t\tAllume ou éteint toutes les lampes.           \n\t[disconnect]\t\t\tDéconnecte de la maquette.   \n\t[pari/<numeroLampe>]\t\t\tDémarre le jeu de pari avec une mise sur <numeroLampe>.");
      }
    }
  }
});
