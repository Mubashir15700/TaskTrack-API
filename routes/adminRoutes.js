const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController/auth");

router.post("/auth/checkauth", authController.checkAuth);
router.post("/login", authController.adminLogin);

module.exports = router;