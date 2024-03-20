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
        const deleteLineQuery = "years." + currentYear + ".mounths." + currentMounth;

        // const lineQuery = "$years." + currentYear + ".mounths." + currentMounth;
        // const pipeline = [
        //     { $match: query },
        //     {
        //         $project: {
        //             _id: 0,
        //             result: {
        //                 $filter: {
        //                     input: lineQuery,
        //                     as: "item",
        //                     cond: { $eq: ["$$item._id", filter] }
        //                 }
        //             }
        //         }
        //     }
        // ];

        // const result = await collection.aggregate(pipeline).toArray();

        // if (result[0]['result'][0] !== null) {
        //      const updateResult =  await collection.updateOne(
        //         query,
        //         { $pull: { [deleteLineQuery] : { _id: filter  } } }
        //       )

        //       console.log(updateResult)
        // }

        const updateResult = await collection.updateOne(
            query,
            {
                $pull: {
                    [deleteLineQuery]:
                    {
                        _id: filter
                    }
                }
            }
        )

        console.log(updateResult)

        if (updateResult.matchedCount == 0) {
            res.status(400).json('Algo não saiu como o esperado.');
        } else {
            if (updateResult.modifiedCount == 0) {
                res.status(404).json('Nenhum valor correspondente foi encontrado.');
            } else {
                res.status(200).json('Valor encontrado e excluido com sucesso!');
            }
        }

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Erro critico no sistema" });

    } finally {
        await client.close();
    }
}

module.exports = { deletar };
