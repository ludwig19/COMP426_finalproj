var root_url = "http://comp426.cs.unc.edu:3001/";
	//I'm assuming the booking button will be the modal button and then this will be the the confirm ticket
$(document).ready(() => {
	
	
	$('#confirm').on('click', () => {
	$.ajax(root_url + "tickets", {
		type: 'POST',
		xhrFields: {
			withCredentials: true
		},
		datatype: 'json',
		success: (response) => {
			"ticket": {
				"first_name": $("#firstName").val();,
				"middle_name": $("#middleName").val();,
				"last_name": $("#lastName").val();,
				"age": $("#age").val();
				"gender": $("#gender").val();,
				"is_purchased": true,
			}
		alert("You have booked your ticket");
		},
		error: () => {
			alert("Please check to make sure you've entered valid inputs");
		}
	});
});

})

