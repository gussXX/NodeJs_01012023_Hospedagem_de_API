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

    var mesDaParcela = 'mounths.' + requisition.mounth;
    var mesDaParcela2 = requisition.mounth;

    const mounthsList = [
      'January', 'February', 'March', 'April', 'May', 'Jun',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    var arrayParcelas = []

    if (requisition.values.parc.isInstallments == true) {
      for (let index = 0; index <= (requisition.values.parc.quant - 1); index++) {

        var valueParcelas = Number(requisition.values.value / requisition.values.parc.quant).toFixed(2);

        for (let i = 0; i < mounthsList.length; i++) {

          if (mounthsList[i] == mesDaParcela2) {
          
            mesDaParcela2 = mounthsList[i]
            arrayParcelas.push({[mesDaParcela2]: parseFloat(valueParcelas).toFixed(2)})
            mesDaParcela2 = mounthsList[i + 1]

            //ESTA PARTE DO CODIGO CORRIGE A DIFERENÇA DO ARREDONDAMENTO DAS PARCELAS E JOGA SEU VALOR PARA A PRIMEIRA.
            const novoValor = (parseFloat(valueParcelas) + 
              parseFloat(requisition.values.value - (requisition.values.parc.quant * valueParcelas))).toFixed(2);
            arrayParcelas[0] = { [requisition.mounth]: parseFloat(novoValor).toFixed(2)}
              
            break;
            
          }
        }
      }

      console.log(arrayParcelas)

      for (let index = 0; index < arrayParcelas.length; index++) {
        const objeto = arrayParcelas[index];
        const mes = Object.keys(objeto)[0];
        const valor = parseFloat(objeto[mes]);

        const newObject = {
          _id: new ObjectId(0),
          date: new Date(0),
          tipe: {
            "categories": requisition.tipe.categories,
            "font": requisition.tipe.font
          },
          values: {
            "total": requisition.values.value,
            "value": valor,
            "parc": {
              "isInstallments": requisition.values.parc.isInstallments,
              "quant": requisition.values.parc.quant,
              "parcValues": arrayParcelas
            },
          },
        };
    
        const query = {
          "_user": requisition.user,
          "_id" : new ObjectId(requisition.id),
        };
    
        const update = { $push: { ['mounths.'+ mes]: { $each: [newObject], $position: 0 } } };
        var result = await collection.updateOne(query, update);

      }

    } else {
      null
    }

    res.status(200).json(result);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "" });

  } finally {

    await client.close();
  }
}

module.exports = { inserir_valores_parcelados_ao_array };
