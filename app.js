const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const path = require("path");
const CreateTables = require('./CreateTable');
const userRoute= require('./user/userroute');
const AdminRoute= require('./admin/adminroute');
app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());
CreateTables();
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use('/user',userRoute);
app.use('/admin',AdminRoute);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
