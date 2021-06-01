let config = require('./config/example.json')

let loadFromConfigFile = () => {
  document.getElementById("server").value = config.server;
  document.getElementById("user").value = config.user;
  document.getElementById("domain").value = config.domain;
  document.getElementById("password").value = config.password;
  document.getElementById("display_name").value = config.display_name;
}

let collectRegisterDataFromDocument = () => {
  return {
    server: document.getElementById("server").value,
    user: document.getElementById("user").value,
    domain: document.getElementById("domain").value,
    password: document.getElementById("password").value,
    display_name: document.getElementById("display_name").value 
  };
};

module.exports = {loadFromConfigFile, collectRegisterDataFromDocument};