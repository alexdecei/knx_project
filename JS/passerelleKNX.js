var knx = require('knx');
console.log("Tentative de connexion...");

var tps = 1000;
var secTime = 0;
var boolChenillard = false;
var boolChenillardInverse = false;
var i=0;

var tableauLampes = [0,0,0,0];
var tableauChenillard = [1,2,3,4];

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
        console.log("0/2/1 :"+obj.data[0]);
      }
      if (dest == "0/2/2") {
        let obj = JSON.parse(JSON.stringify(value));
        console.log("0/2/2 :"+obj.data[0]);
      }
      if (dest == "0/2/3") {
        let obj = JSON.parse(JSON.stringify(value));
        console.log("0/2/3 :"+obj.data[0]);
      }
      if (dest == "0/2/4") {
        let obj = JSON.parse(JSON.stringify(value));
        console.log("0/2/4 :"+obj.data[0]);
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
        if (boolChenillard == true) {
          /*
          boolChenillard = false;
          boolChenillardInverse = true;

          if (i==0) {
            i+=3;
          }
          else if (i==1) {
            i+=1;
          }
          else if (i==2) {
            i-=1;
          }
          else {
            i-=3;
          }
          */
          
          //tableauChenillard = [4,3,2,1];
        }
        else if (boolChenillardInverse == true) {
          /*
          boolChenillardInverse = false;
          boolChenillard = true;
          if (i==0) {
            i+=3;
          }
          else if (i==1) {
            i+=1;
          }
          else if (i==2) {
            i-=1;
          }
          else {
            i-=3;
          }

          tableauChenillard = [1,2,3,4];
          */
        }
      }
    },
    // get notified on connection errors
    error: function(connstatus) {
      console.log("**** ERROR: %j", connstatus);
    }
  }
});

function applyTableauLampes() {
  for (var i=0; i<tableauLampes.length;i++) {
    if (tableauLampes[i]==0) {
      connection.write("0/1/"+(i+1),0);
    }
    else if (tableauLampes[i]==1) {
      connection.write("0/1/"+(i+1),1);
    }
    else {
      console.log("Action inconnue ("+tableauLampes[i]+") sur le composant 0/1/"+(i+1)+".");
    }
  }
}

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
    for (i=0;i<tableauChenillard.length;i++) {
      connection.write("0/1/"+tableauChenillard[i],1);
      await sleepSYNC(tps);
      connection.write("0/1/"+tableauChenillard[i],0);
    }
  }
}

async function chenillardInverse() {
  boolChenillardInverse = true;
  while (boolChenillardInverse) {
    for (var i=tableauLampes.length-1;i>-1;i--) {
      tableauLampes[i]=1;
      applyTableauLampes();
      printTableauLampes();
      tableauLampes[i]=0;
      await sleepSYNC(tps);
      secTime-=tps;
    }
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

async function wait(temps,sens) {
  await sleepSYNC(temps);
  if (sens=="avant") {
    chenillard();
  }
  else if (sens=="arrière") {
    chenillardInverse();
  }
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
          if (OnOff=='on') {
            connection.write("0/1/"+numero, 1);
            //await sleepSYNC(400); // Temps d'attente par sécurité
          }
          else if (OnOff=='off') {
            connection.write("0/1/"+numero, 0);

          }
          break;
      }
    }
  }
});
