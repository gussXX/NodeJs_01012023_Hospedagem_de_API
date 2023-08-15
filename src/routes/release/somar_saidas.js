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

async function somar_saidas(req, res) {

    const requisition = req.body;

    try {
        await client.connect();

        const database = client.db("db_users");
        const collection = database.collection("user_data");

        const query = {
            "_id": new ObjectId(requisition.id),
            "_user": requisition.user,
        };

        const anoSelecionado = requisition.years;
        const mesSelecionado = requisition.mounths;

        const pipeline = [
            { $match: query },
            {
                $project: {
                    "_id": 1,
                    "_user": 1,
                    "mounthValues": "$years." + anoSelecionado + ".mounths." + mesSelecionado
                }
            },
            {   $unwind: "$mounthValues" },
            { 
                $match: { 
                    "mounthValues.tipe.font": "saida" 
                }
            },
            { $group: { _id: null, total: { $sum: "$mounthValues.values.value" } } }
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

module.exports = { somar_saidas };
