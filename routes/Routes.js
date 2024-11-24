const express = require("express");
const identifyContact = require("../controller/ContactController");

const router = express.Router();
router.post("/identify", identifyContact);

module.exports = router;
