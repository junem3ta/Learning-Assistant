_files = '';
/* eslint-disable no-undef */
/* eBooks Upload Processing */
let 
    aSGuide = {
        'fc': 'selecting the appropriate option under the <em>Faculty</em> label.',
        'dpt': 'under the <em>Department</em> label.'
    }, pcGuide = {
        'fc': 'checking the box under the respective <em>Faculty</em> name.',
        'dpt': 'under the <em>Department</em> column:'
    },
    /*  @Fn updateMetadataGuide 
        Declared in Global scope to enable access from within `navigation.js` */
    updateMetadataGuide = ()=> {
        if(aMetadataInput) {
            $('.metadata-guide .fcg').html(aSGuide['fc']);
            $('.metadata-guide .dptg').html(aSGuide['dpt'])
        } else {
            $('.metadata-guide .fcg').html(pcGuide['fc']);
            $('.metadata-guide .dptg').html(pcGuide['dpt']);
        }
    },
    fd = new FormData(), 
    filesObjLength;

$(document).ready(() => {
    const 
        ioConstraints = {
            max_files_allowed: 3,
            file_types: ['pdf', 'docx', 'doc']
        },

        ioMsgs = {
            max_files_exceeded: 'You can only upload a maximum of 3 files. Select a fewer number of files and try again',
            missing_metadata: 'Please provide all the additional information indicated above.',
            invalid_input: 'Please correct the highlighted inputs indicated above.',
            max_size_exceeded: 'Maximum file size (10MiB) exceeded. Please try again with a light-weight version of the file.',
            total_size_exceeded: 'Total files\' size exceeded. Please ensure the total size of the files doesn\'t exceed 30MiB.'
        },
        
        frcDsRef = {
            '0': 'default-s',
            '1': 'fset-s',
            '2': 'bust-s',
            '3': 'fred-s',
            '4': 'fahu-s',
            '5': 'faes-s',
            'other': 'aux'
        };

    let 
        fileId,
        /*  fd = new FormData(), */ 
        logging = false,
        ebAuxDisplay = {'upload0':false,'upload1':false,'upload2':false},
        dptS = {'upload0':false,'upload1':false,'upload2':false},
        submitErrors = {'upload0':false,'upload1':false,'upload2':false},
        aAuxDisplay = false,

        resetAuxDisplay = (e) => {
            $('.eb-metadata tr.eb-aux-inputs.'+e+'aux td.eb-aux-fc, .eb-metadata tr.eb-aux-inputs.'+e+'aux td.eb-aux-dpt').fadeOut();
            $('.eb-metadata tr.eb-aux-inputs.'+e+'aux').hide();
            ebAuxDisplay[e] = false;
        },

        enableDS = (e) => {
            $('#'+e+'s').selectmenu('enable');
            dptS[e] = true;
        },

        disableDS = (e) => {
            $('#'+e+'s').selectmenu('disable');
            dptS[e] = false;
        };

    let a = $($('.eb-metadata-a')[0].content.cloneNode(true));
    /* Render Accordion */
    $('.metadata-wrapper').prepend(a);

    let 
        /* 
            @printAS fn
            @param a, fileID
            @param b, file object.
            Render metadata collection mods for each file about to be uploaded (Android)*/
        printAS = (fileId, file) => {
            let aS =  $($('.eb-metadata-a-s')[0].content.cloneNode(true));
            /* Edit and Render Accordion Sections */
            aS.find('h3').text(file.name).addClass(fileId);
            aS.find('div').addClass(fileId);
            aS.find('div select.a-fcs').attr('name','a-'+fileId+'-fcs');
            aS.find('.a-dpt-s').attr('id',fileId + '-a-dpt-s');
            $('.metadata-wrapper div[data-role=accordion]').append(aS);
        },

        /* 
            @printRow fn
            @param a, fileID
            @param b, file object.
            Render metadata collection mods for each file about to be uploaded */
        printRow = (fileId, file) => {
            let rcName = fileId + 'rc', sName = fileId+'s',

            trs = $($('.eb-metadata-trs')[0].content.cloneNode(true));
            
            $(trs.children()[0]).addClass(fileId);
            if(file.name.length > 11) {
                trs.find('.eb-fn attr').text(file.name).attr('title', file.name);
            } else {
                trs.find('.eb-fn attr').text(file.name);
            }
            
            /* target inputs */
            let x = trs.find('.frc fieldset');
            for(let i=0; i<13; i+=2) {
                $(x.children()[i]).attr('name',rcName);
                $(x.children()[i]).attr('id',fileId+'-'+i/2);
            }

            /* target labels */
            for(let i=1; i<14; i+=2) {
                $(x.children()[i]).attr('for',fileId+'-'+(i-1)/2);	
            }
            
            /* target select */
            let y = trs.find('.eb-dpt select');
            $(y[0]).attr('id',sName);

            /* target aux tr */
            $(trs.children()[1]).addClass(fileId+'aux');
            
            $('.eb-metadata tbody').append(trs);
        }, 

        log = (e) => {
            /* UI logger */
            logging = true;
            $('.uploads-input-log .io-err-msg').text(ioMsgs[e]);
            $('.uploads-input-log').show();
            $('.uploads-input-log .io-err-msg').fadeIn();

            if(/max_files_exceeded|missing_metadata|invalid_input|max_size_exceeded|total_size_exceeded/.test(e)) {
                $('.uploads-input-log').removeClass('bg-success').addClass('bg-error');
            } else {
                $('.uploads-input-log').removeClass('bg-error').addClass('bg-success');
            }
        }, 

        resetLogs = (clonedInputLog) => {
            /* if displayed, hide msgs */
            setTimeout(function () {
                $('.uploads-input-log .io-err-msg').fadeOut();
                $('.uploads-input-log').hide();
                logging = false;
                /* applies for max_files_allowed constraints: */
                if(clonedInputLog) {
                    $('.eb-uploads .ui-block-a .uploads-input-log').remove();
                    if($('#eb-files').attr('disabled') == 'disabled') {
                        $('#eb-files').attr('disabled', false).val('');
                    }
                }
            }, 5000);
        }, 

        resetLogsWT = () => {
            /* Reset Logs without timeout */
            $('.uploads-input-log .io-err-msg').fadeOut();
            $('.uploads-input-log').hide();
            logging = false;
        };
    
    /* Upload files onChange Event handler */
    $('#eb-files').on('change', (event) => {        
        let files = event.target.files/* , filesObjLength = Object.keys(files).length */,
        filesObjLength = Object.keys(files).length;
        _files = files;
        console.log('_files', _o(_files));
        /* File size check */
        if(filesObjLength == 1) {
            _l(files[0].size);
            if(files[0].size > 10 * 1024 * 1024) {
                log('max_size_exceeded');
                $('#eb-files').attr('disabled', true);
                $('.eb-uploads .ui-block-a').append($('.uploads-input-log').clone()[0]);
                resetLogs(true);
                return;
            }
        } else {
            let totalFileSize = 0;
            $.each(files, (i, file) => {
                totalFileSize += file.size;
            });
            if(totalFileSize > 30 * 1024 * 1024) {
                log('total_size_exceeded');
                $('#eb-files').attr('disabled', true);
                $('.eb-uploads .ui-block-a').append($('.uploads-input-log').clone()[0]);
                resetLogs(true);
                return;
            }
        }
        /*max upload files check*/
        if (filesObjLength > ioConstraints.max_files_allowed) {
            log('max_files_exceeded');
            $('#eb-files').attr('disabled', true);
            $('.eb-uploads .ui-block-a').append($('.uploads-input-log').clone()[0]);
            resetLogs(true);
        } else {
            /* disable choose-file input */
            $('#eb-files').attr('disabled', true); 

            /*  Render metadata input mods for both pc & screens < 964px;
                aMetadataInput = true; default; */
            if(filesObjLength == 1) {
                /* Update FormData Obj */
                fd.append("upload0", files[0]);
                /* Print 1 accordion section */
                printAS("upload0",files[0]);
                /* print 1 row */
                printRow("upload0",files[0]);
            } else {
                /* Print n accordion sections / n rows */
                $.each(files, (i, file) => {
                    fileId = 'upload' + i;
                    fd.append(fileId,file);
                    printAS(fileId,file);
                    printRow(fileId,file);
                });
            }
            /*  await for async printAS/async printRow?
                ** Incase enhanceWithin executes before AS/trs are rendered 
                
                Update Accordion/eb-metadata table JQM Styling */
            $('.ui-content').enhanceWithin();
            $('td.eb-aux-dpt input,td.eb-aux-fc input').closest('div').addClass('eb-aux-dpt-custom');
            $('td.eb-dpt select').closest('div').addClass('nomargin');
            $("input").closest('div').addClass('noshadowI');
            $('.pc-metadata-wrapper').removeClass('noshadowI');    
            /* disable dpt-select by default*/
            $('td.eb-dpt select').selectmenu('disable');
            /* update upload eb UI */
            $('.eb-uploads .ui-block-b, .cancel-upload').fadeIn();
        }
        /* Submit form click event */
        /* Metadata Input Validation */
        let 
            ioErrors = {},
            rfc2822ValidEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
            resetIW = (el) => {
                /* Reset Err-Msgs for Input Wrappers */
                if(el.closest('div').hasClass('aux-input-error')) {
                    el.closest('div').removeClass('aux-input-error');
                }
            }, 
            updateErrObj = (fileEl, errType) => {
                if(ioErrors[fileEl]) {
                    ioErrors[fileEl][errType] = 1;
                } else {
                    ioErrors[fileEl] = {[errType]: 1}
                }
            };

        /*  Submit Form Ev. */ 
        $('.submit-eb-uploads a').click(()=>{
            if(Object.keys(ioErrors).length > 0) {
                for(elementId in ioErrors) {
                    /* Reset styling for erroneous Elements */
                    if(elementId === 'email')  {
                        aMetadataInput ? resetIW($('.aEbUploader')) : resetIW($('.ebUploader'));
                    } else if(elementId === 'name') {
                        let fName, lName;
                        if(aMetadataInput) {
                            fName = $('.a-uploader-f-n');
                            lName = $('.a-uploader-l-n');
                        } else {
                            fName = $('.uploader-f-n');
                            lName = $('.uploader-l-n');
                        }
                        if(ioErrors['name']['nullFName'] || ioErrors['name']['nonTxtFName']) {
                            resetIW(fName);
                        }                        
                        if(ioErrors['name']['nullLName'] || ioErrors['name']['nonTxtLName']) {
                            resetIW(lName);
                        }
                    } else {
                        if(aMetadataInput) {
                            /* Android */
                            let 
                                auxFc = $($('div.' + elementId + ' inputwrapper div input')[0]), 
                                auxDpt = $($('div.' + elementId + ' inputwrapper div input')[1]);
                            
                            /* Reset styling for File-Elements with prior erroneous inputs */
                            $('h3.' + elementId).removeClass('as-error');
                            resetIW(auxFc), resetIW(auxDpt);
                        } else {
                            /* PC */
                            let 
                                auxFc = $('.' + elementId + 'aux').find('.eb-aux-fc div input'), 
                                auxDpt = $('.' + elementId + 'aux').find('.eb-aux-dpt div input');
                            
                            $('tr.' + elementId + ' td attr').removeClass('missing-metadata');
                            resetIW(auxFc), resetIW(auxDpt);
                        }  
                    }   
                    /*Clear the ioErrors obj. for subsequent Submit events: */
                    delete ioErrors[elementId];                
                }
            } 

            /* Files */
            for(let i = 0; i < filesObjLength; i++) {
                /* Each loop represents metadata validation for a single file */
                let fileEl = 'upload' + i;
                if(aMetadataInput) {
                    /* On Android */
                    let selectedFC = $('select[name=a-'+ fileEl + '-fcs] option:selected').text();                    
                    /* Check if Faculty field is selected*/
                    if(selectedFC =='Null') {
                        ioErrors[fileEl] = {'nullFcField': 1, 'nullDptField': 1};
                    } else if(selectedFC === 'Other') {
                        let 
                            /*Input Elements*/
                            auxFc = $($('div.' + fileEl + ' inputwrapper div input')[0]),
                            auxDpt = $($('div.' + fileEl + ' inputwrapper div input')[1]);

                        if(auxFc.val().replace(/ /g,'') === '' ) {
                            //null
                            auxFc.closest('div').addClass('aux-input-error');
                            ioErrors[fileEl] = {'nullFcField': 1}
                        } else if(auxFc.val().replace(/ /g, '').search(/^[a-zA-Z]+$/) !== 0) {
                            //non-text-chars
                            auxFc.closest('div').addClass('aux-input-error');
                            ioErrors[fileEl] = {'nonTxtFcField': 1};
                        }
                        
                        if(auxDpt.val().replace(/ /g, '') === '') {
                            //null
                            auxDpt.closest('div').addClass('aux-input-error');
                            updateErrObj(fileEl,'nullDptField');
                        } else if(auxDpt.val().replace(/ /g,'').search(/^[a-zA-Z]+$/) !== 0) {
                            /* Non-text-chars */
                            auxDpt.closest('div').addClass('aux-input-error');
                            updateErrObj(fileEl,'nonTxtDptField');
                        }
                    } else {
                        /* One of the 5 faculties selected */
                        let selectedDpt = $('#' + fileEl + '-a-dpt-s option:selected').text();                        
                        if(selectedDpt === 'Null') {
                            ioErrors[fileEl] = {'nullDptField': 1}
                        }
                    }
                } else {
                    /* On PC*/
                    /* File Metadata Validation */
                    let 
                        selectedFcIndex = $('[name=' + fileEl + 'rc]:checked').val(),                    
                        selectedFc = frcDsRef[selectedFcIndex];     
                    
                    if(selectedFc === 'default-s') {
                        /* Null cell selected: Null faculty field */
                        ioErrors[fileEl] = {'nullFcField': 1, 'nullDptField': 1}
                    } else if(selectedFc === 'aux') {
                        /* Other: text input validation (fc, dpt) */
                        let 
                            /* Input Elements */
                            auxFc = $('.' + fileEl + 'aux').find('.eb-aux-fc div input'),
                            auxDpt = $('.' + fileEl + 'aux').find('.eb-aux-dpt div input');

                        /* Faculty */
                        if(auxFc.val().replace(/ /g, '') === '' ) {
                            /* Null input test */
                            auxFc.closest('div').addClass('aux-input-error');                            
                            ioErrors[fileEl] = {'nullFcField':1}
                        } else if(auxFc.val().replace(/ /g, '').search(/^[a-zA-Z]+$/) !== 0) {
                            /* Non-text-input test */
                            auxFc.closest('div').addClass('aux-input-error');                            
                            ioErrors[fileEl] = {'nonTxtFcField': 1};
                        }
                        
                        /* Department */
                        if(auxDpt.val().replace(/ /g,'') === '') {
                            /* Null input test */
                            auxDpt.closest('div').addClass('aux-input-error');
                            if(ioErrors[fileEl]) {
                                ioErrors[fileEl]['nullDptField'] = 1;
                            } else {
                                ioErrors[fileEl] = {'nullDptField':1}
                            };
                        } else if(auxDpt.val().replace(/ /g,'').search(/^[a-zA-Z]+$/) !== 0) {
                            /* Non-text-input test */
                            auxDpt.closest('div').addClass('aux-input-error');
                            if(ioErrors[fileEl]) {
                                ioErrors[fileEl]['nonTxtDptField'] = 1;
                            } else {
                                ioErrors[fileEl] = {'nonTxtDptField': 1}
                            };
                        }
                    } else {
                        /* Faculty selected: Check for dpt select values */
                        let selectedDpt = $('#' + fileEl + 's option:selected').text();
                        if(selectedDpt === 'Null') {
                            ioErrors[fileEl] = {'nullDptField': 1};
                        };
                    };
                }
                /* Emphasize on erroneous input elements: */
                if(ioErrors[fileEl]) {
                    aMetadataInput ? $('h3.'+fileEl).addClass('as-error') : 
                    $('tr.' + fileEl + ' td attr').addClass('missing-metadata');
                };
            };
        /* CI, Email */
            let fName, LName, publishCI = false, cName = '', isNameValid = true, email;
            if(aMetadataInput) {
                fName = $('.a-uploader-f-n'),
                lName = $('.a-uploader-l-n'),
                publishCIEl = $('.a-publishCI');
                email = $('.aEbUploader');
            } else {
                fName = $('.uploader-f-n'),
                lName = $('.uploader-l-n'),
                publishCIEl = $('.publishCI');
                email = $('.ebUploader');
            };
            /* CI Validation */
            if(publishCIEl.attr('class').indexOf('ui-checkboxradio-checked') === -1 ) {
                /*  publishCI not checked: Uploader hasn't approved profile for Hall of Fame
                    Check if the uploader has provided their Name(s) either way. */
                if(fName.val().replace(/ /g, '') !== '') {
                    if(fName.val().search(/^[a-zA-Z]+$/) !== 0) {
                        isNameValid = false;
                        fName.closest('div').addClass('aux-input-error');
                    } else {
                        cName += fName.val().replace(/ /g, '');
                        _l('register fname', cName);
                    }
                };
                /* Last Name */
                if(lName.val().replace(/ /g, '') !== '') {
                    if(lName.val().search(/^[a-zA-Z\s]+$/) !== 0) {
                        isNameValid = false;
                        lName.closest('div').addClass('aux-input-error');
                    } else {
                        cName += ' ' + lName.val();
                        _l('register fname \+ \' \' \+ lname', cName);
                    }
                };

                if(isNameValid && cName !== '') {
                    _l('Registering: ', cName);
                } else if(isNameValid && cName == '') {
                    _l('Didn\'t sign up for Hall of Fame. No names Provided.');
                }
            } else {
                /*  publishCI checked:
                    Uploader has approved profile for Hall of Fame */
                if(fName.val().replace(/ /g, '') === '') {
                    //null
                    fName.closest('div').addClass('aux-input-error');
                    updateErrObj('name', 'nullFName');
                } else if(fName.val().search(/^[a-zA-Z]+$/) !== 0) {
                    //non-text chars
                    fName.closest('div').addClass('aux-input-error');
                    updateErrObj('name','nonTxtFName');
                }

                if(lName.val().replace(/ /g, '') === '') {
                    //null
                    lName.closest('div').addClass('aux-input-error');
                    updateErrObj('name', 'nullLName');
                } else if(lName.val().replace(/ /g, '').search(/^[a-zA-Z]+$/) !== 0) {
                    //non-text chars 
                    lName.closest('div').addClass('aux-input-error');
                    updateErrObj('name','nonTxtLName');
                }
            };

            /* Email Validation */
            if(email.val() === '') {
                email.closest('div').addClass('aux-input-error');
                ioErrors['email'] = {'nullEmailField': 1};
            } else if(email.val().search(rfc2822ValidEmail) !== 0) {
                email.closest('div').addClass('aux-input-error');
                ioErrors['email'] = {'invalidEmail': 1};
            }
        
            /* Input error notification */
            if(Object.keys(ioErrors).length > 0) {
                let errType = '';
                for(el in ioErrors) {
                    if(ioErrors[el].hasOwnProperty('nonTxtFcField') || ioErrors[el].hasOwnProperty('nonTxtDptField') 
                        || ioErrors[el].hasOwnProperty('nonTxtFName') || ioErrors[el].hasOwnProperty('nonTxtLName') || ioErrors[el].hasOwnProperty('invalidEmail')/* ioErrors.hasOwnProperty('email') */) {
                        errType = 'invalidChars';
                    }
                }

                if(errType === '') {
                    log('missing_metadata');
                } else {
                    log('invalid_input');
                }
                resetLogs();
            } else {
                if(logging) {
                    resetLogsWT();
                }
                _l('proceed');
            }
        });
    });

    /* Cancel upload & reset variables*/
    $('.cancel-upload a').click(()=> {
        $('.eb-uploads .ui-block-b, .cancel-upload').fadeOut();
        /* 	enable choose-file input */
        $('#eb-files').attr('disabled',false); 
        /* reset ctrl vars, empty metadata input mods*/
        ebAuxDisplay = {'upload0':false,'upload1':false,'upload2':false},
        dptS = {'upload0':false,'upload1':false,'upload2':false};
        $('#eb-files').val('');
        $('.eb-metadata tbody').empty();
        /* Reset Accordion sections */
        $('.metadata-wrapper div[data-role=accordion]').remove();
        /* Render Accordion */
        a = $($('.eb-metadata-a')[0].content.cloneNode(true));
        $('.metadata-wrapper').prepend(a);
        /* detach submit event handler */
        //let a = $('.submit-eb-uploads')
    });

    /* 
        Facultyrc-DeptSelect linking
        @Faculty radio checkbox label clickEvent handler   */
    $(document).on('click', '.frc-ds', (e) => {
        let forLabel = $(e.target).attr('for').split('-'), fileId=forLabel[0]; //["upload0",0]
        if(forLabel[1]==0) {
            /*  Null-RC option. Selected by default 
                If displayed, hide dpt-select */

            if(dptS[fileId]) {
                
                setTimeout(()=> {
                    $('.' + fileId + ' .eb-dpt select').empty().html($('.'+frcDsRef['0'])[0].content.cloneNode(true));
                    $('select').selectmenu('refresh', true);
                }, 500);

                disableDS(fileId);
            }

            /* If displayed, hide aux input */
            if(ebAuxDisplay[fileId]) {
                resetAuxDisplay(fileId);
            }

        } else if(forLabel[1]==6) {
            /*  Other-RC
                If displayed, disable dpt-select */
            if(dptS[fileId]) {
                disableDS(fileId);
            }

            /* If not displayed, show aux input */
            if(!ebAuxDisplay[fileId]){
                $('.eb-metadata tr.eb-aux-inputs.'+fileId+'aux').show();
                $('.eb-metadata tr.eb-aux-inputs.'+fileId+'aux td.eb-aux-fc, .eb-metadata tr.eb-aux-inputs.'+fileId+'aux td.eb-aux-dpt').fadeIn();
                ebAuxDisplay[fileId] = true;
            }

            XG = ebAuxDisplay;
        } else {
            /*  Faculty options 1-5
                If displayed, hide aux inputs */
            if(ebAuxDisplay[fileId]) {
                resetAuxDisplay(fileId);
            }
            
            setTimeout(function(){
                currRc = $('[name='+fileId +'rc]:checked').val();
                $('.' + fileId + ' .eb-dpt select').empty().html($('.'+frcDsRef[currRc])[0].content.cloneNode(true));
                //refresh and force rebuild custom select
                $('select').selectmenu('refresh', true);
                /* If not displayed, enable dpt-select */
                if(!dptS[fileId]) {
                    enableDS(fileId);
                }
            },500);
        }
    });		

    /* Android metadata input: Controls */
    $(document).on('change','.a-fcs', (event) => {
        /* Determine fc select */
        let fcS = $(event.target),
        /* Get selected faculty */
        selectedFc = $('select[name=' + fcS.attr('name') + '] option:selected').val(); 
        /* Get current accordion-content-wrapper/fileId */
        aCW = fcS.attr('name').split('-')[1];

        if(selectedFc == 'other') {
            /* Show aux input forms */
            $('.a-cw.' + aCW + ' form inputwrapper').fadeIn();
            $("input").closest('div').addClass('noshadowI');
            /*  Disable dept-select 
                Instance el: div.a-cw.uploads0#upload0-a-dpt-s, where upload0=fileId */
            $('div.a-cw.' + aCW + ' #' + aCW + '-a-dpt-s').selectmenu('disable');
            aAuxDisplay = true;
        } else {
            /* Update dpt select and rebuild custom selectmenu*/
            $('div.a-cw.' + aCW + ' .a-dpt-s').empty().html($('.'+frcDsRef[selectedFc])[0].content.cloneNode(true));
            //_l($('select[name=' + fcS.attr('name') + ']')[0]);
            $('div.a-cw.' + aCW + ' #' + aCW + '-a-dpt-s').selectmenu('refresh', true);

            /* If displayed, hide aux input form and enable dpt-s*/
            if(aAuxDisplay) {
                /* On switch select option to faculty, reset 'Other\'s' input form */
                $('.a-cw.' + aCW + ' form inputwrapper').hide();
                /*  Re-enable select
                    Instance el: div.a-cw.uploads0#upload0-a-dpt-s, where upload0=fileId */
                $('div.a-cw.' + aCW + ' #' + aCW + '-a-dpt-s').selectmenu('enable');
                aAuxDisplay = false;
            }
        }
    });

    $('.publishCI').click(() => {
        $('.publishCI').attr('class').indexOf('ui-checkboxradio-checked') === -1 
        ? /* Checked */ $('.uploader-ID-label span').hide() :  /* Not Checked */ $('.uploader-ID-label span').fadeIn();
    });
    
    $('.a-publishCI').click(() => {
        $('.a-publishCI').attr('class').indexOf('ui-checkboxradio-checked') === -1 
        ? /* checked */ $('.a-uploader-ID .uploader-ID-label span').hide() :  /*  Not Checked*/ $('.a-uploader-ID .uploader-ID-label span').fadeIn();
    });
    
    updateMetadataGuide();
});

/* 
    Detect radio check event? 
        issue: rc label click event doesn't match radio check event
        currentFix: allowing .5s delay for current rc changes to reflect
        
    Cursor for choose-files button
*/