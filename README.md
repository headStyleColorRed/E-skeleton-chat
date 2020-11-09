# E-skeleton-login


E-skeleton-login is a docker project that will deploy in seconds a login/register system with Node.js and MongoDB so you can use it for your projects.

In order to acces this login Api the endpoint should be:
- http://login:8888

You can search more of my E-skeletons docker projects and try to combine them in order to create a complete backend for your apps.
  - E-skeleton-IOs
  - E-skeleton-login
  - E-skeleton-web

### API use

Down here you have example code for the events that this server provides:

#### Login

```js
function logUser() { 
	let userData = {
		username: "client's username",
		password: "client's password"
	}

	$ axios.post("https://yourNetworkPath:8888/login/log_user", userData)
	   	   .then((res) => console.log(res))
}
```

#### Register

```js
function registerUser() {
	let userData = {
		username: "client's username",
		password: "client's password",
		passwordConfirmation: "client's confirmation password",
		group: "admin" // defaults in "user"
	}

	axios.post("https://yourNetworkPath:8888/register/register_user", userData)
	     .then((res) => console.log(res))
}
```

#### Logout
```js
function logoutUser() {
	let userData = {
		username: "client's username",
		password :"client's password"
	}

	$ axios.post("https://yourNetworkPath:8888/logout/logout_user", userData)
		   .then((res) => console.log(res))
}
```

#### User status

```js

function checkUserStatus() {
	let userData = {
		username: "client's username",
		password :"client's password"
	}

	$ axios.post("https://yourNetworkPath:8888/status/user_status", userData)
		   .then((res) => console.log(res))
}

```

### Tech

E-skeleton-login uses a number of open source projects to work properly:

* [node.js] - Evented I/O for the backend
* [Express] - Fast node.js network app framework 
* [MongoDB] - Classified as a NoSQL database program

### Installation

E-skeleton-login requires [Docker](https://www.docker.com/) to run.

If you have Docker already installed in your pc, then proceed with this commands:

```sh
$ git clone https://github.com/headStyleColorRed/E-skeleton-login.git
$ cd E-skeleton-login
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