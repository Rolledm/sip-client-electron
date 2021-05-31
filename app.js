const JsSIP = require('jssip');
const NodeWebSocket = require('jssip-node-websocket');

let socket = new NodeWebSocket('ws://192.168.100.7:80');

let user = '016';
let domain = '192.168.100.7';
let password = '123456';
let display_name = 'Alice';

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