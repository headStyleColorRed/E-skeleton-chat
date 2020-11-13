const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	id: {
        type: String,
        required: [true, "can't be blank"],
        unique: true,
	},
    userName: {
        type: String,
        required: [true, "can't be blank"]
	},
    chatroom: {
        type: Array,
        required: [true, "can't be blank"]
	},
    timezone: {
        type: String
	}
	
});

const User = mongoose.model("User", userSchema);

module.exports = User;