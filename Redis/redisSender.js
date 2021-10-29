const redis = require('redis');
const publisher = redis.createClient(6379,'127.0.0.1');

function passPack(channel,pack){
    publisher.publish(channel,pack,(err)=>{
        if(err)console.log(err);
        
    })
}
publisher.on('connect', function () {
    console.log('Redis broker-Sender is now initialized');
});
module.exports ={passPack};