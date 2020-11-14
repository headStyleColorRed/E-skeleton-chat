const express = require("express")
const router = express.Router()

// Modules
const Chatroom = require("../mongoDB/chatroomModel.js")
const Message = require("../mongoDB/messageModel.js")



//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			C R E A T E 	 B O A R D					//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//

router.post("/create-new-chatroom", async (req, res) => {
	let body = req.body
	let isError = false

	// Create and save Chatroom
	const chatroom = new Chatroom({
		id: body.id,
		name: body.name,
		users: body.users,
		messageId: body.messageId,
	})

	// Save Chatroom
	await chatroom.save().catch((err) => {
		if (err.code == 11000)
			res.status(200).send({ code: "400", status: "Chatroom already exists" })
		else
			res.status(200).send({ code: "400", status: err })
		isError = true
		console.log(err);
	})
	if (isError) { return }


	// Create and save Message list
	const message = new Message({
		id: body.messageId,
		messageList: [],
		chatroom: body.id
	})

	// Save Chatroom
	await message.save().catch((err) => {
		if (err.code == 11000)
			res.status(200).send({ code: "400", status: "Message list already exists" })
		else
			res.status(200).send({ code: "400", status: err })
		isError = true
		console.log(err);
	})
	if (isError) { return }

	res.status(200).send({ code: "200", status: "Chatroom created Succesfully" })
});




module.exports = router;