const express = require("express");
const PORT = 3001 || process.env.PORT;
const cors = require("cors");
const { connection } = require("./connection");
const app = express();
const userRoute = require("./routes/users");
const blogRoute = require("./routes/blogs");

app.use(express.json());
app.use(
  cors({
    origin: "https://blogging-app-project.netlify.app",
  })
);

app.use("/users", userRoute);
app.use("/blogs", blogRoute);

app.listen(PORT, async (req, res) => {
  const { db } = await connection();

  const collections = await db.listCollections().toArray();

  if (collections.length) {
    console.log(`App Running On Port ${PORT}`);
  }
});
