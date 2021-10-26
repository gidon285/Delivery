
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient( "mongodb://user:admin@cluster0-shard-00-00.1clrl.mongodb.net:27017,cluster0-shard-00-01.1clrl.mongodb.net:27017,cluster0-shard-00-02.1clrl.mongodb.net:27017/Cluster0?ssl=true&replicaSet=atlas-etrhdk-shard-0&authSource=admin&retryWrites=true&w=majority", { useUnifiedTopology:true });
const path = require('path')
const dbName = 'ourProj';
const redis = require('redis');
const broker = redis.createClient(6379,'127.0.0.1');
const MongoSender = require('../Redis/redisSender');

broker.subscribe("toput")
broker.subscribe("topull")
broker.subscribe("toputone")
broker.subscribe("updateMongo")

broker.on("message",(channel, message)=>{
    if(channel === "topull"){
        pullAllDataFromMongo();
    }
    if( channel === 'toput'){
        putDataOnMongo();
    }
    if( channel === 'toputone'){
        Minsert(message);
    }
    if( channel === 'updateMongo'){
        putDataOnMongo();
    }
});

async function Minsert(filename){
    client.connect(function(err) {
        const db = client.db(dbName);  
        var mongojson = JSON.parse(filename);
            var array = [];
            for (let i = 0; i < mongojson.package.length; i++) {
                array [i] = mongojson.package[i];
            }
        const docs = array;
        db.collection('packages').insertMany(docs, function(err, result) {
                if (err) throw err;
                console.log('Inserted docs:', result.insertedCount);
            
        });
    });
    client.close;

}
async function putDataOnMongo() {
    client.connect(function(err) {
        console.log('Connected successfully to server');
        const db = client.db(dbName);  
        fs.readFile(path.join(__dirname,'../public/packge/data.json'), (err, data) => {
            if (err)console.log(err);
            else {
                const data = fs.readFileSync(path.join(__dirname,'../public/packge/data.json'));
                var mongojson = JSON.parse(data);
                var array = [];
                for (let i = 0; i < mongojson.package.length; i++) {
                    array [i] = mongojson.package[i];
                }
            const docs = array;
            db.collection('packages').insertMany(docs, function(err, result) {
                    if (err) throw err;
                    console.log('Inserted docs:', result.insertedCount);
                
            });
        }});
    });
    client.close;
}
function pullAllDataFromMongo(){
    client.connect(function(err) {
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        getDocuments(db, function(docs) {
            console.log('Closing connection.');
            client.close();
            // Write to file
            try {
                fs.writeFileSync('../public/packge/out_file.json', JSON.stringify(docs));
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