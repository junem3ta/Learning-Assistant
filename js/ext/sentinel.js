$(document).ready(() => {
	let M_ID =window.location.search.substring(1).split('=')[1];
	if(M_ID) {
		$.ajax({
			url: "http://localhost:3000/moderators/OTP",
			type: "POST",
			data: {"M_ID": M_ID},
			crossDomain: true,
			processData: false,
			contentType: false,
			beforeSend: () => {
				$('.loader')[0].click();
			},
			success: (d) => {
				if(d.res === 'success') {

				} else {
					$('body').html('<pre style="margin:1em">401: Knock it off, Jose.</pre>');
				}
			}, 
			error: (e) => {
				$('body').html('<pre style="margin:1em">' + e.statusText + '</pre>');
			}
		});
	} else if(lht) {
		$.ajax({
			url: "http://localhost:3000/moderators/sentinel",
			type: "POST",
			headers: {"Authorization": 'Bearer ' + lht},
			crossDomain: true,
			processData: false,
			contentType: false,
			beforeSend: () => {
				
			},
			success: (d) => {
				if(d.res === 'success') {

				} else {
					$('body').html('<pre style="margin:1em">401: Knock it off, Jose.</pre>');
				}
			}, 
			error: (e) => {
				$('body').html('<pre style="margin:1em">' + e.statusText + '</pre>');
			}
		});
	} else {
		$('body').html('<pre style="margin:1em">401: Knock it off, Jose.</pre>');
	}
});