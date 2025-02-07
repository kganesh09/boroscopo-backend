const db = require("../db");
const fs = require("fs");
const path = require("path");

// Delete Product Controller
const ProductDelete = (req, res) => {
  const productId = req.params.id;

  // Step 1: Fetch product images before deletion
  const getProductQuery = `SELECT image1, image2, image3, image4 FROM Products WHERE id = ?`;
  db.query(getProductQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching product images:", err);
      return res.status(500).json({ error: "Failed to fetch product images" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const images = results[0];
    const imagePaths = Object.values(images).filter(Boolean); // Remove null values

    // Step 2: Delete product from database
    const deleteProductQuery = `DELETE FROM Products WHERE id = ?`;
    db.query(deleteProductQuery, [productId], (err, result) => {
      if (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({ error: "Failed to delete product" });
      }

      // Step 3: Delete images from filesystem
      let deleteErrors = [];
      imagePaths.forEach((image) => {
        const filePath = path.join(__dirname, "../Uploads", image);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", filePath, err);
            deleteErrors.push(`Failed to delete: ${filePath}`);
          } else {
            console.log("Deleted file:", filePath);
          }
        });
      });

      // Send response (with warnings if any images failed to delete)
      if (deleteErrors.length > 0) {
        return res.status(200).json({ 
          message: "Product deleted successfully, but some images could not be removed.", 
          warnings: deleteErrors 
        });
      }

      res.status(200).json({ message: "Product and images deleted successfully" });
    });
  });
};

module.exports = ProductDelete;
