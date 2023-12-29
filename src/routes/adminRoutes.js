const express = require("express");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.post("/auth/checkauth", authController.checkAuth);
router.post("/login", authController.adminLogin);

router.get("/users", adminController.getUsers);
router.get("/user/:id", adminController.getUser);

module.exports = router;