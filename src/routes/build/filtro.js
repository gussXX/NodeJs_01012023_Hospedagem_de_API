const { MongoClient, ServerApiVersion, ObjectId, ISODate} = require('mongodb');

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

async function filtro(req, res) {

  const requisition = req.body;

  try {
    await client.connect();

    const database = client.db("db_users");
    const collection = database.collection("user_data");

    const query = {
      "_id" : new ObjectId(requisition.id),
      "_user": requisition.user,
    };

    const currentYear = requisition.years;

    const pipeline = [
      { $match: query },
      {
        $match: {
          $or: [
            { "years.2024.mounths.January.date": { 
              $gte: Date("2024-01-04T00:00:00.000Z"), 
              $lt: Date("2024-03-09T00:00:00.000Z") } 
            },
            { "years.2024.mounths.February.date": {
              $gte: Date("2024-01-04T00:00:00.000Z"), 
              $lt: Date("2024-03-09T00:00:00.000Z") } 
            },
            { "years.2024.mounths.March.date": { 
              $gte: Date("2024-01-04T00:00:00.000Z"),
              $lt: Date("2024-03-09T00:00:00.000Z") }
            }
          ]
        }
      },
      {
        $project: {
          _id: 0,
          January: "$years.2024.mounths.January",
          February: "$years.2024.mounths.February",
          March: "$years.2024.mounths.March"
        }
      }
    ];

    const result = await collection.aggregate(pipeline).toArray();
    res.status(200).json(result);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "" });

  } finally {

    await client.close();
  }
}

module.exports = { filtro };
