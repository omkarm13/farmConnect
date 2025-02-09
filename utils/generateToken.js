const jwt = require("jsonwebtoken");

const generateToken = (user, res) => {
  const token = jwt.sign({ id:user._id, role:user.role }, process.env.JWT_SEC, {
    expiresIn: "15d",
  });

  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  });
};

module.exports = generateToken;