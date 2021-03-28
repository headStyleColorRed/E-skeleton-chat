
const express = require("express")
const app = express();
const puerto = 8891;
const bodyParser = require("body-parser")
const Cors = require("cors")
const mongoose = require("mongoose")
const environment = process.env.NODE_ENV
var dbLink = new String()
const { v4: uuidv4 } = require('uuid');
const Notifications = require("./Notifications/NotificationStatus.js")


// Modules
const Chatroom = require("./mongoDB/chatroomModel.js")
const User = require("./mongoDB/userModel.js")
const Message = require("./mongoDB/messageModel.js")

// Set environment
if (environment == "production")
	dbLink = "mongodb://message_DB:27017/messages"
else 
	dbLink = "mongodb://localhost:27017/messages"


// Middlewares
app.use(Cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Routes
app.use("/chatroom", require("./requests/chatroomLogic"))
app.use("/user", require("./requests/userLogic"))
app.use("/message", require("./requests/messageLogic"))


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

app.get("/create-demo-users",  async (req, res) => {
	let MichaelScottId = uuidv4()
	let DwightSchruteId = uuidv4()
	let PamelaMorganId = uuidv4()

	// Delete DemoUsers if existing
	// await User.deleteMany({ isDemoUser: true })
	await Message.deleteMany();
	await Chatroom.deleteMany();
	await User.deleteMany();
	
	// Create users
	let MichaelScott = new User({ "id": MichaelScottId, "username": "Michael Scott", "chatRoom": new Array(), "timeZone": 0, "isDemoUser": true })
	let DwightSchrute = new User({ "id": DwightSchruteId, "username": "Dwight Schrute", "chatRoom": new Array(), "timeZone": 0, "isDemoUser": true })
	let PamelaMorgan = new User({ "id": PamelaMorganId, "username": "Pamela Morgan ", "chatRoom": new Array(), "timeZone": 0, "isDemoUser": true })

	// Save demo users
	await MichaelScott.save()
	await DwightSchrute.save()
	await PamelaMorgan.save()

	// Make demo user friends
    await User.updateOne( { id: MichaelScottId }, { $addToSet: { friends: [DwightSchruteId] } })
    await User.updateOne( { id: DwightSchruteId }, { $addToSet: { friends: [MichaelScottId] } })
    await User.updateOne( { id: MichaelScottId }, { $addToSet: { friends: [PamelaMorganId] } })
    await User.updateOne( { id: PamelaMorganId }, { $addToSet: { friends: [MichaelScottId] } })

	let MichaelScottUser = await User.findOne({ id: MichaelScottId})

    res.status(200).send({ code: "200", status: "Demo users created successfully", data: MichaelScottUser });

})

app.get("/chatrooms", async (req, res) => {						//	 B O R R A R
	const chatRooms = await Chatroom.find();					//	 B O R R A R
	res.json(chatRooms);										//	 B O R R A R
});

app.get("/users", async (req, res) => {							//	 B O R R A R
	const users = await User.find();							//	 B O R R A R
	res.json(users);											//	 B O R R A R
});

app.get("/messages", async (req, res) => {						//	 B O R R A R
	const messages = await Message.find();						//	 B O R R A R
	res.json(messages);											//	 B O R R A R
});


app.get("/deleteUsers", async (req, res) => {					//	 B O R R A R
	const users = await User.deleteMany();						//	 B O R R A R
	res.json("Users deleted");									//	 B O R R A R
});

app.get("/deleteChatroom", async (req, res) => {				//	 B O R R A R
	const chatroom = await Chatroom.deleteMany();				//	 B O R R A R
	res.json("Chatrooms deleted");								//	 B O R R A R
});

app.get("/deleteMessages", async (req, res) => {				//	 B O R R A R
	const messages = await Message.deleteMany();				//	 B O R R A R
	res.json("Messages deleted");								//	 B O R R A R
});

app.get("/deleteEverything", async (req, res) => {				//	 B O R R A R
	await Message.deleteMany();									//	 B O R R A R
	await Chatroom.deleteMany();								//	 B O R R A R
	await User.deleteMany();									//	 B O R R A R
	res.json("All data deleted");								//	 B O R R A R
});

app.post("/sendNotification", (req, res) => {
	let body = req.body

	Notifications.sendNotification(body.userId)
	res.send("Notification sent")
})
 
// Notification structure:
// let notification = {
//		userId: new String()
//		data: null
//		code: <notification code>
//		
//		
// }

// Notification codes:
//		- NOTIF_1 = New message 
//		- NOTIF_2 = New friendRequest
