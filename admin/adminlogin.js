const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const adminCredentials = {
  email: "admin123@gmail.com",
  password: bcrypt.hashSync("admin123", 10), // Hashed password for security
};

const loginHandler = (req, res) => {
  const { email, password } = req.body;

  if (email !== adminCredentials.email) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = bcrypt.compareSync(password, adminCredentials.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate a JWT token
  const token = jwt.sign(
    { email: adminCredentials.email, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
};

module.exports = loginHandler;
