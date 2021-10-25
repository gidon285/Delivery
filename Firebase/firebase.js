/**
 * this file will represent the firebase server its uploads and downloads,
 * every file that need to be, will be connected to this and will interact with its function and funcinality.
 * 
*/
// const {Storage} = require('@google-cloud/storage');
// const path = require('path');
// const admin = require('firebase-admin');
// const serviceac = require('../Firebase/delivery-1437e-firebase-adminsdk-zarhg-9bfe4f4c28.json');
const redis = require('redis');
const broker = redis.createClient(6379,'127.0.0.1');
// const firebaseConfig = {
//     apiKey: "AIzaSyBCf2bjJTh11j7wYDC99aZKBXH7lCTj5Z4",
//     authDomain: "delivery-93cf0.firebaseapp.com",
//     projectId: "delivery-93cf0",
//     storageBucket: "delivery-93cf0.appspot.com",
//     messagingSenderId: "998520789941",
//     appId: "1:998520789941:web:eea9c4eda06e6a25a357fc",
//     measurementId: "G-SPSMFFM1Z1"
// };
// admin.initializeApp({
//    credential: admin.credential.cert(serviceac),
//    databaseURL:"delivery-93cf0.firebaseapp.com"
// })
// const firestore=  admin.firestore();

broker.subscribe("pack");
broker.subscribe("qr");
broker.on("message",(channel, message)=>{
    if(channel ==="qr"){
        uploadQR(message).catch((err)=>{if(err)console.log(err);});
    }
    else{
        // uploadJSON(message).catch((err)=>{if(err)console.log(err);});
    }
})


// async function uploadQR(id){
//     const storage = new Storage({keyFilename: firebaseConfig});
//     let bucketName = 'gs://delivery-1437e.appspot.com';
//     let qr = await path.join(__dirname,'../public/packages/',id+'.png')
//     let filename = './QRCode/2224230d91b00661.png';
//     await storage.bucket(bucketName).upload(filename, {
//         gzip: true,
//         metadata: {
//             cacheControl: 'public, max-age=31536000',
//         },
//     });

// }


// async function uploadJSON(message){
//     // let packson = JSON.parse(message);
//     // var id = packson.package[0].package_id;
//     // firestore.collection('packages').doc(id).set(packson).then().catch((err)=>{console.log(err)});

// }


// const serviceac = require('./delivery-1437e-firebase-adminsdk-zarhg-9bfe4f4c28.json');
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: "./firebase/delivery-1437e-firebase-adminsdk-zarhg-9bfe4f4c28.json"
 });

 
async function uploadQR(id){
    let bucketName = 'gs://delivery-1437e.appspot.com/QRCodes/'
    let filename = './public/packages/'+id+'.png';
    await storage.bucket(bucketName).upload(filename, {
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
});

console.log(`${filename} uploaded to ${bucketName}.`);
}

module.exports={uploadQR};
















