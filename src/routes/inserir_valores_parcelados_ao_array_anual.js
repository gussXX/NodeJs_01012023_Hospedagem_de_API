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

async function inserir_valores_parcelados_ao_array_anual(req, res) {

  const requisition = req.body;

  try {
    await client.connect();

    async function insertOnDB(collection, arrayParcelas, requisition, ano_da_parcela, mes_da_parcela, valor_da_parcela) {

      const mes = mes_da_parcela;
      const valor = valor_da_parcela;
    
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
            //"parcValues": arrayParcelas
          },
        },
      };
    
      const query = {
        "_user": requisition.user,
        "_id": new ObjectId(requisition.id),
      };
    
      const update = { $push: { ['years.' + ano_da_parcela + '.mounths.' + mes]: { $each: [newObject], $position: 0 } } };
      var result = await collection.updateOne(query, update);
    }
    
    const database = client.db("db_users");
    const collection = database.collection("user_data");

    var mesDaParcela = 'mounths.' + requisition.mounth;
    var mesDaParcela2 = requisition.mounth;
    var controllerYear = requisition.year;

    const mounthsList = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    var arrayParcelas = []

    if (requisition.values.parc.isInstallments == true) {

      var valueParcelas = Number(requisition.values.value / requisition.values.parc.quant).toFixed(2);
      var quantParcelas = requisition.values.parc.quant;
      var currentParecelas = 1;

      for (let i = 0; i < mounthsList.length; i++) {
        if (currentParecelas < quantParcelas){
          if (mounthsList[i] == mesDaParcela2){
            if (mounthsList[i] == 'December'){
              mesDaParcela2 = mounthsList[i];
              insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, valueParcelas); 
              currentParecelas = currentParecelas + 1
              mesDaParcela2 = 'January';
              controllerYear = controllerYear + 1; 
              
              for (let index = 0; index < mounthsList.length; index++) {
                if (mounthsList[index] == mesDaParcela2){
                  if (currentParecelas < quantParcelas){
                    insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, valueParcelas);
                    currentParecelas = currentParecelas + 1;
                    mesDaParcela2 = mounthsList[index + 1];                                 
                  }
                  if (currentParecelas == quantParcelas){
                    console.log("ULTIMO VALOR DO ARRAY")
                    const novoValor = (parseFloat(valueParcelas) +
                    parseFloat(requisition.values.value - (requisition.values.parc.quant * valueParcelas))).toFixed(2);
                    insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, novoValor);
                    break;
                  }
                  break;
                }
              }
            }
            insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, valueParcelas);
            mesDaParcela2 = mounthsList[i + 1];
            currentParecelas = currentParecelas + 1;
          }
        } if (currentParecelas == quantParcelas){
          console.log("chamado!")
          const novoValor = (parseFloat(valueParcelas) +
          parseFloat(requisition.values.value - (requisition.values.parc.quant * valueParcelas))).toFixed(2);
          insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, novoValor);
          break;
        }
      }

    } else {
      null
    }

    res.status(200).json();

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "" });

  } finally {
   // await client.close();
  }
};

module.exports = { inserir_valores_parcelados_ao_array_anual };


// if (currentParecelas <= quantParcelas) {
//   console.log("A QUANTIDADE DE PARCELA É MENOR")

//   if (mounthsList[i] == 'December') {
//     console.log("A LISTA CHEGOU AO MES DE DEZEMBRO")

//     mesDaParcela2 = mounthsList[i]
//     arrayParcelas.push({ [mesDaParcela2]: parseFloat(valueParcelas).toFixed(2) });

//     insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, valueParcelas);
//     currentParecelas = currentParecelas + 1;

//     mesDaParcela2 = "January";
//     controllerYear = controllerYear + 1;
//   }

//   for (let index = 0; index < mounthsList.length; index++) {

//     if (mounthsList[index] == mesDaParcela2) {
//       console.log("O MES A SER ADICIONADO É: " + mesDaParcela2)

//       mesDaParcela2 = mounthsList[i]
//       arrayParcelas.push({ [mesDaParcela2]: parseFloat(valueParcelas).toFixed(2) })

//       insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, valueParcelas);
//       currentParecelas= currentParecelas + 1;

//       mesDaParcela2 = mounthsList[i + 1];
//     } 
//   }        
// }