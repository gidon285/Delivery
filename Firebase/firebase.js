/**
 * this file will represent the firebase server its uploads and downloads,
 * every file that need to be, will be connected to this and will interact with its function and funcinality.
 * 
*/
const {Storage} = require('@google-cloud/storage');
const fs = require('fs');
const QRCode= require('qrcode');
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
let ids = [];
const firestore=  admin.firestore();
broker.subscribe("id");
broker.subscribe("start");
broker.on("message",(channel, message)=>{
    if(channel === 'id'){
        ids.push(message);
    }
    if (channel === 'start'){
        run();
    }
})

function mainFunction() {
    let buff_tempdata = fs.readFileSync(path.join(__dirname,'../data/fire.json'));
    let _data = JSON.parse(buff_tempdata);
    uploadJSON();
    
};
function run() {
    setInterval(mainFunction, 20000);
    var generaicpack ={package:[]}
    fs.writeFileSync(path.join(__dirname,'../data/fire.json'), JSON.stringify(generaicpack));
};
async function uploadJSON(){
    let buff_tempdata = fs.readFileSync(path.join(__dirname,'../data/data.json'));
    let _data = JSON.parse(buff_tempdata);
    var packnum = _data.package.length;
    for(let i = 0; i< packnum; i++){
        console.log("a Package was Stored at Firebase!")
        var id =_data.package[0].package_id
        firestore.collection('packages').doc(id).set(_data.package[i]).then().catch((err)=>{console.log(err)});
        await uploadQR(id);
    }
    deleteCollection(firestore,'packages',packnum);
}
async function qr_to_image(id){
    QRCode.toFile(__dirname+`/public/packages/${id}.png`,id,
                {color: {dark: '#0000',light: '#ffff'}},
                function (err) {if (err) throw err})
    return 1;
}
async function uploadQR(id){
    console.log("a QRCode was Stored at Firebase!")
    let bucketName = 'gs://delivery-1437e.appspot.com'
    const destinationFilename = "QRCodes/"+id+".png";
    let filename = path.join(__dirname,'../public/packages/'+id+'.png');
    storage.bucket(bucketName).upload(filename,{ destination: destinationFilename });
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
async function deletefile(id) {
    var json = path.join(__dirname,'../public/packages/'+id+'.json')
    fs.unlink(json,(err)=>{if(err)console.log(err)})
    var qr =path.join(__dirname,'../public/packages/'+id+'.png')
    fs.unlink(qr,(err)=>{if(err)console.log(err)})
}
module.exports={getJson};















