var zmq = require('zmq'), sock = zmq.socket('push'), http = require('http'), sockjs = require('sockjs');


sock.bindSync('tcp://127.0.0.1:3000');
console.log('Producer bound to port 3000');

setInterval(function(){
  console.log('sending work');
  sock.send('some work');
}, 500);
