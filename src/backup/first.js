const first = (req, res)=> {

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = process.env.STRING_MONGODB;

    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      async function run() {
        try {
        // CONEXAO DO CLIENTE COM O SERVIDOR
        await client.connect();

        const db = client.db();
        const collection = db.collection('users');
        const documents = await collection.find({}).toArray();

        console.log('Docs encontrados: ', documents);
        return res.json(documents);

        } catch(err) {
            console.error('Erro ao encontrar documentos:', err);
            res.status(500).json({ error: 'Erro ao encontrar documentos' });
        }
        
        finally {
          // ERROS
          await client.close();
          return;
        }
      }

      run()
      .catch(console.dir);

}
//
module.exports = {first}