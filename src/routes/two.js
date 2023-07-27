const two = (req, res) => {

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = "mongodb+srv://gustavobressan:bringme33@financas.i3pi8od.mongodb.net/?retryWrites=true&w=majority";

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
            const database = client.db("users");
            const users = database.collection("users");

            const query = {};
            const options ={};

            result = await users.find(query, options).toArray();
            res.status(200).json(result)
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
module.exports = { two }

//          res.status(404).json('Consulta')