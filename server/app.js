
const express = require("express")
const app = express();
const puerto = parseInt(process.env.PORT, 10) || 8891;
const bodyParser = require("body-parser")
const Cors = require("cors")
const mongoose = require("mongoose")
const environment = process.env.NODE_ENV
var dbLink = new String()


// Modules
const Chatroom = require("./mongoDB/chatroomModel.js")
const User = require("./mongoDB/userModel.js")

// Set environment
if (environment == "production")
	dbLink = "mongodb://message_DB:27017/messages"
else 
	dbLink = "mongodb://localhost:27017/messages"


// Middlewares
app.use(Cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


// Routes
app.use("/chatroom", require("./requests/chatroomCreation"))
app.use("/user", require("./requests/userCreation"))
// app.use("/message", require("./requests/messageRoomCreation"))


// Open port
app.listen(puerto, () => console.log("Listening port " + puerto))


// DataBase connection
let timeOut = setInterval(() => {
	mongoose.connect(dbLink, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
		if (err) {
			console.log("Encountered an error in Db Connection")
		} else {
			console.log("Succesfully connected with DB");
			clearInterval(timeOut)
		}
	})
}, 5000);


// ++++++++++++++++ HTTP METHODS +++++++++++++++++++ //

app.get("/", (req, res) => {
	res.send("E-skeleton-message is up and running! :D")
})

app.get("/chatrooms", async (req, res) => {						//	 B O R R A R
	const chatRooms = await Chatroom.find();					//	 B O R R A R
	res.json(chatRooms);										//	 B O R R A R
});

app.get("/users", async (req, res) => {							//	 B O R R A R
	const users = await User.find();							//	 B O R R A R
	res.json(users);											//	 B O R R A R
});

app.get("/deleteChatroom", async (req, res) => {				//	 B O R R A R
	const chatroom = await Chatroom.deleteMany();				//	 B O R R A R
	res.json("Chatrooms deleted");								//	 B O R R A R
});