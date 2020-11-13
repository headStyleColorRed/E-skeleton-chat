const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	id: {
        type: String,
        required: [true, "can't be blank"],
        unique: true,
	},
    chatroom: {
        type: String,
        required: [true, "can't be blank"]
	},
    message: {
        type: String,
        required: [true, "can't be blank"]
	},
    senderId: {
        type: String,
        required: [true, "can't be blank"],
	},
    senderName: {
        type: String,
        required: [true, "can't be blank"],
	},
    date: {
        type: String,
        required: [true, "can't be blank"],
	}
	
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;