var root_url = "http://comp426.cs.unc.edu:3001/";
var arrival_id, depart_id;
$(document).ready(() => {
    /*$('#login').on('click', () => {
        var root_url = "http://comp426.cs.unc.edu:3001/"
        var log_in = function() {
        var login_url = root_url + "sessions"; 
        
        $.ajax(login_url, 
            {   type: 'POST', 
                xhrFields: {withCredentials: true}, 
                data: { "user": {
                		"username": name, //our username
                		"password": password //our password
			}
                },
                success: (response) => { 
                    if (response.status) { 
                        console.log("logged in!");
                    }  
                    else {
                        console.log("failed login");
                    }
                }
            });   
} 
    });*/
    $('#execute').on('click', () => {
        let Depart = $("#airport1").val();
        let Arrival = $("#airport2").val();
        //gettinng id code for departure and arrival to query flights\
        //departure
        $.ajax(root_url + "airports?filter[code]=" + Depart,
                   {
                        type: 'GET',
                        xhrFields: {withCredentials: true},
                        datatype : 'json',
                        success: (response) => {
                            if(response[0] != undefined){
                                let depart_data = response[0];
                                depart_id = depart_data.id;
                                //arrival
                                $.ajax(root_url + "airports?filter[code]=" + Arrival,
                               {
                                    type: 'GET',
                                    xhrFields: {withCredentials: true},
                                    datatype : 'json',
                                    success: (response) => {
                                        if(response[0] != undefined){
                                            let arrival_data = response[0];
                                            arrival_id = arrival_data.id;
                                            //combining 
                                            $.ajax(root_url + "flights?filter[departure_id]=" + depart_id + "&filter[arrival_id]=" +arrival_id, {
                                                type: 'GET',
                                                xhrFields: {withCredentials: true},
                                                datatype: 'json',
                                                success: (response) => {
                                                     response.forEach(function(dictionary) {
                                                        flight_builder(dictionary);
                                                    });
                                                    console.log(response);
                                                }
                                            });
                                        }
                                        else{
                                            alert("Enter valid Airport Codes");
                                        }

                                    },
                                    error: () => {
                                        alert('error');
                                    }
                                });
                            }
                            else{
                                alert("Enter valid Airport Codes");
                            }
                            
                        },
                        error: () => {
                            alert('error');
                        }
                    });
    });
});

var flight_builder = (dictionary) =>{
    //fill this in with each individual flight builder
    /*
    Departure --> Arrival:  data
    Depature Date:          data
    Arrival Date:           data
    //can query to select which airline it belongs to. 
    */
    console.log(dictionary);
    $('body').append('<p>'+dictionary.departs_at+'</p>');
}