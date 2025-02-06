const express = require("express");
const router = express.Router();
const loginHandler = require("./adminlogin");
const adminAuthMiddleware = require("../middlewares/AdminAuth");
const EnquiresChat = require("./EnquiresChat");
const upload = require("../middlewares/multer");
const ProductUpload = require("./ProductUpload");
const ViewProduct = require("./ViewProduct")

//Admin login API
router.post("/login", loginHandler);

// Protected admin routes by adminauthmiddleware

//get the use enquires API
router.get("/enquires", adminAuthMiddleware, EnquiresChat);

//Admin product Upload API
router.post("/ProductUpload", adminAuthMiddleware, upload.array("images", 4), ProductUpload);

router.get("/ViewProducts", adminAuthMiddleware, ViewProduct);

module.exports = router;
