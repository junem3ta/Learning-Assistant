/* eRead Bot */
let user = null;
$(document).ready(() => {
    /* Sessions */
    /* Accounts */
    let 
        /* Login Credentials, LC */
        unEl = $('.un'),
        pwEl = $('.pw'),
        /* Registration Fields, RF */
        fnEl = $('.c-u-fn'),
        lnEl = $('.c-u-ln'),
        cuunEl = $('.c-u-un'),
        emailEl = $('.c-u-email'),
        /* Recover Account fields, RAF */
        rAEmail = $('.r-a-email'),
        markAsErroneous = (el) => {
            el.closest('div').addClass('aux-input-error');
        },
        priorLCErrors = false,
        priorRFErrors = false,
        priorRAFErrors = false;
    const
        isAN /* AlphaNumeric Test */ = /^[a-zA-Z0-9]+$/,
        isText = /^[a-zA-Z'.]+$/,
        rfc2822Email = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
        verifyLC = (un, pw) => {
            let valid = true;
            if(un == '' || isAN.test(un) === false) {
                markAsErroneous(unEl);
                valid = false;
            }
            if(pw == '') {
                markAsErroneous(pwEl);
                valid = false;
            }
            priorErrors = valid ? false : true;
            return valid ? true : false;
        },
        verifyRF = (fn, ln, un, email) => {
            let valid = true;
            if(fn == '' || isText.test(fn) === false) {
                markAsErroneous(fnEl);
                valid = false;
            }
            if(ln == '' || isText.test(ln) === false) {
                markAsErroneous(lnEl);
                valid = false;
            }
            if(un == '' || isAN.test(un) === false || un.length < 4) {
                markAsErroneous(cuunEl);
                valid = false;
            }
            if(email == '' || rfc2822Email.test(email) === false) {
                markAsErroneous(emailEl);
                valid = false;
            }
            priorRFErrors = valid ? false : true;
            return valid ? true : false;
        },
        verifyRAF = (email) => {
            let valid = true;
            if(email == '' || !rfc2822Email.test(email)) {
                markAsErroneous(rAEmail);
                priorRAFErrors = true;
                return false;
            }   
            return true;
        },
        resetErrNotification = (elements) => {
            for(let i=0; i<elements.length; i++) {
                if(elements[i].closest('div').hasClass('aux-input-error')) {
                    elements[i].closest('div').removeClass('aux-input-error');
                }
            }
		},
		updateuASpecs = (user) => {
			notifications.splice(0, 1);
			renderNotifications(new Date().toDateString(), notifications);

			let fullname = user.firstname + ' ' + user.lastname,
			fnInitial = user.firstname.split('')[0];

			$('.sub-nav').remove();
			$('.cw-ctrls-wrapper #ua-cw p').text('My Account');
			$('.ua-ctrl-icon').removeClass('fas fa-user-circle').text(fnInitial).addClass('u-fn-i');
			$('.ua-ctrl-hdr span').attr('aria-label', fullname);
			$('.login-ctrls-hdr').attr('aria-label', 'My Account');
			$('.login-ctrls-hdr i').removeClass('fa-user-plus').addClass('fa-user');
			$('.ua-login-ctrls .login-ctrl, .ua-login-ctrls .register-ctrl').remove();
			$('.ua-login-ctrls').append($('<div>', {class: 'u-fn'}).append($('<p>').text(fullname)));
			$('.ua-details h4').text('Logged In');
			$('.u-n-ph').text(user.username);
			$('.udID p').text(fullname);
			$('.ua .ui-block-b').remove();
		};
    $('.v-u').click(() => {
        priorLCErrors ? resetErrNotification([unEl, pwEl]) : '';
        if(verifyLC($.trim(unEl.val()), $.trim(pwEl.val()))) {
           	let breadcrumbs = {
                "username": $.trim(unEl.val()),
                "password": $.trim(pwEl.val())
			};
			_l('[vu]', breadcrumbs);
            /* Ajax Call here */
          	$.ajax({
				url: "http://localhost:3000/users/login",
				type: "POST",
				data: breadcrumbs,
				beforeSend:function() {
					$('.v-u-log span.p-h').text('Operation in progress');
					$('.v-u-log').addClass('bg-loading');
					$('.v-u').prop('disabled', true);
					$('.v-u-log').show();
				},
				success: (userObj) => {
					if(userObj.verified) {
						user = userObj;
						$('.v-u-log').removeClass('bg-loading').addClass('bg-success');
						$('.v-u-log .fa-spinner').hide();
						$('.v-u-log span.p-h').text(user.msg);
						if(user.lhBound) {
							/* Redirect here */
							lht = user.token;
							_l('lhBound', lht);
							setTimeout(() => {
                                window.location.href="http://127.0.0.1:5501/ext/lighthouse/index.html?AT=" + user.token;
                            }, 10000);
						} else {
							/* Update ua-specs Here */
							_l('Update ua Specs', user);
							updateuASpecs(user);
							setTimeout(() => {
								$('#loginPopup').popup('close');
							}, 5000);
						}
					} else {
						_l('401', userObj);
						$('.v-u-log').removeClass('bg-loading').addClass('bg-error');
						$('.v-u-log .fa-spinner').hide();
						$('.v-u-log span.p-h').text(userObj.msg);
					}
					setTimeout(() => {
						$('.v-u-log').hide();
						$('.v-u-log .fa-spinner').css({display: 'inline-block'});
						$('.v-u-log').removeClass('bg-success').removeClass('bg-error').addClass('bg-loading');
						$('.v-u').prop('disabled', false);
					}, 10000);
				},
				error: (e) => {
					console.log(e);
					$('.v-u-log').removeClass('bg-loading').addClass('bg-error');
					$('.v-u-log .fa-spinner').hide();
					$('.v-u-log span.p-h').text(e.status + ': ' + e.statusText);
					setTimeout(() => {
						$('.v-u-log').hide();
						$('.v-u-log .fa-spinner').css({display: 'inline-block'});
						$('.v-u-log').removeClass('bg-error').addClass('bg-loading');
						$('.v-u').prop('disabled', false);
					}, 10000);
				} 
			});
        }
        return false;
    });
    $('.c-u').click(() => {
        priorRFErrors ? resetErrNotification([fnEl, lnEl, cuunEl, emailEl]) : '';
        if(verifyRF($.trim(fnEl.val()), $.trim(lnEl.val()), $.trim(cuunEl.val()), $.trim(emailEl.val()))) {
            let breadcrumbs = {
                "username": $.trim(cuunEl.val()),
                "firstname": $.trim(fnEl.val()),
                "lastname": $.trim(lnEl.val()),
                "email": $.trim(emailEl.val()),
			},
			codeDesc = {
				'dplUsername': 'Username already taken!',
				'dplEmail': 'Email already registered! Sorry, that email address is already registered. If you already have an eRead account, try Signing in.'
			};
            _l('[cu]', breadcrumbs);
            /* Ajax Call here */
          	$.ajax({
				url: "http://localhost:3000/users/presignup",
				type: "POST",
				data: breadcrumbs,
				beforeSend:function() {
					$('.c-u-log span.p-h').text('Operation in progress');
					$('.c-u-log').addClass('bg-loading');
					$('.c-u').prop('disabled', true).addClass('not-allowed');
					$('.c-u-log').show();
				},
				success: (res) => {
					console.log(res, _o(res));
					if(res.res === 'activate') { 
						$('.c-u-log').removeClass('bg-loading').addClass('bg-success');
						$('.c-u-log .fa-spinner').hide();
						$('.c-u-log span.p-h').text(res.msg);
					} else {
						$('.c-u-log').removeClass('bg-loading').addClass('bg-error');
						$('.c-u-log .fa-spinner').hide();
						$('.c-u-log span.p-h').text(codeDesc[res.ERR]);
					}
					setTimeout(() => {
						$('.c-u-log').hide();
						$('.c-u-log .fa-spinner').css({display: 'inline-block'});
						$('.c-u-log').removeClass('bg-success').removeClass('bg-error').addClass('bg-loading');
						$('.c-u').prop('disabled', false).removeClass('not-allowed');
					}, 10000);
				},
				error: (e) => {
					console.log(e, e.responseText);
					$('.c-u-log').removeClass('bg-loading').addClass('bg-error');
					$('.c-u-log.fa-spinner').hide();
					$('.c-u-log span.p-h').text(e.status + ': ' + e.statusText);
					setTimeout(() => {
						$('.c-u-log').hide();
						$('.c-u-log .fa-spinner').css({display: 'inline-block'});
						$('.c-u-log').removeClass('bg-error').addClass('bg-loading');
						$('.c-u').prop('disabled', false).removeClass('not-allowed');
					}, 10000);
				} 
			});
        }
        return false;
    });
    $('.r-a').click(() => {
        priorRAFErrors ? resetErrNotification([rAEmail]) : '';
        _l(0);
        if(verifyRAF($.trim(rAEmail.val()))) {
            _l(1);
            breadcrumbs = {
                "email": $.trim(rAEmail.val()),
            }
            _l('[ra]', breadcrumbs);
            /* Ajax Call here */
          	$.ajax({
				url: "http://localhost:3000/users/",
				type: "POST",
				data: breadcrumbs,
				beforeSend:function() {
					$('.r-a-log span.p-h').text('Operation in progress');
					$('.r-a-log').addClass('bg-loading');
					$('.r-a').prop('disabled', true);
					$('.r-a-log').show();
				},
				success: (res) => {
					if(res.res === 'success') { 
						$('.r-a-log').removeClass('bg-loading').addClass('bg-success');
						$('.r-a-log .fa-spinner').hide();
						$('.r-a-log span.p-h').text(res.msg);
					} else {
						$('.r-a-log').removeClass('bg-loading').addClass('bg-error');
						$('.r-a-log .fa-spinner').hide();
						$('.r-a-log span.p-h').text(res.msg);
					}
					setTimeout(() => {
						$('.r-a-log').hide();
						$('.r-a-log .fa-spinner').css({display: 'inline-block'});
						$('.r-a-log').removeClass('bg-success').addClass('bg-loading');
						$('.r-a').prop('disabled', false);
					}, 10000);
				},
				error: (e) => {
					console.log(e, e.responseText);
					$('.r-a-log').removeClass('bg-loading').addClass('bg-error');
					$('.r-a-log.fa-spinner').hide();
					$('.r-a-log span.p-h').text(e.status + ': ' + e.statusText);
					setTimeout(() => {
						$('.r-a-log').hide();
						$('.r-a-log .fa-spinner').css({display: 'inline-block'});
						$('.r-a-log').removeClass('bg-error').addClass('bg-loading');
						$('.r-a').prop('disabled', false);
					}, 10000);
				} 
			});
        }
        return false;
    });
    /* Notifications */
});