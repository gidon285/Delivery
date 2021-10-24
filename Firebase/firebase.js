/**
 * this file will represent the firebase server its uploads and downloads,
 * every file that need to be, will be connected to this and will interact with its function and funcinality.
 * 
*/
const {Storage} = require('@google-cloud/storage');
const admin = require('firebase-admin');
const serviceac = require('../Firebase/delivery-1437e-firebase-adminsdk-zarhg-9bfe4f4c28.json');
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
   credential: admin.credential.cert(serviceac)
})
async function uploadToFire(package) {
    const db = admin.firestore();
    // db.collection('packages').add(JSON.parse(package));
    
}
broker.subscribe("pack");
broker.on("message",(channel, message)=>{
    var pack = JSON.parse(message);
    var id = json.package[0].package_id;
    upload(id, message);

})
async function upload(id,package){
    const storage = new Storage({keyFilename: firebaseConfig});
    const bucketName = `gs://delivery-1437e.appspot.com/QRCodes/${id}`
    const qr = `./public/packages/${id}.png`;
    const json = `./public/packages/${id}.json`;
    await storage.bucket(bucketName).upload(qr, {
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });
    await storage.bucket(bucketName).upload(json, {
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });
}

module.exports={uploadToFire}













// async function get(name){
//     var docRef = db.collection('packages').doc(name);
//     docRef.get().then((doc) => {
//         if (doc.exists) {
//             console.log("Document data:", doc.data());
//             return doc.data();
//         } else {
//             console.log("No such document!");
//         }
//     }).catch((error) => {
//         console.log("Error getting document:", error);
//     });
// }
// async function fads(){
//     var ans = await get('test');
//     console.log(ans);
// }

// fads();

// const storage = new Storage({keyFilename: firebaseConfig});

// const bucketName = 'gs://delivery-1437e.appspot.com/'

// let filename = './QRCode/qr1.png';

// const uploadFile = async() => {

//     await storage.bucket(bucketName).upload("", {

//         gzip: true,

//         metadata: {

//             cacheControl: 'public, max-age=31536000',

//         },

// });

// console.log(`${filename} uploaded to ${bucketName}.`);

// }

// uploadFile();
// module.exports = {upload};