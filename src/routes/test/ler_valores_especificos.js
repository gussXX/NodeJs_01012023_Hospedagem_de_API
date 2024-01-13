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

async function ler_valores_especificos(req, res) {

const requisition = req.body;

  try {
    await client.connect();

    const database = client.db("db_users");
    const collection = database.collection("user_data");

    const query = { 
        "_id" : new ObjectId(requisition.id),
        "_user": requisition.user 
    };

    const pipeline = [
      { $match: query },
      { $unwind: "$mounths."+requisition.mounth},
      { $project: { "value": "$mounths."+requisition.mounth+".values.value" } },
      { $group: { "_id": null, "sumValues": { $sum: "$value" } } },
      { $project: { "_id": 0, "sumValues": 1 } }
    ];

    const result = await collection.aggregate(pipeline).toArray();

    console.log(pipeline);
    res.status(200).json(result);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "" });

  } finally {

    await client.close();
  }
}

module.exports = { ler_valores_especificos };
