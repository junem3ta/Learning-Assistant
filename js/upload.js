/* eslint-disable no-undef */
$(document).ready(function(){
    function _l(e) {
        console.log(e);
    }

    function _o(e){
        return JSON.stringify(e);
    }

    /* eb Upload Processing */
    let fileId, file, fd = new FormData(), logging = false;
    let ioConstraints = {
        max_files_allowed: 3,
        file_types: ['pdf', 'docx', 'doc']
    }
    let ioMsgs = {
        max_files_exceeded: 'You can only upload a maximum of 3 files. Select a fewer number of files and try again'
    }
    
    // eslint-disable-next-line no-unused-vars
    let defaultS = "bust-s", rcName, sName;

    let frcDsRef = {
        '1': 'fset-s',
        '2': 'bust-s',
        '3': 'fred-s',
        '4': 'fahu-s',
        '5': 'faes-s',
        'other': 'aux'
    }, 
    ebAuxDisplay = {'upload0':false,'upload1':false,'upload2':false}, 
    dptS = {'upload0':false,'upload1':false,'upload2':false};
    
    function resetAuxDisplay(e) {
        $('.eb-metadata tr.eb-aux-inputs.'+e+'aux td.eb-aux-fc, .eb-metadata tr.eb-aux-inputs.'+e+'aux td.eb-aux-dpt').fadeOut();
        $('.eb-metadata tr.eb-aux-inputs.'+e+'aux').hide();
        ebAuxDisplay[e] = false;
        //_l(_o(ebAuxDisplay));
    }

    function enableDS(e) {
        $('#'+e+'s').selectmenu('enable');
        dptS[e] = true;
        //_l(_o(dptS));
    }

    function disableDS(e) {
        $('#'+e+'s').selectmenu('disable');
        dptS[e] = false;
        //_l(_o(dptS));
    }

    /* facultyrc-deptselect linking */
    /* Faculty radio checkbox label click event handler*/
    $(document).on('click','.frc-ds', function() {
        let forLabel = $(this).attr('for').split('-'), fileId=forLabel[0]; //["upload0",0]
        if(forLabel[1]==0) {
            /*null rc*/
            /* if displayed, hide dpt-select */
            if(dptS[fileId]) {
                disableDS(fileId);
            }
            /* if displayed, hide aux input */
            if(ebAuxDisplay[fileId]) {
                resetAuxDisplay(fileId);
            }
        } else if(forLabel[1]==6) {
            /*other rc*/
            /* if displayed, hide dpt-select */
            if(dptS[fileId]) {
                disableDS(fileId);
            }
            /* if not displayed, show aux input */
            if(!ebAuxDisplay[fileId]){
                $('.eb-metadata tr.eb-aux-inputs.'+fileId+'aux').show();
                $('.eb-metadata tr.eb-aux-inputs.'+fileId+'aux td.eb-aux-fc, .eb-metadata tr.eb-aux-inputs.'+fileId+'aux td.eb-aux-dpt').fadeIn();
                ebAuxDisplay[fileId] = true;
                //_l(_o(ebAuxDisplay));
            }
        } else {
            /*Faculty options 1-5: if displayed, hide aux inputs*/
            if(ebAuxDisplay[fileId]) {
                resetAuxDisplay(fileId);
            }

            /* 
                detect radio check event? 
                issue: rc label click event doesn't match radio check event
                currentFix: allowing .5s delay for current rc changes to reflect
                */
            setTimeout(function(){
                currRc = $("[name="+fileId +"rc]:checked").val();

                /* _l(currRc);
                _l($('.'+frcDsRef[currRc])[0].content.cloneNode(true));
                _l($('.' + fileId + ' .eb-dpt select')[0]); */

                $('.' + fileId + ' .eb-dpt select').empty().html($('.'+frcDsRef[currRc])[0].content.cloneNode(true));
                /* refresh custom select options? */
                if(!dptS[fileId]) {
                    enableDS(fileId);
                }
            },500);
        }
    });						

    function printRow(a,b) {
        let fileId = a, file = b, rcName = fileId + 'rc', sName = fileId+'s';
        let trs = $($('.eb-metadata-trs')[0].content.cloneNode(true));
        
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
    
    document.getElementById("eb-files").addEventListener('change', (event) => {
        /*max upload files check*/
        let files = event.target.files, filesObjLength = Object.keys(files).length;
        if (filesObjLength > ioConstraints.max_files_allowed) {
            logging = true;
            $('.uploads-input-log .io-err-msg').text(ioMsgs.max_files_exceeded);
            $('.uploads-input-log').show();
            $('.uploads-input-log .io-err-msg').fadeIn();
        } else {
            $('#eb-files').attr('disabled', true);
            /* Render metadata input and get target dept */
            
            if (filesObjLength == 1) {
                fd.append("upload0", file);
                /* print 1 row */
                printRow("upload0",files[0]);
            } else {
                /* print n rows */
                $.each(files, (i, file) => {
                    fileId = "upload" + i;
                    fd.append(fileId,file);
                    printRow(fileId,file);
                });
            }
        }

        /* submit form click event */
        /* cancel upload, reset all upload variables*/

        /* if displayed, hide msgs */
        if (logging) {
            setTimeout(function () {
                $('.uploads-input-log .io-err-msg').fadeOut();
                $('.uploads-input-log').hide();
                logging = false;
                return;
            }, 5000);
        }

        /* 	enable choose file input
            $('#eb-files').attr('disabled',false); 
            */
    });
});