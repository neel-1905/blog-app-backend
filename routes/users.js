const express = require("express");
const { connection } = require("../connection");
const verify = require("../middleware/verify");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { db } = await connection();
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      message: "Please fill all the details",
      isSuccess: false,
    });
  }

  const userExists = await db.collection("users").findOne({ email });

  if (userExists) {
    return res.json({ message: "User already exists", isSuccess: false });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .collection("users")
    .insertOne({ name, email, password: hashedPassword });

  return res.json({ message: "User registered successfully", isSuccess: true });
});

router.post("/login", async (req, res) => {
  const { db } = await connection();
  const { email, password } = req.body;

  const userExists = await db.collection("users").findOne({ email });

  if (!userExists) {
    return res.json({ message: "User not found", isSuccess: false });
  }

  const passwordIsTrue = await bcrypt.compare(password, userExists?.password);

  const secretkey = "secretkey";

  const token = jwt.sign(
    { _id: userExists?._id, name: userExists?.name },
    secretkey
  );

  if (passwordIsTrue) {
    return res.json({ message: "Login Successful", isSuccess: true, token });
  } else {
    return res.json({ message: "Password Is Incorrect", isSuccess: false });
  }
});

module.exports = router;
