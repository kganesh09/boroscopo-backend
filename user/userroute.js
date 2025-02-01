// userRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const db = require('../db');
require('dotenv').config();
const passkey = process.env.EMAILPASSKEY;

// Create a transporter using your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ganesh1861997@gmail.com',
    pass: passkey
  }
});

router.post('/contact', (req, res) => {
  const { name, email, phoneno, date } = req.body;

  const query = 'INSERT INTO EnquiresDetails (name, email, phonenumber, date) VALUES (?, ?, ?, ?)';

  db.execute(query, [name, email, phoneno, date], (err, results) => {
    if (err) {
      console.log('Error inserting data into database: ', err);
      return res.status(500).json({ success: false, message: 'Error storing data in database' });
    }

  const mailOptions = {
    from: email,
    to: 'ganesh1861997@gmail.com',
    subject: 'Contact Us Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nPhoneno: ${phoneno} \ndate: ${date}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Error sending message' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ success: true, message: 'Thank you for contact us... We will contact you soon!!!' });
    }
    
  });
 });
});


module.exports = router;
