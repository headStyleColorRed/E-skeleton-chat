const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const WebSocket = require("ws");
const currentHost = "0.0.0.0";

const wss = new WebSocket.Server({ host: currentHost, port: 8892 });

// Socket handling
// var clients = []

// Modules
const Message = require("../mongoDB/messageModel.js");
const Validation = require("../tools/validation");


wss.broadcast = (data) => {
	let clientList = new Array()

    wss.clients.forEach((client) => {
		if (clientList.includes(client)) {
			client.close()
		} else {
			clientList.push(client)
			client.send(data)
		}
	});


};

wss.on("connection", function connection(socket) {
    socket.on("message", async (message) => {
        // await addNewMessage(message)
        //     .then((res) => {
        //         client.send(res);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         socket.send("Error ");
		//     });
		wss.broadcast(message)
    });
});

// wss.on("connection", (ws, req) => {
// 	console.log("new connection");
// 	clients.push(socket)
// 	console.log(clients.length);

//     socket.on("message", async (message) => {
//         await addNewMessage(message)
//             .then((res) => {
// 				client.send(res)
//             })
//             .catch((err) => {
//                 console.log(err);
//                 socket.send("Error ");
//             });

//     });

//     socket.on("close", (e) => {
//         console.log("close", e);
//     });

//     // socket.send("something");
// });

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

module.exports = router;
