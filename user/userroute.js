// userRoutes.js
const express = require('express');
const router = express.Router();
const emailSender = require("./emailSender")

//email sender API for user
router.post('/contact', emailSender);

//

module.exports = router;
