const chatRepository = require("../repositories/chat");
const notificationRepository = require("../repositories/notification");

function handleGetChatHistory(io, socket) {
    socket.on("get_chat_history", async (data) => {

        console.log(data);
        const conversation = await chatRepository.findConversation(data.senderId, data.receiverId);

        if (conversation) {
            // Find chat messages based on the conversationId
            const chatHistory = await chatRepository.findChatHistory(conversation._id);

            // Emit the chat history to the user who requested it
            io.to(socket.id).emit("chat_history", chatHistory);
        }
    });
};

function handleSendMessage(io, socket, connectedUsers, findUserById) {
    socket.on("send_message", async (data) => {

        // Find the sender and receiver users using their IDs
        const senderUser = findUserById(data.senderId, connectedUsers);
        const receiverUser = findUserById(data.receiverId, connectedUsers);

        if (senderUser && receiverUser) {
            // Emit the message to the receiver
            io.to(receiverUser.socketId).emit("receive_message", data);

            // Save the notification to the database
            const newNotification = {
                from: data.senderId,
                to: data.receiverId,
                message: `You have a new message from ${data.username}!`,
                redirectTo: `/chat/${data.senderId}/${data.username}`,
            };

            await notificationRepository.saveNewNotification(newNotification);

            if (receiverUser) {
                // Emit a notification to the receiver
                io.to(receiverUser.socketId).emit("chat_notification", {
                    type: "new_message",
                    senderId: data.senderId,
                    message: `You have a new message from ${data.username}!`,
                });

                // Emit a success message to the sender
                io.to(senderUser.socketId).emit("send_message_success", {
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    message: data.message,
                    timestamp: new Date(),
                });
            } else {
                console.log("No reciever found");
            }
        }

        // Create a new conversation or find an existing one
        let conversation = await chatRepository.findConversation(data.senderId, data.receiverId);

        if (!conversation) {
            conversation = await chatRepository.createConversation(data.senderId, data.receiverId);
        }

        // Save the message to the database with the conversationId
        const newChatMessage = {
            conversationId: conversation._id,
            senderId: data.senderId,
            message: data.message,
            timestamp: new Date(),
        };

        await chatRepository.saveNewChatMessage(newChatMessage);
    });
};

module.exports = { handleGetChatHistory, handleSendMessage };
