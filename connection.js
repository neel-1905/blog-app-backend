const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const connection = async () => {
  const client = await MongoClient.connect(
    `mongodb+srv://neel1905:neel1905@cluster0.abtfoeg.mongodb.net/?retryWrites=true&w=majority`
  );
  const db = client.db("Blogs");

  return { db };
};

module.exports = { connection };
