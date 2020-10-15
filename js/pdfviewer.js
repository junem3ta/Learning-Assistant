$( document ).on( "pagecreate", function() {
    let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0), 
        windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    function scale( width, height, padding, border ) {
        // The window width and height are decreased by 30 to take the tolerance of 15 pixels at each side into account
        var scrWidth = $( window ).width() - 30,
            scrHeight = $( window ).height() - 30,
            ifrPadding = 2 * padding,
            ifrBorder = 2 * border,
            ifrWidth = width + ifrPadding + ifrBorder,
            ifrHeight = height + ifrPadding + ifrBorder,
            h, w;
        if ( ifrWidth < scrWidth && ifrHeight < scrHeight ) {
            w = ifrWidth;
            h = ifrHeight;
        } else if ( ( ifrWidth / scrWidth ) > ( ifrHeight / scrHeight ) ) {
            w = scrWidth;
            h = ( scrWidth / ifrWidth ) * ifrHeight;
        } else {
            h = scrHeight;
            w = ( scrHeight / ifrHeight ) * ifrWidth;
        }
        return {
            'width': w - ( ifrPadding + ifrBorder ),
            'height': h - ( ifrPadding + ifrBorder )
        };
    };
    $( ".ui-popup iframe" ).attr( "width", 0 ).attr( "height", "auto" );
    $( "#pdfViewer" ).on({
        popupbeforeposition: function() {
            // call our custom function scale() to get the width and height
            let size = scale( /* 497, 298, */ windowWidth, windowHeight, 15, 1 ),
                w = size.width,
                h = size.height;
            _l(w, h);
            $( "#pdfViewer iframe" ).attr( "width", w ).attr( "height", h );
        },
        popupafterclose: function() {
            $( "#pdfViewer iframe" ).attr( "width", 0 ).attr( "height", 0 );
        }
    });
});