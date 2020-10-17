/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
$(document).ready(() => {
    /* Explorer */
	/* 
		ECL = Explorer Container Level 
		ecw = explorer-container-wrapper
	*/

	fsIndex = fsIndex['root'];
	let currentECLSuffix = 1;
	let currentPath = 'root';
	let absPath = '';
	
	function renderECL1() {
		/* Generate root folders */
		let eCL1 = $('<div>',{class:'ecw ecl1'});
		$('.explorer').append(eCL1);
		/* Loop through root obj and print folder icons */
		for(let entry in fsIndex) {
			let folderId = entry;
			let folderClass = 'folder-icon';
			/* create folder-tile-wrapper and append folder-tile. add folder-tile-wrapper to ecl1 in explorer */
			let ftw = $('<div>',{class:'folder-tile-wrapper'});
			ftw.append($('<div>',{id:folderId,class:folderClass}).append($('<p>',{text:entry})));
			$('.ecl1').append(ftw);			
		}
	}
	renderECL1(fsIndex);

	/* Generic folder-icon click event for all folders */
	$('.explorer').on('click', '.folder-icon', function() {
		let currentECL = 'ecl' + currentECLSuffix;
		console.log('currentECL : ',currentECL);
		/* Get object-key that the folder icon refers to */
		let targetId = $(this).attr('id');
		console.log('OpenFolder Event on : ',targetId);
		/* Clear explorer window */
		$('.'+currentECL).hide();
		console.log('Clearing explorer window');
		/* Update ecl level */
		currentECLSuffix ++;
		let nextECL = 'ecl' + currentECLSuffix;
		console.log("Updated to nextECL : " + nextECL);

		/* parse targetId (fsIndex Obj keys) and generate nextFsIndexObject*/
		let 
			nextIndexObj, folderName;

		if(targetId == 'BUST' || targetId == 'FSET' || targetId == 'FAHU' || targetId == 'FAES' || targetId == 'FRED') {
			nextIndexObj = fsIndex[targetId];
			folderName = targetId;
		} else {
			/* FSET-2014-2015 */
			let 
				pathArray = targetId.split('_');
				tempIndexObj = fsIndex;
			folderName = pathArray[pathArray.length-1];
			for(let i=0; i<pathArray.length; i++) {
				tempIndexObj = tempIndexObj[pathArray[i]];
			}
			nextIndexObj = tempIndexObj;
		}
		
		console.log('Path section text | Folder name, ',folderName);
		console.log('TargetId ', targetId,'. Next Index Object : ',nextIndexObj);
		/* Append delimeter to explorer-navigation */
		let newDelimeter = ($('.tmp-path-delimeter').clone())
		.removeClass('tmp-path-delimeter')
		.attr('id',currentECL+'-p-s-dlm')
		.addClass(currentECL+'-p-s-dlm path-delimeter');
		/* Append history pointer to current-path-section */
		/* How to change attr of dynamically generated element jQuery */
		$('.'+currentPath+'-path-section').attr('id',currentECL).addClass('path-section-w-h path-section-link');
		/* Update currentPath */
		currentPath += '_' + folderName;
		console.log('Updated current path to : ',currentPath);
		/* Append new-path-section to explorer-navigation */
		let newPathSection = ($('.tmp-path-section').clone())
		.removeClass('tmp-path-section')
		.addClass(currentPath+'-path-section '+'path-section')
		.text(folderName);
		$('.explorer-navigation').append(newDelimeter);
		$('.explorer-navigation').append(newPathSection);

		if(nextIndexObj['__files__']!=undefined && Object.keys(nextIndexObj).length == 2) {
			/* Print Files */
			absPath = nextIndexObj['path'].split('root/')[1];
			let files = nextIndexObj['__files__'];
			console.log('Print the following files, w/path ', absPath,' @nextECL, ',nextECL,' \n\r',files);

			$('.explorer').append(
				$('<div>', {class:'ecw '+nextECL, id:nextECL})
				.append(
					[
						$('<div>', {class: 'ecw-navbar'}).append(`<input data-type="search" id="searchFiles" placeholder="Search Files">`),
						$('<div>', {class: 'files-wrapper', 'data-filter': 'true', 'data-input':'#searchFiles', 'data-inset': 'true'})
					]
					)
				);
			$('#searchFiles').textinput().textinput('refresh');
			$('#searchFiles').closest('div').addClass('noshadowI search-files');
			/* .append(
				`<input class="search-files" data-type="search" id="searchFiles" placeholder="Search Files">`) 
				$('.'+nextECL).append($('<p>',{text:'Files',class:'files-ecw-hdr'}));
				*/
			
			for(let i=0; i<files.length; i++) {
				let fullFileName = files[i];
				let fileNameArr = fullFileName.split('.pdf');
				fileName = fileNameArr.join('');
				path = '/' + absPath + '/' + fileName;
				$('.'+nextECL+' .files-wrapper').append(
					$('<div>',{class:'file-tile-wrapper tooltipped tooltipped-s border p-2 mb-2 mr-2 float-left', 'aria-label': fileName})
					.append(
						$('<a>',
						{id:fullFileName, class:'file-icon', href: '#pdfViewer', 'data-rel':'popup', 'data-position-to':'window', path: path})
						.append(
							$('<p>',{text:fileName}))
					)
				);
			}			
			$('.files-wrapper').filterable().filterable('refresh').listview().listview('refresh');
			$('.'+nextECL).append(
				$('<div>',{class:'fw-stats'}).append(
					$('<p>',{text:"Showing " + files.length + " of 10,511 files. Path: " + absPath}))
				);

		} else if(Object.keys(nextIndexObj).length!=0) {
			absPath = '';
			$('.explorer').append($('<div>',{class:'ecw '+nextECL}));
			for(let entry in nextIndexObj) {
				/* Changed targetId delimeter from - to _ due to conflicts in fsIndex folder names eg. FSET-2014-2015 */
				let folderId = targetId + '_' + entry;
				let folderClass = 'folder-icon';
				$('.'+nextECL).append(
					$('<div>',{class:'folder-tile-wrapper'})
					.append(
						$('<div>',{id:folderId,class:folderClass})
						.append(
							$('<p>',{text:entry})
						)
					)
				);
			}
		} else {
			console.log('No files found in current folder.');
		}
	});

	/* Generic path-section-link for all path-sections */
	$('.explorer-navigation').on('click', '.path-section-link', function() {
		/* Display previous ecl wrapper */
		$('.ecw').hide();
		console.log('Hiding current-ecl ', currentECLSuffix);
		/* Obtain history pointer from previous path-section */
		targetId = $(this).attr('id');
		/* Clean up ecl containers upto the current-path-section-link */
		start = targetId.split('');
		start = +start[start.length-1]; /* 1,3; offset = 3 - 1 */
		end = currentECLSuffix;
		offset = end - start;
		for(let i=start+1; i<=end; i++) {/* 1,3; 2, */
			tmp = 'ecl' + i;
			console.log('Cleaner Today Tomorrow: Removing ecl',i);
			$('.'+tmp).remove();
		}
		$('.'+targetId).show();
		console.log('Target path-section : ',targetId,' CurrentECLSuffix : ',end,' Offset : ',offset)
		currentECLSuffix -= offset;
		/* Update currentPath */
		currentPath = currentPath.split('_');
		/* 
			root-bust-2010
			root, offset=2 [root,bust,2010];
		*/
		currentPath.splice(currentPath.length-offset,offset);
		if(currentPath.length>1) {
			currentPath = currentPath.join('_');
		} else {
			currentPath = currentPath.join('');
		}
		console.log('Modified (-) currentPath : ',currentPath);
		/* clean up explorer-navigation divs */
		let pathIndex = $(this).index();
		let explorerElements = $('.path').children().length;
		for(let i=pathIndex+1; i<explorerElements; i++) {
			console.log('Update Explorer-navigation. Removing element',i);
			$('.path').children().eq(i).remove();
			explorerElements--;
			i--;
		}
	});
	$('.explorer').on('click', '.file-icon', (event) => {
		let filePath = '/web/viewer.html?file=http://localhost:3000/fetch' + $(event.target).attr('path');
		$('#pdf-js-viewer').attr('src', filePath);
	});
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
});

