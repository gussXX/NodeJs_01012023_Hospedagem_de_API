const { MongoClient, ServerApiVersion, ObjectId, Double, Int32 } = require('mongodb');

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

    async function insertOnDB(collection, arrayParcelas, requisition, ano_da_parcela, mes_da_parcela, valor_da_parcela) {

      await client.connect();

      const mes = mes_da_parcela;
      const valor = Number(valor_da_parcela);

      const newObject = {
        _id: new ObjectId(0),
        date: new Date(0),
        tipe: {
          "categories": requisition.tipe.categories,
          "font": requisition.tipe.font
        },
        values: {
          "total": new Double(requisition.values.value),
          "value": new Double(valor),
          "parc": {
            "isInstallments": requisition.values.parc.isInstallments,
            "quant": new Int32(requisition.values.parc.quant),
            //"parcValues": arrayParcelas
          },
        },
      }

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
      var controledolaço = true;

      for (let i = 0; i < mounthsList.length; i++) {
        if (currentParecelas < quantParcelas && controledolaço == true) {
          if (mounthsList[i] == mesDaParcela2 && controledolaço == true) {
            if (mounthsList[i] == 'December' && controledolaço == true) {
              mesDaParcela2 = mounthsList[i];
              insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, Number(valueParcelas).toFixed(2));

              console.log("ADICIONADO AO BANCO, QUANTIDADE DE PARCELAS: " + quantParcelas + " | PARCELA ATUAL: " + currentParecelas + " | MES: " + mesDaParcela2 + " | O MES É IGUAL A DEZEMBRO")

              currentParecelas = currentParecelas + 1
              mesDaParcela2 = 'January';
              controllerYear = controllerYear + 1;

              for (let index = 0; index < mounthsList.length; index++) {
                if (mounthsList[index] == mesDaParcela2 && controledolaço == true) {
                  if (currentParecelas < quantParcelas && controledolaço == true) {
                    insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, Number(valueParcelas).toFixed(2));

                    console.log("ADICIONADO AO BANCO, QUANTIDADE DE PARCELAS: " + quantParcelas + " | PARCELA ATUAL: " + currentParecelas + " | MES: " + mesDaParcela2 + " | O MES CHEGOU EM DEZEMBRO")

                    currentParecelas = currentParecelas + 1;
                    mesDaParcela2 = mounthsList[index + 1];
                  }
                  if (currentParecelas == quantParcelas && controledolaço == true) {
                    const novoValor = (parseFloat(valueParcelas) +
                      parseFloat(requisition.values.value - (requisition.values.parc.quant * valueParcelas))).toFixed(2);
                    insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, Number(novoValor).toFixed(2));
                    controledolaço = false;
                    console.log("ADICIONADO AO BANCO, QUANTIDADE DE PARCELAS: " + quantParcelas + " | PARCELA ATUAL: " + currentParecelas + " | MES: " + mesDaParcela2 + " | SUPOSTA ULTIMA PARCELA APT DEZEMBRO")

                  }

                }
              }
            } else if (controledolaço == true) {
              insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, valueParcelas);
              console.log("ADICIONADO AO BANCO, QUANTIDADE DE PARCELAS: " + quantParcelas + " | PARCELA ATUAL: " + currentParecelas + " | MES: " + mesDaParcela2 + " | O MES NÃO COMEÇOU EM DEZEMBRO")
              mesDaParcela2 = mounthsList[i + 1];
              currentParecelas = currentParecelas + 1;
            }
          }
        } if (currentParecelas == quantParcelas && controledolaço == true) {
          const novoValor = (parseFloat(valueParcelas) +
            parseFloat(requisition.values.value - (requisition.values.parc.quant * valueParcelas))).toFixed(2);
          insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, Number(novoValor).toFixed(2));
          controledolaço = false;
          console.log("ADICIONADO AO BANCO, QUANTIDADE DE PARCELAS: " + quantParcelas + " | PARCELA ATUAL: " + currentParecelas + " | MES: " + mesDaParcela2 + " | SUPOSTA ULTIMA PARCELA FORA DE DEZEMBRO")

        }
      }

    } else {
      insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, Number(requisition.values.value));
    }

    await client.close();
    res.status(200).json();

  } catch (error) {
    await client.close();
    console.error(error);
    res.status(500).json({ error: "" });

  } finally {

  }
};

module.exports = { inserir_valores_parcelados_ao_array_anual };

