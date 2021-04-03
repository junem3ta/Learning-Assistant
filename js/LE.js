$(document).ready(() => {
    let qs = window.location.search.substring(1).split('=')[1];
});

//'onpopstate/hashchange' optimization.
$( window ).on( "navigate", ( event, data ) => {    
    if(data.state.direction) {
        //back/forward browser navigation events.
        let hash = window.location.hash;

        if(hash == '') {
            //home

        } else {
            //goTo(window.location.hash);
            let target = data.state.target;
            _l(target);
            //map targets to cw-ctrls to indicate active ctrl.
            if(/contributors-cw|ua-cw|uploads-cw|eb-cw|pp-cw/.test(target)) {
                resetActiveLinks();
                $('div#'+target).addClass('active-cw-ctrl');
            } else if(/n-cw|sc-cw/.test(target)) {
                // let activeSpan = target == '' ? : (target == '' ? : );
            }
            
        };
    }
});
/* $('.content-wrapper-ctrl').click(function() {
    // Only target Desktop content-wrapper-controllers
    if($(this).prop("nodeName")=="DIV") {
        resetActiveLinks();
        $(this).addClass("active-cw-ctrl");
    }
    //activate search-bar tooltip
    if($(this).attr('id') == 'sr-cw') {
        $('.header-search').closest('div').focus();
        setTimeout(() => {
            $('.header-search').focus();
        }, 10000);
        return;
    }
    //reset navigation to top of page
    $(window).scrollTop(0);
    if($('.ui-content').hasClass('ui-content-up')) {
        $('.ui-content').removeClass('ui-content-up')
        $('.home-search-wrapper').removeClass('hs-wrapper-up');
    }
    let target = $(this).attr('id');
    //on android displays;
    if(!desktopMode) {
        //display pp-cw/eb-cw static header accordingly
        target == 'pp-cw' || target == 'eb-cw' ? $('.static-hdr').show() : $('.static-hdr').hide();
        //display search option accordingly
        target == 'pp-cw' || target == 'eb-cw' ? $('.home-search-wrapper').show() : $('.home-search-wrapper').hide();
    }
    if($(this).hasClass('ua-dpl-ctrl')){
        resetActiveLinks();
        $('.cw-ctrls-wrapper #'+$(this).attr('id')).addClass('active-cw-ctrl');
    }
    //render target window
    if(currentCW == target) {
        return;
    } else {
        $('.content').removeClass('active-content-wrapper').hide();
        $('.'+target).addClass('active-content-wrapper').fadeIn();
        currentCW = target;
    }		
}); 
*/