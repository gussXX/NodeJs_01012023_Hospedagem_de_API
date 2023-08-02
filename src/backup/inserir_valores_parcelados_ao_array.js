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

    const mounthsList = [
        'January', 'February',  'March',        'April',    'May',      'Jun',
        'July',    'August',    'September',    'October',  'November', 'December'
    ];

    const mesDaParcela = ['mounths.'+requisition.mounth];

    var arrayParcelas = []

    if(requisition.values.parc.isInstallments == true){
       for (let index = 0; index <= (requisition.values.parc.quant - 1 ); index++) {
    
       var valueParcelas = Number(requisition.values.value / requisition.values.parc.quant).toFixed(2);
       //var valueParcelasSobra = requisition.values.value % requisition.values.parc.quant;
        arrayParcelas.unshift(
          {
            ["parc_" + (index + 1)] : parseFloat(valueParcelas).toFixed(2) 
          }
        )
       }
       
       const novoValor = (parseFloat(valueParcelas) + parseFloat(requisition.values.value - (requisition.values.parc.quant * valueParcelas))).toFixed(2);

       function corrigirUltimaParcela(lista, novoValor){
        lista[lista.length - 1] = {["parc_1"]: novoValor};
       }
       corrigirUltimaParcela(arrayParcelas, novoValor);

    }else{
      null
    }

    console.log(arrayParcelas)

    for (let i = 0; i < mounthsList.length; i++) {
      if(mounthsList[i] == mesDaParcela){
        indexDoMes = i;
        nomeDoMes = mounthsList[i];

        mesDaParcela = mounthsList[i]
        break;
      }
    }

    const newObject = {
      _id: new ObjectId(0),
      date: new Date(0),
      tipe: {
        "categories": requisition.tipe.categories,
        "font": requisition.tipe.font
      },
      values: {
        "total" :requisition.values.value,
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

    const update = { $push: { [mesDaParcela]: { $each: [newObject], $position: 0 } } };
    const result = await collection.updateOne(query, update);

    res.status(200).json(result);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "" });

  } finally {

    await client.close();
  }
}

module.exports = { inserir_valores_parcelados_ao_array };
