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
		chatRoom: [body.chatRoom],
		timeZone: body.timeZone
	})

	// Save user if doesn't exist already
	await user.save().catch((err) => {
		if (err.code == 11000) {
			userExists = true
			console.log("existe ya este usuario");
		} else {
			res.status(200).send({ code: "400", status: err })
			isError = true
		}
		console.log(err);
	})
	if (isError) { return }


	// Add chatroom to user if already exists
	if (userExists) {
		await User.updateOne( { id: body.id }, { $addToSet: { chatroom: [body.chatRoom]}} ).then((res) => {
		console.log("vaya");
		console.log(res);
	}).catch((err) => {
			res.status(200).send({ code: "400", status: err })
			isError = true
			console.log(err);
		})
	}
	if (isError) { return }


	// Find Chatroom and push user's id
	await Chatroom.updateOne( { id: body.chatRoom }, { $addToSet: { users: [body.id]}} ).catch((err) => {
		res.status(200).send({ code: "400", status: err })
		isError = true
		console.log(err);
	})
	if (isError) { return }

	res.status(200).send({ code: "200", status: "User added Succesfully" })
});




module.exports = router;