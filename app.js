const JsSIP = require('jssip');
const NodeWebSocket = require('jssip-node-websocket');

let config = require('./config/example.json')

let server = config.server;
let user = config.user;
let domain = config.domain;
let password = config.password;
let display_name = config.display_name;

let socket = new NodeWebSocket(`ws://${server}`);

let ua = new JsSIP.UA(
  {
    uri          : `sip:${user}@${domain}`,
    password     : password,
    display_name : display_name,
    sockets      : [ socket ]
  });


ua.on("registered", (data) => {
  document.getElementById("status").textContent = `${display_name} ${user}`
});

ua.on("unregistered", (data) => {
  document.getElementById("status").textContent = "You are not registered.";
});

ua.on("registrationFailed", (data) => {
  document.getElementById("status").textContent = "Registration failed.";
});


JsSIP.debug.enable("*")



document.getElementById("register").addEventListener("click", () => {
  ua.start();
  ua.register();
});

document.getElementById("unregister").addEventListener("click", () => {
  ua.unregister();
});