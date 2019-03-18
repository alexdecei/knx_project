var http = require('http');
async function test(){
  console.log("0sec")
  await sleepSYNC(2000)
  console.log("2sec")
  await sleepSYNC(4000)
  console.log("4sec")
  sleepSYNC(4000)
}

  var server = http.createServer(function(req, res) {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write('<!DOCTYPE html>'+
  '<html>'+
  '    <head>'+
  '        <meta charset="utf-8" />'+
  '        <title>Ma page Node.js !</title>'+
  '    </head>'+
  '    <body>'+
  '     	<p>Voici un paragraphe <strong>HTML</strong> !</p>'+
  '    </body>'+
  '</html>');
      res.end();

  });
  server.listen(8080);


  function sleepSYNC(temps){
    return new Promise(function(resolve, reject) { setTimeout(function() { resolve('fini');}, temps);});
  }


test()
