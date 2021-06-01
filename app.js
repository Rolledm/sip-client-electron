const { session } = require('electron');
const JsSIP = require('jssip');
const NodeWebSocket = require('jssip-node-websocket');

const state = require('./state');
const config = require('./config')

state.applyStateChange(state.etState.LOGIN);
config.loadFromConfigFile();

const registerData = config.collectRegisterDataFromDocument();
let socket = new NodeWebSocket(`ws://${registerData.server}`);
let ua = new JsSIP.UA(
{
  uri          : `sip:${registerData.user}@${registerData.domain}`,
  password     : registerData.password,
  display_name : registerData.display_name,
  sockets      : [ socket ]
});

let audio = new window.Audio();
audio.autoplay = true;

ua.on("registered", (data) => {
  document.getElementById("status").textContent = `${registerData.display_name} ${registerData.user}`;
  state.applyStateChange(state.etState.MAIN);
});

ua.on("unregistered", (data) => {
  document.getElementById("status").textContent = "You are not registered.";
  state.applyStateChange(state.etState.LOGIN);
});

ua.on("registrationFailed", (data) => {
  document.getElementById("status").textContent = "Registration failed.";
});

ua.on("newMessage", (data) => {
  if (data.originator === "local") {
    document.getElementById("messages").textContent = "Message sent";
  } else {
    console.log(data)
    document.getElementById("messages").textContent = `New message from ${data.request.from._display_name}: ${data.request.body}`;
  }
});


JsSIP.debug.enable("*")


var eventHandlers = {
	'progress': function(e) {
		console.log('call is in progress');

		session.connection.ontrack = function(e) {
      audio.srcObject = e.streams[0];
		};
	},
	'failed': function(e) {
		console.log('call failed with cause: ' + e.cause);
	},
  'started': function(e) {
		console.log('call started');
  },
	'ended': function(e) {
		console.log('call ended with cause: ' + e.cause);
	},
	'confirmed': function(e) {
		console.log('call confirmed');
	}
};

var options = {
	'eventHandlers'    : eventHandlers,
	'mediaConstraints' : { 'audio': true, 'video': false }
};


document.getElementById("register").addEventListener("click", () => {
  ua.start();
  ua.register();
});

document.getElementById("unregister").addEventListener("click", () => {
  ua.unregister();
});

document.getElementById("sendMessage").addEventListener("click", () => {
  let receiver = document.getElementById("chatUA").value;
  let text = document.getElementById("chatText").value;
  
  // Register callbacks to desired message events
  var eventHandlers = {
    'succeeded': function(e){ console.log("Sent!") },
    'failed':    function(e){ console.log("Not sent...") }
  };

  var options = {
    'eventHandlers': eventHandlers
  };

  ua.sendMessage(`sip:${receiver}@${registerData.domain}`, text, options);
});

document.getElementById("call").addEventListener("click", () => {
  let callee = document.getElementById("callee").value;
  session = ua.call(`sip:${callee}@${registerData.domain}`, options);
});

document.getElementById("terminate").addEventListener("click", () => {
  if (session) {
    session.terminate;
  }
});