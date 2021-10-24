
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://user:admin@cluster0-shard-00-00.1clrl.mongodb.net:27017,cluster0-shard-00-01.1clrl.mongodb.net:27017,cluster0-shard-00-02.1clrl.mongodb.net:27017/Cluster0?ssl=true&replicaSet=atlas-etrhdk-shard-0&authSource=admin&retryWrites=true&w=majority";
MongoClient.connect(uri, function(err, client) {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
  });