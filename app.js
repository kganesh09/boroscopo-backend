const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const userRoute= require('./user/userroute');
const AdminRoute= require('./admin/adminroute');
app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());
app.use('/user',userRoute);
app.use('/admin',AdminRoute);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
