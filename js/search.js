$(document).ready(() => {
   /* Generate search index */
	/* let f = []; */
	_l('Loading FSIndex');
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
	/* 
		let generateSearchIndex = async (i) => {
			for(entry in i) {
				let currentObj = i[entry],
				length = Object.keys(currentObj).length;
				if(length == 2 && currentObj['__files__'] !== undefined) {
					//_l(' - __files__ !, path', currentObj['path'], currentObj['__files__']);
					let files = currentObj['__files__'], 
					path = currentObj['path'],
					absPath = path.split('root/')[1];
					for(let j=0; j<files.length; j++) {
						let fullFileName = files[j];
						let fileNameArr = fullFileName.split('.pdf');
						fileName = fileNameArr.join('');
						path = '/' + absPath + '/' + fileName;
						$('.sr-wrapper').append(
							$('<div>',{class:'file-tile-wrapper fi-tw-mini tooltipped tooltipped-s border p-2 mb-2 mr-2 float-left', 'aria-label': fileName})
							.append(
								$('<a>',
								{
									id:fullFileName, 
									class:'file-icon fi-i-mini', 
									href: '#pdfViewer', 
									'data-rel':'popup', 
									'data-position-to':'window', 
									path: path,
									'data-filtertext': path.split('/').join(' ')
								})
								.append(
									$('<p>',{text:fileName}))
							)
						);
					}
				} else if(length > 1) {
					generateSearchIndex(currentObj);
				} else {
					//?Exception
					_l('?')
				}
			}
		} 
		setTimeout(() => {
			generateSearchIndex(fsIndex).then(() => {
				$('.header-search').attr('placeholder', 'Search past papers, e-books');
				$('.header-search').closest('div').removeClass('ui-state-disabled');
				$.mobile.loading( "hide" );
				console.log('done!');
			});
			$('.sr-wrapper').filterable().filterable('refresh') 
		}, 5000); 
	*/
});