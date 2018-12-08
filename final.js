var root_url = "http://comp426.cs.unc.edu:3001/";
var arrival_id, depart_id;

$(document).ready(() => {
    $('#execute').on('click', () => {
        $(".append_below").empty();
        let depart = $("#airport1").val();
        let arrival = $("#airport2").val();
        let dept_date = $("#depart_date").val();
        let return_date = $("#return_date").val(); 
        console.log(dept_date);
        //gettinng id code for departure and arrival to query flights\
        //departure
        flight_getter(depart, arrival);
        
    });
});

function flight_getter(depart, arrival) {
    $.ajax(root_url + "airports?filter[code]=" + depart,
           {
        type: 'GET',
        xhrFields: {withCredentials: true},
        datatype : 'json',
        success: (response) => {
            if(response[0] != undefined){
                let depart_data = response[0];
                depart_id = depart_data.id;
                //arrival
                $.ajax(root_url + "airports?filter[code]=" + arrival,
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
                                        flight_builder(dictionary, depart, arrival);
                                    });
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
}

var flight_builder = (dictionary, depart, arrival) =>{
    //fill this in with each individual flight builder
    /*
    Departure --> Arrival:  data
    Depature Date:          data
    Arrival Date:           data
    //can query to select which airline it belongs to. 
    */
    var departure_time = dictionary.departs_at;
    var arrival_time = dictionary.arrives_at;
    var airline_id = dictionary.airline_id;
    $.ajax(root_url + 'airlines/' + airline_id,
           {
            type: 'GET',
            xhrFields: {withCredentials: true},
            datatype : 'json',
            success: (response) => {
                airline_name = response.name;
                var body = $(".append_below");
                body.append(`<ul>
                                <li>${airline_name}</li>
                                <li>${departure_time}</li>
                                <li>${arrival_time}</li>
                                <li>departure airport: ${depart}</li>
                                <li>arrival airport: ${arrival}</li>
                            </ul>`);
            }
    });
}
