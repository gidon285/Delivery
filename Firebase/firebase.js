/**
 * this file will represent the firebase server its uploads and downloads,
 * every file that need to be, will be connected to this and will interact with its function and funcinality.
 * 
*/
const {Storage} = require('@google-cloud/storage');
const path = require('path');
const fireSender = require('../Redis/redisSender');
const admin = require('firebase-admin');
const serviceac = require('../Firebase/delivery-1437e-firebase-adminsdk-zarhg-9bfe4f4c28.json');
const storage = new Storage({
    keyFilename: "./firebase/delivery-1437e-firebase-adminsdk-zarhg-9bfe4f4c28.json"
 });
const redis = require('redis');
const broker = redis.createClient(6379,'127.0.0.1');
const firebaseConfig = {
    apiKey: "AIzaSyBCf2bjJTh11j7wYDC99aZKBXH7lCTj5Z4",
    authDomain: "delivery-93cf0.firebaseapp.com",
    projectId: "delivery-93cf0",
    storageBucket: "delivery-93cf0.appspot.com",
    messagingSenderId: "998520789941",
    appId: "1:998520789941:web:eea9c4eda06e6a25a357fc",
    measurementId: "G-SPSMFFM1Z1"
};
admin.initializeApp({
   credential: admin.credential.cert(serviceac),
   databaseURL:"delivery-93cf0.firebaseapp.com"
})

const firestore=  admin.firestore();
let packnum = 0;
broker.subscribe("pack");
broker.subscribe("packnumber");
broker.subscribe("qr");

// run();
function mainFunction() {
    broker.on("message",(channel, message)=>{
        if(channel ==="qr"){
            uploadQR(message).catch((err)=>{if(err)console.log(err);});
        }
        else if (channel === "packnumber"){
            packnum = parseInt(message);
        }else if (channel === "pack"){
            uploadJSON(message).catch((err)=>{if(err)console.log(err);});
        }
    })
    
};
function run() {
    setInterval(mainFunction, 30000);
};
async function uploadJSON(message){
    for(let i = 0; i< packnum; i++){
        let packson = JSON.parse(message);
        var id = packson.package[i].package_id;
        await firestore.collection('packages').doc(id).set(packson).then().catch((err)=>{console.log(err)});
        var pack = await getJson(id);
        fireSender.passPack('package',JSON.stringify(pack));
    }
    deleteCollection(firestore,'packages',packnum);
}
async function uploadQR(id){
    for(let i = 0; i< packnum; i++){
        let bucketName = 'gs://delivery-1437e.appspot.com'
        const destinationFilename = "QRCodes/"+id+".png";
        let filename = './public/packages/'+id+'.png';
        await storage.bucket(bucketName).upload(filename,{ destination: destinationFilename });
    }
}
async function getJson(id) {
    const packRef = firestore.collection('packages').doc(id);
    const doc = await packRef.get();    
    return doc.data();
}
async function deleteCollection(db, collectionPath, batchSize) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);
    return new Promise((resolve, reject) => {
      deleteQueryBatch(db, query, resolve).catch(reject);
    });
}
  
async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();
    const batchSize = snapshot.size;
    if (batchSize === 0) {
      resolve();
      return;
    }
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    process.nextTick(() => {
      deleteQueryBatch(db, query, resolve);
    });
  }

module.exports={getJson};















