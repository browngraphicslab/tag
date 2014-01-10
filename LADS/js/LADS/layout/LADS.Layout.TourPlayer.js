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

    var tagContainer = $('#tagRoot');
    

    var player,
        root = LADS.Util.getHtmlAjax('TourPlayer.html'), // $(document.createElement('div')),
        rinPlayer = root.find('#rinPlayer'), // $(document.createElement('div')),
        backButtonContainer = root.find('#backButtonContainer'), // $(document.createElement('div')),
        backButton = root.find('#backButton'),
        overlayOnRoot = root.find('#overlayOnRoot'), // $(document.createElement('div')),
        w = screen.width,
        h = screen.height,
        idealW = h * 16 / 9,
        idealH = w * 9 / 16,
        xoffset, yoffset;

    // set width and height to enforce 16:9 aspect ratio
    // if (idealW <= w) {
    //     xoffset = (w - idealW) / 2;
    //     root.css({
    //         'position': 'absolute',
    //         'left': xoffset + 'px',
    //         'top': '0px',
    //         'width': idealW,
    //         'height': '100%'
    //     });
    // } else {
    //     yoffset = (h - idealH) / 2;
    //     root.css({
    //         'position': 'absolute',
    //         'top': yoffset + 'px',
    //         'left': '0px',
    //         'height': idealH,
    //         'width': '100%'
    //     });
    // }

    // playerElement.attr('id', 'rinplayer');
    // playerElement.css({
    //     'position': 'absolute',
    //     'overflow': 'hidden',
    //     //left: 0, top: 0,
    //     width: '100%', height: '100%'
    // });

    //overlayOnRoot for back button
    // overlayOnRoot.css({
    //     'position': 'absolute',
    //     'left': '0px',
    //     'top': '0px',
    //     'background-color': 'rgba(255,0,0,1)',
    //     'width': '100%',
    //     'height':'auto'
    //    // 'display':'none'
    // });
    

    // Back button
    // back.css({
    //     position: 'absolute',
    //     height: '5%',
    //     top: '15px',
    //     left: '15px',
    //     'z-index': LADS.TourAuthoring.Constants.aboveRinZIndex
    // });
    // back.addClass("tourBack");
    
    // var backButton =  $(document.createElement('img'));
    // backButton.attr('src', 'images/icons/Back.svg');

    // backButton.css({
    //     'z-index': LADS.TourAuthoring.Constants.aboveRinZIndex,
    //     'width': '100%',
    //     'height': 'auto',
    //     'position': 'relative'
    // });
    //clicked effect for back button
    backButton.mousedown(function(){
        LADS.Util.UI.cgBackColor("backButton", backButton, false);
    });
    backButton.mouseleave(function () {
        LADS.Util.UI.cgBackColor("backButton", backButton, true);
    });

    backButton.on('click', function () {
        var artmode, catalog;

        backButton.off('click');
        player.pause();
        player.unload();

        if (artworkPrev && artwork) {
            artmode = new LADS.Layout.Artmode(artworkPrev, artwork, exhibition);
            LADS.Util.UI.slidePageRightSplit(root, artmode.getRoot());
        } else {
            // TODO FIX THIS TO GO BACK TO CURRENT ARTWORK/EXHIBITION
            catalog = new LADS.Layout.NewCatalog(exhibition);
            LADS.Util.UI.slidePageRightSplit(root, catalog.getRoot());           
        }
        // TODO: do we need this next line?
        tagContainer.css({ 'font-size': '11pt', 'font-family': DEFAULT_FONT_FAMILY }); // Quick hack to fix bug where rin.css was overriding styles for body element -jastern 4/30
    });

    return {
        getRoot: function () {
            return root;
        },
        startPlayback: function () { // need to call this to ensure the tour will play when you exit and re-enter a tour, since sliding functionality and audio playback don't cooperate
            // start RIN
            // rin.processAll(null, 'js/RIN/web').then(function() {
            //     var playerControl = rin.getPlayerControl(rinPlayer);
            //     var deepstateUrl = playerControl.resolveDeepStateUrlFromAbsoluteUrl(window.location.href);
            //     if(deepstateUrl) {
            //         playerControl.load(deepstateUrl);
            //     }
            // })

            // return;
            

            rin.processAll(null, 'js/RIN/web').then(function () {
                var options = 'systemRootUrl=js/RIN/web/&autoplay=true';
                // debugger;
                // create player
                player = rin.createPlayerControl(rinPlayer[0], options);
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