const socketIO = require("socket.io");
const { handleRequestSubmit, handleRequestAction } = require("./notifications");
// const chattingModule = require("./chatting");

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
        pingTimeout: 60000,
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", (socket) => {
        console.log(`New User connected: ${socket.id}`);

        socket.on("set_role", (data) => {

            // Store the role and ids in the connectedUsers Map
            connectedUsers.set(socket.id, {
                userId: data.userId,
                role: data.role,
            });
        });

        // Initialize modules
        handleRequestSubmit(io, socket, connectedUsers, findUserByRole);
        handleRequestAction(io, socket, connectedUsers, findUserById);
        // chattingModule(io, socket, connectedUsers);

        // Handle the "disconnect" event
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            connectedUsers.delete(socket.id);
        });
    });
};

module.exports = { initializeSocket, connectedUsers };
