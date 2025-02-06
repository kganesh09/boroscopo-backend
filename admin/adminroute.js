const express = require("express");
const router = express.Router();
const loginHandler = require("./adminlogin");
const adminAuthMiddleware = require("../middlewares/AdminAuth");
const EnquiresChat = require("./EnquiresChat");
const upload = require("../middlewares/multer");
const ProductUpload = require("./ProductUpload");

//Admin login API
router.post("/login", loginHandler);

// Protected admin routes by adminauthmiddleware

//get the use enquires API
router.get("/enquires", adminAuthMiddleware, EnquiresChat);

//Admin product Upload API
router.post("/ProductUpload", adminAuthMiddleware, upload.array("images", 4), ProductUpload);

router.get("/settings", adminAuthMiddleware, (req, res) => {
  res.json({ message: "Admin Settings Page" });
});

module.exports = router;
