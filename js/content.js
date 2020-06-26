/* eslint-disable no-undef */
$(document).ready(function () {
    /*Create and load dynamic DOM content*/
    /* 
        @generateBasicPopup helper fn
        creates markup for JQM 1.5.0 popup windows.    
    */
    function generateBasicPopup(a, b, c, d) {
        var popup = $($('.popupbasic-template')[0].content.cloneNode(true));
        popup.find('a').attr('href', a).text(b);
        a = a.split('#')[1];
        $(popup.find('div')[0]).attr('id', a);
        popup.find('form').attr('id', c);
        popup.find('h3').text(d);
        return popup;
    }

    $('.contributors-login-ctrl, .contributors-aux-lc').append(
        generateBasicPopup('#contributorLoginPopup', 'Contributor', 'contributorLogin', 'Contributor | Signin'));
    $('.modr-login-ctrl, .moderators-aux-lc').append(
        generateBasicPopup('#moderatorLoginPopup', 'Moderator', 'moderatorLogin', 'Moderator | Signin'));
    $('#contributorLoginPopup, #moderatorLoginPopup').enhanceWithin().popup(); 

    for(let i=0; i<3; i+=2) {
        /* add unique id to side panel sub-nav login controls */
       $($('.sub-nav div').children()[i]).attr('id','sn-ctrl-'+i);
       /* add similar class to both login controls on ua UI */
       if(i==0) {
           $($('.modr-login-ctrl').children()[i]).addClass('popup-dpl-ctrl');
           $($('.contributors-login-ctrl').children()[i]).addClass('popup-dpl-ctrl');
           $($('.modr-login-ctrl').children()[i]).addClass('sn-ctrl-0');
           $($('.contributors-login-ctrl').children()[i]).addClass('sn-ctrl-2');
       }
    }
});