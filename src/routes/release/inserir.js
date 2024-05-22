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

async function inserir(req, res) {

  const requisition = req.body;

  try {

    function getDate(mes_vigente){
      const currentDate = new Date();

      const day = currentDate.getDate();
      const year = currentDate.getFullYear();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();
      const milliseconds = currentDate.getMilliseconds();

      // console.log(mounthsNames[mes_vigente])

      const newDate = new Date(
        year,
        mounthsNames[mes_vigente], 
        day, 
        hours,
        minutes, 
        seconds, 
        milliseconds
      );
      // console.log("===============")
      // console.log(newDate)
      // console.log("===============")

      return newDate;
    }

    async function insertOnDB(collection, arrayParcelas, requisition, ano_da_parcela, mes_da_parcela, valor_da_parcela, data_com_o_mes) {

      await client.connect();

      const mes = mes_da_parcela;
      const valor = parseFloat(valor_da_parcela);
      const total = parseFloat(requisition.values.value)

      console.log(requisition.date)

      const newObject = {
        _id: new ObjectId(0),
        date: data_com_o_mes,
        tipe: {
          "categories": requisition.tipe.categories,
          "font": requisition.tipe.font
        },
        values: {
          "total": Number(total),
          "value": Number(valor),
          "parc": {
            "isInstallments": requisition.values.parc.isInstallments,
            "quant": requisition.values.parc.quant,
            //"parcValues": arrayParcelas
          },
        },
      };

      console.log(newObject)

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
    
    const mounthsNames = {
      'January' : 0, 
      'February': 1,
      'March': 2,
      'April': 3,
      'May': 4,
      'June':5 ,
      'July': 6,
      'August': 7,
      'September': 8,
      'October': 9,
      'November': 10,
      'December': 11,
    }

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
              insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, valueParcelas);

              console.log("ADICIONADO AO BANCO, QUANTIDADE DE PARCELAS: " + quantParcelas + " | PARCELA ATUAL: " + currentParecelas + " | MES: " + mesDaParcela2 + " | O MES É IGUAL A DEZEMBRO")
              console.log(mes_da_parcela2)

              currentParecelas = currentParecelas + 1
              mesDaParcela2 = 'January';
              controllerYear = controllerYear + 1;

              for (let index = 0; index < mounthsList.length; index++) {
                if (mounthsList[index] == mesDaParcela2 && controledolaço == true) {
                  if (currentParecelas < quantParcelas && controledolaço == true) {
                    const data_com_o_mes = getDate(mesDaParcela2)
                    //
                    insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, valueParcelas, data_com_o_mes);
                    console.log("ADICIONADO AO BANCO, QUANTIDADE DE PARCELAS: " + quantParcelas + " | PARCELA ATUAL: " + currentParecelas + " | MES: " + mesDaParcela2 + " | O MES CHEGOU EM DEZEMBRO")

                    currentParecelas = currentParecelas + 1;
                    mesDaParcela2 = mounthsList[index + 1];
                  }
                  if (currentParecelas == quantParcelas && controledolaço == true) {
                    const novoValor = parseFloat((parseFloat(valueParcelas) + parseFloat(requisition.values.value - (requisition.values.parc.quant * valueParcelas))).toFixed(2));
                    const data_com_o_mes = getDate(mesDaParcela2)
                    //
                    insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, novoValor, data_com_o_mes);
                    controledolaço = false;
                    console.log("ADICIONADO AO BANCO, QUANTIDADE DE PARCELAS: " + quantParcelas + " | PARCELA ATUAL: " + currentParecelas + " | MES: " + mesDaParcela2 + " | SUPOSTA ULTIMA PARCELA APT DEZEMBRO")

                  }

                }
              }
            } else if (controledolaço == true) {
              const data_com_o_mes = getDate(mesDaParcela2)
              //
              insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, parseFloat(valueParcelas), data_com_o_mes);
              console.log("ADICIONADO AO BANCO, QUANTIDADE DE PARCELAS: " + quantParcelas + " | PARCELA ATUAL: " + currentParecelas + " | MES: " + mesDaParcela2 + " | O MES NÃO COMEÇOU EM DEZEMBRO")
              mesDaParcela2 = mounthsList[i + 1];
              currentParecelas = currentParecelas + 1;
            }
          }
        } if (currentParecelas == quantParcelas && controledolaço == true) {
          const novoValor = (parseFloat(valueParcelas) +
            parseFloat(requisition.values.value - (requisition.values.parc.quant * valueParcelas))).toFixed(2);
            const data_com_o_mes = getDate(mesDaParcela2)
            //
          insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, parseFloat(novoValor), data_com_o_mes);
          controledolaço = false;
          console.log("ADICIONADO AO BANCO, QUANTIDADE DE PARCELAS: " + quantParcelas + " | PARCELA ATUAL: " + currentParecelas + " | MES: " + mesDaParcela2 + " | SUPOSTA ULTIMA PARCELA FORA DE DEZEMBRO")
        }
      }

    } else {
      const data_com_o_mes = getDate(mesDaParcela2)
      //
      insertOnDB(collection, arrayParcelas, requisition, controllerYear, mesDaParcela2, requisition.values.value, data_com_o_mes);
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

module.exports = { inserir };

