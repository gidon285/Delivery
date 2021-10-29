
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const uri ="mongodb://user:admin@cluster0-shard-00-00.1clrl.mongodb.net:27017,cluster0-shard-00-01.1clrl.mongodb.net:27017,cluster0-shard-00-02.1clrl.mongodb.net:27017/Cluster0?ssl=true&replicaSet=atlas-etrhdk-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient( uri , {useNewUrlParser: true,useUnifiedTopology: true});
const path = require('path')
const dbName = 'ourProj';
const redis = require('redis');
const broker = redis.createClient(6379,'127.0.0.1');
const MongoSender = require('../Redis/redisSender');

broker.subscribe("toput")

broker.on("message",(channel, message)=>{
    store(message);
    upload();
});
let counter = 0;
let flag = true;
function store(message) {
    var _temp = JSON.parse(message);
    let buff_tempdata = fs.readFileSync(path.join(__dirname,'../data/data.json'));
    let _data = JSON.parse(buff_tempdata);
    _data.package.push(_temp.package[0]);
    fs.writeFileSync(path.join(__dirname,'../data/data.json'), JSON.stringify(_data));
    counter++;

}
async function update() {
    console.log("trying to pull from mongo")
    pullAllDataFromMongo();
    var generaicpack ={package:[]}
    fs.writeFileSync(path.join(__dirname,'../data/data.json'), JSON.stringify(generaicpack));
 
}
runupdate();
function runupdate() {
    setInterval(update, 30000);
}
async function upload() {
    if(counter > 3 ){
        if(!flag){
            update();
        }
        counter =0;
        falg = false;
        putDataOnMongo();
    }
}
async function putDataOnMongo() {
    client.connect(function(err) {
        console.log('Connected successfully to server');
        const db = client.db(dbName);  
        fs.readFile(path.join(__dirname,'../data/data.json'), (err, data) => {
            if (err)console.log(err);
            else {
                const data = fs.readFileSync(path.join(__dirname,'../data/data.json'));
                var mongojson = JSON.parse(data);
                if(mongojson.package.length < 1){
                    client.close;
                    return;
                }
                var array = [];
                for (let i = 0; i < mongojson.package.length; i++) {
                    array[i]= mongojson.package[i];
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
async function pullAllDataFromMongo(){
        client.connect(function(err) {
            console.log('Connected successfully to server22');
            const db = client.db(dbName);
            getDocuments(db, function(docs) {
                console.log('Closing connection.');
                client.close();
                // Write to file
                try {
                    fs.writeFileSync(path.join(__dirname,'../data/FromMongo.json'), JSON.stringify(docs));
                    console.log('Done writing to file.');
                }
                catch(err) {
                    console.log('Error writing to file', err)
                }
            });
        });
        
    }
function getDocuments(db, callback) {
    const query = {};
    db.collection('packages').find(query).toArray(function(err, result) { 
            if (err) throw err; 
            callback(result); 
    }); 
};