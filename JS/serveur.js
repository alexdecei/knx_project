var http = require('http');

function test(){
  console.log("coucoucouc")
  //document.getElementById('test1').innerHTML = "testReussi"
}
test()
var server = http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write('<!DOCTYPE html>'+
'<html>'+
'    <head>'+
'        <meta charset="utf-8" />'+
'        <title>Free KNX</title>'+
'    </head>'+
'    <body>'+
'     	<p>Controllez la maqutte KNX <strong>G R A T U I T E M E N T</strong> </p>'+
'     	<p> </p>'+
'     	<p>Vitesse en ms </p>'+
'       <input type="text" id="vTemps" name="temps" size="10">'+
'     	<p> </p>'+
'     	<p>Arreter/démarrer le chenillard </p>'+
'       <button onclick="test()">hop</button>'+
'     	<p id="test1"> test </p>'+
'     	<p> </p>'+
'     	<p>Changer le sens du chenillard </p>'+
'       <button onclick="test()">changer</button>'+
'    </body>'+
'</html>');
    res.end();
});
server.listen(8080);
