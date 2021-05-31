const { session } = require('electron');
const JsSIP = require('jssip');
const NodeWebSocket = require('jssip-node-websocket');

const etState = {
  LOGIN: 0,
  MAIN: 1,
  CALL: 2
};

let applyStateChange = (state) => {
  switch (state) {
    case etState.LOGIN:
      document.getElementById("regparams").style.display = 'block';
      document.getElementById("register").style.display = 'inline';
      document.getElementById("unregister").style.display = 'none';
      document.getElementById("client").style.display = 'none';
      break;
    
    case etState.MAIN:
      document.getElementById("regparams").style.display = 'none';
      document.getElementById("register").style.display = 'none';
      document.getElementById("unregister").style.display = 'inline';
      document.getElementById("client").style.display = 'block';
      break;
  
    default:
      break;
  }
}

applyStateChange(etState.LOGIN);

let config = require('./config/example.json')

document.getElementById("server").value = config.server;
document.getElementById("user").value = config.user;
document.getElementById("domain").value = config.domain;
document.getElementById("password").value = config.password;
document.getElementById("display_name").value = config.display_name;

let server = document.getElementById("server").value;
let user = document.getElementById("user").value;
let domain = document.getElementById("domain").value;
let password = document.getElementById("password").value;
let display_name = document.getElementById("display_name").value;

let socket = new NodeWebSocket(`ws://${server}`);

let audio = new window.Audio();
audio.autoplay = true;

let ua = new JsSIP.UA(
  {
    uri          : `sip:${user}@${domain}`,
    password     : password,
    display_name : display_name,
    sockets      : [ socket ]
  });


ua.on("registered", (data) => {
  document.getElementById("status").textContent = `${display_name} ${user}`;
  applyStateChange(etState.MAIN);
});

ua.on("unregistered", (data) => {
  document.getElementById("status").textContent = "You are not registered.";
  applyStateChange(etState.LOGIN);
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

  ua.sendMessage(`sip:${receiver}@${domain}`, text, options);
});

document.getElementById("call").addEventListener("click", () => {
  let callee = document.getElementById("callee").value;
  session = ua.call(`sip:${callee}@${domain}`, options);
});

document.getElementById("terminate").addEventListener("click", () => {
  if (session) {
    session.terminate;
  }
});