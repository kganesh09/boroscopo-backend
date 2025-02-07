const express = require("express");
const router = express.Router();
const loginHandler = require("./adminlogin");
const adminAuthMiddleware = require("../middlewares/AdminAuth");
const EnquiresChat = require("./EnquiresChat");
const upload = require("../middlewares/multer");
const ProductUpload = require("./ProductUpload");
const ViewProduct = require("./ViewProduct")
const ProductDelete = require("./ProductDelete")
const ProductUpdate = require("./ProductUpdate")

//Admin login API
router.post("/login", loginHandler);

// Protected admin routes by adminauthmiddleware

//get the use enquires API
router.get("/enquires", adminAuthMiddleware, EnquiresChat);

//Admin product Upload API
router.post("/ProductUpload", adminAuthMiddleware, upload.array("images", 4), ProductUpload);

//View All product API
router.get("/ViewProducts", adminAuthMiddleware, ViewProduct);

//Delete a Single Product Using Product-ID
router.delete("/ProductDelete/:id", adminAuthMiddleware, ProductDelete);

//Edit the a single product using ProductID
router.put("/ProductEdit/:id", adminAuthMiddleware, upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]), ProductUpdate);

module.exports = router;
