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

async function deletar(req, res) {

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
        const currentMounth = requisition.mounth;

        const filter = new ObjectId(requisition.filter);
        const lineQuery = "years." + currentYear + ".mounths." + currentMounth + "._id"

        console.log(filter)

        const pipeline = [
            { $match: query },
            {
                $project: {
                    _id: 0,
                    result: {
                        $filter: {
                            input: "$years." + currentYear + ".mounths." + currentMounth,
                            as: "item",
                            cond: { $eq: ["$$item._id", filter] }
                        }
                    }
                }
            }
        ];

        const result = await collection.aggregate(pipeline).toArray();

        res.status(200).json(result[0]['result'][0]);

        if (result[0]['result'][0] !== null) {
        }

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "" });

    } finally {
        await client.close();
    }
}

module.exports = { deletar };
