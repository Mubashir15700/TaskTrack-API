const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/auth/checkauth", authController.checkAuth);
router.post("/login", authController.adminLogin);

module.exports = router;