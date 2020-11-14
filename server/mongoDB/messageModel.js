const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	id: {
        type: String,
        required: [true, "can't be blank"],
        unique: true,
	},
    messageList: {
        type: Array,
        required: [true, "can't be blank"]
	},
    chatroom: {
        type: String,
        required: [true, "can't be blank"]
	},
	
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;