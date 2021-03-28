// IOS WEBSOCKET
var WebSocketServer = require('websocket').server;
var http = require('http');

// Array of Objects
var clientsArray = new Array()

var iOSServer = http.createServer();
iOSServer.listen(8894, () => {
    console.log('Notification server started on 8894');
});

// create the server
wsServer = new WebSocketServer({
    httpServer: iOSServer
});

// WebSocket server
// First send an empty message that won't be saved
// With the joinroom parameter to "true"
wsServer.on('request', async (request) => {
    var client = request.accept(null, request.origin);
    console.log('A user connected');

    client.on("message", (msg) => {
        try {
            let newClient = JSON.parse(msg.utf8Data);

            joinRoom(client, newClient.userId)

        } catch (error) {
            console.log(error);
            console.error("Error parsing json file");
        }
    })
});

function joinRoom(client, userId) {
    let chatroomObject = {
        client: client,
        userId: userId
    }
    clientsArray.push(chatroomObject)
    console.log(`User with id ${userId} joined notification socket`);
}

function sendNotification(userId) {

    let notification = {
        userId: userId,
        data: null,
        code: "NOTIF_1"
    }

    let data = Buffer.from(JSON.stringify(notification), "utf-8")

    let notifClient = clientsArray.find(e => e.userId === userId);

    if (!notifClient) return ;

    notifClient.client.send(data)
    console.log("Sent notification");
}

module.exports = {
    sendNotification,
}