const db = require("../db"); 
const fs = require("fs");
const path = require("path");

// Product Upload Controller
const ProductUpload = (req, res) => {
  const { productname, productdescription, modelnumber } = req.body;
  const images = req.files.map((file) => file.filename); // Extract filenames

  if (!images.length) {
    return res.status(400).json({ error: "At least one image is required" });
  }

  // SQL Query
  const query = `
    INSERT INTO Products (productname, productdescription, modelnumber, image1, image2, image3, image4)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    productname,
    productdescription,
    modelnumber,
    images[0] || null,
    images[1] || null,
    images[2] || null,
    images[3] || null,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      deleteUploadedFiles(req.files);
      return res.status(500).json({ error: "Database insertion failed" });
    }
    res.status(201).json({ message: "Product uploaded successfully", productId: result.insertId });
  });
};

// Function to Delete Uploaded Files
const deleteUploadedFiles = (files) => {
  files.forEach((file) => {
    const filePath = path.join(__dirname, "../Uploads", file.filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", filePath, err);
      } else {
        console.log("Deleted file:", filePath);
      }
    });
  });
};

module.exports = ProductUpload;
