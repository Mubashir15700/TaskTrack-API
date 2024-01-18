const socketIO = require("socket.io");
const Notification = require("../models/notificationModel");

function initializeSocket(server) {
    const io = socketIO(server, {
        pingTimeout: 60000,
        cors: {
            origin: "http://localhost:5173"
        },
    });

    const connectedUsers = new Map();

    // Function to find a user by role in the connectedUsers Map
    function findUserByRole(role) {
        for (const [socketId, userDetails] of connectedUsers) {
            if (userDetails.role === role) {
                return { socketId, userDetails };
            }
        }
        return null;
    };

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("admin_connect", (adminData) => {

            // Store admin details along with their socket
            connectedUsers.set(socket.id, {
                userDetails: adminData,
                role: "admin",
            });
        });

        socket.on("user_connect", (userData) => {

            // Store user details along with their socket
            connectedUsers.set(socket.id, {
                userDetails: userData,
                role: "user",
            });
        });

        // Handle the "request_form_submit" event
        socket.on("form_submit", async (data) => {
            try {
                // Find the admin user in the connectedUsers Map
                const adminUser = findUserByRole("admin");

                if (adminUser) {
                    // Save the notification to the database
                    const newNotification = new Notification({
                        from: data.userId,
                        to: "admin",
                        message: "A new request has been received!",
                        formData: data,
                    });

                    await newNotification.save();

                    // Emit a response event only to the admin
                    io.to(adminUser.socketId).emit("notify_form_submit", {
                        message: "A new request has been submitted!",
                        formData: data,
                    });
                } else {
                    console.log("No admin user found");
                    // Handle the case when no admin user is found
                }
            } catch (error) {
                console.error("Error processing form submission:", error);
                // Handle the error, e.g., emit an error event or log it
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
