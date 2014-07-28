var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nicknames =[];

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  socket.on('new user', function(data, callback){
  	console.log('message: ' + data);
  	if (nicknames.indexOf(data) != -1) {

  		callback(false);
  	} else {
  		callback(true);
  		socket.nickname = data;
  		nicknames.push(socket.nickname);
  		updateNicknames();
  		
  	}
    
  });

  function updateNicknames(){

  	io.emit('usernames', nicknames);


  }

  socket.on('send msg', function(data){
  	console.log('message: ' + data + ' from '+ socket.nickname);
    io.emit('new msg', {msg: data, nick: socket.nickname});
  });

  socket.on('disconnect',function(data){
  	if(!socket.nickname) return;
  	nicknames.splice(nicknames.indexOf(socket.nickname),1);
  	updateNicknames();


  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});