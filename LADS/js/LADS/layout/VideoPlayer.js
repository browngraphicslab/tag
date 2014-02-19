LADS.Util.makeNamespace("LADS.Layout.VideoPlayer");

/**
 * Player for RIN tours
 * @param tour      RIN tour in Javascript object (pre-parsed from JSON)
 *@param exhibition: 
 *@param artworkPrev: thumbnail of the artwork
 *@param artwork:the artworks in this tour
 */
LADS.Layout.VideoPlayer = function (videoSrc, exhibition) {
    "use strict";
    var TOPBAR_HEIGHT = '8';
    var TOPBAR_BGCOLOR = 'rgb(63,55,53)';
    var DEFAULT_FONT_FAMILY = '"Segoe UI", "Ebrima", "Nirmala UI", "Gadugi", "Segoe UI Symbol", "Meiryo UI", "Khmer UI", "Tunga", "Lao UI", "Raavi", "Iskoola Pota", "Latha", "Leelawadee", "Microsoft YaHei UI", "Microsoft JhengHei UI", "Malgun Gothic", "Estrangelo Edessa", "Microsoft Himalaya", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le", "Microsoft Yi Baiti", "Mongolian Baiti", "MV Boli", "Myanmar Text", "Cambria Math"'; // CSS override fix (see below) -jastern

    //overlayOnRoot for back button
    overlayOnRoot.css({
        'position': 'absolute',
        'left': '0px',
        'top': '0px',
        'background-color': 'rgba(255,0,0,1)',
        'width': '100%',
        'height':'auto'
        // 'display':'none'
    });
    
    //create top bar
    var topBar = $(document.createElement('div'));
    topBar.css({
        'background-color': TOPBAR_BGCOLOR,
        'width': '100%',
        'height': TOPBAR_HEIGHT + '%',
        'top':'2%',
        'position':'absolute'
    });

    var bottomBar = $(document.createElement('div'));
    topBar.css({
        'background-color': TOPBAR_BGCOLOR,
        'width': '100%',
        'height': TOPBAR_HEIGHT + '%',
        'bottom':'2%',
        'position':'absolute'

    });

    root.append(topBar);
    root.append(bottomBar);


    var player = $(document.createElement('video'));
    player.css ( {
        'width': '100%',
        'height':'100%'
    });
    player.attr('src', videoSrc);


    //create top bar

    var backButton =  $(document.createElement('img'));
    backButton.attr('src', 'images/icons/Back.svg');

    backButton.css({
        'z-index': 'LADS.TourAuthoring.Constants.aboveRinZIndex',
        'width': '100%',
        'height': 'auto',
        'position': 'relative'
    });

    bottomBar.append(player);
    topBar.append(backButton);

    //clicked effect for back button
    backButton.mousedown(function(){
        LADS.Util.UI.cgBackColor("backButton", backButton, false);
    });
    backButton.mouseleave(function () {
        LADS.Util.UI.cgBackColor("backButton", backButton, true);
    });

    backButton.click(function () {
        backButton.off('click');
        player.pause();

        /* nbowditch _editted 2/13/2014 : added backInfo */
        var backInfo = { backArtwork: null, backScroll: prevScroll };
        var catalog = new LADS.Layout.NewCatalog(null, function (exhibitions) {

            //catalog.clickExhibitionByDoq(exhibitionID);
            root.css({ 'overflow-x': 'hidden' });
        });
        /* end nbowditch edit */
        LADS.Util.UI.slidePageRightSplit(root, catalog.getRoot());
    });

    function createTimer() {
        if (!player[0].paused()) {
            backButton.fadeOut(500);
        }
    }

    var hideTimer = createTimer();

    root.on("mousemove", function() {
        hideTimer.cancel();
        hideTimer=createTimer();
    }

};