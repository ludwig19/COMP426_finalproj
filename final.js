var root_url = "http://comp426.cs.unc.edu:3001/";
var arrival_id, depart_id;

$(document).ready(() => {

    $('#execute').on('click', () => {
        $('.append_below').empty();
        let depart = $("#airport1").val();
        let arrival = $("#airport2").val();
        let dept_early = $("#depart_early").val();
        let dept_late = $("#depart_late").val();
        let arrive_early = $("#return_early").val();
        let arrive_late = $("#return_late").val();
        //gettinng id code for departure and arrival to query flights\
        flight_getter(depart, arrival, dept_early, dept_late, arrive_early, arrive_late);
        //flight_getter(arrival, depart, arrive_early, arrive_late);
    });
});


function flight_getter(depart, arrival, d_early, d_late, a_early, a_late) {
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
                            //departure tickets
                            $.ajax(root_url + `flights?filter[departure_id]=${depart_id}&filter[arrival_id]=${arrival_id}&filter[departs_at_ge]=${d_early}&filter[departs_at_le]=${d_late}`, {
                                type: 'GET',
                                xhrFields: {withCredentials: true},
                                datatype: 'json',
                                success: (response) => {
                                    response.forEach(function(dictionary) {
                                        console.log(root_url + `flights?filter[departure_id]=${depart_id}&filter[arrival_id]=${arrival_id}&filter[departs_at_ge]=${d_early}&filter[departs_at_le]=${d_late}`);
                                        flight_builder(dictionary, depart, arrival);
                                    });
                                }
                            });
                            //end departure tickets
                            if(a_early && a_late){
                                //return tickets
                                //this can be moved inside the depart tickets so that once a departure ticket is selected so that the next window to pop up is return tickets
                                console.log(a_early);
                                console.log(a_late);
                                 $.ajax(root_url + `flights?filter[departure_id]=${arrival_id}&filter[arrival_id]=${depart_id}&filter[departs_at_ge]=${a_early}&filter[departs_at_le]=${a_late}`, {
                                    type: 'GET',
                                    xhrFields: {withCredentials: true},
                                    datatype: 'json',
                                    success: (response) => {
                                        response.forEach(function(dictionary) {
                                            console.log(root_url + `flights?filter[departure_id]=${arrival_id}&filter[arrival_id]=${depart_id}&filter[departs_at_ge]=${a_early}&filter[departs_at_le]=${a_late}`);
                                            flight_builder(dictionary, arrival, depart);
                                        });
                                    }
                                });
                                //end return tickets
                            }
                        }
                        else{
                            alert("Enter valid Airport Codes -- failed airport2");
                        }

                    },
                    error: () => {
                        alert('error');
                    }
                });
            }
            else{
                console.log(root_url + "airports?filter[code]=" + depart);
                alert("Enter valid Airport Codes -- failed airport 1");
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
                $(body).append(`<ul>
                                <li>${airline_name}</li>
                                <li>${departure_time}</li>
                                <li>${arrival_time}</li>
                                <li>departure airport: ${depart}</li>
                                <li>arrival airport: ${arrival}</li>
                            </ul>`);
				$(body).append('<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Book Ticket</button>');
            }
    });
}
//potentially useless funct
Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}