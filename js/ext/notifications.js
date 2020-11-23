let generateNotifications = (user, tasks) {
    let tasks = taskshistory = [];
    for(let i = 0; i < tasks.length; i++) {
        if(tasks[i].active) {
            tasks.push(tasks[i]);
        } else {
            taskshistory.push(tasks[i]);
        }

        if(i === tasks.length - 1) {
             
        }
    }
    return notifications = [
        {
            "id": "tasks-n",
            "name": "My Tasks",
            "title": "You have " + tasks.length + "notifications",
            "state": "unopened", /* label = 'new' */
            "msg": "Hey there! Are you a student at Chuka University? Create an eRead Account to get personalized settings!"
        }
    ]
}



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
