const express = require("express");
const db = require ("../db")

const EnquiresChat = (req, res) => {
  // Destructure query parameters with default values for page, limit, and search
  const { page = 1, limit = 10, search = '' } = req.query;
  
  // Ensure the page and limit are treated as integers
  const pageInt = parseInt(page, 10);
  const limitInt = parseInt(limit, 10);

  // Calculate offset for pagination
  const offset = (pageInt - 1) * limitInt;

  // Define the SQL query for fetching data with LIKE for search and pagination
  const enquiresQuery = `
    SELECT * FROM EnquiresDetails
    WHERE name LIKE ? OR email LIKE ?
    LIMIT ? OFFSET ?`;

  // Define the search term pattern for LIKE
  const searchTerm = `%${search}%`;

  // Query the database to get the filtered data
  db.query(enquiresQuery, [searchTerm, searchTerm, limitInt, offset], (err, results) => {
    if (err) {
      console.log('Error fetching data from the database: ', err);
      return res.status(500).json({ success: false, message: 'Error fetching data' });
    }

    // Get total records for pagination
    const countQuery = 'SELECT COUNT(*) AS total FROM EnquiresDetails WHERE name LIKE ? OR email LIKE ?';
    
    db.query(countQuery, [searchTerm, searchTerm], (err, countResult) => {
      if (err) {
        console.log('Error fetching count: ', err);
        return res.status(500).json({ success: false, message: 'Error fetching count' });
      }

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limitInt); // calculate the total number of pages

      // Return the results along with pagination info
      res.status(200).json({
        success: true,
        data: results,
        pagination: {
          totalRecords,
          totalPages,
          currentPage: pageInt,
          limit: limitInt
        }
      });
    });
  });
};

module.exports = EnquiresChat ;