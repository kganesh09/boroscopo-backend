const db = require("../db");
const fs = require("fs");
const path = require("path");

const ProductEdit = (req, res) => {
  const productId = req.params.id;
  const { productname, productdescription, modelnumber } = req.body;

  // Retrieve the uploaded images (if any)
  const newImages = [];
  ["image1", "image2", "image3", "image4"].forEach((imageKey) => {
    if (req.files[imageKey]) {
      newImages.push(req.files[imageKey][0].filename); // Save the filenames of uploaded images
    } else {
      newImages.push(null); // If no file is uploaded for this image, keep it as null
    }
  });

  // Step 1: Fetch existing product data from the database
  const getProductQuery = `SELECT image1, image2, image3, image4 FROM Products WHERE id = ?`;
  db.query(getProductQuery, [productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch product details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const oldImages = results[0]; // Get the old image filenames from the database
    let updatedImages = Object.values(oldImages); // Default to the old image filenames

    // Step 2: Replace old images with new ones (if any new images are uploaded)
    newImages.forEach((img, index) => {
      updatedImages[index] = img || oldImages[`image${index + 1}`]; // If no new image, retain the old one
    });

    // Step 3: Update product data in the database
    const updateProductQuery = `
      UPDATE Products 
      SET productname = ?, productdescription = ?, modelnumber = ?, 
          image1 = ?, image2 = ?, image3 = ?, image4 = ?
      WHERE id = ?`;

    const values = [
      productname,
      productdescription,
      modelnumber,
      updatedImages[0] || null, // Ensure no undefined values are inserted
      updatedImages[1] || null,
      updatedImages[2] || null,
      updatedImages[3] || null,
      productId,
    ];

    db.query(updateProductQuery, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update product" });
      }

      // Step 4: If new images are uploaded, delete the old ones
      let deleteErrors = [];
      newImages.forEach((newImage, index) => {
        if (newImage && oldImages[`image${index + 1}`]) {
          const oldImagePath = path.join(__dirname, "../Uploads", oldImages[`image${index + 1}`]);
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              deleteErrors.push(`Failed to delete: ${oldImagePath}`);
            }
          });
        }
      });

      // Step 5: Return the response with any warnings for failed deletions
      if (deleteErrors.length > 0) {
        return res.status(200).json({
          message: "Product updated, but some old images couldn't be deleted.",
          warnings: deleteErrors,
        });
      }

      // Step 6: Send a success response
      res.status(200).json({ message: "Product updated successfully" });
    });
  });
};

module.exports = ProductEdit;
