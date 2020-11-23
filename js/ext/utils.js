let getTasks = (AT) => {
    $.ajax({
        url: "http://localhost:3000/users/sentinel",
        type: "POST",
        headers: {
            "Authorization": 'Bearer ' + AT
        },
        beforeSend: () => {
            $('.loader')[0].click();
        },
        success: (d) => {
            $.mobile.loading( "hide" );
            if(d.res) {
                _l(d);
                /* Populate notifications, tasks, tasks history here */
            } else {
                
            }
        }, 
        error: (e) => {
            $.mobile.loading( "hide" );
            /* Error loading tasks */
        }
    });
}, 

updateUASpecs = (user) => {
    $('.ua-specs').text(user.firstname + ' ' + user.lastname);
},

updateProfile = (d) => {
    $.ajax({
        url: "http://localhost:3000/users/updateprofile",
        type: "POST",
        data: d,
        headers: {
            "Authorization": 'Bearer ' + AT
        },
        beforeSend: () => {
            $('.loader')[0].click();
        },
        success: (d) => {
            $.mobile.loading( "hide" );
            if(d.res) {
                _l(d);
                /* Populate tasks, tasks history here */
            } else {
                
            }
        }, 
        error: (e) => {
            $.mobile.loading( "hide" );
            /* Error loading tasks */
        }
    })
};