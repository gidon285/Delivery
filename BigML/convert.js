const JSONtoCSV = require('json2csv');
const fs = require('fs');
const csvjson = require ('csvjson');




////// way 1 - print only the fields

// const fields =  ['package_id','departmen','name','product','color','product_price','taxes','shipment_cost','size','description','first_name','last_name','gender','email_adress','country','state/region','city','street_name','street_num','zipCode','phone','arrival_date','sent_date'];
// const opts =  {fields};     // create the object by fields
// const Jsonprase = new JSONtoCSV.Parser(opts);   // 
// const csvfile = Jsonprase.parse("./input.json")
// // const csvfile2 = JSON.parse (fs.readFileSync('input.json'))
// console.log(JSON.stringify(csvfile))    // print
// fs.writeFile("data2.csv", csvfile, function (err) {    // output
//     if (err) {
//         console.log("ERROR" + err);
//  }
// })




///////////
/// way 2 - in 1 field he is print all the data
////////////



// const converter = require('json-2-csv');
// const fs = require('fs');
// const todos = JSON.parse(fs.readFileSync('input.json'));    // read the JSON file
// // convert JSON array to CSV string
// converter.json2csv(todos, (err, csv) => {
//     if (err) {
//         throw err;
//     }

//     // print CSV string
//     console.log(csv);

//     // write CSV to a file
//     fs.writeFileSync('todos2.csv', csv);
    
// });





/////////////////
// way 3 
//////////////////


// for read and write files
const fs = require('fs');
const csvjson = require ('csvjson');
const readFile = fs.readFile;
const writeFile = fs.writeFile;
  
// Reading json file(filename -data.json)
readFile('./afterPrase.json', 'utf-8', (err, fileContent) => {
    if (err) {
        // Doing something to handle the error or just throw it
        console.log(err); 
        throw new Error(err);
    }
  
    // Convert json to csv function
    const csvData = csvjson.toCSV(fileContent, {
        headers: 'key'
    });
  
    // Write data into csv file named college_data.csv
    writeFile('./output_data2.csv', csvData, (err) => {
        if(err) {
            // Do something to handle the error or just throw it
            console.log(err); 
            throw new Error(err);
        }
        console.log('Data stored into csv file successfully');
    });
});


































































// (async () => {
//     try {
//         const csv = await converter.json2csvAsync(todos);

//         // print CSV string
//         console.log(csv);

//         // write CSV to a file
//         fs.writeFileSync('todos3.csv', csv);

//     } catch (err) {
//         console.log(err);
//     }
// })();



// // convert JSON array to CSV string
// converter.json2csvAsync(todos).then(csv => {

//     // print CSV string
//     console.log(csv);

//     // write CSV to a file
//     fs.writeFileSync('todos4.csv', csv);

// }).catch(err => console.log(err));