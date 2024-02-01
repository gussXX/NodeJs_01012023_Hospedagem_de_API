const { MongoClient, ServerApiVersion, ObjectId, ISODate } = require('mongodb');

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

async function filtrar_data(req, res) {

    const requisition = req.body;

    try {
        await client.connect();

        const database = client.db("db_users");
        const collection = database.collection("user_data");

        const query = {
            "_id": new ObjectId(requisition.id),
            "_user": requisition.user,
        };

        const currentYear = requisition.years;

        const pipeline = [
            { $match: query },
            {
                $project: {
                    _id: 0,
                    result: {
                      $map: {
                        input: { $objectToArray: "$years.2024.mounths" },
                        as: "month",
                        in: {
                          month: "$$month.k",
                          items: {
                            $filter: {
                              input: "$$month.v",
                              as: "item",
                              cond: {
                                $and: [
                                  { $gte: ["$$item.date", { $dateFromString: { dateString: "2024-01-01T00:00:00.000Z" } }] },
                                  { $lte: ["$$item.date", { $dateFromString: { dateString: "2024-01-04T23:59:59.999Z" } }] },
                                  { $eq:  ["$$item.tipe.categories", "Conta"] }
                                ]
                              },
                            },
                          },
                        },
                      },
                    },
                }
            },
            {
                $match :{
                    "result.items": {
                      $elemMatch: { $exists: true },
                    },
                }
            },
            {
                $unwind : "$result"
            },
            {
                $unwind : "$result.items"
            },
            {
                $group : {
                    _id: null,
                    totalValue: {
                      $sum: "$result.items.values.value",
                    },
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

module.exports = { filtrar_data };
