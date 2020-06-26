/* eslint-disable no-undef */
/* eBooks Upload Processing */
$(document).ready(function(){
    const ioConstraints = {
        max_files_allowed: 3,
        file_types: ['pdf', 'docx', 'doc']
    },

    ioMsgs = {
        max_files_exceeded: 'You can only upload a maximum of 3 files. Select a fewer number of files and try again'
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

    let fileId, fd = new FormData(), logging = false,

    tmp = {'upload0':false,'upload1':false,'upload2':false},

    ebAuxDisplay = {'upload0':false,'upload1':false,'upload2':false},
    
    dptS = {'upload0':false,'upload1':false,'upload2':false},
    
    aAuxDisplay = false;
    
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

                if(!dptS[fileId]) {
                    enableDS(fileId);
                }
            },500);
        }
    });						

    let a = $($('.eb-metadata-a')[0].content.cloneNode(true));
     /* Render Accordion */
    $('.metadata-wrapper').append(a);

    /* 
        @printAS fn
        @param a, fileID
        @param b, file object.
        Render metadata collection mods for each file about to be uploaded (Android)*/
    let aSParent = false; 
    function printAS(fileId,file) {
        //_l(1);
        let aS =  $($('.eb-metadata-a-s')[0].content.cloneNode(true));
        /* Edit and Render Accordion Sections */
        aS.find('h3').text(file.name);
        aS.find('div').addClass(fileId);
        aS.find('div select').attr('name','a-'+fileId+'-fcs');
        aS.find('.a-dpt-s').attr('id',fileId + '-a-dpt-s');
        $('.metadata-wrapper div[data-role=accordion]').append(aS);
    }

    /* let a = async ()=>{

    }; */

    /* 
        @printRow fn
        @param a, fileID
        @param b, file object.
        Render metadata collection mods for each file about to be uploaded */
    function printRow(fileId,file) {
        let rcName = fileId + 'rc', sName = fileId+'s',

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
        $(trs.children()[1]).addClass(fileId+'aux');
        
        $('.eb-metadata tbody').append(trs);
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
        /* Reset Accordion sections */
        $('.metadata-wrapper div[data-role=accordion]').remove();
        /* Render Accordion */
        a = $($('.eb-metadata-a')[0].content.cloneNode(true));
        $('.metadata-wrapper').append(a);
    });

    /* Android metadata input */
    $(document).on('change','.a-fcs',(event)=>{
        /* Determine fc select */
        let fcS = $(event.target),
        /* Get selected faculty */
        selectedFc = $('select[name=' + fcS.attr('name') + '] option:selected').val(); 
        /* Get current accordion-content-wrapper/fileId */
        aCW = fcS.attr('name').split('-')[1];

        if(selectedFc == 'other') {
            /* Show aux input forms */
            $('.a-cw.' + aCW + ' form').fadeIn();
            $("input").closest('div').addClass('noshadowI');
            /*  Disable dept-select 
                Instance el: div.a-cw.uploads0#upload0-a-dpt-s, where upload0=fileId */
            $('div.a-cw.' + aCW + ' #' + aCW + '-a-dpt-s').selectmenu('disable');
            aAuxDisplay = true;
        } else {
            /* Update dpt select and rebuild custom selectmenu*/
            $('div.a-cw.' + aCW + ' .a-dpt-s').empty().html($('.'+frcDsRef[selectedFc])[0].content.cloneNode(true));
            $('select[name=' + fcS.attr('name') + ']').selectmenu('refresh', true);

            /* If displayed, hide aux input form and enable dpt-s*/
            if(aAuxDisplay) {
                /* On switch select option to faculty, reset 'Other\'s' input form */
                $('.a-cw.' + aCW + ' form').hide();
                /*  Re-enable select
                    Instance el: div.a-cw.uploads0#upload0-a-dpt-s, where upload0=fileId */
                $('div.a-cw.' + aCW + ' #' + aCW + '-a-dpt-s').selectmenu('enable');
                aAuxDisplay = false;
            }
        }
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

            /*  Render metadata input mods for both pc & screens < 922px;
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
        
    Cursor for choose-files button
*/