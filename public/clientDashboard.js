//var admin = JSON.parse(request2.response).user


function getInfo() {

    let curr = new XMLHttpRequest();
  
    curr.open("GET", 'http://localhost:3000/dashboard/getCurrent',true);
    curr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    curr.send();

    curr.onreadystatechange = function() {
        if (curr.readyState === 4) {
        var admin = JSON.parse(curr.response).user; //who is login

        let request = new XMLHttpRequest();
    
        request.open("GET", 'http://localhost:3000/dashboard/getInfo',true);
        request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        request.send();
    
            request.onreadystatechange = function() {
                if (request.readyState === 4) {
                    var jsonrespons = JSON.parse(request.response);
                    document.getElementById('pro_username').value=admin;
                    document.getElementById('pro_email').value=jsonrespons.info[admin].email_adress;
                    document.getElementById('pro_first_name').value=jsonrespons.info[admin].first_name;
                    document.getElementById('pro_last_name').value=jsonrespons.info[admin].last_name;
                    document.getElementById('pro_address').value=jsonrespons.info[admin].address;
                    document.getElementById('pro_city').value=jsonrespons.info[admin].city;
                    document.getElementById('pro_country').value=jsonrespons.info[admin].country;
                    document.getElementById('pro_zip').value=jsonrespons.info[admin].zip_code;
                    document.getElementById('pro_about').value=jsonrespons.info[admin].about;
                
            
                
                }
            }
        }
  }

}



function logOut() {
        let request = new XMLHttpRequest();
        request.open("POST", 'http://localhost:3000/dashboard/Exit',true);
        request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        request.send();
        return;
            
}


function saveProfile() {
    var data = {
        pro_username:document.getElementById('pro_username').value,
        pro_email:document.getElementById('pro_email').value,
        pro_first_name:document.getElementById('pro_first_name').value,
        pro_last_name:document.getElementById('pro_last_name').value,
        pro_address:document.getElementById('pro_address').value,
        pro_city:document.getElementById('pro_city').value,
        pro_country:document.getElementById('pro_country').value,
        pro_zip:document.getElementById('pro_zip').value,
        pro_about:document.getElementById('pro_about').value
    };
        
        //document.getElementById("demo").innerHTML=data;


    let request = new XMLHttpRequest();
    request.open("POST", 'http://localhost:3000/dashboard/profile/saveProfile',true);
    request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    request.send(JSON.stringify(data));


    return;
        
}


function graph() {
    let curr = new XMLHttpRequest();
  
    curr.open("GET", 'http://localhost:3000/dashboard/graph',true);
    curr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    curr.send();

    curr.onreadystatechange = function() {
        if (curr.readyState === 4) {
        
            var a = JSON.parse(curr.response);
            //document.getElementById('deemo').innerText=a.numbers[0];
            
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [ "January" , "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    datasets: [{
                        label: 'Number of packages by month',
                        data: [a.numbers[0], a.numbers[1], a.numbers[2], a.numbers[3], a.numbers[4], a.numbers[5], a.numbers[6], a.numbers[7], a.numbers[8], a.numbers[9], a.numbers[10], a.numbers[11]],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                        'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ]
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
  }
    

}





function size() {
    let curr = new XMLHttpRequest();
  
    curr.open("GET", 'http://localhost:3000/dashboard/countSize',true);
    curr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    curr.send();

    curr.onreadystatechange = function() {
        if (curr.readyState === 4) {
        
            var a = JSON.parse(curr.response);
            //document.getElementById('deemo').innerText=a.numbers[0];

            var ct = document.getElementById('myChart3').getContext('2d');
            var myChart2 = new Chart(ct, {
                type: 'doughnut',
                data: {
                    labels: [ "small" , "medium", "large"],
                    datasets: [{
                        label: 'The sum prices of products by size',
                        data: [a.price[0], a.price[1], a.price[2]],
                        backgroundColor: [
                        'rgba(75, 192, 192, 111)',
                            'rgba(153, 102, 255, 111)',
                            'rgba(255, 159, 164, 111)'
                        ],
                        borderColor: [
                        'rgba(75, 192, 192, 111)',
                            'rgba(153, 102, 255, 111)',
                            'rgba(255, 159, 164, 111)'
                        ]
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            




            var ctx = document.getElementById('myChart2').getContext('2d');
            var myChart2 = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: [ "small" , "medium", "large"],
                    datasets: [{
                        label: 'Number of packages by size',
                        data: [a.numbers[0], a.numbers[1], a.numbers[2]],
                        backgroundColor: [
                            'rgba(255, 99, 132, 111)',
                            'rgba(54, 162, 235, 111)',
                            'rgba(255, 206, 86, 111)',
                        ],
                        borderColor: [
                        'rgba(255, 99, 132, 111)',
                            'rgba(54, 162, 235, 111)',
                            'rgba(255, 206, 86, 1111)',
                        ]
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            



        }
  }
    

}






function deliverys() {
    let curr = new XMLHttpRequest();
  
    curr.open("GET", 'http://localhost:3000/dashboard/deliverysTable',true);
    curr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    curr.send();

    curr.onreadystatechange = function() {
        if (curr.readyState === 4) {
        
            var a = JSON.parse(curr.response);
            let strData =a[0][0];
            var img;
            

        
            document.getElementById('td00').innerText=a[0][0];
            //document.getElementById('td01').src;
            //document.getElementById('td01').innerText ->> img;
            document.getElementById('td02').innerText=a[0][1];
            document.getElementById('td03').innerText=a[0][2];
            document.getElementById('td04').innerText=a[0][3];
            document.getElementById('td05').innerText=a[0][4];
            document.getElementById('td06').innerText=a[0][5];
            document.getElementById('td07').innerText=a[0][6];
            document.getElementById('td08').innerText=a[0][7];
            
            document.getElementById('td10').innerText=a[1][0];
            //document.getElementById('td01').innerText ->> img;
            document.getElementById('td12').innerText=a[1][1];
            document.getElementById('td13').innerText=a[1][2];
            document.getElementById('td14').innerText=a[1][3];
            document.getElementById('td15').innerText=a[1][4];
            document.getElementById('td16').innerText=a[1][5];
            document.getElementById('td17').innerText=a[1][6];
            document.getElementById('td18').innerText=a[1][7];

            document.getElementById('td20').innerText=a[2][0];
            //document.getElementById('td01').innerText ->> img;
            document.getElementById('td22').innerText=a[2][1];
            document.getElementById('td23').innerText=a[2][2];
            document.getElementById('td24').innerText=a[2][3];
            document.getElementById('td25').innerText=a[2][4];
            document.getElementById('td26').innerText=a[2][5];
            document.getElementById('td27').innerText=a[2][6];
            document.getElementById('td28').innerText=a[2][7];

            document.getElementById('td30').innerText=a[3][0];
            //document.getElementById('td01').innerText ->> img;
            document.getElementById('td32').innerText=a[3][1];
            document.getElementById('td33').innerText=a[3][2];
            document.getElementById('td34').innerText=a[3][3];
            document.getElementById('td35').innerText=a[3][4];
            document.getElementById('td36').innerText=a[3][5];
            document.getElementById('td37').innerText=a[3][6];
            document.getElementById('td38').innerText=a[3][7];

            document.getElementById('td40').innerText=a[4][0];
            //document.getElementById('td01').innerText ->> img;
            document.getElementById('td42').innerText=a[4][1];
            document.getElementById('td43').innerText=a[4][2];
            document.getElementById('td44').innerText=a[4][3];
            document.getElementById('td45').innerText=a[4][4];
            document.getElementById('td46').innerText=a[4][5];
            document.getElementById('td47').innerText=a[4][6];
            document.getElementById('td48').innerText=a[4][7];

            



        }
  }
    

}


function analytical() {
    let curr = new XMLHttpRequest();
  
    curr.open("GET", 'http://localhost:3000/dashboard/analyticalTable',true);
    curr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    curr.send();

    curr.onreadystatechange = function() {
        if (curr.readyState === 4) {      
            var a = JSON.parse(curr.response);
        
            document.getElementById('an00').innerText=a[0].product;
            document.getElementById('an01').innerText=a[0].items;
            document.getElementById('an02').innerText=a[0].support;
            document.getElementById('an03').innerText=a[0].coverage;
            

            document.getElementById('an10').innerText=a[1].product;
            document.getElementById('an11').innerText=a[1].items;
            document.getElementById('an12').innerText=a[1].support;
            document.getElementById('an13').innerText=a[1].coverage;
            
            document.getElementById('an20').innerText=a[2].product;
            document.getElementById('an21').innerText=a[2].items;
            document.getElementById('an22').innerText=a[2].support;
            document.getElementById('an23').innerText=a[2].coverage;

            document.getElementById('an30').innerText=a[3].product;
            document.getElementById('an31').innerText=a[3].items;
            document.getElementById('an32').innerText=a[3].support;
            document.getElementById('an33').innerText=a[3].coverage;

            document.getElementById('an40').innerText=a[4].product;
            document.getElementById('an41').innerText=a[4].items;
            document.getElementById('an42').innerText=a[4].support;
            document.getElementById('an43').innerText=a[4].coverage;
        }
  }
    

}

