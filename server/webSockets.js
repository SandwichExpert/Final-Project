const webSocketServerPort = 5000;
const webSocketServer = require('websocket').server;
const http = require('http')

const server = http.createServer();
server.listen(webSocketServerPort)  
const wsServer = new webSocketServer({
  httpServer:server
});

const clients = {};

const getUniqueId = () =>{
  const s4 =()=>Math.floor((1+Math.random())*0x1000).toString(16).subString(1);
  return s4() + s4() + '-'+ s4();
}

wsServer.on('request', function(request){
  var userId=getUniqueId();
  console.log(new Date()+'Received new connection from origin'+request.origin+'.');
  const connection=request.accept(null,request.origin);
  clients[userId] = connection;
  console.log('connected: '+userId+' in ' + Object.getOwnPropertyNames(clients))
});