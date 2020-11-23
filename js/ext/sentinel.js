let _l = console.log;
$(document).ready(() => {
	let ERR_MSGS = {
		basic: 'This is getting old, fast! Knock it off Dolores.'
	},
	four01 = $('<pre>', {style: 'margin: 1em'}).append(ERR_MSGS.basic),
	qs = window.location.search.substring(1).split('&')[0];

	if(qs.split('=')[0] === 'UID') { 
		let M_ID = qs.split('=')[1];
		_l('Linked :D', M_ID);
		$.ajax({
			url: "http://localhost:3000/users/lh/AT",
			type: "POST",
			data: {
				"id": M_ID
			},
			success: (d) => {
				if(d.res === 'success') {
					$('body').show();
				} else {
					$('body').html(four01);
				}
			}, 
			error: (e) => {
				$('body').show().html(four01);
			}
		});
	} else if(qs.split('=')[0] === 'AT') {
		let lht = qs.split('=')[1];
		_l('Redirected', lht);
		$.ajax({
			url: "http://localhost:3000/users/sentinel",
			type: "POST",
			headers: {
				"Authorization": 'Bearer ' + lht
			},
			success: (d) => {
				if(d.res) {
					_l('looking good', d);
					$('body').show();
					//updateUASpecs(d);
					//getTasks(lht);
				} else {
					$('body').show().html(four01);
				}
			}, 
			error: (e) => {
				$('body').show().html(four01.text('').append('ERR_CODE ' + e.statusCode + ': ' + e.statusText));
			}
		});
	} else {
		_l('Unauthorized');
		$('body').show().html(four01);
	}
});