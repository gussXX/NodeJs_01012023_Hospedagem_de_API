const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.STRING_MONGODB;

const mongoOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

const client = new MongoClient(uri, mongoOption);

async function ler_valores_especificos_anual(req, res) {

  const requisition = req.body;

  try {
    await client.connect();

    const database = client.db("db_users");
    const collection = database.collection("user_data");

    const query = {
      //"_id" : new ObjectId(requisition.id),
      "_user": requisition.user,
      "years": { "$elemMatch": { [requisition.years]: { "$exists": true } } }
    };

    const thisYear = requisition.years;

    const pipeline = [
      { $match: query },
      { $project: {
          "_id": 1,
          "_user": 1,
          "years": {
            $filter: {
              input: "$years",
              as: "year", 
              cond: { $gt: [{ $ifNull: ["$$year." + thisYear, null] }, null] }
            }
          }
        }
      },
    ];

    console.log(thisYear)

    const result = await collection.aggregate(pipeline).toArray();
    res.status(200).json(result);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "" });

  } finally {

    await client.close();
  }
}

module.exports = { ler_valores_especificos_anual };
