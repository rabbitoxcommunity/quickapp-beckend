

const { MongoClient } = require('mongodb');

// Your MongoDB connection string
// const uri = "mongodb://username:password@hostname:port/database";
const uri = "mongodb://thequick:aslam#@123@92.204.40.142:27017/quickapp";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");

    const database = client.db("your_database_name");
    const users = database.collection("users");

    // Data to be inserted
    const doc = {
      _id: new ObjectId("66b4f0e8e650e69dd3385925"),
      username: "quickapp",
      email: "quick@superadmin.com",
      password: "$2a$12$3BnxhmqbiPwRGzjDR8I2gO/PJkGmMt3Bob1T2noWb6AZRCWJavEx6",
      profile: "uploads/1723134184939.jpg",
      location: "Edakkulam",
      role: "superadmin",
      isActive: true,
      __v: 0
    };

    const result = await users.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);