$(document).ready(() => {
    $("input").closest('div').addClass('noshadowI');
    $( document ).on( "click", ".show-page-loading-msg", function() {
		var $this = $( this ),
			theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
			msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
			textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
			textonly = !!$this.jqmData( "textonly" );
			html = $this.jqmData( "html" ) || "";
		$.mobile.loading( "show", {
				text: msgText,
				textVisible: textVisible,
				theme: theme,
				textonly: textonly,
				html: html
		});
	})
	.on( "click", ".hide-page-loading-msg", function() {
		$.mobile.loading( "hide" );
    });

    let bc = window.location.search.substring(1).split('&')[0];
    if(bc.split('=')[0] == 'breadcrumb') {
        $('.loader')[0].click();
        $('.pw-init')[0].click();
        $.mobile.loading( "hide" );
        bc = bc.split('=')[1]
        $('.ua-specs').text(bc);

        let 
            pwEl = $('.pw'),
            pwcEl = $('.pw-c'),
            priorErrors = false,
            markAsErroneous = (el) => {
                el.closest('div').addClass('input-error');
            },
            verifyPC = (pw, pwc) => {
                let valid = true;
                if(pw == '' || pw.length < 6) {
                    markAsErroneous(pwEl);
                    valid = false;
                }
                if(pwc == '' || pwc.length < 6) {
                    markAsErroneous(pwcEl);
                    valid = false;
                }
                if(pwc !== pw) {
                    markAsErroneous(pwEl);
                    markAsErroneous(pwcEl);
                    valid = false;
                }
                priorErrors = valid ? false : true;
                return valid ? true : false;
            },
            resetErrNotification = (elements) => {
                for(let i=0; i<elements.length; i++) {
                    if(elements[i].closest('div').hasClass('input-error')) {
                        elements[i].closest('div').removeClass('input-error');
                    }
                }
            };

        $('.c-p').click(() => {
            console.log('cp');
            priorErrors ? resetErrNotification([pwEl, pwcEl]) : '';
            console.log('Verifying: ', $.trim(pwEl.val()), $.trim(pwcEl.val()));
            if(verifyPC($.trim(pwEl.val()), $.trim(pwcEl.val()))) {
                let breadcrumbs = {
                    "id": bc,
                    "pwd": $.trim(pwEl.val())
                };
                console.log('[cp]', breadcrumbs);
                /* Ajax Call here */ 
                $.ajax({
                    url: "http://localhost:3000/users/signup",
                    type: "POST",
                    data: breadcrumbs,
                    beforeSend: () => {
                        $('.p-init-log span.p-h').text('Operation in progress');
                        $('.c-p').prop('disabled', true);
                        $('.p-init-log').show();
                    },
                    success: (res) => {
                        if(res.res) { 
                            $('.p-init-log').removeClass('bg-loading').addClass('bg-success');
                            $('.p-init-log .fa-spinner').hide();
                            $('.p-init-log span.p-h').text(res.msg);
                            /* Redirect here */
                            setTimeout(() => {
                                window.location.href="http://127.0.0.1:5501/index.html?lightfoldto=login";
                            }, 10000);
                        } else {
                            $('.p-init-log').removeClass('bg-loading').addClass('bg-error');
                            $('.p-init-log .fa-spinner').hide();
                            $('.p-init-log span.p-h').text(res.ERR);
                        }
                        setTimeout(() => {
                            $('.p-init-log').hide();
                            $('.p-init-log .fa-spinner').css({display: 'inline-block'});
                            $('.p-init-log').removeClass('bg-success').removeClass('bg-error').addClass('bg-loading');
                            $('.c-p').prop('disabled', false);
                        }, 10000);
                    },
                    error: (e) => {
                        console.log(e, e.responseText);
                        $('.p-init-log').removeClass('bg-loading').addClass('bg-error');
                        $('.p-init-log .fa-spinner').hide();
                        $('.p-init-log span.p-h').text(e.status + ': ' + e.statusText);
                        setTimeout(() => {
                            $('.p-init-log').hide();
                            $('.p-init-log .fa-spinner').css({display: 'inline-block'});
                            $('.p-init-log').removeClass('bg-error').addClass('bg-loading');
                            $('.c-p').prop('disabled', false);
                        }, 10000);
                    } 
                });
            }
            return false;
        });
    } else {
        $('.ua-specs').text('null');
    }
});