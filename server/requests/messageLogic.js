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

async function addNewMessage(unparsedBody) {
    let isError = false;

    try {
        JSON.parse(unparsedBody);
    } catch (err) {
        throw err;
    }

    let body = JSON.parse(unparsedBody);
    console.log(body);

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

async function getChatroomMessages(unparsedBody) {
    try {
        JSON.parse(unparsedBody);
    } catch (err) {
        throw err;
    }

    let body = JSON.parse(unparsedBody);
    console.log(body);

    // Validation
    let validationResult = Validation.validateDataFields(
        body,
        ["messageId", "fromMessage"],
        "get chatroom messages"
    );
    if (validationResult.isError) {
        throw JSON.stringify(validationResult);
    }

    // get message room
    let message = await Message.findOne({ id: body.messageId })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw JSON.stringify({ code: "400", status: err });
        });

    let succesMessage = {
        code: "200",
        status: "Message room messages retrieved succesfully",
        data: message,
    };
    return JSON.stringify(succesMessage);
}

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
        status: "Chatroom created Succesfully",
        data: message,
    });
});







// app.js 
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, { origins: '*:*' });



app.get('/', function (req, res) {
    res.send("WebsocketServer")
});

server.listen(8892, () => {
    console.log('server started on PORT 8892');
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
        console.log(msg);
        io.sockets.in(room).emit('server-message', msg);

    })


});

module.exports = router;
