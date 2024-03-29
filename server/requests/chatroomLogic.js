const express = require("express");
const router = express.Router();
const Validation = require("../tools/validation");
const { v4: uuidv4 } = require('uuid');

// Modules
const Chatroom = require("../mongoDB/chatroomModel.js");
const Message = require("../mongoDB/messageModel.js");
const User = require("../mongoDB/userModel.js");

// Assets
const TeamNames = require("../assets/teamNames.js");

//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			C R E A T E 	C H A T R O O M				//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//

router.post("/create-new-chatroom", async (req, res) => {
    let isError = false;
    let chatroomId = uuidv4()
    let messageId = uuidv4()

    // Create and save Chatroom
    const chatroom = new Chatroom({
        id: chatroomId,
        usernames: new Array(),
        name: TeamNames.generateRandomName(),
        users: new Array(),
        messageId: messageId,
    });

    // Save Chatroom
    await chatroom.save().catch((err) => {
        if (err.code == 11000)
            res.status(200).send({
                code: "400",
                status: "Chatroom already exists",
            });
        else res.status(200).send({ code: "400", status: err });
        isError = true;
        console.log(err);
    });
    if (isError) {
        return;
    }

    // Create and save Message list
    const message = new Message({
        id: messageId,
        messageList: [],
        chatroom: chatroomId,
    });

    // Save message list
    await message.save().catch((err) => {
        if (err.code == 11000)
            res.status(200).send({
                code: "400",
                status: "Message list already exists",
            });
        else res.status(200).send({ code: "400", status: err });
        isError = true;
        console.log(err);
    });
    if (isError) {
        return;
    }

    res.status(200).send({
        code: "200",
        status: "Chatroom created Succesfully",
        data: { "chatroomId": chatroomId, "messageId": messageId} 
    });
});

//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			D E L E T E 	C H A T R O O M				//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//

router.post("/delete-chatroom", async (req, res) => {
    let body = req.body;
    let isError = false;
    let usersInChatroom = new Array();

    if (
        body.chatroomId == null ||
        body.chatroomId == undefined ||
        body.messageId == null ||
        body.messageId == undefined
    ) {
        res.status(200).send({ code: "400", status: "Missing fields" });
        return;
    }

    // First find which users are in this chatroom
    await Chatroom.findOne({ id: body.chatroomId })
        .then((res) => {
            usersInChatroom = res.users;
        })
        .catch((err) => {
            res.status(200).send({ code: "400", status: err });
            isError = true;
            console.log(err);
        });
    if (isError) {
        return;
    }

    // Then delete the chatroom
    await Chatroom.deleteOne({ id: body.chatroomId }).catch((err) => {
        res.status(200).send({ code: "400", status: err });
        isError = true;
        console.log(err);
    });
    if (isError) {
        return;
    }

    // Delete the message bucket
    await Message.deleteOne({ id: body.messageId }).catch((err) => {
        res.status(200).send({ code: "400", status: err });
        isError = true;
        console.log(err);
    });
    if (isError) {
        return;
    }

    // Remove chatroom from users containing it
    for (const user of usersInChatroom) {
        console.log(`Deleting room ${body.chatroomId} from user ${user}`);
        await User.updateOne(
            { id: user },
            { $pull: { chatroom: body.chatroomId } }
        ).catch((err) => {
            isError = true;
            console.log(err);
        });
    }
    if (isError) {
        res.status(200).send({ code: "400", status: err });
        return;
    }

    res.status(200).send({
        code: "200",
        status: "Chatroom deleted Succesfully",
    });
});

//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 		A D D   U S E R   T O   C H A T R O O M  		//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//

router.post("/add-user-to-chatroom", async (req, res) => {
    let body = req.body;
    let isError = false;

    console.log(body);

    // Validation
    let validationResult = Validation.validateDataFields(
        body,
        ["chatroomId", "userId", "username"],
        "add user to chatroom"
    );
    if (validationResult.isError) {
        res.status(200).send({
            code: validationResult.error,
            status: validationResult.message,
        });
        return;
    }

    // Add chatroom to user
    await User.updateOne(
        { id: body.userId },
        { $addToSet: { chatroom: [body.chatroomId] } }
    )
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            res.status(200).send({ code: "400", status: err });
            isError = true;
            console.log(err);
        });
    if (isError) {
        return;
    }

    console.log(body.username);

    // Find Chatroom and push user's id
    await Chatroom.updateOne(
        { id: body.chatroomId },
        { $addToSet: { users: [body.userId], usernames: [body.username] } }
    ).catch((err) => {
        res.status(200).send({ code: "400", status: err });
        isError = true;
        console.log(err);
    });
    if (isError) {
        return;
    }

    res.status(200).send({ code: "200", status: "User added Succesfully" });
});

//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 		C H A N G E   C H A T R O O M  	 N A M E    	//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
router.post("/change-chatroom-name", async (req, res) => {
    let body = req.body;
    let isError = false;
    let conversationName = new String();

    console.log(body);

    // Validation
    let validationResult = Validation.validateDataFields(
        body,
        ["chatroomId", "name"],
        "change chatroom's name"
    );
    if (validationResult.isError) {
        res.status(200).send({
            code: validationResult.error,
            status: validationResult.message,
        });
        return;
	}
	

	if (body.name != null && body.name != undefined && body.name.length >= 1)
		conversationName = body.name;
	else
		conversationName = TeamNames.generateRandomName()
	


    // Update chatrooms name
    await Chatroom.updateOne({ id: body.chatroomId }, { name: conversationName })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            isError = true;
            console.log(err);
        });
    if (isError) {
        return;
    }

    res.status(200).send({ code: "200", status: "Changed name succesfully" });
});

module.exports = router;
