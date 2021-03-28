const express = require("express");
const router = express.Router();


// Modules
const Message = require("../mongoDB/messageModel.js");
const Validation = require("../tools/validation");


//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			C R E A T E 	 M E S S A G E				//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//

async function addNewMessage(body) {

    // Validation
    let validationResult = Validation.validateDataFields(
        body,
        [
            "id",
            "messageId",
            "chatroom",
            "message",
            "senderId",
            "senderName",
            "date",
        ],
        "add new messages"
    );
    if (validationResult.isError) {
        throw validationResult;
    }

    // Create message
    const messageObject = {
        id: body.id,
        messageId: body.messageId,
        chatroom: body.chatroom,
        message: body.message,
        senderId: body.senderId,
        senderName: body.senderName,
        date: body.date,
    };

    await Message.updateOne(
        { id: body.messageId },
        { $addToSet: { messageList: [messageObject] } }
    ).catch((err) => {
        throw err;
    });

    let succesMessage = { code: "200", status: "Message added Succesfully" };
    return JSON.stringify(succesMessage);
}

//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			G E T 	M E S S A G E R O O M				//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//

router.post("/get-messages", async (req, res) => {
    let body = req.body;
    let isError = false;

    // Validation
    let validationResult = Validation.validateDataFields(
        body,
        ["messageId", "fromMessage"],
        "get chatroom messages"
    );
    if (validationResult.isError) {
        res.status(200).send({
            code: validationResult.error,
            status: validationResult.message,
        });
        return;
    }

    // get message room
    let message = await Message.findOne({ id: body.messageId })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            res.status(200).send({ code: "400", status: err });
            isError = true;
            console.log(err);
        });
    if (isError) {
        return;
    }

    res.status(200).send({
        code: "200",
        status: "Messages retrieved Succesfully",
        data: message,
    });
});







// WEBSITE WEBSOCKET
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, { origins: '*:*' });



app.get('/', function (req, res) {
    res.send("WebsocketServer")
});

server.listen(8892, () => {
    console.log('socket.io server started on 8892');
});

io.on('connection', async (socket) => {
    console.log('a user connected');


    socket.on("join-room", (roomId) => {
        console.log("user joined room: " + roomId);
        socket.join(roomId)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on("message", (msg, room) => {
        addNewMessage(msg).catch((err) => { console.log(err); })
        console.log(msg);
        io.sockets.in(room).emit('server-message', msg);

    })
});




// IOS WEBSOCKET
var WebSocketServer = require('websocket').server;
var http = require('http');

// Array of Objects
var currentRooms = new Array()

var iOSServer = http.createServer();
iOSServer.listen(8893, () => {
    console.log('iOS socket server started on 8893');
});

// create the server
wsServer = new WebSocketServer({
    httpServer: iOSServer
});

// WebSocket server
// First send an empty message that won't be saved
// With the joinroom parameter to "true"
wsServer.on('request', async (request) => {
    var client = request.accept(null, request.origin);
    console.log('A user connected');

    client.on("message", (msg) => {
        try {
            let message = JSON.parse(msg.utf8Data);
      
            if (message.joinroom == "true") {
              joinRoom(client, message.data.chatroom, message.data.senderName)
            } else {
              addNewMessage(message.data)
            }

            let clients = getClientsForRoom(message.data.chatroom)
            clients.forEach(roomClient => {
                roomClient.sendBytes(Buffer.from(JSON.stringify(message.data), "utf-8"))
            });

          } catch (error) {
              console.log(error);
            console.error("Error parsing json file");
          }
    })

    client.on('disconnect', () => {
        console.log('user disconnected');
    });

    client.on('close', (client) => {
        console.log('user closed connection');
    });
});

function joinRoom(client, room, user) {
    let chatroom = currentRooms.find(e => e.id === room);
    if (!chatroom) {
        let chatroomObject = {
            id: room,
            clients: new Array(),
            users: new Array()
        }
        chatroomObject.clients.push(client)
        chatroomObject.users.push(user)
        currentRooms.push(chatroomObject)
    } else {
        chatroom.clients.push(client)
        chatroom.users.push(user)
    }
}

function getClientsForRoom(room) {
    let chatroom = currentRooms.find(e => e.id === room);
    console.log(chatroom.clients.length + " users in this room: " + chatroom.users);
    return chatroom.clients
}

module.exports = router;
