/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
$(document).ready(function() {
	/* Default Global VARS */
	var desktopMode = false;
	var windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	var swHeight = windowHeight - 88; /* 56 + 32 (padding ) */
	/*var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); */
	var isPanelOpen = false;
	var isSearching = false;
	var currentCW = "ua-cw";
	responsiveUIHandler();

	/* Hide Android Searchbar on Scrolldown, show on Scrollup*/
	/* var didScroll; */
	var lastScrollTop = 0;
	var delta = 5;
	/* var navbarHeight = 88 */ /* 91 */ /*46 without static header *//* ; */
	$(window).scroll(function(){
		if(currentCW == "eb-cw" || currentCW == "pp-cw") {
			hasScrolled(); 
		}
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
		/* Scrolldown 
			Ref: Sticky header, w3schools.
		*/
		if(st > lastScrollTop) {
			if(window.pageYOffset > Math.ceil($('.static-hdr').offset().top)) {
				$('.home-search-wrapper').addClass('static-hdr-up');
			}	
		}
   		lastScrollTop = st;
	} 
	/*Sidepanel controllers*/
	 $(document).on('swiperight', function() {
			if(!isPanelOpen && !isSearching) {
				$('.side-panel-wrapper').animate({
					left: '0'
				});
				$('body').addClass("no-scroll");
				isPanelOpen = true;
			}
    });
	$(document).on('swipeleft',function(){
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
	});
	$('.home-search').closest('div').addClass('nomargin noshadow');
	/*Activate search mode*/
	$(document).on('focus', '.home-search', function () {
		isSearching = true;
		$(this).closest('div').addClass('noradius');
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
		currentCW == "pp-cw" ? $('.static-hdr').hide() : "";
	});
	/*Deactivate search mode*/
	$('.search-ctrl').click(function() {
		isSearching = false;
		$('.home-search').closest('div').removeClass('noradius');
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
		currentCW == "pp-cw" ? $('.static-hdr').show() : "";
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
			},5000);

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
			currentCW == 'pp-cw' || currentCW == 'eb-cw' ? $('.static-hdr').show() : $('.static-hdr').hide();
			currentCW == 'pp-cw' || currentCW == 'eb-cw' ? $('.home-search-wrapper').show() : $('.home-search-wrapper').hide();
		}
	}

	/* Disable focus styling and remove margin around search input fields*/
	$("input").closest('div').addClass('noshadowI');
	$(".header-search").closest('div').addClass('nomargin hsw-custom');

	/*remove blue outline on clicking jqm ui-input-clear button??*/
  
	/* 
		Display pp-cw/eb-cw static header accordingly 
		Display search option accordingly
		Reset _GLOBAL VAR_ currentCW to "pp-cw" and delete the following when deploying.
	*/

	currentCW == 'pp-cw' || currentCW == 'eb-cw' ? $('.static-hdr').show() : $('.static-hdr').hide();
	currentCW == 'pp-cw' || currentCW == 'eb-cw' ? $('.home-search-wrapper').show() : $('.home-search-wrapper').hide();

	$('.content-wrapper-ctrl').click(function() {
		//reset navigation to top of page
		$(window).scrollTop(0);
		if($('.ui-content').hasClass('ui-content-up')) {
			$('.ui-content').removeClass('ui-content-up')
			$('.home-search-wrapper').removeClass('hs-wrapper-up');
		}
		var target = $(this).attr('id');
		//on android displays;
		if(!desktopMode) {
			//display pp-cw/eb-cw static header accordingly
			target == 'pp-cw' || target == 'eb-cw' ? $('.static-hdr').show() : $('.static-hdr').hide();
			//display search option accordingly
			target == 'pp-cw' || target == 'eb-cw' ? $('.home-search-wrapper').show() : $('.home-search-wrapper').hide();
		}
		
		/*Only target Desktop content-wrapper-controllers*/
		if($(this).prop("nodeName")=="DIV") {
			$('.content-wrapper-ctrl').removeClass('active-cw-ctrl');
			$('.sub-nav div a').removeClass('active-sn-ctrl');
			$(this).addClass("active-cw-ctrl");
		}

		if($(this).hasClass('ua-dpl-ctrl')){
			$('.content-wrapper-ctrl').removeClass('active-cw-ctrl');
			$('.sub-nav div a').removeClass('active-sn-ctrl');
			$('.cw-ctrls-wrapper #ua-cw').addClass('active-cw-ctrl');
		}

		if(currentCW == target) {
			return;
		} else {
			$('.content').hide();
			$('.'+target).fadeIn();
			currentCW = target;
		}		
	});

	$(document).on('click','.sub-nav div a',function() {
		$('.content-wrapper-ctrl').removeClass('active-cw-ctrl');
		$('.sub-nav div a').removeClass('active-sn-ctrl');
		$(this).addClass("active-sn-ctrl");
	});

	$("#modrLogin, #contributorLogin").submit(function(){
		return false;
	});

	var tmp = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse accumsan blandit fermentum. Pellentesque cursus mauris purus, auctor commodo mi ullamcorper nec. Donec semper mattis eros, nec condimentum ante sollicitudin quis. Etiam orci sem, porttitor ut tellus nec, blandit posuere urna. Proin a arcu non lacus pretium faucibus. Aliquam sed est porttitor, ullamcorper urna nec, vehicula lorem. Cras porttitor est lorem, non venenatis diam convallis congue.";
	for (let i = 0; i < 5; i++) {
		$(".side-panel p").append(tmp + "<br>");	
	}
});