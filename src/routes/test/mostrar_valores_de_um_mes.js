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

async function mostrar_valores_de_um_mes(req, res) {

  const requisition = req.body;

  console.log(requisition);

  try {
    await client.connect();

    const database = client.db("db_users");
    const collection = database.collection("user_data");

    const query = {
      "_id" : new ObjectId(requisition.id),
      "_user": requisition.user,
    };

    const currentYear = requisition.years;
    const currentMounth = requisition.mounth;

    const pipeline = [
      { $match: query },
      {
        $project: {
          // _id: 1,
          // _user: 1,
          currentMounth: {
            $map: {
              input: "$years." + currentYear + ".mounths." + currentMounth,
              as: "item",
              in: {
                date: "$$item.date",
                categories : "$$item.tipe.categories",
                parc : "$$item.values.parc.isInstallments",
                tipe: "$$item.tipe.font",
                value: "$$item.values.value"
              }
            }
          }
        }
      }
    ];
    
    const result = await collection.aggregate(pipeline).toArray();
    res.status(200).json(result);
    console.log('MOSTRAR VALORES DE UM MES - Executado com sucesso!')
  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "" });

  } finally {

    await client.close();
  }
}

module.exports = { mostrar_valores_de_um_mes };
