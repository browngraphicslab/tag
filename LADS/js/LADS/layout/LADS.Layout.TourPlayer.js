LADS.Util.makeNamespace("LADS.Layout.TourPlayer");

/**
 * Player for RIN tours
 * @param tour      RIN tour in Javascript object (pre-parsed from JSON)
 *@param exhibition: 
 *@param artworkPrev: thumbnail of the artwork
 *@param artwork:the artworks in this tour
 */
LADS.Layout.TourPlayer = function (tour, exhibition, artworkPrev, artwork) {
    "use strict";

    var DEFAULT_FONT_FAMILY = '"Segoe UI", "Ebrima", "Nirmala UI", "Gadugi", "Segoe UI Symbol", "Meiryo UI", "Khmer UI", "Tunga", "Lao UI", "Raavi", "Iskoola Pota", "Latha", "Leelawadee", "Microsoft YaHei UI", "Microsoft JhengHei UI", "Malgun Gothic", "Estrangelo Edessa", "Microsoft Himalaya", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le", "Microsoft Yi Baiti", "Mongolian Baiti", "MV Boli", "Myanmar Text", "Cambria Math"'; // CSS override fix (see below) -jastern

    var player,
        root = $(document.createElement('div')),
        playerElement = $(document.createElement('div')),
        back = $(document.createElement('div')),
        overlayOnRoot = $(document.createElement('div')),
        w = screen.width,
        h = screen.height,
        idealW = h * 16 / 9,
        idealH = w * 9 / 16,
        xoffset, yoffset;

    // set width and height to enforce 16:9 aspect ratio
    if (idealW <= w) {
        xoffset = (w - idealW) / 2;
        root.css({
            'position': 'absolute',
            'left': xoffset + 'px',
            'top': '0px',
            'width': idealW,
            'height': '100%'
        });
    } else {
        yoffset = (h - idealH) / 2;
        root.css({
            'position': 'absolute',
            'top': yoffset + 'px',
            'left': '0px',
            'height': idealH,
            'width': '100%'
        });
    }

    playerElement.attr('id', 'rinplayer');
    playerElement.css({
        'position': 'absolute',
        'overflow': 'hidden',
        //left: 0, top: 0,
        width: '100%', height: '100%'
    });

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
    

    // Back button
    back.css({
        position: 'absolute',
        height: '5%',
        top: '15px',
        left: '15px',
        'z-index': LADS.TourAuthoring.Constants.aboveRinZIndex
    });
    back.addClass("tourBack");
    
    var backButton =  $(document.createElement('img'));
    backButton.attr('src', 'images/icons/Back.svg');

    backButton.css({
        'z-index': 'LADS.TourAuthoring.Constants.aboveRinZIndex',
        'width': '100%',
        'height': 'auto',
        'position': 'relative'
    });
    //clicked effect for back button
    backButton.mousedown(function(){
        LADS.Util.UI.cgBackColor("backButton", backButton, false);
    });
    backButton.mouseleave(function () {
        LADS.Util.UI.cgBackColor("backButton", backButton, true);
    });

    backButton.click(function () {
    // Added these API calls because there were some weird issues
        // when tours persisted after closing. -jastern 5/15   //////// THESE SEEM TO BE CAUSING AUDIO PLAYBACK ERRORS
        backButton.off('click');
        player.pause();
        player.unload();

        if (artworkPrev !== undefined && artwork !== undefined) {
            // If we were pushed from an artmode view, go back there
            var artmode = new LADS.Layout.Artmode(artworkPrev, artwork, exhibition);
            root.css({ 'overflow-x': 'hidden' });
            LADS.Util.UI.slidePageRightSplit(root, artmode.getRoot());
            }
        else {//go back to the exhibition if pushed from exhibition
            //var tempExhibitions = new LADS.Layout.Exhibitions(null, function (exhibitions) {

            //FIX THIS TO GO BACK TO CURRENT ARTWORK/EXHIBITION
            var catalog = new LADS.Layout.NewCatalog(exhibition);

           // exhibitions.selectTourTab();
            //catalog.clickExhibitionByDoq(null, exhibition);//ERROR=catalog doesnt support
                root.css({ 'overflow-x': 'hidden' });

            LADS.Util.UI.slidePageRightSplit(root, catalog.getRoot());           
        }
        $('body').css({ 'font-size': '11pt', 'font-family': DEFAULT_FONT_FAMILY }); // Quick hack to fix bug where rin.css was overriding styles for body element -jastern 4/30
   });

    back.append(backButton);
	root.append(playerElement);
    root.append(back);

    return {
        getRoot: function () {
            return root;
        },
        startPlayback: function () { // need to call this to ensure the tour will play when you exit and re-enter a tour, since sliding functionality and audio playback don't cooperate
            // Start RIN
            rin.processAll(null, 'js/rin/web').then(function () {
                var options = 'systemRootUrl=js/rin/web/&autoplay=true';

                // create player
                player = rin.createPlayerControl(playerElement[0], options);
                for (var key in tour.resources) {
                    if (tour.resources.hasOwnProperty(key)) {
                        if (typeof tour.resources[key].uriReference === 'string') {
                            tour.resources[key].uriReference = LADS.Worktop.Database.fixPath(tour.resources[key].uriReference);
                        }
                    }
                }
                player.loadData(tour, function () {

                });
            });
        }
    };

};