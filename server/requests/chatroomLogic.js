const express = require("express")
const router = express.Router()

// Modules
const Chatroom = require("../mongoDB/chatroomModel.js")
const Message = require("../mongoDB/messageModel.js")
const User = require("../mongoDB/userModel.js")

// Assets
const TeamNames = require("../assets/teamNames.js")





//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			C R E A T E 	C H A T R O O M				//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//

router.post("/create-new-chatroom", async (req, res) => {
	let body = req.body
	let isError = false
	let chatRoomName = ""
	
	console.log(body);

	if (body.id == null || body.id == undefined ||
		body.users == null || body.users == undefined ||
		body.messageId == null || body.messageId == undefined) {
		res.status(200).send({ code: "400", status: "Missing fields" })
		return
	}

	console.log(body.users.length);
	if ((body.name == null || body.name == undefined) && body.users.length > 2) {
		console.log("nooo puede ser");
		chatRoomName = TeamNames.generateRandomName()
	} else {
		for (const index in body.users) {
			if (body.users.hasOwnProperty(index)) {
				const element = body.users[index];
				chatRoomName += `${element.userName} - `
			}
		}
		chatRoomName = chatRoomName.trim().substring(0, chatRoomName.length - 3);
	}

	console.log(chatRoomName);

	// // Create and save Chatroom
	// const chatroom = new Chatroom({
	// 	id: body.id,
	// 	name: body.name,
	// 	users: new Array(),
	// 	messageId: body.messageId,
	// })

	// // Save Chatroom
	// await chatroom.save().catch((err) => {
	// 	if (err.code == 11000)
	// 		res.status(200).send({ code: "400", status: "Chatroom already exists" })
	// 	else
	// 		res.status(200).send({ code: "400", status: err })
	// 	isError = true
	// 	console.log(err);
	// })
	// if (isError) { return }


	// // Create and save Message list
	// const message = new Message({
	// 	id: body.messageId,
	// 	messageList: [],
	// 	chatroom: body.id
	// })

	// // Save message list
	// await message.save().catch((err) => {
	// 	if (err.code == 11000)
	// 		res.status(200).send({ code: "400", status: "Message list already exists" })
	// 	else
	// 		res.status(200).send({ code: "400", status: err })
	// 	isError = true
	// 	console.log(err);
	// })
	// if (isError) { return }

	res.status(200).send({ code: "200", status: "Chatroom created Succesfully" })
});






//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			D E L E T E 	C H A T R O O M				//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//

router.post("/delete-chatroom", async (req, res) => {
	let body = req.body
	let isError = false
	let usersInChatroom = new Array()

	if (body.chatroomId == null || body.chatroomId == undefined ||
		body.messageId == null || body.messageId == undefined) {
		res.status(200).send({ code: "400", status: "Missing fields" })
		return
	}

	// First find which users are in this chatroom
	await Chatroom.findOne({ "id": body.chatroomId }).then((res) => { usersInChatroom = res.users })
		.catch((err) => {
			res.status(200).send({ code: "400", status: err })
			isError = true
			console.log(err);
		})
	if (isError) { return }

	// Then delete the chatroom
	await Chatroom.deleteOne({ "id": body.chatroomId }).catch((err) => {
		res.status(200).send({ code: "400", status: err })
		isError = true
		console.log(err);
	})
	if (isError) { return }

	// Delete the message bucket
	await Message.deleteOne({ "id": body.messageId }).catch((err) => {
		res.status(200).send({ code: "400", status: err })
		isError = true
		console.log(err);
	})
	if (isError) { return }

	// Remove chatroom from users containing it
	for (const user of usersInChatroom) {
		console.log(user);
		await User.updateOne({ id: user }, { $pull: { chatroom: body.chatroomId } }).catch((err) => {
			isError = true
			console.log(err);
		})
	}
	if (isError) {
		res.status(200).send({ code: "400", status: err })
		return
	}

	res.status(200).send({ code: "200", status: "Chatroom deleted Succesfully" })
});

module.exports = router;