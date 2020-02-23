$(document).ready(function() {

	function modify(index, path) {
		for (entry in index) {
			var currentObj = index[entry];
			var length = Object.keys(currentObj).length;
			

			if(length > 1) {
				var currentPath;
				if(entry == 'root') {
					currentPath = path;
				} else {
					currentPath = path + '/' + entry;
				}
				modify(currentObj, currentPath);
			} else if (length == 1 && currentObj['__files__'] !== undefined) {
				temp = currentObj['__files__'];
				delete currentObj['__files__'];
				currentObj['path'] = path + '/' + entry;
				currentObj['__files__']= temp;
			} else if (length == 1 && currentObj['__files__'] == undefined) {
				console.log("Exception: " + JSON.stringify(currentObj));
			}
		}
		return index;
	}

	$('.ui-content').append(JSON.stringify(modify(fsIndex, "root")));
});