var express = require('express');

var app = express();

app.use(express.static('public'));
app.use(express.static('views'));

app.get('/', function(req, res) {
	res.render('index.ejs');
});

app.use(function(req, res, next){
	res.setHeader('Content-Type', 'text/plain');
	res.status(404).send('Page introuvable !');
});


// Chargement de socket.io
var io = require('socket.io').listen(app.listen(8888));


// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
	console.log('Un client est connecté !');

	socket.on('connection', function(pseudo) {
		socket.pseudo = pseudo;
		socket.emit('message_info', 
			{ message: 'Bienvenu ' + socket.pseudo } );
		socket.broadcast.emit('message_info', 
			{ message: socket.pseudo + ' vient de se connecter !' } );


		
	});

	socket.on('message', function (message) {
		socket.emit('message_self', { message : message } );
		socket.broadcast.emit('message',
			{ pseudo: socket.pseudo, message: message } );
	});

	
	socket.on('disconnect', function() {
		socket.broadcast.emit('message_info', 
			{ message: 'Deconnection de ' + socket.pseudo } );
	});
});