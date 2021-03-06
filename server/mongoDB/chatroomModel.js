const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
	id: {
        type: String,
        required: [true, "can't be blank"],
        unique: true,
	},
    usernames: {
        type: Array
	},
	name: {
		type: String
	},
    users: {
        type: Array
	},
    messageId: {
		type: String
	},
	
});

const Chatroom = mongoose.model("Chatroom", chatRoomSchema);

module.exports = Chatroom;