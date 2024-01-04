const express = require("express");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");

const router = express.Router();

// authentication and login
router.post("/auth/checkauth", authController.checkAuth);
router.post("/login", authController.adminLogin);

// search
router.post("/search", adminController.search);

// user-related actions
router.get("/users", adminController.getUsers);
router.get("/user/:id", adminController.getUser);
router.post("/user-action/:id", adminController.blockUnblockUser);

module.exports = router;
