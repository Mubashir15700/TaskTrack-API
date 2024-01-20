const socketIO = require("socket.io");
const Notification = require("../models/notification");

function initializeSocket(server) {
    const io = socketIO(server, {
        pingTimeout: 60000,
        cors: {
            origin: "http://localhost:5173"
        },
    });

    const connectedUsers = new Map();

    function findUserByRole(roleToFind) {
        for (const [socketId, userDetails] of connectedUsers) {
            if (userDetails.role === roleToFind) {
                return { socketId, userDetails };
            }
        }
        return null;
    };

    function findUserById(IdToFind) {
        for (const [socketId, userDetails] of connectedUsers) {
            if (userDetails.userId === IdToFind) {
                return { socketId, userDetails };
            }
        }
        return null;
    };

    io.on("connection", (socket) => {
        console.log(`New User connected: ${socket.id}`);

        socket.on("set_role", (data) => {

            // Store the role and ids in the connectedUsers Map
            connectedUsers.set(socket.id, {
                userId: data.userId,
                role: data.role,
            });
        });

        socket.on("request_submit", async (data) => {

            try {
                const adminUser = findUserByRole("admin");

                // Save the notification to the database
                const newNotification = new Notification({
                    from: data,
                    to: "admin",
                    message: "A new request has been received!",
                });

                await newNotification.save();

                if (adminUser) {

                    // Emit a response event only to the admin
                    io.to(adminUser.socketId).emit("notify_request_submit", {
                        message: "A new request has been submitted!",
                    });
                }
            } catch (error) {
                console.error("Error processing form submission:", error);
                // Handle the error, e.g., emit an error event or log it
            }
        });

        socket.on("request_action", async (data) => {

            const targetUser = findUserById(data.userId);

            // Save the notification to the database
            const newNotification = new Notification({
                to: data.userId,
                message: "Recieved response!",
            });

            await newNotification.save();

            if (targetUser) {

                io.to(targetUser.socketId).emit("notify_request_action", {
                    message: "Admin responded",
                });
            }
        });

        // Handle the "disconnect" event
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            connectedUsers.delete(socket.id);
        });
    });
};

module.exports = initializeSocket;
