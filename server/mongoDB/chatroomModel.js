const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
	id: {
        type: String,
        required: [true, "can't be blank"],
        unique: true,
	},
    name: {
        type: String,
        required: [true, "can't be blank"]
	},
    users: {
        type: Array,
        required: [true, "can't be blank"]
	},
    messages: {
		type: Array
	},
	
});

const Chatroom = mongoose.model("Chatroom", chatRoomSchema);

module.exports = Chatroom;