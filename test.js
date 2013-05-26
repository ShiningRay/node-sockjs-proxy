var WebSocket = require('faye-websocket'),
    http      = require('http');

var server = http.createServer();

server.on('upgrade', function(request, socket, body) {
  console.log('upgrading');

  if (WebSocket.isWebSocket(request)) {
    var ws = new WebSocket(request, socket, body);
    var startTime = new Date();
    console.log(startTime);
    ws.on('message', function(event) {
      //console.log(event.data);
      //ws.send(event.data);
    });

    ws.on('close', function(event) {
      var endTime = new Date();
      console.log('close', event.code, event.reason);
      console.log(endTime - startTime);
      ws = null;
    });
  }
});

server.listen(8000);

