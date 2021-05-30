const JsSIP = require('jssip');
const NodeWebSocket = require('jssip-node-websocket');

let socket = new NodeWebSocket('ws://192.168.100.7:80');

let ua = new JsSIP.UA(
  {
    uri          : 'sip:016@192.168.100.7',
    password     : '123456',
    display_name : '016',
    sockets      : [ socket ]
  });

JsSIP.debug.enable("*")



document.getElementById("register").addEventListener("click", () => {
    ua.start();
    ua.register();
});

