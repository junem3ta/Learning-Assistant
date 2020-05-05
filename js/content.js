$(document).ready(function () {
    //create and load dynamic DOM content
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
        generateBasicPopup('#contributorLoginPopup', 'Contributors', 'contributorLogin', 'Contributor | Signin'));
    $('.mod-login-ctrl').append(
        generateBasicPopup('#moderatorLoginPopup', 'Moderators', 'moderatorLogin', 'Moderator | Signin'));
    $('#contributorLoginPopup, #moderatorLoginPopup').enhanceWithin().popup(); 
});