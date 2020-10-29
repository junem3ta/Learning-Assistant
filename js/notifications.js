notifications = [
    {
        "id": "signup-n",
        "name": "eRead Account",
        "title": "Get Started with a user account",
        "state": "unopened", /* label = 'new' */
        "msg": "Hey there! Are you a student at Chuka University? Create an eRead Account to get personalized settings!"
    },
    {
        "id": "contribute-n",
        "name": "Share eBooks",
        "title": "Contribute learning resources to the community",
        "state": "unopened", /* label = 'new' */
        "msg": "Do you have ebooks that you've found useful in the past, and that might be beneficial to others? Contribute and have your profile published on the <em>Hall of Fame</em>!"
    }
]


let currentTimeStamp = '',
renderNotifications = (t, notificationsObj) => {
    $('.n, .a-n').text(notifications.length);
    if(currentTimeStamp === t) {
        _l(0);
        for(let i = 0; i<notificationsObj.length; i++) {
            let n = $($('.n-tmpl')[0].content.cloneNode(true)),
            notification = notificationsObj[i];
    
            n.find('.n-name').text(notification['name']);
            n.find('.n-title').text(notification['title']);
            n.find('.n-msg').text(notification['msg']);
            n.find('.n-timestamp').html('<strong>' + new Date().toLocaleTimeString().split(' ')[0] + '</strong> ' + new Date().toLocaleTimeString().split(' ')[1]);
            $('.n-listview').append(n);
        }
    } else {
        if(notificationsObj.length > 0) {
            let listDivider = $($('.n-list-divider')[0].content.cloneNode(true));
            listDivider.find('.l-d-ts').text(t);
            listDivider.find('.ui-listview-item-count-bubble').text(notificationsObj.length);
            $('.n-listview').append(listDivider);
        }
        for(let i = 0; i<notificationsObj.length; i++) {
            let n = $($('.n-tmpl')[0].content.cloneNode(true)),
            notification = notificationsObj[i];
            n.find('li').addClass(notification['id']);
            n.find('.n-name').text(notification['name']);
            n.find('.n-title strong').text(notification['title']);
            n.find('.n-msg').text(notification['msg']);
            n.find('.n-timestamp').html('<strong>' + new Date().toLocaleTimeString().split(' ')[0] + '</strong> ' + new Date().toLocaleTimeString().split(' ')[1]);
            n.find('.del-n').attr('id', notification['id']).attr('nindex', i);
            $('.n-listview').append(n);
        }
        $('.n-listview').listview().listview('refresh');
    }
};

$(document).ready(() => {
    /* $('.n').text(notifications.length); */
    let timestamp =  new Date().toDateString();
    renderNotifications(timestamp, notifications);    
    $('.ui-listview').listview().listview('refresh');
    $(document).on('click', '.del-n', (event) => {
        $('.u-loader')[0].click();
        $('.n-listview').empty();
        notifications.splice(+$(event.target).attr('nindex'), 1);
        renderNotifications(timestamp, notifications);  
        $.mobile.loading( "hide" );
    });
});
