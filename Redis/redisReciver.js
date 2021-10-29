const redis = require('redis');
const redisComm = require('./redisCommunicate.js')
const fs = require('fs');
const path = require('path');
const reciver = redis.createClient(6379,'127.0.0.1');
const reSender = require('./redisSender');

reciver.subscribe("package");
reciver.on("message",(channel, message)=>{
    prossecPack(message);
})
let counter =0;
async function prossecPack(message) {
    counter++;
    var befpackage = JSON.parse(message);
    var id = befpackage.package[0].package_id;
    redisComm.setData(id,befpackage);
    reSender.passPack("toput",message);
    redisComm.delData(id);
    if( counter >6){
        var _temp = JSON.parse(message);
        let buff_tempdata = fs.readFileSync(path.join(__dirname,'../data/fire.json'));
        let _data = JSON.parse(buff_tempdata);
        _data.package.push(_temp.package[0]);
        fs.writeFileSync(path.join(__dirname,'../data/fire.json'), JSON.stringify(_data));
        counter =0;
    }
}