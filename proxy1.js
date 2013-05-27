var http = require('http'), sockjs = require('sockjs'), WebSocket= require('faye-websocket');

var backend = '127.0.0.1:8000';
var endpoint = '/echo';
var proxy = sockjs.createServer({log: function(a,b){console.log(b)}});
//load balancing
function createBackendConnection(){

}

proxy.on('connection', function(conn) {
  console.log(conn.headers);
  console.log(conn.url);
  console.log(conn.protocol);
  var backendConn = new WebSocket.Client('ws://'+backend+endpoint, null, {headers: conn.headers});
  var opened = false, queue = [];
  console.log('incoming conn');
  backendConn.on('open', function(){
    opened = true;
    if(queue.length > 0){
      queue.forEach(function(i){
        backendConn.send(i);
      });
      queue = [];
    }
  });
  backendConn.on('error', function(){
    // retry or failed
  });
  backendConn.on('close', function(){
    console.log('backend close');
    opened = false;
    if(conn){
      conn.close();
    }
    backendConn = null;
  });
  backendConn.on('message', function(event){
    //console.log('server -> client', event.data);
    conn.write(event.data);
  });
  conn.on('data', function(message) {
    if(opened){
      //console.log('client -> server', message);
      backendConn.send(message);
    }else{
      queue.push(message);
    }
  });
  conn.on('close', function() {
    if(opened){
      opened=false;
      backendConn.close();
    }
    conn = null;
  });
});
var server = http.createServer();
proxy.installHandlers(server, {prefix:endpoint});
server.listen(9999, '0.0.0.0');
