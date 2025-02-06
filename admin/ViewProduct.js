const express = require("express");
const db = require("../db");

const ViewProducts = (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const pageInt = parseInt(page, 10);
  const limitInt = parseInt(limit, 10);
  const offset = (pageInt - 1) * limitInt;

  const searchTerm = `%${search}%`;

  const productQuery = `
    SELECT id, productname, productdescription, modelnumber, image1, image2, image3, image4
    FROM Products
    WHERE productname LIKE ? OR productdescription LIKE ? OR modelnumber LIKE ?
    LIMIT ? OFFSET ?`;

  db.query(productQuery, [searchTerm, searchTerm, searchTerm, limitInt, offset], (err, results) => {
    if (err) {
      console.log("Error fetching products:", err);
      return res.status(500).json({ success: false, message: "Error fetching data" });
    }

    const countQuery = `SELECT COUNT(*) AS total FROM Products WHERE productname LIKE ? OR productdescription LIKE ? OR modelnumber LIKE ?`;

    db.query(countQuery, [searchTerm, searchTerm, searchTerm], (err, countResult) => {
      if (err) {
        console.log("Error fetching count:", err);
        return res.status(500).json({ success: false, message: "Error fetching count" });
      }

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limitInt);

      res.status(200).json({
        success: true,
        data: results,
        pagination: { totalRecords, totalPages, currentPage: pageInt, limit: limitInt },
      });
    });
  });
};

module.exports = ViewProducts;
