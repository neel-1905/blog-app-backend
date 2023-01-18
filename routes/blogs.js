const express = require("express");
const { ObjectId } = require("mongodb");
const { connection } = require("../connection");
const verify = require("../middleware/verify");
const router = express.Router();

router.get("/all", verify, async (req, res) => {
  const { db } = await connection();

  const blogs = await db.collection("blogs").find({}).toArray();

  if (!blogs) {
    return res.json({ message: "No blogs found", isSuccess: false });
  }

  return res.json({ message: "Blogs found", blogs, isSuccess: true });
});

router.get("/getOne/:id", verify, async (req, res) => {
  const { db } = await connection();
  const id = req.params.id;

  const blog = await db.collection("blogs").findOne({ _id: ObjectId(id) });

  if (!blog) {
    return res.json({ message: "Blog not found", isSuccess: false });
  }

  return res.json({ message: "Blog found", blog, isSuccess: true });
});

router.post("/addBlog", verify, async (req, res) => {
  const { db } = await connection();
  const { title, category, content, author, time } = req.body;

  if (!title || !category || !content || !author || !time) {
    return res.json({
      message: "Please fill all the details",
      isSuccess: false,
    });
  }

  await db
    .collection("blogs")
    .insertOne({ title, category, content, author, time });

  return res.json({ message: "Blog posted", isSuccess: true });
});

router.put("/edit/:id", verify, async (req, res) => {
  const { db } = await connection();
  const { title, category, content, author, time } = req.body;
  const id = req.params.id;

  if (!title || !category || !content || !author || !time) {
    return res.json({
      message: "Please fill all the details",
      isSuccess: false,
    });
  }

  const blog = await db.collection("blogs").findOne({ _id: ObjectId(id) });

  if (!blog) {
    return res.json({ message: "Blog not found", isSuccess: false });
  }

  await db
    .collection("blogs")
    .updateOne(
      { _id: ObjectId(id) },
      { $set: { title, category, content, author, time } }
    );

  return res.json({ message: "Blog updated successfully", isSuccess: true });
});

router.delete("/delete/:id", verify, async (req, res) => {
  const { db } = await connection();
  const id = req.params.id;

  const blog = await db.collection("blogs").findOne({ _id: ObjectId(id) });

  if (!blog) {
    return res.json({ message: "Blog not found", isSuccess: false });
  }

  await db.collection("blogs").deleteOne({ _id: ObjectId(id) });

  return res.json({ message: "Blog deleted", isSuccess: true });
});

module.exports = router;
