var http = require('http'), sockjs = require('sockjs'), WebSocket= require('faye-websocket');
var zmq = require('zmq');
var backend = '127.0.0.1:8000';
var endpoint = '/echo';
var proxy = sockjs.createServer();
var requestSocket = zmq.socket('router');
var responseSocket = zmq.socket('dealer'); 
requestSocket.bindSync('tcp://127.0.0.1:3000'); 
responseSocket.bindSync('tcp://127.0.0.1:3001');
var incomingConnections = {}
proxy.on('connection', function(conn) {
  console.log(conn.headers);
  console.log(conn.url);
  console.log(conn.protocol);
  var opened = false;

  conn.on('data', function(message) {

  });

  conn.on('close', function() {
    if(opened){
      opened=false;
      backendConn.close();
    }
    conn = null
  });
});
var server = http.createServer();
proxy.installHandlers(server, {prefix:endpoint});
server.listen(9999, '0.0.0.0');
