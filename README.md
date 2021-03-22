# E-skeleton-message


E-skeleton-message is a docker project that will deploy in seconds a message system with Node.js and MongoDB so you can use it for your projects.

In order to acces this message Api the endpoint should be:
- http://message:8891

You can search more of my E-skeletons docker projects and try to combine them in order to create a complete backend for your apps.
  - E-skeleton-IOs
  - E-skeleton-message
  - E-skeleton-web

### API use
This app allows you to set an instant messaging system through sockets. 

Down here you have example code for the events that this server provides:


### ____________________________________ P R O C C E S  ____________________________________ ###

Down here you can find the steps required to do all processes you might need to use:

Start a new conversation:
1. Create users		 				```createUser()```
2. Create a chatroom 				```createNewChatroom()```
3. Add users to this chatroom		```addNewUserToChatroom()```
4. Set chatroom name				```createNewChatroom()```



### ____________________________________ E N T I T I E S ____________________________________ ###

In order to use this api you will need to know wich data it needs, how to send it and where. There are three Classes or Entities that are used.

The Chatroom. Every conversation that two or more people have, needs a Chatroom. It contains the users and messages sent. This component will be created only once, but
it's data will change over time and interaction. The messages will be created automatically as an empty email
```js
class Chatroom {
	constructor(id, name, users, messages) {
		this.id = id
		this.name = name
		this.users = users
		this.messages = messages
	}
}
```

The User. It will need this five fields, the timezone must receive a number from -12 to 12. Any other input will be ignored and London timezone applied. U
```js
class User {
	constructor(id, username, chatrooms, timeZone) {
		this.id = id
		this.username = username
		this.chatrooms = chatrooms
		this.timeZone = timeZone
	}
}
```

The Message. Must contain the parent chatroom to whom it belongs, the message = text, and senderId will be the user's id
```js
class Message {
	constructor(id, chatroom, message, senderId, date) {
		this.id = id
		this.chatroom = chatroom
		this.message = message
		this.senderId = senderId
		this.date = date
	}
}
```

### ____________________________________ A P I   C A L L S____________________________________ ###

#### Create a new Chatroom

```js
function createNewChatroom() { 
	let chatRoomData = {
		id: "A random unique Id",
		messageId: "A random unique Id for the message model that will be conected to this chatroom",
	}

	axios.post("http://localhost:8891/chatroom/create-new-chatroom", chatRoomData)
	   	 .then((res) => console.log(res))
}
```

#### Add user to chatroom

```js
function addNewUserToChatroom() {
	let userData = {
		chatroomId: "An existing chatroom's id",
		userId: "An existing User's id",
		username: "User's name"
	}

	axios.post("https://yourNetworkPath:8891/chatroom/add-user-to-chatroom", userData)
	     .then((res) => console.log(res))
}
```


#### Set chatroom's name

```js
function addNewUserToChatroom() {
	let chatroomData = {
		chatroomId: "An existing chatroom's id",
		name: "New name for a Chatroom"
	}

	axios.post("https://yourNetworkPath:8891/chatroom/change-chatroom-name", chatroomData)
	     .then((res) => console.log(res))
}
```

### ____________________________________ E R R O R   T A B L E ____________________________________ ###

Generic Error:
- 5000 : Missing fields
- 5001 : Field null or undefined: [...]
Error saving User
- 6000 : User Already exists
- 6001 : Unknown error, return on parameter "error"

### Tech

E-skeleton-message uses a number of open source projects to work properly:

* [node.js] - Evented I/O for the backend
* [Express] - Fast node.js network app framework 
* [MongoDB] - Classified as a NoSQL database program

### Installation

E-skeleton-message requires [Docker](https://www.docker.com/) to run.

If you have Docker already installed in your pc, then proceed with this commands:

```sh
$ git clone https://github.com/headStyleColorRed/E-skeleton-message.git
$ cd E-skeleton-message
$ docker-compose up --build -d
```

For personal environments you may want to run

```js
$ npm run dev
// Instead of :
$ npm start
```

### Todos

 - Add testing
 - Add Load Balancer
 - Add Oauth
 - Add Recovery

License
----

MIT


**Free Software, Hell Yeah!**
