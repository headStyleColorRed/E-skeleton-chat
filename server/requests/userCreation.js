const express = require("express")
const router = express.Router()

// Modules
const Chatroom = require("../mongoDB/chatroomModel.js")
const User = require("../mongoDB/userModel.js")



//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			C R E A T E 	 U S E R					//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//

router.post("/add-user-to-chatroom", async (req, res) => {
	let body = req.body
	let isError = false
	let userExists = false

	if (body.id == null || body.id == undefined ||
		body.userName == null || body.userName == undefined ||
		body.chatRoom == null || body.chatRoom == undefined ||
		body.timeZone == null || body.timeZone == undefined) {
			res.status(200).send({ code: "400", status: "Missing fields" })
			return
		}

	// Create user
	const user = new User({
		id: body.id,
		userName: body.userName,
		chatRoom: body.chatRoom,
		timeZone: body.timeZone,
	})

	// Save user if doesn't exist already
	await user.save().catch((err) => {
		if (err.code == 11000) {
			userExists = true
		} else {
			res.status(200).send({ code: "400", status: err })
			isError = true
		}
		console.log(err);
	})
	if (isError) { return }

	// Add chatroom to user if already exists
	let filterUser = { id: body.id }
	let pushDataUser = { chatroom: body.chatRoom }

	if (userExists) {
		await user.update(filterUser, { $push: pushDataUser }).catch((err) => {
			res.status(200).send({ code: "400", status: err })
			isError = true
			console.log(err);
		})
	}
	if (isError) { return }

	// Find Chatroom and push user's id
	let filterChatroom = { id: body.chatRoom }
	let pushDataChatroom = { users: body.id }

	await Chatroom.update(filterChatroom, { $push: pushDataChatroom }).catch((err) => {
		res.status(200).send({ code: "400", status: err })
		isError = true
		console.log(err);
	})
	if (isError) { return }

	res.status(200).send({ code: "200", status: "User added Succesfully" })
});




module.exports = router;