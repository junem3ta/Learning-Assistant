/* eslint-disable no-undef */
/* eBooks Upload Processing */
$(document).ready(function(){
    //let _l = console.log;

    const ioConstraints = {
        max_files_allowed: 3,
        file_types: ['pdf', 'docx', 'doc']
    },

    ioMsgs = {
        max_files_exceeded: 'You can only upload a maximum of 3 files. Select a fewer number of files and try again'
    },
    
    frcDsRef = {
        '1': 'fset-s',
        '2': 'bust-s',
        '3': 'fred-s',
        '4': 'fahu-s',
        '5': 'faes-s',
        'other': 'aux'
    };

    let fileId, file, fd = new FormData(), logging = false,

    tmp = {'upload0':false,'upload1':false,'upload2':false},

    ebAuxDisplay = dptS = tmp;
    
    function resetAuxDisplay(e) {
        $('.eb-metadata tr.eb-aux-inputs.'+e+'aux td.eb-aux-fc, .eb-metadata tr.eb-aux-inputs.'+e+'aux td.eb-aux-dpt').fadeOut();
        $('.eb-metadata tr.eb-aux-inputs.'+e+'aux').hide();
        ebAuxDisplay[e] = false;
    }

    function enableDS(e) {
        $('#'+e+'s').selectmenu('enable');
        dptS[e] = true;
    }

    function disableDS(e) {
        $('#'+e+'s').selectmenu('disable');
        dptS[e] = false;
    }

    /* 
        Facultyrc-DeptSelect linking
        @Faculty radio checkbox label clickEvent handler   */

    $(document).on('click','.frc-ds', function() {
        let forLabel = $(this).attr('for').split('-'), fileId=forLabel[0]; //["upload0",0]
        if(forLabel[1]==0) {
            /*  Null-RC option. Selected by default
                If displayed, hide dpt-select */
            if(dptS[fileId]) {
                disableDS(fileId);
            }

            /* If displayed, hide aux input */
            if(ebAuxDisplay[fileId]) {
                resetAuxDisplay(fileId);
            }

        } else if(forLabel[1]==6) {
            /*  Other-RC
                If displayed, hide dpt-select */
            if(dptS[fileId]) {
                disableDS(fileId);
            }

            /* If not displayed, show aux input */
            if(!ebAuxDisplay[fileId]){
                $('.eb-metadata tr.eb-aux-inputs.'+fileId+'aux').show();
                $('.eb-metadata tr.eb-aux-inputs.'+fileId+'aux td.eb-aux-fc, .eb-metadata tr.eb-aux-inputs.'+fileId+'aux td.eb-aux-dpt').fadeIn();
                ebAuxDisplay[fileId] = true;
            }

        } else {
            /*  Faculty options 1-5
                If displayed, hide aux inputs */
            if(ebAuxDisplay[fileId]) {
                resetAuxDisplay(fileId);
            }
           
            setTimeout(function(){
                currRc = $("[name="+fileId +"rc]:checked").val();
                $('.' + fileId + ' .eb-dpt select').empty().html($('.'+frcDsRef[currRc])[0].content.cloneNode(true));

                if(!dptS[fileId]) {
                    enableDS(fileId);
                }
            },500);
        }
    });						

    /* Display metadata collection mods for each file about to be uploaded*/
    function printRow(a,b) {
        let fileId = a, file = b, rcName = fileId + 'rc', sName = fileId+'s',

        trs = $($('.eb-metadata-trs')[0].content.cloneNode(true));
        
        $(trs.children()[0]).addClass(fileId);
        trs.find('.eb-fn attr').text(file.name);
        
        /* target inputs */
        let x = trs.find('.frc fieldset');
        for(let i=0; i<13; i+=2) {
            $(x.children()[i]).attr('name',rcName);
            $(x.children()[i]).attr('id',fileId+'-'+i/2);
        }

        /* target lablels */
        for(let i=1; i<14; i+=2) {
            $(x.children()[i]).attr('for',fileId+'-'+(i-1)/2);	
        }
        
        /* target select */
        let y = trs.find('.eb-dpt select');
        $(y[0]).attr('id',sName);

        /* target aux tr */
        $(trs.children()[1]).addClass(fileId+"aux");
        
        $('.eb-metadata tbody').append(trs);

        /* Update JQM styling */
        $('.ui-content').enhanceWithin();
        $('td.eb-aux-dpt input,td.eb-aux-fc input').closest('div').addClass('eb-aux-dpt-custom');
        $('td.eb-dpt select').closest('div').addClass('nomargin');
        $("input").closest('div').addClass('noshadowI');

        /* disable dpt-select by default*/
        $('#'+sName).selectmenu('disable');
    }
    
    /* Cancel upload & reset variables*/
    $('.cancel-upload a').click(()=> {
        $('.eb-uploads .ui-block-b, .cancel-upload').fadeOut();
        /* 	enable choose-file input */
        $('#eb-files').attr('disabled',false); 
        /* reset ctrl vars, empty metadata input mods*/
        ebAuxDisplay = dptS = tmp;
        $('#eb-files').val('');
        $('.eb-metadata tbody').empty();
    });

    /* Upload files onChange Event handler */
    $('#eb-files').on('change', (event) => {        
        let files = event.target.files, filesObjLength = Object.keys(files).length;
        
        /*max upload files check*/
        if (filesObjLength > ioConstraints.max_files_allowed) {
            logging = true;
            $('.uploads-input-log .io-err-msg').text(ioMsgs.max_files_exceeded);
            $('.uploads-input-log').show();
            $('.uploads-input-log .io-err-msg').fadeIn();
        } else {
            /* disable choose-file input */
            $('#eb-files').attr('disabled', true);

            /* Render metadata input mods */
            if (filesObjLength == 1) {
                fd.append("upload0", file);
                /* print 1 row */
                printRow("upload0",files[0]);
                $('.eb-uploads .ui-block-b, .cancel-upload').fadeIn();
            } else {
                /* print n rows */
                $.each(files, (i, file) => {
                    fileId = "upload" + i;
                    fd.append(fileId,file);
                    printRow(fileId,file);
                });
                $('.eb-uploads .ui-block-b, .cancel-upload').fadeIn();
            }
        }

        /* submit form click event */

        /* if displayed, hide msgs */
        if (logging) {
            setTimeout(function () {
                $('.uploads-input-log .io-err-msg').fadeOut();
                $('.uploads-input-log').hide();
                logging = false;
                return;
            }, 5000);
        }
    });
});

/* 
    Detect radio check event? 
        issue: rc label click event doesn't match radio check event
        currentFix: allowing .5s delay for current rc changes to reflect

    Refresh custom select options

    Cursor for choose-files button
*/