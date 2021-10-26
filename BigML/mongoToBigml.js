const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const dbName = 'ourProj';
const client = new MongoClient( "mongodb://user:admin@cluster0-shard-00-00.1clrl.mongodb.net:27017,cluster0-shard-00-01.1clrl.mongodb.net:27017,cluster0-shard-00-02.1clrl.mongodb.net:27017/Cluster0?ssl=true&replicaSet=atlas-etrhdk-shard-0&authSource=admin&retryWrites=true&w=majority", { useUnifiedTopology:true });

function getDatafromMongo(){
    client.connect(function(err) {
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        getDocuments(db, function(docs) {
            console.log('Closing connection.');
            client.close();
            // Write to file
            try {
                fs.writeFileSync('out_file.json', JSON.stringify(docs));
                console.log('Done writing to file.');
            }
            catch(err) {
                console.log('Error writing to file', err)
            }
        });
    });
}
function getDocuments(db, callback) {
   // const query = {db.packages.find ({ $and:"package_id":" " },{"products":" "}) };  // this is my query criteria
    const query = {};
    db.collection('packages').find(query).toArray(function(err, result) { 
          if (err) throw err; 
          callback(result); 
    }); 
};
getDatafromMongo ();
module.exports={getDatafromMongo}
