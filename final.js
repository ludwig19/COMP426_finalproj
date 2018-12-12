var root_url = "http://comp426.cs.unc.edu:3001/";
var arrival_id, depart_id;
var counter = 0;
var send_once = 1;
$(document).ready(() => {
    $('#execute').on('click', () => {
        send_once = 1;
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
$(document).on('click', "#ticket_btn", () => {
    $('.append_below').empty();
    id = $('#ticket_input').val();
    ticket_getter(id);
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
                                    counter = 0;
                                    response.forEach(function(dictionary) {
                                        flight_builder(dictionary, depart, arrival, counter);
                                        counter++;
                                    });
                                            $('.book_ticket').click(function(){
                                                console.log($(this).attr('id'));
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
                                            flight_builder(dictionary, arrival, depart, counter);
                                            counter++;
                                            
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
var flight_builder = (dictionary, depart, arrival, count) =>{
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
    var flight_id = dictionary.id;
    var ts_bool = 1;
    flight_dict = {};
    $.ajax(root_url + 'airlines/' + airline_id,
           {
            type: 'GET',
            xhrFields: {withCredentials: true},
            datatype : 'json',
            success: (response) => {
                airline_name = response.name;
                var body = $(".append_below");
                $(body).append(`<div class="ts" id="flight_information">
                                    Airline--${airline_name}<br>
                                    Departure Time--${departure_time}<br>
                                    Arrival Time--${arrival_time}<br>
                                    departure airport--${depart}<br>
                                    arrival airport--${arrival}<br>
                                    flight ID--${flight_id}<br>
                                </div>
                                <button class = "col-button w3-button w3-round" position = "absolute" type="button" id="ts" data-toggle="modal" data-target="#myModal">Book Ticket</button>`);
                if(ts_bool){
                    $('.book_ticket').click(function(){
                        btn_id = $(this).attr('id');
                        let string_to_slice = $(this).prev()[0].innerHTML;
                        let string_array = string_to_slice.split("<br>");
                        var out_array = [];
                        let i = 0;
                        /*
                        [0] => airline
                        [1] => dept time
                        [2] => arrive time
                        [3] => dept airport
                        [4] => arrive airport
                        [5] => flight ID
                        */
                        string_array.forEach(function(element){
                            out_array[i] = element.split("--")[1];
                            i++;
                        });
                        //currently posting twice need to make condit variable to limit to a single post in this section
                        $('#confirm').click(function(){
                            let first1 = $('#firstName').val();
                            let middle1 = $('#middleName').val();
                            let last1 = $('#lastName').val();
                            let age1 = $('#age').val();
                            let gender1 = $('#gender').val();
                            
                            ticket_poster(first1, middle1, last1, parseInt(age1), gender1, true, parseInt(out_array[5]), out_array[1], out_array[0]);
                            send_once=0;
                        });
                    });
                }   
            }
    });
}

//used to post tickets will connect with submit button. 
var ticket_poster = (first, middle, last, age, gender, is_purchased, flight_id, departure_time, airline) => {
    $.ajax(`${root_url}tickets`, {
        type: 'POST',
        xhrFields: {withCredentials: true},
        data : {"ticket": {
                "first_name":   first,
                "middle_name":  middle,
                "last_name":    last,
                "age":          age,
                "gender":       gender,
                "is_purchased": is_purchased,
                "price_paid":   "420",
            //if y'all wanna redo this section I'd appreciate it if it looked nice. 
                "info": `Suuhh, ${first}, Thanks for booking with Fly High. Being such a high roller, you've gotten the special discount ticket for only $420! Here's some additional info about your flight. Your flight number is ${flight_id} and it departs at ${departure_time}. Remember, you'll be flying on ${airline}. Stay toasty, my dude!`
              }
        },
        "success" : (response) => {
            
            alert(`Your ticket ID is ${response.id}`);
        }
    }); 
}
var ticket_getter = (id) => {
    $.ajax(`${root_url}tickets/${id}`, {
        type: 'GET',
        xhrFields: {withCredentials: true},
        success: (response) => {
            let first_name = response.first_name;
            let gender = response.gender;
            let age = response.age;
            let info = response.info;
            let last_name = response.last_name;
            let middle_name = response.middle_name;
            let price = response.price_paid;
            //mason style here 
            $('.append_below').append(`
                                        <div id= "ticket_information">
                                            <ul>
                                                First Name: ${first_name}<br>
                                                Middle Name: ${middle_name}<br>
                                                Last Name: ${last_name}<br>
                                                Age: ${age}<br>
                                                Gender: ${gender}<br>
                                                Info: ${info}<br>
                                                Price: ${price}<br>
                                            </ul>
                                        </div>`)
        } 
    }); 
}