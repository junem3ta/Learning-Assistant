!function(strs) {
    var aObj = {};
    for(var i=0; i<strs.length; i++) {
        console.log(i,aObj);
        var str = strs[i].split('').sort().join('');
        console.log(str);
        if(typeof(aObj[str]) ==='undefined') {
            aObj[str] = strs[i];
        } else {
            console.log('push ph', str);
           //aObj[str].push(strs[i]);
        }

    }
    console.log(aObj);
}(["eat", "tea", "tan", "ate", "nat", "bat"]);
