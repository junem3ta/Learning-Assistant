$(document).ready(function() {
    /* Explorer */
	/* 
		ECL = Explorer Container Level 
		ecw = explorer-container-wrapper
	*/

	fsIndex = fsIndex['root'];
	var currentECLSuffix = 1;
	var currentPath = 'root';
	var absPath = '';
	var files;
	
	function renderECL1() {
		/* Generate root folders */
		var eCL1 = $('<div>',{class:'ecw ecl1'});
		$('.explorer').append(eCL1);
		/* Loop through root obj and print folder icons */
		for(var entry in fsIndex) {
			var folderId = entry;
			var folderClass = 'folder-icon';
			/* create folder-tile-wrapper and append folder-tile. add folder-tile-wrapper to ecl1 in explorer */
			var ftw = $('<div>',{class:'folder-tile-wrapper'});
			ftw.append($('<div>',{id:folderId,class:folderClass}).append($('<p>',{text:entry})));
			$('.ecl1').append(ftw);			
		}
	}
	renderECL1(fsIndex);

	/* Generic folder-icon click event for all folders */
	$('.explorer').on('click', '.folder-icon', function() {
		var currentECL = 'ecl' + currentECLSuffix;
		console.log('currentECL : ',currentECL);
		/* Get object-key that the folder icon refers to */
		var targetId = $(this).attr('id');
		console.log('OpenFolder Event on : ',targetId);
		/* Clear explorer window */
		$('.'+currentECL).hide();
		console.log('Clearing explorer window');
		/* Update ecl level */
		currentECLSuffix ++;
		var nextECL = 'ecl' + currentECLSuffix;
		console.log("Updated to nextECL : " + nextECL);

		/* parse targetId (fsIndex Obj keys) and generate nextFsIndexObject*/
		if(targetId == 'BUST' || targetId == 'FSET' || targetId == 'FAHU' || targetId == 'FAES' || targetId == 'FRED') {
			var nextIndexObj = fsIndex[targetId];
			var folderName = targetId;
		} else {
			/* FSET-2014-2015 */
			var pathArray = targetId.split('_');
			var folderName = pathArray[pathArray.length-1];
			var tempIndexObj = fsIndex;
			for(var i=0; i<pathArray.length; i++) {
				tempIndexObj = tempIndexObj[pathArray[i]];
			}
			var nextIndexObj = tempIndexObj;
		}
		
		console.log('Path section text | Folder name, ',folderName);
		console.log('TargetId ', targetId,'. Next Index Object : ',nextIndexObj);
		/* Append delimeter to explorer-navigation */
		var newDelimeter = ($('.tmp-path-delimeter').clone())
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
		var newPathSection = ($('.tmp-path-section').clone())
		.removeClass('tmp-path-section')
		.addClass(currentPath+'-path-section '+'path-section')
		.text(folderName);
		$('.explorer-navigation').append(newDelimeter);
		$('.explorer-navigation').append(newPathSection);

		if(nextIndexObj['__files__']!=undefined && Object.keys(nextIndexObj).length == 2) {
			/* Print Files */
			absPath = nextIndexObj['path'];
			var files = nextIndexObj['__files__'];
			console.log('Print the following files, w/path ', absPath,' @nextECL, ',nextECL,' \n\r',files);

			$('.explorer').append($('<div>',{class:'ecw '+nextECL}));
			$('.'+nextECL).append(
				$('<div>',{class:'fdownl-dialog-wrapper'})
				.append(
					$('<div>',{id:'downl-dialog',class:'file-downl-dialog'}))
				).append($('<p>',{text:'Files',class:'files-ecw-hdr'}));
			
			for(var i=0; i<files.length; i++) {
				var fullFileName = files[i];
				var fileNameArr = fullFileName.split('.pdf');
				fileName = fileNameArr.join('');

				$('.'+nextECL).append(
					$('<div>',{class:'file-tile-wrapper'})
					.append(
						$('<div>',{id:fullFileName,class:'file-icon'})
						.append(
							$('<p>',{text:fileName}))
					)
				);
			}
			$('.'+nextECL).append(
				$('<div>',{class:'fw-stats'}).append(
					$('<p>',{text:"Showing " + files.length + " of 10,511 files. Path: " + absPath}))
				);

		} else if(Object.keys(nextIndexObj).length!=0) {
			absPath = '';
			$('.explorer').append($('<div>',{class:'ecw '+nextECL}));
			for(var entry in nextIndexObj) {
				/* Changed targetId delimeter from - to _ due to conflicts in fsIndex folder names eg. FSET-2014-2015 */
				var folderId = targetId + '_' + entry;
				var folderClass = 'folder-icon';
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
		var currentECL = 'ecl' + currentECLSuffix;
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
		for(var i=start+1; i<=end; i++) {/* 1,3; 2, */
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
		var pathIndex = $(this).index();
		var explorerElements = $('.path').children().length;
		for(var i=pathIndex+1; i<explorerElements; i++) {
			console.log('Update Explorer-navigation. Removing element',i);
			$('.path').children().eq(i).remove();
			explorerElements--;
			i--;
		}
	});
});