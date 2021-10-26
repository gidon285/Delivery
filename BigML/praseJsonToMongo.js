const { json } = require("body-parser");
const { compile } = require("ejs");
const fs = require('fs');
const { fabricate_Multipackages } = require("../generator");

// prase the json and got the id and prod
  function praseJsonToMongo (){
fs.readFile('./out_file.json', (err, data) => {
  if (err)
    console.log(err);
  else {
    //console.log(data)
    //console.log(JSON.parse(data))
      var fakejson = JSON.parse(data);
      var data = "";
      var data2 = "";
      // var JsonOup = {};
      for (let i = 0; i < fakejson.length; i++) {
        // data = fakejson[i].package_id + "," ;
        // JsonOup += data ;
       // data += "\n"
      for (let j = 0; j < fakejson[i].products.length; j++) {
        data2 +=  fakejson[i].products[j]+",";
        //JsonOup.item.push(data2)
       // JsonOup += data2 
      }
      data2 += "\n"
      }
    var toMongoString = data + data2

   // console.log (toMongoString)
    fs.writeFile('CSVafterPrase.csv',toMongoString, function (err) {
      if (err) return console.log(err);
    });
  }
})
  }
module.exports = {praseJsonToMongo}
praseJsonToMongo ();


  
  













// function praseJsonToMongo (){
// fs.readFile('./fake.json', (err, data) => {
//   if (err)
//     console.log(err);
//   else {
//     var fakejson = JSON.parse(data);
//     var data = "";
//     var data2 = "";
//       for (let i = 0; i < fakejson.package.length; i++) {
//       data = data + "," + fakejson.package[i].package_id;
//       data += "\n"
//       for (let j = 0; j < fakejson.package[i].products.length; j++) {
//         data2 = data2 +"," + fakejson.package[i].products[j];
//       }
//       data2 += "\n"
//       }
//       var toMongoString = data + data2
//     console.log (toMongoString)
//   }
// })
// }