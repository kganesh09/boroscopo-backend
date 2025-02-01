const db = require('./db'); // Database connection file

// SQL queries to create the tables
const createEnquiresDetailsTableQuery = `
  CREATE TABLE IF NOT EXISTS EnquiresDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phonenumber VARCHAR(15),
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createProductsTableQuery = `
  CREATE TABLE IF NOT EXISTS Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productname VARCHAR(255) NOT NULL,
    productdescription TEXT,
    modelnumber VARCHAR(100),
    image1 VARCHAR(255),
    image2 VARCHAR(255),
    image3 VARCHAR(255),
    image4 VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Function to create both tables
const createTables = () => {
  // Execute both queries one after the other
  db.query(createEnquiresDetailsTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating EnquiresDetails table:', err);
    } else {
      console.log('Table "EnquiresDetails" checked/created successfully!');
    }
  });

  db.query(createProductsTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating Products table:', err);
    } else {
      console.log('Table "Products" checked/created successfully!');
    }
  });
};

module.exports = createTables;
