const faker = require('faker');
const QRCode = require('qrcode');
const path = require('path')
const genSender = require('./Redis/redisSender');
const mongo = require('./Mongo/M.js');
const fs = require('fs');
// lists
const _pgender_type = ["Male","Female"];
const _edomain = ["@gmail.com", "@yahoo.com","@outlook.com"
        ,"@zahav.co.il","@msmail.com","@nana10.co.il", "@apple.com"
        , "@mailout.com","@ebay.com","@spotify.com","@asus.com"];
/**
 *  The object that contains countries and states for fabricating sender/reciver information.
*/
const _address= { 
    country:["US","New Zealand", "Germany","Austria","Belgium", "Irland", "Luxembourg", "Norway","Iceland","Poland","Sweeden","Israel"],
    US:{
        state_Name:["Illinois", "Missouri", "Pennsylvania", "Oregon", "Maryland", "Texas"],
        state:{
            Illinois:["Chicago", "Elk Grove Village", "Patterson"],
            Missouri:["Manchester", "Kansas City", "Columbia"],
            Pennsylvania :["Newark", "Chambersburg", "Philadelphia"],
            Oregon :["Klamath Falls", "Portsland", "Tigard"],
            Maryland :["Lanham", "Baltimore", "Clarksville"],
            Texas :["Dallas", "Houston", "Austin"],
        }
    },
    New_Zealand:{
        state_Name:["Hamilton", "Whangarei", "Waitaki", "Kaiapoi", "Christchurch", "Nelson"],
        state:{
            Hamilton:["Fitzroy", "Glenview", "Beerescourt"],
            Whangarei:["Glenbervie", "Parahaki", "Bucklands Beach"],
            Waitaki: ["Omarama", "Ardgowan", "Quailburn"],
            Kaiapoi: ["Pines Beach", "Camside", "Kairaki Beach"],
            Christchurch: ["Opawa", "Ardgowan", "Governors Bay"],
            Nelson: ["Bishopdale", "Britannia Heights", "Wakapuaka"],
        }
    },
    Germany:{
        state_Name:["Rheinland Pfalz", "Freistaat Bayern", "Schleswig Holstein", "Berlin", "Freistaat Sachsen", "Nordrhein Westfalen"],
        state:{
            Rheinland_Pfalz: ["Bosenbach", "Merzweiler", "Klausen"],
            Freistaat_Bayern: ["Ingolstadt", "Karlstadt", "München"],
            Schleswig_Holstein:["Bebensee", "Kropp", "Holm"],
            Berlin:["Barrit", "Heinersdorf", "Tempelhof"],
            Freistaat_Sachsen: ["Delitzsch", "Eibenstock", "Zwickau"],
            Nordrhein_Westfalen: ["Bonn", "Krefeld", "Essen"],
        }
    }, 
    Austria:{
        state_Name:["Styria", "Burgenland", "Carinthia", "Upper Austria", "Lower Austria", "Tyrol"],
        state:{
            Styria: ["Winkl-Boden", "Naintsch", "Stojen"],
            Burgenland: ["Markt allhau", "Wallern Im Burgenland", "Deutsch Tschantschendorf"],
            Carinthia:["Unterbergen", "Epritz", "Tigring"],
            Upper_Austria:["Feyregg", "Taigen", "Thal"],
            Lower_Austria: ["Pottenhofen", "Zeil", "Rindlberd"],
            Tyrol: ["Kapfing", "Kaisertal", "Hygna"],
        }
    },  
    Belgium:{
        state_Name:["Liège", "Walloon Brabant", "Hainaut", "Antwerp", "Namur", "East Flanders"],
        state:{
            Liège: ["Voroux-Goreux", "Fosse", "Beyne-Heusay"],
            Walloon_Brabant: ["Noduwez", "Bonlez", "Terwagne"],
            Hainaut:["Resteigne", "Halma", "Hellebecq"],
            Antwerp:["Gravenwezel", "Aartselaar", "Breendonk"],
            Namur: ["Feschaux", "Heure", "Beez"],
            East_Flanders: ["Evergem", "St-Maria-Oudenhove", "Mendonk"],
        }
    }, 
    Irland:{
        state_Name:"n/a",
        Region:"n/a",
        city_name :["Dublin", "Cork", "Castlebar", "Sligo", "New Ross", "Ennis"],
    },
    Luxembourg:{
        state_Name:"n/a",
        Region:"n/a",
        city_name :["Strassen", "Belgique", "Esch sur Alzette", "Differdange", "New Mersch", "Mondorf Les Bains"],
    },
    Norway:{
        state_Name:"n/a",
        Region:"n/a",
        city_name :["Notodden", "Harstad", "Jessheim", "Drammen", "Arnatveit", "Sandefjord"],
    },
    Iceland:{
        state_Name:"n/a",
        Region:"n/a",
        city_name :["Selfoss", "Grindavík", "Reykjavík", "Hvammstangi", "Keflavík", "Bru"],
    },
    Poland:{
        state_Name:"n/a",
        Region:"n/a",
        city_name :["Gdansk", "Chorzow", "Olsztyn", "Kalisz", "Opole", "Krakow"],
    },
    Sweeden:{
        state_Name:"n/a",
        Region:"n/a",
        city_name :["Kode", "Vartofta", "Sjomarken", "Arbra", "Kallo-knippla", "Alnarp"],
    },
    Israel:{
        state_Name:["Negev","Galil","Golan","Arava","Merkaz","Shomron"],
        state:{
            Negev: ["Beer-Sheva", "Mizpe-Ramon", "Aarad","Dimona"],
            Galil: ["Tveria", "Bet-Rimon", "Hoshaya","Yokneam"],
            Golan:["Katzerin", "Yonatan", "Nov","Ramat-Magshimim"],
            Arava:["Yotvata", "Hatzeva", "Eilat","Timnaa"],
            Merkaz: ["Hod Hasharon", "Petah Tikva", "Tel aviv","Holon"],
            Shomron: ["Elkana", "Ariel", "Itamar","Eli"],
        },
        street:["Waizeman", "Hertzel", "Ha-Rishonim", "Ben-Gorion", "Narkisim"
        , "Hardoff", "HaShita"," Ha-Taasim", "Hayarkon", "Hattas", "Frishman"
        , "Megido", "Bar-Kochva", "Tel-Hai", "Hameyasdim", "Shahar", "Gefen"
        , "Kibuts Galuyot", "Hasharon", "Egoz", "Oren", "Almog", "Shikma"]
    }
};
/**
 *  The object that contains department and items for fabricating each item shipped.
*/
const _package= { 
    department_name : ["Grocery","Home","Tools","Beauty","Clothing","Electronics","Sports","Jewelery","Computers"],
    product: {
        Grocery:["Cheese","Salad","Fish","Sausages","Chicken"],
        Home:["Chair","Table","Soap","Towels"],
        Tools:["Hammer","Screw-driver","Electric-screw-driver","Drill","Ladder",],
        Beauty:["Makeup","Skin Care","Cream","Shampo","Lipstick",],
        Clothing:["Shirt","Pants","Shoes","Gloves","Hat"],
        Electronics:["Camera","Cell Phone","Headphones","Gps","Television",],
        Jewelery:["Neckless","Ring","Bracelet","Glasses","Earrings"],
        Sports:["Ball","Bike","Running shose","Dryfit-shirt","Soccer shose"],
        Computers: ["Mouse","Keyboard","Printer","Scanner","laptop",]
    },
    color: ["orange","orchid","silver","plum","purple",
            "sky blue","purple","pink","magenta","lime","violet",
            "plum","azure","salmon","maroon","ivory"
    ],
    description:["Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals"
    ,"The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J"
    ,"Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles"
    ,"The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive"
    ,"The Football Is Good For Training And Recreational Purposes"
    ,"Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support"
    ,"The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design"
    ,"The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients"
    ,"New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart"
    ,"Carbonite web goalkeeper gloves are ergonomically designed to give easy fit"
    ,"The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality"
    ,"New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016"]
};
/**
 *  This fuction will generate the information part of the packgae including:
 *  department, item itself, price etc.
 * 
 * @return  A string representing the whole information of the package.
*/
function gen_Packageinfo(){
    var _dnumber = gen_IntRange(0,8);
    var num =gen_IntRange(1,7)-1;  
    if(0<=_dnumber && _dnumber<=2){
        var _price = (gen_IntRange(1,75)*num).toFixed(0);
        var _taxes = 0;
        var _shipment_cost = (gen_IntRange(10,25)*num).toFixed(0);
        var _size = "small";
    }
    else if(3<=_dnumber && _dnumber<=4){
        var _price = (gen_IntRange(75,500)*num).toFixed(0);
        var _taxes = ((0.17*_price)*num).toFixed(0);
        var _shipment_cost = (gen_IntRange(25,50)*num).toFixed(0);
        var _size = "medium";
    }
    else{
        var _price = (gen_IntRange(500,2500)*num).toFixed(0);
        var _taxes = (50*num).toFixed(0);
        var _shipment_cost = (gen_IntRange(50,150)*num).toFixed(0);
        var _size = "large";
    }
    var _department_name = _package.department_name[_dnumber];
    var _departments ="[\""+_department_name+"\","; 
    var _items="[\""+_package.product[_department_name][gen_IntRange(0,6)-1]+"\",";
    var colors ="[\""+ _package.color[gen_IntRange(0,15)]+"\",";
    var plant = gen_IntRange(0,200)-1
    for(let i = 0; i <num; i++){
        if( i == num-1){
            _dnumber = gen_IntRange(0,8);
            _department_name = _package.department_name[_dnumber];
            _departments += "\""+_department_name +"\"]";
            _items += "\""+_package.product[_department_name][gen_IntRange(0,5)-1]+"\"]";
            colors += "\""+_package.color[gen_IntRange(0,15)]+"\"]";
            break;
        }
        if(plant%3 !== 0){
            _dnumber = gen_IntRange(0,8);
            _department_name = _package.department_name[_dnumber];
            _departments += "\""+_department_name +"\",";
            _items += "\""+_package.product[_department_name][gen_IntRange(0,5)-1]+"\",";
            colors += "\""+_package.color[gen_IntRange(0,15)]+"\",";
        }else{
            _department_name = _package.department_name[_dnumber];
            _departments += "\""+_department_name+"\",";
            _items += "\""+_package.product[_department_name][gen_IntRange(0,5)-1]+"\",";
            colors += "\""+_package.color[gen_IntRange(0,15)]+"\",";
        }
    }
    return ("\"department_names\":"+_departments+","
            +"\"products\": "+_items+","
            +"\"colors\": "+ colors+","
            +"\"product_price\": \"" +_price+"$\","
            +"\"taxes\": \"" +_taxes+"$\","
            +"\"shipment_cost\": \"" +_shipment_cost+"$\","
            +"\"size\": \""+_size+"\","
            +"\"description\": \""+_package.description[gen_IntRange(0,11)]                                      
    );
}  
/**
 *  A simple Integer generator ranged based.
 * @param  min  minimun value for output Integer.
 * @param  max  maximun value for output Integer.
 * @return Integer.
*/ 
function gen_IntRange(min, max) {
    min++;
    return Math.floor(Math.random() * (max - min) + min);
}
/**
 *  A simple Integer generator for a given sized length.
 * @param  length  the approximate lenth of the outoput.
 * @return Integer.
*/ 
function gen_Num_size(length) {
    return Math.floor(Math.random() * length);
}
/**
 *  This function will generate the sender address information,the task requirements states that the packages will be sent to Israel
 *  exclusively there for the origin is not including Israel.
 * @return A string representation of the sender address, including country and street, phone etc'.
*/
function gen_Sender_Address() {
    var _connum = gen_IntRange(0,11);;
    var _con; var _state_name; var _city;
    if( _connum <= 4 ){
        _con = _address.country[_connum]
        _con = _con.includes(' ') ? _con.replace(' ', '_') : _con;
        _state_name = _address[_con].state_Name[gen_IntRange(0,5)];
        _state_name=_state_name.includes(' ') ? _state_name.replace(' ', '_') : _state_name;
        _city = _address[_con].state[_state_name][gen_IntRange(0,3)];

        _con = _con.includes('_') ? _con.replace('_', ' ') : _con;
        _state_name = _state_name.includes('_') ? _state_name.replace('_', ' ') : _state_name;
        return ("\"sender country\": \""+_con+"\",\"sender state/region\": \"" + _state_name 
                +"\",\"sender_city\": \""+_city +"\",\"sender street_name\": \""+ faker.address.streetName() 
                +"\",\"sender_street_num\": \""+ gen_Num_size(10000).toString() 
                +"\",\"sender_zipCode\": \""+faker.address.zipCode()
                +"\",\"sender_phone\": \""+faker.phone.phoneNumberFormat(1));                                      
    }
    _con = _address.country[_connum];
    _city = _address[_con].city_name[gen_IntRange(0,5)];
    return ("\"sender_country\": \""+_con+"\",\"sender_state/region\": \"n/a\""+",\"sender_city\": \""
            +_city+"\",\"sender_street_name\": \""+ faker.address.streetName()+"\",\"sender_street_num\": \""
            +gen_Num_size(10000).toString() +"\",\n\t\"sender_zipCode\": \""+faker.address.zipCode()+"\","+"\"sender_phone\": \""
            +faker.phone.phoneNumberFormat(1)                                         
            );
}
/**
 *  This function will generate the reciver address information,the task requirements states that the packages will be sent to Israel
 *  exclusively there for the destination is only Israel.
 * @return A string representation of the reciver address, including country and street, phone etc'.
*/
function gen_Reciver_Address() {
    _state = _address[_address.country[11]].state_Name[gen_IntRange(0,5)];
    _city = _address[_address.country[11]].state[_state][gen_IntRange(0,3)];
    _phone ="05"+gen_IntRange(0,8).toString()+'-'+lfsr(gen_IntRange(11111,99999), 7, 10).slice(0,7)                                         
    return ("\"reciver_country\": \""+_address.country[11]+"\",\"reciver_state/region\":\""+_state+"\",\"reciver_city\": \""
            +_city+"\",\"reciver_street_name\": \""+ _address[_address.country[11]].street[gen_IntRange(0,22)]+"\",\"reciver_street_num\": \""
            +gen_Num_size(100).toString() +"\",\"reciver_zipCode\": \""+faker.address.zipCode()+"\","+"\"reciver_phone\": \""
            +_phone                                       
            );
}
/**
 *  This function will fabricate a random person, not given his place of birth, meaning not authentic.
 * @return A string representation of a person 
*/
function gen_Reciver(){
    var _gender = gen_IntRange(0,1);
    var _pname = faker.name.firstName(_gender); 
    var _plast = faker.name.lastName();
    var _pemail = _pname+_plast+gen_Num_size(100).toString()+_edomain[gen_IntRange(0,10)];
    return ("\"reciver_first_name\": \""+_pname+"\",\"reciver_last_name\":\""+_plast
            +"\",\"reciver_gender\": \""+_pgender_type[_gender]+"\",\"reciver_email_adress\": \""
            +_pemail.toLocaleLowerCase()                                          
            );
}
/**
 *  This function will fabricate a random person, not given his place of birth, meaning not authentic.
 * @return A string representation of a person 
*/
function gen_Sender(){
    var _gender = gen_IntRange(0,1);
    var _pname = faker.name.firstName(_gender); 
    var _plast = faker.name.lastName();
    var _pemail = _pname+_plast+gen_Num_size(100).toString()+_edomain[gen_IntRange(0,10)];
    return ("\"sender_first_name\": \""+_pname+"\",\"sender_last_name\":\""+_plast
            +"\",\"sender_gender\": \""+_pgender_type[_gender]+"\",\"sender_email_adress\": \""
            +_pemail.toLocaleLowerCase()                                          
            );
}
/**
 * Linear-feedback shift register - This function will fabricate the ID for the package, wich will be uniqe.
 * @param  seed The seed from wich the number will be calculated.
 * @param  length  The number of iterations the loop will go to generate the number.
 * @param  base  The numerical base for the radom ID- hex, binary, octal etc.
 * @return An Integer (in hex) that will represent the ID for the package.
*/
function lfsr(seed,length,base){
    var arr = Array.from(seed.toString(base));
    var result ="";
    for (var i = 0; i < length ; i++) {
        var _newbit = parseInt(arr.pop(),16) ^ parseInt(arr[arr.length - 1],base);
        arr.splice(0 , 0 ,_newbit.toString(base));
        result += _newbit.toString(base); 
    }
    return  result; 
}
/**
 * Saves the given json to a text file.
 * @param jsonData actual json variable. 
 * @param fs node packages to save json to text.
*/
function json_toText(fs,jsonData){
    fs.writeFile("test.txt", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
}
/**
 * Saves a given ID num(hex) to a QRCode image.
 * @param id the package ID. 
*/
async function qr_to_image(id){
    QRCode.toFile(__dirname+`/public/packages/${id}.png`,id,
                {color: {dark: '#0000',light: '#ffff'}},
                function (err) {if (err) throw err})
    return 1;
}
/**
 * This fuction will get all of the other functions together for simplicity sake. 
 * @param seed For the lfsr funtion, a seed for generating a radom ID number.
 * @param length The legth of the output from the lfsr funciton.
 * @param base The numerical base for the radom ID.  
 * @returns A string that is the actual package.
*/
function gen_packageString(id,arrival,quantity){
    var _c_date = new Date();
    var _date = _c_date.toLocaleString('en-us', {  weekday: 'short' })+" "
            + _c_date.toLocaleString('default', { month: 'short' })+" "
            + _c_date.getDate() +" "
            + _c_date.getFullYear() +" "
            + _c_date.getHours() + ":"  
            + _c_date.getMinutes() + ":" 
            + _c_date.getSeconds()+" GMT+0300 (Israel Daylight Time)";

    for(var i =0; i< quantity; i++){

    }
    return (   "{\"package_id\":\""+id+"\","
                    + gen_Packageinfo() +"\","
                    + gen_Sender()+"\","
                    + gen_Sender_Address() + "\","
                    + gen_Reciver()+"\","
                    + gen_Reciver_Address()+"\","
                    +"\"arrival_date\":"+"\""+arrival+"\","
                    +"\"sent_date\":\""+ _date+"\"}");
}
/**
 * If needed to be used to fabricate massive amounts of packages, use this function.
 *   This function is the main fuction, it will generate a random package including all of its aspects. 
 *   Sending date will be defualting as the current day.
 *   given the next variable the json file will represent:
 *   A sender and his\hers address and info,
 *   The recipiente address and info,
 *   a QRCode with and image, and arrivale and departore time,
* @param  {Number}seed an Integer that will be the seed for the lfsr funtion to generate the hex based tracking number.
* @param  {Number}length the length of the disierd tracking number.
* @param  {Number}base  currently an hex based.
* @param  {Number}duration [OPTINAL] if given the duration of the arrivale will be defined from 1 - 5, from short to long,
                    defualting as shortest.
* @return      return a json file that represents the package.
*/
function fabricate_Multipackages(num,seed,length,base,duration){
    let packages = "{\"package\":[";
    for(var i = 0; i < num ; i++){
        var _pid = lfsr(seed*(i+1*i+1),length,base);
        if(i == num -1 ){
            packages += gen_packageString(_pid,faker.date.soon(1))+"]}";
            return packages;
        }
        switch (duration) {
            default: 
                packages += gen_packageString(_pid,faker.date.soon(1))+",";
            case 1:
                packages += gen_packageString(_pid,faker.date.soon(duration*2))+",";
            case 2:
                packages += gen_packageString(_pid,faker.date.soon(7))+",";
            case 3:
                packages += gen_packageString(_pid,faker.date.soon(14))+",";
            case 4:
                packages += gen_packageString(_pid,faker.date.soon(25))+",";
            case 5:
                packages += gen_packageString(_pid,faker.date.soon(40))+",";
          }
    }
    return packages
}
/**
 * save package to a simple text file(json), to the current file location.
* @param  name  the name of the json being saved.
* @param  data  the actual sting to be saved.
* @param  err   callvack function for error throwing
* @return       returns a true false, in case of an error thorws.
*/
async function packToFile(num){
    let buff_tempdata = fs.readFileSync(path.join(__dirname,'./data/dataAccum.json'));
    let _dataAcum = JSON.parse(buff_tempdata);
    var json =JSON.parse(fabricate_Multipackages(num,3292313261*gen_IntRange(2,3408),16,16,5));
    var prettyJSON = JSON.stringify(json);
    
    _dataAcum.package.push(json.package[0]);
    fs.writeFileSync(path.join(__dirname,'./data/dataAccum.json'), JSON.stringify(_dataAcum));
    var ids= [];
    for (let i = 0; i < num; i++){
        var id = json.package[i].package_id;
        ids.push(id);
        genSender.passPack('id',id);
        var ok = await qr_to_image(id);
        fs.writeFile(__dirname+`/public/packages/${id}.json`, prettyJSON, (err) => {
            if (err) {
                throw err;
            }
        });
    }
    console.log("a Package was arrived!")
    genSender.passPack('package',prettyJSON);
    if( counter >3){
        genSender.passPack('start',prettyJSON);
        counter = 0;
    }
    return;    
}
run();
async function mainFunction() {
    var numbers = gen_IntRange(0,10);
    packToFile(1);
    counter ++;
   
};
function run() {
    setInterval(mainFunction, 10000);
};
let counter = 3;
