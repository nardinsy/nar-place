// const { MongoClient } = require("mangodb");
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017/mern";
// const callOnDb = () => {
//   console.log("okokok");
// };

const callOnDb = async (dbProcessor) => {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db();

    const result = await dbProcessor(db);
    // throw new Error("helloo");
    return { result, error: undefined };
  } catch (error) {
    return { result: undefined, error };
  } finally {
    client.close();
  }
};

exports.callOnDb = callOnDb;
