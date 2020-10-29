/* eRead Bot */
let lht = null;

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
            if(un == '' || isAN.test(un) === false) {
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
        };
    $('.v-u').click(() => {
        priorLCErrors ? resetErrNotification([unEl, pwEl]) : '';
        if(verifyLC($.trim(unEl.val()), $.trim(pwEl.val()))) {
            breadcrumbs = {
                "un": $.trim(unEl.val()),
                "pw": $.trim(pwEl.val())
            }
            $('.v-u').prop('disabled', true);
            $('.v-u-log span.p-h').text('Operation in progress');
            $('.v-u-log').addClass('bg-loading');
            /* Ajax Call here */
           
            setTimeout(() => {
                $('.v-u').prop('disabled', false);
            }, 5000);
        }
        return false;
    });
    $('.c-u').click(() => {
        priorRFErrors ? resetErrNotification([fnEl, lnEl, cuunEl, emailEl]) : '';
        if(verifyRF($.trim(fnEl.val()), $.trim(lnEl.val()), $.trim(cuunEl.val()), $.trim(emailEl.val()))) {
            breadcrumbs = {
                "fn": $.trim(fnEl.val()),
                "ln": $.trim(lnEl.val()),
                "un": $.trim(cuunEl.val()),
                "email": $.trim(emailEl.val()),
            }
            $('.c-u').prop('disabled', true);
            $('.c-u-log span.p-h').text('Operation in progress');
            $('.c-u-log').addClass('bg-loading');
            /* Ajax Call here */
            setTimeout(() => {
                $('.c-u').prop('disabled', false);
            }, 5000);
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
            $('.r-a').prop('disabled', true);
            $('.r-a-log span.p-h').text('Operation in progress');
            $('.r-a-log').addClass('bg-loading');
            /* Ajax Call here */
            setTimeout(() => {
                $('.r-a').prop('disabled', false);
            }, 5000);
        }
        return false;
    });
    /* Notifications */
});