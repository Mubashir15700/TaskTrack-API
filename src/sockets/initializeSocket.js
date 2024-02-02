const socketIO = require("socket.io");
const {
    handleRequestSubmit,
    handleRequestAction,
    handleJobApplication,
    handleCancelApplication,
    handleApplicationAction
} = require("./notifications");
const { handleGetChatHistory, handleSendMessage } = require("./chatting");

const connectedUsers = new Map();

function findUserByRole(roleToFind, usersMap) {
    for (const [socketId, userDetails] of usersMap) {
        if (userDetails.role === roleToFind) {
            return { socketId, userDetails };
        }
    }
    return null;
};

function findUserById(IdToFind, usersMap) {
    for (const [socketId, userDetails] of usersMap) {
        if (userDetails.userId === IdToFind) {
            return { socketId, userDetails };
        }
    }
    return null;
};

function initializeSocket(server) {

    const io = socketIO(server, {
        pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000,
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        },
    });

    io.on("connection", (socket) => {
        console.log(`New User connected: ${socket.id}`);

        socket.on("set_role", (data) => {
            console.log("setting role: ", data);
            // Store the role and ids in the connectedUsers Map
            connectedUsers.set(socket.id, {
                userId: data.userId,
                role: data.role,
            });
        });

        // Initialize modules
        // notifications
        handleRequestSubmit(io, socket, connectedUsers, findUserByRole);
        handleRequestAction(io, socket, connectedUsers, findUserById);
        handleJobApplication(io, socket, connectedUsers, findUserById);
        handleCancelApplication(io, socket, connectedUsers, findUserById);
        handleApplicationAction(io, socket, connectedUsers, findUserById);
        // chatting
        handleGetChatHistory(io, socket);
        handleSendMessage(io, socket, connectedUsers, findUserById);

        // Handle the "disconnect" event
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            connectedUsers.delete(socket.id);
        });
    });
};

module.exports = initializeSocket;
