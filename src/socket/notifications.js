const Notification = require("../models/notification");

function handleRequestSubmit(io, socket, connectedUsers, findUserByRole) {
    socket.on("request_submit", async (data) => {

        try {
            const adminUser = findUserByRole("admin", connectedUsers);
            console.log("adminUser", adminUser);

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
                    message: "A new request has been received!",
                });
            }
        } catch (error) {
            console.error("Error processing form submission:", error);
            // Handle the error, e.g., emit an error event or log it
        }
    });
};

function handleRequestAction(io, socket, connectedUsers, findUserById) {
    socket.on("request_action", async (data) => {
        const targetUser = findUserById(data.userId, connectedUsers);
        console.log("targetUser", targetUser);

        // Save the notification to the database
        const newNotification = new Notification({
            to: data.userId,
            message: data.message,
        });

        await newNotification.save();

        if (targetUser) {

            io.to(targetUser.socketId).emit("notify_request_action", {
                message: data.message,
            });
        }
    });
};

module.exports = { handleRequestSubmit, handleRequestAction };
