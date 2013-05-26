var WebSocket = require('faye-websocket'),
    ws        = new WebSocket.Client('http://localhost:8000/');
function benchmark(){
  var startTime = new Date();
  for(var i = 0; i < 100000; i++){
    ws.send(i.toString());
  }
  var endTime = new Date();
  console.log(endTime - startTime);
  ws.close();
}

ws.on('open', function(event) {
  console.log('open');
  /*setInterval(function(){
    ws.send('Hello, world!');
  }, 3000);*/
	benchmark();
});

ws.on('message', function(event) {
  console.log('message', event.data);
});

ws.on('close', function(event) {
  console.log('close', event.code, event.reason);
  ws = null;
});
