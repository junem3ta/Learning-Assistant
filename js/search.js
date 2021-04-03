<<<<<<< HEAD
let directUIUpdates = () => {
=======
directUIUpdates = () => {
>>>>>>> tmp
	_l('Loading File-Server Search Index');
	$('.header-search').attr('placeholder', 'Loading FsIndex...');
	$('.header-search').closest('div').addClass('ui-state-disabled');
	$('.loader')[0].click();
},
<<<<<<< HEAD
loadSI = () => {
=======
bindSearchEvents = () => {
>>>>>>> tmp
	$('.sr-dt').load('ext/index/fsindex.html #index', () => {
		_l('DT, Done!');
		$('.sr').load('ext/index/fsindex.html #index', () => {
			_l('A, Done!');
			$.mobile.loading( "hide" );
			$('.sr-wrapper').attr('id', '');
			$('.header-search').closest('div').removeClass('ui-state-disabled');
			$('.header-search').attr('placeholder', 'Search past papers, e-books');
			$('.sr .sr-wrapper').attr('data-input', '#hmSearch');
			$('.sr-wrapper').filterable().filterable('refresh');

			/* LightFold Engine */
			let qs0 = window.location.search.substring(1).split('&')[0];
			if(qs0.split('=')[0] == 'lightfoldto') {
				let d = qs0.split('=')[1];
				_l(qs0, d);
				if(d === 'login') {
					resetActiveLinks();
					$('.content').hide();
					$('.ua-cw').addClass('active-content-wrapper').show();
					currentCW = 'ua-cw';
					$('#sn-ctrl-0').addClass('active-sn-ctrl');
					$('#sn-ctrl-0')[0].click();
					window.history.replaceState({}, null, '/index.html');
				} else {
					window.history.replaceState({}, null, '/index.html');
					_l('404');
				}
			} else {
				_l('L.E', null);
			}
		});
	});	
},
loadLastSR = (id) => {
	_l('Loading last SR');
	$($('.sr-dt')[$('.sr-dt').length - 1]).load('ext/index/fsindex.html #index', () => {
		_l('done');
		$.mobile.loading( "hide" );
		$('.header-search').closest('div').removeClass('ui-state-disabled');
		$('.header-search').attr('placeholder', 'Search past papers, e-books');
		/* if(id) {
			$($('.sr-dt')[$('.sr-dt').length - 1]).find('.sr-wrapper').attr('data-input', id);
		} */
		$($('.sr-dt')[$('.sr-dt').length - 1]).find('.sr-wrapper').attr('id', '');
		$($('.sr-dt')[$('.sr-dt').length - 1]).find('.sr-wrapper').filterable().filterable('refresh');
	});
},
bindSearchEvents = () => {
	$('.header-search')./* keypress */click(() =>  {
		if(!$('.sr-cw').hasClass('active-content-wrapper')) {
			resetActiveLinks();
			$('#sr-cw').addClass("active-cw-ctrl");
			$('.content').removeClass('active-content-wrapper').hide();
			$('.sr-cw').addClass('active-content-wrapper').fadeIn();
			currentCW = 'sr-cw';
		}
	});
};

$(document).ready(() => {
	directUIUpdates();
<<<<<<< HEAD
	/* Generate search index */
	loadSI();
=======
>>>>>>> tmp
	bindSearchEvents();
});