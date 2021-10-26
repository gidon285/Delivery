
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const dbName = 'ourProj';
const client = new MongoClient( "mongodb://user:admin@cluster0-shard-00-00.1clrl.mongodb.net:27017,cluster0-shard-00-01.1clrl.mongodb.net:27017,cluster0-shard-00-02.1clrl.mongodb.net:27017/Cluster0?ssl=true&replicaSet=atlas-etrhdk-shard-0&authSource=admin&retryWrites=true&w=majority", { useUnifiedTopology:true });

client.connect(function(err) {
  
    console.log('Connected successfully to server');
    const db = client.db(dbName);  
    fs.readFile('./fake.json', (err, data) => {
        if (err)
          console.log(err);
        else {
            const data = fs.readFileSync('fake.json');
            var mongojson = JSON.parse(data);
            var array = [];
            for (let i = 0; i < mongojson.package.length; i++) {
            array [i] = mongojson.package[i];
            }
            // const docs = JSON.parse();
           const docs = array;
           db.collection('packages')
            .insertMany(docs, function(err, result) {
                if (err) throw err;
                console.log('Inserted docs:', result.insertedCount);
                 client.close();
            
    });
}});
});
