$(document).ready( function() {

	var socket = io.connect('http://localhost:8888');

	/* modal for connection */
	$('.modal').modal({
		dismissible: false,
		complete: function() { 
			socket.emit('connection', $('#pseudo')[0].value);
		}
	});
	$('#modal1').modal('open');

	socket.on('message', function(data) {
		var tmpHtml = new EJS({url: '/template/message.ejs'}).render(data);
		addToTalk(tmpHtml);
	});

	socket.on('message_self', function(data) {
		var tmpHtml = new EJS({url: '/template/message_self.ejs'}).render(data);
		addToTalk(tmpHtml);
	});

	socket.on('message_info', function(data) {
		var tmpHtml = '<span>' + data.message + '<span>';
		addToTalk(tmpHtml);
	});

	$('#send_message').click(function () {
		var tmp = $('#message')[0].value.replace(/\r?\n/g, '<br>');
		if (tmp == '') {
			return
		}
		socket.emit('message', tmp);
	});

	resizeTalk();
	window.addEventListener("resize", resizeTalk);
});

function addToTalk(htmlData) {
	var talk = document.getElementById('talk');
	var div = document.createElement('div');
	div.innerHTML = htmlData;
	talk.appendChild(div);
	$('main')[0].scrollTop = $('main')[0].scrollHeight;
}

function resizeTalk(e) {
	var mainHeight = $(document).height() - $('#msg-new')[0].offsetHeight - $('header')[0].offsetHeight;
	$('main')[0].style.height = mainHeight + 'px';
}