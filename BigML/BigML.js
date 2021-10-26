// requires
var bigml = require('bigml');
var connection = new bigml.BigML('ELADVAK8','8870296ed4ff2a7d9c648238167d20dc88a98f41') 
var source = new bigml.Source(connection);    // create connection
const fs = require('fs');
const csvjson = require ('csvjson');
const app = require('csvjson');
const readFile = fs.readFile;
const writeFile = fs.writeFile;
const mongo = require('./mongoToBigml.js')
const jsonPrase = require ("./praseJsonToMongo")
const MongoClient = require('mongodb').MongoClient;
const dbName = 'ourProj';
const client = new MongoClient( "mongodb://user:admin@cluster0-shard-00-00.1clrl.mongodb.net:27017,cluster0-shard-00-01.1clrl.mongodb.net:27017,cluster0-shard-00-02.1clrl.mongodb.net:27017/Cluster0?ssl=true&replicaSet=atlas-etrhdk-shard-0&authSource=admin&retryWrites=true&w=majority", { useUnifiedTopology:true });

// connect to mondodb and export the data
//mongo.getDatafromMongo();
function getDatafromMongo(){
  client.connect(function(err) {
      console.log('Connected successfully to server');
      const db = client.db(dbName);
      getDocuments(db, function(docs) {
          console.log('Closing connection.');
          client.close();
          // Write to file
          try {
              fs.writeFileSync('out_file.json', JSON.stringify(docs));
              console.log('Done writing to file.');
          }
          catch(err) {
              console.log('Error writing to file', err)
          }
      });
  });
}
function getDocuments(db, callback) {
 // const query = {db.packages.find ({ $and:"package_id":" " },{"products":" "}) };  // this is my query criteria
  const query = {};
  db.collection('packages').find(query).toArray(function(err, result) { 
        if (err) throw err; 
        callback(result); 
  }); 
};


// parse the json data that come from the mongo and find the id and products
//jsonPrase.praseJsonToMongo();
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

  
const BigMLfunction = ((req,res)=>{

const source = new bigml.Source(connection);
  source.create('./CSVafterPrase.csv', { name: 'My data source' }, true,function (error, sourceInfo) {
    if (!error && sourceInfo) {
      const dataset = new bigml.Dataset(connection);
      dataset.create(sourceInfo, null, true, function (error, datasetInfo) {
      if (!error && datasetInfo) {
        if (!error && datasetInfo) {
        const association = new bigml.Association(connection);
        association.create(datasetInfo, { name: 'pencil' }, true, function (error, associationInfo) {
         if (!error && associationInfo) {
           const model = new bigml.Model(connection);
           const results = {};        // save the result to export to json file
           results.data = [];
           model.get(associationInfo.resource, true, 'only_model=true;limit=-1', function (error, modelInfo) {
          if (!error && modelInfo) {
            console.log(modelInfo.object.associations)
            for (let i = 0; i < modelInfo.object.associations.rules.length; i++) {
              var src = modelInfo.object.associations.rules[i].lhs_cover[1]
              var dest = modelInfo.object.associations.rules[i].rhs_cover[1]
              var antecedent = modelInfo.object.associations.items.find((item) => item.count === src).name
              var consequent = modelInfo.object.associations.items.find((item) => item.count === dest).name
              var coverage = (modelInfo.object.associations.rules[i].lhs_cover[0] * 100) + '%'
              var support = (modelInfo.object.associations.rules[i].support[0] * 100) + '%'
                results.data.push({
                  product: antecedent,
                  items: consequent,
                  support: support,
                  coverage: coverage
                });
              //  console.log(antecedent);
              //  console.log(consequent);
              //  console.log(support);
              //  console.log(coverage);
              //  console.log("----------------------------------");
            }
                   // res.json(results);
                  //  var json = JSON.parse(results);
                   console.log(results)
                }
 });
  }
   });
     }
      }
       })
          }
            });

})
// run the function
getDatafromMongo();
praseJsonToMongo ();
BigMLfunction ();








/// require = bigml , json2csv , json-2-csv --save , csvjson





// BigML API and association Model 
// source.create('./output_data.csv', { name: 'My data source' }, true,function (error, sourceInfo) {
//                   if (!error && sourceInfo) {
//                       const dataset = new bigml.Dataset(connection);
//                       dataset.create(sourceInfo, null, true, function (error, datasetInfo) {
//                           if (!error && datasetInfo) {
//                               if (!error && datasetInfo) {
//                                   const association = new bigml.Association(connection);
//                                   association.create(datasetInfo, { name: 'pencil' }, true, function (error, associationInfo) {
//                                       if (!error && associationInfo) {
          
//                                           const model = new bigml.Model(connection);
//                                           model.get(associationInfo.resource, true, 'only_model=true;limit=-1', function (error, modelInfo) {
//                                               if (!error && modelInfo) {
          
//                                                   console.log(modelInfo.object.associations)
          
          
          
//                                               }
//                                           });
          
                      
//                                       }
//                                   });
//                               }
//                           }
//                       })
//                   }
//               });

  




// convert fron json to csv
// Reading json file(filename -data.json)
// readFile('./afterPrase.json', 'utf-8', (err, fileContent) => {
//   if (err) {
//       // Doing something to handle the error or just throw it
//       console.log(err); 
//       throw new Error(err);
//   }

//   // Convert json to csv function
//   const csvData = csvjson.toCSV(fileContent, {
//       headers: 'key'
//   });

//   // Write data into csv file named college_data.csv
//   writeFile('./output_data4.csv', csvData, (err) => {
//       if(err) {
//           // Do something to handle the error or just throw it
//           console.log(err); 
//           throw new Error(err);
//       }
//       console.log('The convert successfully');
//   });
// });

// after model and export to json

// app.get('/predictBIGML', (req, res) => {