/* eslint-disable no-undef */
$(document).ready(function () {
    /*Create and load dynamic DOM content*/
    /* 
        @generateBasicPopup helper fn
        creates markup for JQM 1.5.0 popup windows.    
    */
    function generateBasicPopup(a, b, c, d, e) {
        var popup = $($('.popupbasic-template')[0].content.cloneNode(true));
        popup.find('a').attr('href', a).text(b);
        a = a.split('#')[1];
        $(popup.find('div')[0]).attr('id', a);
        popup.find('form').attr('id', c);
        popup.find('h3').text(d);
        return popup;
    }

    $('.contributors-login-ctrl').append(
        generateBasicPopup('#contributorLoginPopup', 'Contributor', 'contributorLogin', 'Contributor | Signin'));
    $('.modr-login-ctrl').append(
        generateBasicPopup('#moderatorLoginPopup', 'Moderator', 'moderatorLogin', 'Moderator | Signin'));
    $('#contributorLoginPopup, #moderatorLoginPopup').enhanceWithin().popup(); 
});