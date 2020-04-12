$(document).ready(function() {
	/* Default Global VARS */
	var desktopMode = false;
	var windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	var swHeight = windowHeight - 88; /* 56 + 32 (padding ) */
	/*var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); */
	var isPanelOpen = false;
	var isSearching = false;
	responsiveUIHandler();

	/* Hide Android Searchbar on Scrolldown, show on Scrollup*/
	var didScroll;
	var lastScrollTop = 0;
	var delta = 5;
	var navbarHeight = 91 /*46 without static header */;
	$(window).scroll(function(){
		hasScrolled(); 
		//didScroll = true;
	});
	/* setInterval(function() {if (didScroll && !isSearching) {hasScrolled();didScroll = false;}}, 250); */
	function hasScrolled() {
		var st = $(this).scrollTop();
		if(Math.abs(lastScrollTop - st) <= delta) { 
			return;
		} 
		/* Scrollup*/
		if (st < lastScrollTop) {
			if(st < 5 && $('.home-search-wrapper').hasClass('hs-wrapper-up')) {
				$('.home-search-wrapper').removeClass('hs-wrapper-up');
				$('.ui-content').removeClass('ui-content-up');
        		$('.panel-ctrl-wrapper').removeClass('pcw-up');
			} else if(st < 46 && $('.home-search-wrapper').hasClass('static-hdr-up')) {
				$('.home-search-wrapper').removeClass('static-hdr-up');
			} else if (st > 46 && !$('.home-search-wrapper').hasClass('hs-wrapper-up')){
				$('.home-search-wrapper').removeClass('static-hdr-up');
				$('.home-search-wrapper').addClass('hs-wrapper-up');
          $('.panel-ctrl-wrapper').addClass('pcw-up');
				$('.ui-content').addClass('ui-content-up');
			}
		}
		/* Scrolldown */
		if(st > lastScrollTop) {
			if(window.pageYOffset > Math.ceil($('.static-hdr').offset().top)) {
				$('.home-search-wrapper').addClass('static-hdr-up');
			}	
		}
   		lastScrollTop = st;
	} 
	/*Sidepanel controllers*/
	 $(document).on('swiperight', function(e) {
			if(!isPanelOpen && !isSearching) {
				$('.side-panel-wrapper').animate({
					left: '0'
				});
				$('body').addClass("no-scroll");
				isPanelOpen = true;
			}
    });
	$(document).on('swipeleft',function(e){
		if(isPanelOpen) {
			$('.side-panel-wrapper').animate({
				left: '-100%'
			});
			isPanelOpen = false;
			$('body').removeClass("no-scroll");
		}
	});
	/* Sidepanel toggle button | Collapse sidepanel on clicking outside of it */
	$('.panel-ctrl').click(function (){
		if(!isPanelOpen) {
			$('.side-panel-wrapper').animate({
				left: '0'
			});
			isPanelOpen = true;
			$('body').addClass("no-scroll");
		}
	});
	$(document).click(function(event) {
		/* collapse if clickevent target is outside of android sidepanel */
		if(isPanelOpen) {
			if($(event.target).closest('.side-panel').length == 0
					&& !$(event.target).hasClass('panel-ctrl')
					) {
				$('.side-panel-wrapper').animate({
					left: '-100%'
				});
				isPanelOpen = false;
				$('body').removeClass("no-scroll");
			}
		}
		/* 
		**
		  move outside of click event to reimplement
			$(document).on("focus",".header-search", function() {
				$(this).closest('div').addClass('noshadowI');
			});
		**
		if(desktopMode) {
			if($(event.target).closest('.header-search').length == 0) {
				$(".header-search").closest('div').removeClass('noshadowI');
			}
		} */
		
	});
	/*Activate search mode*/
	$(document).on('focus', '.home-search', function () {
		isSearching = true;
		$(this).closest('div').addClass('noshadow');
		$('.home-search-wrapper').addClass('hs-wrapper-search-mode');
		$('.hs-wrapper-search-mode').css({'height': windowHeight});
		$('.search-window').css({'height': swHeight});
		$('.ui-content').addClass('ui-content-search-mode');
		$('.panel-ctrl-wrapper').addClass('pc-wrapper-search-mode');
		$('.home-search').addClass('hs-search-mode');
		$('.panel-ctrl').hide();
		$('.search-ctrl').show();
		$('.search-window').show();
		$('body').addClass("no-scroll");
		$('.static-hdr').hide();
	});
	/*Deactivate search mode*/
	$('.search-ctrl').click(function() {
		isSearching = false;
		$('.home-search').closest('div').removeClass('noshadow');
		$('.home-search-wrapper').removeClass('hs-wrapper-search-mode');
		//$('.home-search-wrapper').css({'height': 54});
		//$('.home-search-wrapper').css("cssText", "height: auto !important;");
		$('.home-search-wrapper').attr('style', 'height: auto !important;');
		$('.ui-content').removeClass('ui-content-search-mode');
		$('.panel-ctrl-wrapper').removeClass('pc-wrapper-search-mode');
		$('.home-search').removeClass('hs-search-mode');
		$('.search-ctrl').hide();
		$('.search-window').hide();
		$('body').removeClass("no-scroll");
		$('.static-hdr').show();
		if(!desktopMode) {
			$('.panel-ctrl').show();
		}
	});

	/* Detect resize and apply appropriate responsive styles */
	$(window).resize(function() {
		responsiveUIHandler();
	});
	function responsiveUIHandler() {
		if($('.side-panel-wrapper').css('display') == 'none') {
			/* "Switch to Desktop Mode" */
			desktopMode = true;

			$('.content-wrapper').attr('style', 'padding-bottom: 0 !important;');
			setTimeout(function() {
				$('.content-wrapper').attr('style', 'padding-bottom: 0 !important;');
			},1000);

			if(isSearching) {
				isSearching = false;
				$('.home-search').closest('div').removeClass('noshadow');
				$('.home-search-wrapper').removeClass('hs-wrapper-search-mode');
				$('.home-search-wrapper').attr('style', 'height: auto !important;');
				$('.ui-content').removeClass('ui-content-search-mode');
				$('.panel-ctrl-wrapper').removeClass('pc-wrapper-search-mode');
				$('.home-search').removeClass('hs-search-mode');
				$('.search-ctrl').hide();
				$('.search-window').hide();
				$('body').removeClass("no-scroll");
				$('.static-hdr').show();
			}
			if(isPanelOpen) {
				$('.side-panel-wrapper').animate({
					left: '-100%'
				});
				isPanelOpen = false;
				$('body').removeClass("no-scroll");
			}
		}  else {
			/* "Switch back to Android Mode" */
			desktopMode = false;
			if($('.panel-ctrl').css('display') == 'none') {
				$(".panel-ctrl").show();
			}
		}
	}

	$(".header-search").closest('div').addClass('noshadowI');
	/*remove blue outline on clicking jqm ui-input-clear button*/
  
	var temp = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse accumsan 	blandit fermentum. Pellentesque cursus mauris purus, auctor commodo mi ullamcorper nec. Donec semper mattis eros, nec condimentum ante sollicitudin quis. Etiam orci sem, porttitor ut tellus nec, blandit posuere urna. Proin a arcu non lacus pretium faucibus. Aliquam sed est porttitor, ullamcorper urna nec, vehicula lorem. Cras porttitor est lorem, non venenatis diam convallis congue."
		
	for(var i=0; i<20; i++) {
		//$('.content p').append(temp);
	}

	var currentCW = "pp-cw";
	$('.content-wrapper-ctrl').click(function() {
		$(window).scrollTop(0);
		var target = $(this).attr('id');

		/*Only target Desktop content-wrapper-controllers*/
		if($(this).prop("nodeName")=="DIV") {
			$('.content-wrapper-ctrl').removeClass("active-cw-ctrl");
			$(this).addClass("active-cw-ctrl");
		}

		if(currentCW == target) {
			return;
		} else {
			$('.content').hide();
			$('.'+target).fadeIn();
			currentCW = target;
		}		
	});
			
	/* Explorer */
	/* 
		ECL = Explorer Container Level 
		ecw = explorer-container-wrapper
	*/

	fsIndex = fsIndex['root'];
	currentECLSuffix = 1;
	currentPath = 'root';
	
	function renderECL1() {
		/* Generate root folders */
		var eCL1 = $('<div>',{class:'ecw ecl1'});
		$('.explorer').append(eCL1);
		/* Loop through root obj and print folder icons */
		for(var entry in fsIndex) {
			var folderId = entry;
			var folderClass = 'folder-icon';
			/* create folder-tile-wrapper and append folder-tile. add folder-tile-wrapper to ecl1 in explorer */
			var ftw = $('<div>',{class:'folder-tile-wrapper'});
			ftw.append($('<div>',{id:folderId,class:folderClass}).append($('<p>',{text:entry})));
			$('.ecl1').append(ftw);			
		}
	}
	renderECL1(fsIndex);

	/* Generic folder-icon click event for all folders */
	$('.explorer').on('click', '.folder-icon', function() {
		var currentECL = 'ecl' + currentECLSuffix;
		console.log('currentECL : ',currentECL);
		/* Get object-key that the folder icon refers to */
		var targetId = $(this).attr('id');
		console.log('OpenFolder Event on : ',targetId);
		/* Clear explorer window */
		$('.'+currentECL).hide();
		console.log('Clearing explorer window');
		/* Update ecl level */
		currentECLSuffix ++;
		var nextECL = 'ecl' + currentECLSuffix;
		console.log("Updated to nextECL : " + nextECL);

		/* parse targetId (fsIndex Obj keys) and generate nextFsIndexObject*/
		if(targetId == 'BUST' || targetId == 'FSET' || targetId == 'FAHU' || targetId == 'FAES' || targetId == 'FRED') {
			var nextIndexObj = fsIndex[targetId];
			var folderName = targetId;
		} else {
			/* FSET-2014-2015 */
			var pathArray = targetId.split('_');
			var folderName = pathArray[pathArray.length-1];
			var tempIndexObj = fsIndex;
			for(var i=0; i<pathArray.length; i++) {
				tempIndexObj = tempIndexObj[pathArray[i]];
			}
			var nextIndexObj = tempIndexObj;
		}
		
		console.log('Path section text | Folder name, ',folderName);
		console.log('TargetId ', targetId,'. Next Index Object : ',nextIndexObj);
		/* Append delimeter to explorer-navigation */
		var newDelimeter = ($('.tmp-path-delimeter').clone())
		.removeClass('tmp-path-delimeter')
		.attr('id',currentECL+'-p-s-dlm')
		.addClass(currentECL+'-p-s-dlm path-delimeter');
		/* Append history pointer to current-path-section */
		/* How to change attr of dynamically generated element jQuery */
		$('.'+currentPath+'-path-section').attr('id',currentECL).addClass('path-section-w-h path-section-link');
		/* Update currentPath */
		currentPath += '_' + folderName;
		console.log('Updated current path to : ',currentPath);
		/* Append new-path-section to explorer-navigation */
		var newPathSection = ($('.tmp-path-section').clone())
		.removeClass('tmp-path-section')
		.addClass(currentPath+'-path-section '+'path-section')
		.text(folderName);
		$('.explorer-navigation').append(newDelimeter);
		$('.explorer-navigation').append(newPathSection);

		if(nextIndexObj['__files__']!=undefined && Object.keys(nextIndexObj).length == 2) {
			/* Print Files */
			console.log('print files');
		} else if(Object.keys(nextIndexObj).length!=0) {
			$('.explorer').append($('<div>',{class:'ecw '+nextECL}));
			for(var entry in nextIndexObj) {
				/* Changed targetId delimeter from - to _ due to conflicts in fsIndex folder names eg. FSET-2014-2015 */
				var folderId = targetId + '_' + entry;
				var folderClass = 'folder-icon';
				$('.'+nextECL).append(
					$('<div>',{class:'folder-tile-wrapper'})
					.append(
						$('<div>',{id:folderId,class:folderClass})
						.append(
							$('<p>',{text:entry})
						)
					)
				);
			}
		} else {
			console.log('No files found in current folder.');
		}
	});

	/* Generic path-section-link for all path-sections */
	$('.explorer-navigation').on('click', '.path-section-link', function() {
		var currentECL = 'ecl' + currentECLSuffix;
		/* Display previous ecl wrapper */
		$('.ecw').hide();
		console.log('Hiding current-ecl ', currentECLSuffix);
		/* Obtain history pointer from previous path-section */
		targetId = $(this).attr('id');
		/* Clean up ecl containers upto the current-path-section-link */
		start = targetId.split('');
		start = +start[start.length-1]; /* 1,3; offset = 3 - 1 */
		end = currentECLSuffix;
		offset = end - start;
		console.log('start, ',start,'start+1, ',start+1,'end, ',end,'offset, ',offset);
		for(var i=start+1; i<=end; i++) {/* 1,3; 2, */
			tmp = 'ecl' + i;
			console.log('Cleaner Today Tomorrow: Removing ecl',i);
			$('.'+tmp).remove();
		}
		$('.'+targetId).show();
		console.log('Target path-section : ',targetId,' CurrentECLSuffix : ',end,' Offset : ',offset)
		currentECLSuffix -= offset;
		/* Update currentPath */
		currentPath = currentPath.split('_');
		currentPath.splice(currentPath.length-1,1);
		if(currentPath.length>1) {
			currentPath = currentPath.join('_');
		} else {
			currentPath = currentPath.join('');
		}
		console.log('Modified (-) currentPath : ',currentPath);
		/* clean up explorer-navigation divs */
		var pathIndex = $(this).index();
		var explorerElements = $('.path').children().length;
		for(var i=pathIndex+1; i<explorerElements; i++) {
			console.log('Update Explorer-navigation. Removing element',i);
			$('.path').children().eq(i).remove();
			explorerElements--;
			i--;
		}
	});
});