const adicionar_valor_ao_mes = (req, res) => {

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = process.env.STRING_MONGODB;

    const mongoOption = {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }

    const client = new MongoClient(uri, mongoOption);
    const requisition = req.body;

    async function run() {
        try {
            const database = client.db("db_users");
            const collection = database.collection("user_data");

            const doc = {name: "Neapolitan pizza", shape: "round"};
            const query = {};
            const options ={};

            result = await collection.insertOne(doc, query, options);

            if (result.length === 0){
                res.status(404).json("O valor não foi inserido!")
            } else{
                res.status(200).json(result)
            }
        } 

        catch(error){
            console.error(error);
            res.status(500).json({ error: "" });
        }
        
        finally {
          await client.close();
        }
      }
      run().catch(console.dir);

}
//
module.exports = { adicionar_valor_ao_mes }
