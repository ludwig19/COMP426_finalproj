var root_url = "http://comp426.cs.unc.edu:3001/";
$(document).ready(() =>{
    var body = $('.append_below');
    $('#ticket_btn').click( function() {
        ticket_getter(13821);
    });
});
var ticket_getter = (id) => {
    $.ajax(`${root_url}tickets/${id}`, {
        type: 'GET',
        xhrFields: {withCredentials: true},
        success: (response) => {
            $('.append_below').append(response.age);            
        } 
    }); 
}