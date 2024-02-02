const express = require("express");
const utilityController = require("../controllers/utility");

const router = express.Router();

// search
router.get("/search", utilityController.search);

module.exports = router;
