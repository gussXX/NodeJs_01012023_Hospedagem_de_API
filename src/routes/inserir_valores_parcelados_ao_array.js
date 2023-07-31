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

async function inserir_valores_parcelados_ao_array(req, res) {

  const requisition = req.body;

  try {
    await client.connect();

    const database = client.db("db_users");
    const collection = database.collection("user_data");

    const mounthsList =[
        'January', 'February',  'March',        'April',    'May',      'Jun',
        'July',    'August',    'September',    'October',  'November', 'December'
    ];

    var arrayParcelas = []

    console.log(requisition.values.parc.isInstallments)

    if(requisition.values.parc.isInstallments == true){
       for (let index = 0; index <= (requisition.values.parc.quant - 1 ); index++) {
    
       var valueParcelas = (requisition.values.value / requisition.values.parc.quant).toFixed(2);
       var valueParcelasSobra = requisition.values.value % requisition.values.parc.quant;

       console.log("Sobrou --> " + valueParcelasSobra.toFixed(2))

        arrayParcelas.unshift({["parc0" + (index + 1) + ""] : parseFloat(valueParcelas).toFixed(2) })
       }

       console.log(arrayParcelas)

    }else{
      null
    }

    const newObject = {
      _id: new ObjectId(0),
      date: new Date(0),
      tipe: {
        "categories": requisition.tipe.categories,
        "font": requisition.tipe.font
      },
      values: {
        "value": requisition.values.value,
        "parc": {
          "isInstallments" : requisition.values.parc.isInstallments,
          "quant" : requisition.values.parc.quant,
          "parcValues": arrayParcelas
        },
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

module.exports = { inserir_valores_parcelados_ao_array };
