$(document).ready(() => {
	let resetActiveLinks = () => {
		$('.content-wrapper-ctrl').removeClass('active-cw-ctrl');
		$('.sub-nav div a').removeClass('active-sn-ctrl');
	};
	/* Generate search index */
	_l('Loading File-Server Search Index');
	$('.header-search').attr('placeholder', 'Loading FsIndex...');
	$('.header-search').closest('div').addClass('ui-state-disabled');
	$('.loader')[0].click();
	$('.sr-dt').load('ext/index/fsindex.html #index', () => {
		_l('DT, Done!');
		$('.sr').load('ext/index/fsindex.html #index', () => {
			$.mobile.loading( "hide" );
			$('.sr-wrapper').attr('id', '');
			$('.header-search').closest('div').removeClass('ui-state-disabled');
			$('.header-search').attr('placeholder', 'Search past papers, e-books');
			$('.sr .sr-wrapper').attr('data-input', '#hmSearch');
			$('.sr-wrapper').filterable().filterable('refresh');
			_l('A, Done!');

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
				//window.history.replaceState({}, null, '/index.html');
				_l('L.E', null);
			}
		});
	});
	$('.header-search')./* keypress */click(() =>  {
		if(!$('.sr-cw').hasClass('active-content-wrapper')) {
			resetActiveLinks();
			$('#sr-cw').addClass("active-cw-ctrl");
			$('.content').removeClass('active-content-wrapper').hide();
			$('.sr-cw').addClass('active-content-wrapper').fadeIn();
			currentCW = 'sr-cw';
		}
	});
});