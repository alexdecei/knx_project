var knx = require('knx');
console.log("coucou1")
var connection = new knx.Connection( {
  // ip address and port of the KNX router or interface
  ipAddr: '192.168.0.5', ipPort: 3671,
  // set the log level for messsages printed on the console. This can be 'error', 'warn', 'info' (default), 'debug', or 'trace'.
  loglevel: 'info',


  // define your event handlers here:
  handlers: {
    // wait for connection establishment before sending anything!
    connected: function() {
      console.log('Hurray, I can talk KNX!');

      // WRITE an arbitrary boolean request to a DPT1 group address



      // you can also issue a READ request and pass a callback to capture the response
      connection.read("0/3/1", (src, responsevalue) => {
        console.log(src);
        console.log(responsevalue);
      });

    },
    // get notified for all KNX events:
    event: function(evt, src, dest, value) { console.log(
        "event: %s, src: %j, dest: %j, value: %j",
        evt, src, dest, value
      );
      if (dest=="0/3/1") {
        connection.write("0/1/1", 1);
      }
      if (dest=="0/3/2") {
        connection.write("0/1/1", 0);
      }
      if (dest=="0/3/3") {
        connection.read("0/2/1", (src, responsevalue) => {
          console.log("### "+src);
          console.log("#### "+responsevalue);
        });
      }
      if (dest=="0/3/4") {

      }
    },
    // get notified on connection errors
    error: function(connstatus) {
      console.log("**** ERROR: %j", connstatus);
    }
  }
});

async function chenillard(nbre, tps){
  // Initialisation à 0
  connection.write("0/1/1", 0);
  connection.write("0/1/2", 0);
  connection.write("0/1/3", 0);
  connection.write("0/1/4", 0);
  sleepSYNC(250)
  //Chenillards
  for (i = 0; i < nbre; i++) {
    connection.write("0/1/1", 1);
    sleepSYNC(tps)
    connection.write("0/1/1", 0);
    connection.write("0/1/2", 1);
    sleepSYNC(tps)
    connection.write("0/1/2", 0);
    connection.write("0/1/3", 1);
    sleepSYNC(tps)
    connection.write("0/1/3", 0);
    connection.write("0/1/4", 1);
    sleepSYNC(tps)
    connection.write("0/1/4", 0);
  }
}

function sleepSYNC(temps){
  return(promise1 = new Promise(function(resolve, reject) {
    setTimeout(temps);
  }));
}

console.log("coucou2");
