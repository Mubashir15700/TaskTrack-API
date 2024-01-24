const Notification = require("../models/notification");

function handleRequestSubmit(io, socket, connectedUsers, findUserByRole) {
    socket.on("request_submit", async (data) => {

        console.log("request_submit");

        try {
            const adminUser = findUserByRole("admin", connectedUsers);
            console.log("adminUser", adminUser);

            // Save the notification to the database
            const newNotification = new Notification({
                from: data,
                to: "admin",
                message: "A new request has been received!",
                redirectTo: "/admin/laborer-requests",
            });

            await newNotification.save();

            if (adminUser) {

                console.log("if adminUser");

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
            redirectTo: "/jobs/works-history",
        });

        await newNotification.save();

        if (targetUser) {

            io.to(targetUser.socketId).emit("notify_request_action", {
                message: data.message,
            });
        }
    });
};

function handleJobApplication(io, socket, connectedUsers, findUserById) {
    socket.on("new_applicant", async (data) => {
        const targetUser = findUserById(data, connectedUsers);

        // // Save the notification to the database
        const newNotification = new Notification({
            to: data.empId,
            message: "New job application recieved",
            redirectTo: `/jobs/listed-jobs/${data.jobId}`,
        });

        await newNotification.save();

        if (targetUser) {
            io.to(targetUser.socketId).emit("notify_new_applicant", {
                message: "New job application recieved",
            });
        }
    });
};

function handleCancelApplication(io, socket, connectedUsers, findUserById) {
    socket.on("application_cancel", async (data) => {
        console.log(data);
        const targetUser = findUserById(data.userId, connectedUsers);
        console.log("targetUser", targetUser);

        // // Save the notification to the database
        const newNotification = new Notification({
            to: data.empId,
            message: "Laborer cancelled application",
            redirectTo: `/jobs/listed-jobs/${data.jobId}`,
        });

        await newNotification.save();

        if (targetUser) {

            io.to(targetUser.socketId).emit("notify_application_cancel", {
                message: "Laborer cancelled application",
            });
        }
    });
};

module.exports = { handleRequestSubmit, handleRequestAction, handleJobApplication, handleCancelApplication };
