const express = require("express")
const router = express.Router()

// Modules
const Message = require("../mongoDB/messageModel.js")



//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			C R E A T E 	 M E S S A G E				//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//

router.post("/add-new-message", async (req, res) => {
	let body = req.body
	let isError = false

	if (body.id == null || body.id == undefined ||
		body.chatroom == null || body.chatroom == undefined ||
		body.message == null || body.message == undefined ||
		body.senderId == null || body.senderId == undefined ||
		body.senderName == null || body.senderName == undefined ||
		body.date == null || body.date == undefined) {
		res.status(200).send({ code: "400", status: "Missing fields" })
		return
	}

	// Create message
	const messageObject = {
		id: body.id,
		chatroom: body.chatroom,
		message: body.message,
		senderId: body.senderId,
		senderName: body.senderName,
		date: body.date
	}
	
	const messageArray = Object.entries(messageObject)
	
	await Message.updateOne( { id: body.messageId }, { $addToSet: { messageList: [messageArray]}} ).catch((err) => {
		res.status(200).send({ code: "400", status: err })
		isError = true
		console.log(err);
	})
	if (isError) { return }

	res.status(200).send({ code: "200", status: "Message added Succesfully" })
});




module.exports = router;