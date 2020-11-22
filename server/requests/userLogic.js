const express = require("express");
const router = express.Router();
const Validation = require("../tools/validation");

// Modules
const Chatroom = require("../mongoDB/chatroomModel.js");
const User = require("../mongoDB/userModel.js");

//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			C R E A T E 	 U S E R					//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//

async function saveUser(body) {
    let isError = false;

    // Create user
    const user = new User({
        id: body.id,
        userName: body.userName,
        chatRoom: [body.chatRoom],
        timeZone: body.timeZone,
    });

    // Save user
    await user.save().catch((err) => {
        if (err.code == 11000) {
            let error = {
                error: 6000,
                isError: true,
                message: "User already exist",
                error: null,
            };
            throw error;
        } else {
            let error = {
                error: 6001,
                isError: true,
                message: "Unknown error saving user",
                error: err,
            };
            console.log(err);
            throw error;
        }
	});
	return isError
}

router.post("/create-user", async (req, res) => {
    let body = req.body;
	let isError = false;
	
    // Validation
    let validationResult = Validation.validateDataFields(body, ["id", "userName", "chatRoom", "timeZone"]);
    if (validationResult.isError) {
        res.status(200).send({ code: validationResult.error, status: validationResult.message });
        return;
    }

    // Save user if doesn't exist already
    await saveUser(body).catch((err) => {
		res.status(200).send({ code: err.error, status: err.message });
		isError = true
    });
    if (isError) return;

	// Succesfull result
    res.status(200).send({ code: "200", status: "User created Succesfully" });
});

//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 		A D D   C H A T R O O M    T O   U S E R  		//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//

router.post("/add-chatroom-to-user", async (req, res) => {
    let body = req.body;
    let isError = false;

    if (
        body.chatroomId == null ||
        body.chatroomId == undefined ||
        body.userId == null ||
        body.userId == undefined
    ) {
        res.status(200).send({ code: "400", status: "Missing fields" });
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

    res.status(200).send({ code: "200", status: "Chatroom added Succesfully" });
});

//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			D E L E T E 	 U S E R					//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
router.post("/delete-user", async (req, res) => {
    let body = req.body;
    let isError = false;

    // Validation
    let validationResult = Validation.validateDataFields(body, ["userId"]);
    if (validationResult.isError) {
        res.status(200).send({ code: validationResult.error, status: validationResult.message });
        return;
    }

    await User.deleteOne({ id: body.userId }).catch((err) => {
        res.status(200).send({ code: "400", status: err });
        isError = true;
        console.log(err);
    });
    if (isError) return;

    res.status(200).send({ code: "200", status: "User deleted Succesfully" });
});

//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 	  D O W N L O A D   U S E R   C H A T R O O M S		//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//

router.post("/download-chatrooms", async (req, res) => {
    let body = req.body;
    let isError = false;
    let chatRoomList = new Array();
    let chatRoomArray = new Array();

    if (body.userId == null || body.userId == undefined) {
        res.status(200).send({ code: "400", status: "Missing fields" });
        return;
    }

    // First find in which chatrooms is this user in
    await User.findOne({ id: body.userId })
        .then((res) => {
            chatRoomList = res.chatroom;
        })
        .catch((err) => {
            res.status(200).send({ code: "400", status: err });
            isError = true;
            console.log(err);
        });
    if (isError) {
        return;
    }

    // Iterate over chatrooms and save in chatroom
    for (const room of chatRoomList) {
        console.log(room);
        await Chatroom.findOne({ id: room })
            .then((res) => {
                let chatRoomModel = {
                    id: res.id,
                    name: res.name,
                    users: res.users,
                    messageId: res.messageId,
                };
                chatRoomArray.push(chatRoomModel);
                console.log(res);
            })
            .catch((err) => {
                isError = true;
                console.log(err);
            });
    }
    if (isError) {
        res.status(200).send({ code: "400", status: err });
        return;
    }

    res.status(200).send({ code: "200", status: chatRoomArray });
});

module.exports = router;
