const ler_valores_especificos = (req, res) => {

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

            const query = {};
            const options = {
                projection: {
                    "_user" : "guss"
                }
            };

            result = await collection.find(query, options).toArray();

            if (result.length === 0){
                res.status(404).json("A consulta não retornou valores.")
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
module.exports = { ler_valores_especificos }
