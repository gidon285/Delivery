const redis = require('redis');
const redisComm = require('./redisCommunicate.js')
const reciver = redis.createClient(6379,'127.0.0.1');
const reSender = require('./redisSender');

reciver.subscribe("package");
let counter = 0;
reciver.on("message",(channel, message)=>{
    if(channel === "package"){
        var befpackage = JSON.parse(message);
        var id = json.package[0].package_id;
        redisComm.setData(id,json);
        var aftpackge = redisComm.getData(id);
        reSender.passPack("toputone",json);
        counter++;
        redisComm.delData(id);
        if( counter === 15){
            counter = 0;
            reSender.passPack('updateMongo',"");
            reSender.passPack('toextract',"");
            reSender.passPack('toannal',"");
        }
    }   
})