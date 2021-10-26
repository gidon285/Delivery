const redis = require('redis');
const redisComm = require('./redisCommunicate.js')
const reciver = redis.createClient(6379,'127.0.0.1');

reciver.subscribe("package");

reciver.on("message",(channel, message)=>{
    if(channel === "package"){
        console.log("asddsadasdsa")
        var befpackage = JSON.parse(message);
        var id = json.package[0].package_id;
        redisComm.setData(id,json);
        var aftpackge = redisComm.getData(id);
        redisComm.delData(id);
        /// to mongo 
    }   
  
})