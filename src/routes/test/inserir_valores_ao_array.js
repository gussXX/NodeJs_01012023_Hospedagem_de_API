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

async function inserir_valores_ao_array(req, res) {

  const requisition = req.body;

  try {
    await client.connect();

    const database = client.db("db_users");
    const collection = database.collection("user_data");

    const newObject = {
      _id: new ObjectId(0),
      date: new Date(0),
      tipe: {
        "categories": requisition.tipe.categories,
        "font": requisition.tipe.font
      },
      values: {
        "value": requisition.values.value,
        parc: []
      },
    };

    const query = {
      "_user": requisition.user,
      //"_id": requisition.id
    };

    const update = { $push: { 'mounths.February': { $each: [newObject], $position: 0 } } };

    const result = await collection.updateOne(query, update);

    console.log(query);
    res.status(200).json(result);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "" });

  } finally {

    await client.close();
  }
}

module.exports = { inserir_valores_ao_array };
