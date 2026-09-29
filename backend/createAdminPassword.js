const bcrypt = require("bcryptjs");

const password = "Admin@12345";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error("Password hashing failed:", err);
    return;
  }

  console.log("Original password:", password);
  console.log("Hashed password:", hash);
});