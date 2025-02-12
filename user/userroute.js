// userRoutes.js
const express = require('express');
const router = express.Router();
const emailSender = require("./emailSender")
const ViewProduct = require("../admin/ViewProduct");

//email sender API for user
router.post('/contact', emailSender);

//product listing for product page
router.get('/viewProduct', ViewProduct);

module.exports = router;
