const initializeSocket = require("./initializeSocket");
const notificationsModule = require("./notifications");
const chattingModule = require("./chatting");

module.exports = { 
    initializeSocket: initializeSocket.initializeSocket, 
    notificationsModule, 
    chattingModule 
};
