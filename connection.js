const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const connection = async () => {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.abtfoeg.mongodb.net/?retryWrites=true&w=majority`
  );
  const db = client.db("Blogs");

  return { db };
};

module.exports = { connection };
