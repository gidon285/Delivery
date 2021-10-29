const fs = require('fs');
var bigml = require('bigml');
var connection = new bigml.BigML('ELADVAK8','8870296ed4ff2a7d9c648238167d20dc88a98f41') 
const csvjson = require ('csvjson');
const redis = require('redis');
const BigSender = require('../Redis/redisSender');
const path = require('path');
const broker = redis.createClient(6379,'127.0.0.1');

broker.subscribe("toextract")
broker.subscribe("toanal")


broker.on("message",(channel, message)=>{
    if(channel === "toextract"){
      ConvertDataToCSV();
    }
    if( channel === 'toannal'){
        BigMLfunction();
    }
});
function ConvertDataToCSV (){
    var place = __dirname+"\\out_file.json";
    fs.readFile(place, (err, data) => {
    if (err)
        console.log(err);
    else {
        var fakejson = JSON.parse(data);
        var data = "";
        var data2 = "";
        for (let i = 0; i < fakejson.length; i++) {
        for (let j = 0; j < fakejson[i].products.length; j++) {
            data2 +=  fakejson[i].products[j]+",";
        }
        data2 += "\n"
        }
        var toMongoString = data + data2

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
            association.create(datasetInfo, { name: 'elad' }, true, function (error, associationInfo) {
             if (!error && associationInfo) {
               const model = new bigml.Model(connection);
               const results = {};        // save the result to export to json file
               results.data = [];
               model.get(associationInfo.resource, true, 'only_model=true;limit=-1', function (error, modelInfo) {
              if (!error && modelInfo) {
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
                }
                      res(JSON.stringify(results));
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