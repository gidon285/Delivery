const express = require("express");
const router = express.Router();
const path = require('path');
const bodyParser =require('body-parser');
const redisComm = require('../Redis/redisCommunicate.js');
const QRCode = require('qrcode');
const fs = require('fs');
const { stringify } = require("querystring");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.get('/',async (req,res)=>{
    res.render('./pages/dashboard');
});
router.get('/profile',async (req,res)=>{
    res.render(path.join(__dirname,'..','/views/pages/profile'));
});

router.get('/getInfo',async (req,res)=>{
    var _data =  await redisComm.getData('user_info');
    res.send(_data);
});

router.get('/countSize',async (req,res)=>{
    //var _data =  await redisComm.getData('user_info');
    fs.readFile('./data/dataAccum.json', async (err, data) => {
      if (err)console.log(err);
      else {
    
          var admin = JSON.parse(data);


          var size=[0, 0, 0];
          var pr=[0,0,0];
          for(var i=0; i<admin.package.length; i++){
              if(admin.package[i].size=='small'){
                  size[0]+=1;
                  pr[0]+=parseInt(admin.package[i].product_price.substring(0,admin.package[i].product_price.length-1));
              }
              else if(admin.package[i].size=='medium'){
                  size[1]+=1;
                  pr[1]+=parseInt(admin.package[i].product_price.substring(0,admin.package[i].product_price.length-1));
  
              }
              else if(admin.package[i].size=='large'){
                  size[2]+=1;
                  pr[3]+=parseInt(admin.package[i].product_price.substring(0,admin.package[i].product_price.length-1));
  
              }
              
          }   
          //console.log(pr);
          var a={numbers:"",price:""};
          a.numbers=size;
          a.price=pr;
      res.send(a);

      }
    });

});


router.get('/analyticalTable',async (req,res)=>{

fs.readFile('./BigML/data_out.json', (err, data) => {
  if (err)console.log(err);
  else {

      var admin = JSON.parse(data);
      let a=[];
      for(var i= 0; i<5; i++){
              a.push(admin[i]);
      }   
      res.send(a);

  }
});
  
});




router.get('/deliverysTable',async (req,res)=>{
    //var _data =  await redisComm.getData('user_info');
    

    fs.readFile('./data/dataAccum.json', async (err, data) => {
      if (err)console.log(err);
      else {
    
          var admin = JSON.parse(data);

        let a=[];

        
        //var pr=[0,0,0];
        var min= Math.min(5,admin.package.length)
        for(var i= 0; i<min; i++){
                var p = ["", "", "", "", "", "", "", ""];
                p[0]=admin.package[i].package_id;
                p[1]=admin.package[i].reciver_city;
                p[2]=admin.package[i].sender_first_name;
                p[3]=admin.package[i].sender_last_name;
                p[4]=admin.package[i].sender_phone;
                p[5]=admin.package[i].sender_email_adress;
                p[6]=admin.package[i].product_price;
                p[7]=admin.package[i].taxes;
                a.push(p);
                await qr_to_image(admin.package[i].package_id, i);
        }   
        //console.log(a);
    //var ok = await qr_to_image("jsdbkjfsnjsdknfkjs", "2");
        res.send(a);
      }
    });
  });

async function qr_to_image(id, i){
  QRCode.toFile(__dirname+ `/../public/css/img/${i}.png`,id,
              {},
              function (err) {if (err) throw err})
              return;
}


router.get('/graph',async (req,res)=>{
    //var _data =  await redisComm.getData('user_info');
    fs.readFile('./data/dataAccum.json', async (err, data) => {
      if (err)console.log(err);
      else {
    
          var admin = JSON.parse(data);


          var mont=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          for(var i=0; i<admin.package.length; i++){
              if(admin.package[i].arrival_date.substring(4,7)=='Jan'){mont[0]+=1}
              else if(admin.package[i].arrival_date.substring(4,7)=='Feb'){mont[1]+=1}
              else if(admin.package[i].arrival_date.substring(4,7)=='Mar'){mont[2]+=1}
              else if(admin.package[i].arrival_date.substring(4,7)=='Apr'){mont[3]+=1}
              else if(admin.package[i].arrival_date.substring(4,7)=='May'){mont[4]+=1}
              else if(admin.package[i].arrival_date.substring(4,7)=='Jun'){mont[5]+=1}
              else if(admin.package[i].arrival_date.substring(4,7)=='Jul'){mont[6]+=1}
              else if(admin.package[i].arrival_date.substring(4,7)=='Aug'){mont[7]+=1}
              else if(admin.package[i].arrival_date.substring(4,7)=='Sep'){mont[8]+=1}
              else if(admin.package[i].arrival_date.substring(4,7)=='Oct'){mont[9]+=1}
              else if(admin.package[i].arrival_date.substring(4,7)=='Nov'){mont[10]+=1}
              else if(admin.package[i].arrival_date.substring(4,7)=='Dec'){mont[11]+=1}
              
              
          }        
      
      var a={numbers:""};
      a.numbers=mont;
          res.send(a);

      }
    });



});

router.get('/getCurrent',async (req,res)=>{
    var _data =  await redisComm.getData('current');
    res.send(_data);
});

router.post('/Exit',async (req,res)=>{
    var scurrent = await redisComm.getData('current')
    var current = JSON.parse(scurrent);
    current.user = "-";
    redisComm.setData('current',current);
});


router.post('/profile/saveProfile',async (req,res)=>{
    var _data =  await redisComm.getData('user_info')
    var json = JSON.parse(_data);
    var answer = { 
        email_adress:req.body.pro_email,
        first_name:req.body.pro_first_name,
        last_name:req.body.pro_last_name,
        address:req.body.pro_address,
        city:req.body.pro_city,
        country:req.body.pro_country,
        zip_code:req.body.pro_zip,
        about:req.body.pro_about
    };
    json.info[req.body.pro_username]=answer;
    
    redisComm.setData('user_info', json);
});


router.get('/map-google',async (req,res)=>{
    res.render(path.join(__dirname,'..','/views/pages/map-google'));
});
router.get('/deliveries',async (req,res)=>{
    res.render(path.join(__dirname,'..','/views/pages/deliveries'));
});
router.get('/analytical',async (req,res)=>{
    res.render(path.join(__dirname,'..','/views/pages/analytical'));
});
router.get('/register', (req, res) => {
    res.render('/pages/register');
});

module.exports = router;