const express = require("express");
const hasToken = require("../../middlewares/auth/hasToken");
const catchAsync = require("../../utils/errorHandling/catchAsync");

const router = express.Router();

// router.get("/", hasToken.adminHasToken, catchAsync((req, res) => console.log("dashboard")));

module.exports = router;
