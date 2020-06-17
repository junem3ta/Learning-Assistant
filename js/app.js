console.log(~"abc".indexOf("w"));

/* 
@TestHistory, REPO.

//Test04
    /* Print a half pyramid of hashes *//*
    var n=6;
    /* 
    Desired output
        # 1, ws=5 
        ## 2, ws=4
    ### 3, ws=3
    #### 4, ws=2
    ##### 5, ws=1
    ###### 6, ws=0
    *//*
    for(i=1; i<=n; i++) {
        //generate whitespaces 
        var whiteSpaces = '';
        for(var j=0; j<n-i; j++) {
            whiteSpaces +=' ';
        }

        //generatePHString
        var placeHolderString = '';
        for(var k=0; k<i; k++) {
            placeHolderString +='#';
        }

        console.log(whiteSpaces + placeHolderString + placeHolderString + "\r");
    }
    /* End algorithm *//*

//@Test03
    function truthyOrFalsy(a) {
        console.log(a);
        //return a ? console.log("truthy") : console.log("falsy");
    }

    truthyOrFalsy(~1);

//Test02
    function truthyOrFalsy(a) {
        return a ? "truthy" : "falsy";
    }

    truthyOrFalsy(01);

//@Test01
    function truthyOrFalsy(a) {
        return a ? console.log("truthy") : console.log("falsy");
    }

    truthyOrFalsy(01);

//Initial test
    console.log("I love tasks.json");

*/