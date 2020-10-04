/* eRead Bot */
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
        markAsErroneous = (el) => {
            el.closest('div').addClass('aux-input-error');
        },
        priorLCErrors = false,
        priorRFErrors = false;
    const
        isAN /* AlphaNumeric Test */ = /^[a-zA-Z0-9]+$/,
        isText = /^[a-zA-Z']+$/,
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
        resetErrNotification = (elements) => {
            for(let i=0; i<elements.length; i++) {
                if(elements[i].closest('div').hasClass('aux-input-error')) {
                    elements[i].closest('div').removeClass('aux-input-error');
                }
            }
        };
    $('.v-u').click(()=> {
        priorLCErrors ? resetErrNotification([unEl, pwEl]) : '';
        if(verifyLC($.trim(unEl.val()), $.trim(pwEl.val()))) {
            breadcrumbs = {
                "un": $.trim(unEl.val()),
                "pw": $.trim(pwEl.val())
            }
            /* Ajax Call here */
        }
        return false;
    });
    $('.c-u').click(()=> {
        priorRFErrors ? resetErrNotification([fnEl, lnEl, cuunEl, emailEl]) : '';
        if(verifyRF($.trim(fnEl.val()), $.trim(lnEl.val()), $.trim(cuunEl.val()), $.trim(emailEl.val()))) {
            breadcrumbs = {
                "fn": $.trim(fnEl.val()),
                "ln": $.trim(lnEl.val()),
                "un": $.trim(cuunEl.val()),
                "email": $.trim(emailEl.val()),
            }
            /* Ajax Call here */
        }
        return false;
    });
    /* Notifications */
});