const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const adminCredentials = {
  username: "admin",
  password: bcrypt.hashSync("admin123", 10), // Hashed password for security
};

const loginHandler = (req, res) => {
  const { username, password } = req.body;

  if (username !== adminCredentials.username) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isPasswordValid = bcrypt.compareSync(password, adminCredentials.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token
  const token = jwt.sign(
    { username: adminCredentials.username, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
};

module.exports = loginHandler;
