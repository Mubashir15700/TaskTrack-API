const NotificationRepository = require("../repositories/notification");
const notificationRepository = new NotificationRepository();

async function saveNotification(message, redirectTo, to, from) {
    if (!message || !redirectTo || !to) {
        throw new Error("Missing required parameters for saving notification");
    }

    const newNotification = {
        message,
        redirectTo,
        to,
    };

    if (from) {
        newNotification.from = from;
    }

    await notificationRepository.saveNewNotification(newNotification);
};

function handleRequestSubmit(io, socket, connectedUsers, findUserByRole) {
    socket.on("request_submit", async (data) => {
        try {
            const adminUser = findUserByRole("admin", connectedUsers);

            const message = "A new request has been received!";
            await saveNotification(
                message,
                "/admin/laborer-requests",
                "admin",
                data,
                
            );

            if (adminUser) {
                // Emit a response event only to the admin
                io.to(adminUser.socketId).emit("notify_request_submit", {
                    message,
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

        const message = data.message;

        // Save the notification to the database
        await saveNotification(message, "/jobs/works-history", data.userId);

        if (targetUser) {
            io.to(targetUser.socketId).emit("notify_request_action", {
                message,
            });
        }
    });
};

function handleJobApplication(io, socket, connectedUsers, findUserById) {
    socket.on("new_applicant", async (data) => {
        const targetUser = findUserById(data.empId, connectedUsers);

        const message = "New job application recieved";

        // Save the notification to the database
        await saveNotification(message, `/jobs/listed-jobs/${data.jobId}`, data.empId);

        if (targetUser) {
            io.to(targetUser.socketId).emit("notify_new_applicant", {
                message,
            });
        }
    });
};

function handleCancelApplication(io, socket, connectedUsers, findUserById) {
    socket.on("application_cancel", async (data) => {
        const targetUser = findUserById(data.empId, connectedUsers);

        const message = "Laborer cancelled application";

        // Save the notification to the database
        await saveNotification(message, `/jobs/listed-jobs/${data.jobId}`, data.empId);

        if (targetUser) {
            io.to(targetUser.socketId).emit("notify_application_cancel", {
                message,
            });
        }
    });
};

function handleApplicationAction(io, socket, connectedUsers, findUserById) {
    socket.on("application_action", async (data) => {
        const targetUser = findUserById(data.laborerId, connectedUsers);

        const message = `Your job request has been ${data.actionTook}`;

        // Save the notification to the database
        await saveNotification(message, `/jobs/${data.jobId}`, data.laborerId);

        if (targetUser) {
            io.to(targetUser.socketId).emit("notify_application_action", {
                message,
            });
        }
    });
};

module.exports = {
    handleRequestSubmit,
    handleRequestAction,
    handleJobApplication,
    handleCancelApplication,
    handleApplicationAction
};
