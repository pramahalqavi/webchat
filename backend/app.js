var express = require('express');
var socket = require('socket.io');

var app = express();

server = app.listen(8080, function(){
    console.log('server is running on port 8080')
});

var stdin = process.openStdin();
var msg = "";

io = socket(server);

io.on('connection', (socket) => {
    console.log(socket.id + ': is connected');

    stdin.addListener("data", function(d) {
		//console.log("you entered: [" + d.toString().trim() + "]");
		msg = d.toString().trim();
		command = msg.split(" ");
		if (command[0] == "text") {
			msg = msg.substring(5);
			var dataa = {
		   		author: 'bot',
		   		message: {type: 'text',
		   			content: msg}
		   	};
		   	if (msg != '') {
		   		socket.emit('RECEIVE_MESSAGE', dataa);
		   		if (socket.connected) {
					console.log(socket.id + ': got \'' + dataa.message.content + '\'');
				}
		   	}
		} else if (command[0] == "buttons") {
			msg = msg.substring(8);
			buttons = msg.split(" ");
			var dataa = {
				author: 'bot',
		   		message: {type: 'template',
		   			items: []}
			};
			for (var i = 0; i < buttons.length; i++) {
				var item = {
					item: 'button',
					text: buttons[i]
				};
				dataa.message.items.push(item);
			}
			if (msg != '') {
				socket.emit('RECEIVE_MESSAGE', dataa);
				if (socket.connected) {
					process.stdout.write(socket.id + ': got buttons(');
					process.stdout.write(dataa.message.items[0].text);
					for (var i = 1; i < dataa.message.items.length; i++) {
						process.stdout.write(', ' + dataa.message.items[i].text);
					}
					console.log(')');
				}
			}
		}
	});
    
    socket.on('SEND_MESSAGE', function(data){
        socket.emit('RECEIVE_MESSAGE', data);
        console.log(socket.id + ': is writing \'' + data.message.content + '\'');
    })
    socket.on('disconnect', function() {
		console.log(socket.id + ': is disconnected');
		socket.disconnect();
	});
});

