var knx = require("knx");

console.log("coucou1");
var connection = new knx.Connection({
  // ip address and port of the KNX router or interface
  ipAddr: "192.168.0.5",
  ipPort: 3671,
  // the KNX physical address we'd like to use
  //physAddr: '15.15.249',
  // set the log level for messsages printed on the console. This can be 'error', 'warn', 'info' (default), 'debug', or 'trace'.
  loglevel: "info",
  // do not automatically connect, but use connection.Connect() to establish connection
  manualConnect: false,
  // use tunneling with multicast (router) - this is NOT supported by all routers! See README-resilience.md
  forceTunneling: true,
  // wait at least 10 millisec between each datagram
  minimumDelay: 10,
  // enable this option to suppress the acknowledge flag with outgoing L_Data.req requests. LoxOne needs this
  suppress_ack_ldatareq: false,
  // define your event handlers here:
  handlers: {
    // wait for connection establishment before sending anything!
    connected: function() {
      console.log("Hurray, I can talk KNX!");
      chenillard(4, 250);
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
    },
    // get notified on connection errors
    error: function(connstatus) {
      console.log("**** ERROR: %j", connstatus);
    }
  }
});

async function chenillard() {
  // Initialisation à 0
  connection.write("0/1/1", 0);
  connection.write("0/1/2", 0);
  connection.write("0/1/3", 0);
  connection.write("0/1/4", 0);
  sleepSYNC(250);
  //Chenillards
  for (i = 0; i < nbre; i++) {
    connection.write("0/1/1", 1);
    sleepSYNC(tps);
    connection.write("0/1/1", 0);
    connection.write("0/1/2", 1);
    sleepSYNC(tps);
    connection.write("0/1/2", 0);
    connection.write("0/1/3", 1);
    sleepSYNC(tps);
    connection.write("0/1/3", 0);
    connection.write("0/1/4", 1);
    sleepSYNC(tps);
    connection.write("0/1/4", 0);
  }
}

function sleepSYNC(temps) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve("fini");
    }, temps);
  });
}

function verifChenillard() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve("fini");
    }, 10);
  });
}

console.log("coucou2");
