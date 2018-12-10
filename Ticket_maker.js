var root_url = "http://comp426.cs.unc.edu:3001/";
$(document).ready(() =>{
    var body = $('.append_below');
    $('#ticket_btn').click( function() {
        ticket_getter("alexander", "sheldon", "ludwig", 22, "male", true, 390742);
    });
});
var ticket_getter = (first, middle, last, age, gender, is_purchased, flight_id) => {
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
                "instance_id": flight_id
              }
        }
    }); 
}