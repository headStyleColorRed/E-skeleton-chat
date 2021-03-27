const express = require("express");
const router = express.Router();
const Validation = require("../tools/validation");

// Modules
const Chatroom = require("../mongoDB/chatroomModel.js");
const User = require("../mongoDB/userModel.js");
const { json } = require("body-parser");

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
        username: body.username,
        chatRoom: new Array(),
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
    let validationResult = Validation.validateDataFields(body, ["id", "username", "timeZone"], "creating user");
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
    let validationResult = Validation.validateDataFields(body, ["userId"], "deleting user");
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
        res.status(200).send({ code: "400", status: "Missing userId fields" });
        return;
    }

    // First find in which chatrooms is this user in
    await User.findOne({ id: body.userId })
        .then((res) => {
            if (res) { chatRoomList = res.chatroom }
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
        await Chatroom.findOne({ id: room })
            .then((res) => {
                let chatRoomModel = {
                    id: res.id,
                    name: res.name,
                    users: res.users,
                    messageId: res.messageId,
                    usernames: res.usernames
                };
                chatRoomArray.push(chatRoomModel);
            })
            .catch((err) => {
                isError = true;
                console.log(err);
            });
    }
    if (isError) {
        res.status(200).send({ code: "400", status: "Error saving user in chatroom" });
        return;
    }

    res.status(200).send({ code: "200", status: "Conversations recolected successfullyj", data: chatRoomArray });
});


//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			F I L T E R    U S E R S					//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
router.post("/filter-users", async (req, res) => {
    let body = req.body;
    let isError = false;

    // Validation
    let validationResult = Validation.validateDataFields(body, ["queryField"], "deleting user");
    if (validationResult.isError) {
        res.status(200).send({ code: validationResult.error, status: validationResult.message });
        return;
    }

    // Query users that match received string
    const regex = new RegExp(body.queryField, 'i') // i for case insensitive
    let users = await User.find({ username: { $regex: regex } }).then((res) => {
        return res
    }).catch((err) => {
        isError = true;
        console.log(err);
    });
    if (isError) {
        res.status(200).send({ code: "400", status: err });
        return;
    }

    res.status(200).send({ code: "200", status: "User find query succesfull", data: users });
});


//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			A D D   N E W   F R I E N D					//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
router.post("/add-friend-to-user", async (req, res) => {
    let body = req.body;
    let isError = false;

    // Validation
    let validationResult = Validation.validateDataFields(body, ["userId", "friendId"], "adding friend");
    if (validationResult.isError) {
        res.status(200).send({ code: validationResult.error, status: validationResult.message });
        return;
    }

    // Find User1 and add friend
    await User.updateOne(
        { id: body.userId },
        { $addToSet: { friends: [body.friendId] } }
    ).catch((err) => {
        res.status(200).send({ code: "400", status: err });
        isError = true;
        console.log(err);
    });
    if (isError) {
        return;
    }

    // Find Friend and add User1
    await User.updateOne(
        { id: body.friendId },
        { $addToSet: { friends: [body.userId] } }
    ).catch((err) => {
        res.status(200).send({ code: "400", status: err });
        isError = true;
        console.log(err);
    });
    if (isError) {
        return;
    }

    res.status(200).send({ code: "200", status: "Friend added succesfully" });
});


//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			G E T    U S E R    D A T A 				//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
router.post("/get-user-data", async (req, res) => {
    let body = req.body;
    let isError = false;

    // Validation
    let validationResult = Validation.validateDataFields(body, ["userId"], "getting user data");
    if (validationResult.isError) {
        res.status(200).send({ code: validationResult.error, status: validationResult.message });
        return;
    }

    // Query users that match received string
    let user = await User.find({ id: body.userId }).then((res) => {
        return res
    }).catch((err) => {
        isError = true;
    });
    if (isError) {
        res.status(200).send({ code: "400", status: err });
        return;
    }

    res.status(200).send({ code: "200", status: "User data finding succesfull", data: user });
});

//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 		S E N D   F R I E N D  R E Q U E S T 			//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
router.post("/send-friend-request", async (req, res) => {
    let body = req.body;
    let isError = false;

    // Validation
    let validationResult = Validation.validateDataFields(body, ["userId", "friendId"], "sending friend request");
    if (validationResult.isError) {
        res.status(200).send({ code: validationResult.error, status: validationResult.message });
        return;
    }

    // Find Friend and add user id as request
    await User.updateOne(
        { id: body.friendId },
        { $addToSet: { friendRequest: [body.userId] } }
    ).catch((err) => {
        res.status(200).send({ code: "400", status: err });
        isError = true;
    });
    if (isError) { return }

    res.status(200).send({ code: "200", status: "User friend request sent succesfull" });
});


//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 	    A C C E P T   F R I E N D  R E Q U E S T 		//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
router.post("/accept-friend-request", async (req, res) => {
    let body = req.body;
    let isError = false;

    // Validation
    let validationResult = Validation.validateDataFields(body, ["userId", "friendId"], "accepting friend request");
    if (validationResult.isError) {
        res.status(200).send({ code: validationResult.error, status: validationResult.message });
        return;
    }

    // Find user and remove friend id request
    await User.updateOne(
        { id: body.userId },
        { $pull: { friendRequest: body.friendId } }
    ).catch((err) => {
        res.status(200).send({ code: "400", status: err });
        isError = true;
    });
    if (isError) { return }

    // Find User1 and add friend
    await User.updateOne(
        { id: body.userId },
        { $addToSet: { friends: [body.friendId] } }
    ).catch((err) => {
        res.status(200).send({ code: "400", status: err });
        isError = true;
        console.log(err);
    });
    if (isError) {
        return;
    }

    // Find Friend and add User1
    await User.updateOne(
        { id: body.friendId },
        { $addToSet: { friends: [body.userId] } }
    ).catch((err) => {
        res.status(200).send({ code: "400", status: err });
        isError = true;
        console.log(err);
    });
    if (isError) {
        return;
    }

    res.status(200).send({ code: "200", status: "User friend request accepted and befrended succesfully" });
});

//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 		G E T   F R I E N D  R E Q U E S T  			//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
router.post("/get-friend-requests", async (req, res) => {
    let body = req.body;
    let isError = false;

    // Validation
    let validationResult = Validation.validateDataFields(body, ["userId"], "sending friend request");
    if (validationResult.isError) {
        res.status(200).send({ code: validationResult.error, status: validationResult.message });
        return;
    }

    // Find user and send requests
    let user = await User.findOne({ id: body.userId }).then((res) => {
        return res
    }).catch((err) => {
        res.status(200).send({ code: "400", status: err });
        isError = true;
    });
    if (isError) { return }



    let friendRequestsArray = user.friendRequest
    let friendsArray = new Array()
    // Find all users in friendRequestsArray
    for (const friend of friendRequestsArray) {
        await User.findOne({ id: friend }).then((friend) => {
            friendsArray.push(friend)
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

    res.status(200).send({ code: "200", status: "User friend request sent succesfull", data: friendsArray });
});


//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 	    R E J E C T   F R I E N D  R E Q U E S T 		//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
router.post("/reject-friend-request", async (req, res) => {
    let body = req.body;
    let isError = false;

    // Validation
    let validationResult = Validation.validateDataFields(body, ["userId", "friendId"], "sending friend request");
    if (validationResult.isError) {
        res.status(200).send({ code: validationResult.error, status: validationResult.message });
        return;
    }

    // Find Friend and add user id as request
    await User.updateOne(
        { id: body.userId },
        { $pull: { friendRequest: body.friendId } }
    ).catch((err) => {
        res.status(200).send({ code: "400", status: err });
        isError = true;
    });
    if (isError) { return }

    res.status(200).send({ code: "200", status: "User friend request rejected succesfull" });
});


//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
//														//
// 			G E T    U S E R    F R I E N D S 			//
//														//
//	#	#	#	#	#	#	#	#	#	#	#	#	#	//
router.post("/get-user-friends", async (req, res) => {
    let body = req.body;
    let isError = false;

    // Validation
    let validationResult = Validation.validateDataFields(body, ["userId"], "getting user friends");
    if (validationResult.isError) {
        res.status(200).send({ code: validationResult.error, status: validationResult.message });
        return;
    }

    // Query users that match received string
    let user = await User.find({ friends: body.userId }).then((res) => {
        return res
    }).catch((err) => {
        isError = true;
    });
    if (isError) {
        res.status(200).send({ code: "400", status: err });
        return;
    }

    res.status(200).send({ code: "200", status: "User friend finding succesfull", data: user });
});

module.exports = router;
