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
			},500);
		}  else {
			/* "Switch back to Android Mode" */
			desktopMode = false;
			if($('.panel-ctrl').css('display') == 'none') {
				$(".panel-ctrl").show();
			}
		}
	}

  
	var temp = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse accumsan 	blandit fermentum. Pellentesque cursus mauris purus, auctor commodo mi ullamcorper nec. Donec semper mattis eros, nec condimentum ante sollicitudin quis. Etiam orci sem, porttitor ut tellus nec, blandit posuere urna. Proin a arcu non lacus pretium faucibus. Aliquam sed est porttitor, ullamcorper urna nec, vehicula lorem. Cras porttitor est lorem, non venenatis diam convallis congue."
		
	for(var i=0; i<20; i++) {
		//$('.content p').append(temp);
	}

	var currentCW = "pp-cw";
	$('.content-wrapper-ctrl').click(function() {
		$(window).scrollTop(0);
		var target = $(this).attr('id');
		if(currentCW == target) {
			return;
		} else {
			$('.content').hide();
			$('.'+target).fadeIn();
			currentCW = target;
		}
	});
			
	/* Explorer */
	/* for ( var a in fsIndex['root']) {
		alert(a);
	} */

});