$(document).ready(() => {
   /* Generate search index */
	/* let f = []; */
	_l('Loading File-Server Search Index');
	$('.header-search').attr('placeholder', 'Loading FsIndex...');
	$('.header-search').closest('div').addClass('ui-state-disabled');
	$('.loader')[0].click();
	$('.sr-dt, .sr').load('ext/index/fsindex.html #index', () => {
		$.mobile.loading( "hide" );
		$('.sr-wrapper').attr('id', '');
		$('.header-search').closest('div').removeClass('ui-state-disabled');
		$('.header-search').attr('placeholder', 'Search past papers, e-books');
		$('.sr .sr-wrapper').attr('data-input', '#hmSearch');
		$('.sr-wrapper').filterable().filterable('refresh');
		_l('Done!');
	});
	let resetActiveLinks = () => {
		$('.content-wrapper-ctrl').removeClass('active-cw-ctrl');
		$('.sub-nav div a').removeClass('active-sn-ctrl');
	};
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