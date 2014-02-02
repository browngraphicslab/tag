LADS.Util.makeNamespace("LADS.Layout.TourPlayer");

/**
 * Player for RIN tours
 * @param tour         RIN tour in Javascript object (pre-parsed from JSON)
 * @param exhibition   exhibition we came from (if any) (doq object)
 * @param artworkPrev  value is 'artmode' when we arrive here from the art viewer
 * @param artwork      options to pass into LADS.Layout.Artmode
 * @param tourObj      the tour doq object, so we can return to the proper tour in the collections screen
 */
LADS.Layout.TourPlayer = function (tour, exhibition, artworkPrev, artwork, tourObj) {
    "use strict";

    var tagContainer = $('#tagRoot');

    var player,
        root = LADS.Util.getHtmlAjax('TourPlayer.html'),
        rinPlayer = root.find('#rinPlayer'),
        backButtonContainer = root.find('#backButtonContainer'),
        backButton = root.find('#backButton'),
        overlayOnRoot = root.find('#overlayOnRoot');

    //clicked effect for back button
    backButton.on('mousedown', function(){
        LADS.Util.UI.cgBackColor("backButton", backButton, false);
    });
    backButton.on('mouseleave', function () {
        LADS.Util.UI.cgBackColor("backButton", backButton, true);
    });

    backButton.on('click', goBack);

    function goBack () {
        var artmode, catalog;

        backButton.off('click');
        player.pause();
        player.screenplayEnded.unsubscribe();
        player.unload();

        if (artworkPrev && artwork) {
            artmode = new LADS.Layout.Artmode(artworkPrev, artwork, exhibition);
            LADS.Util.UI.slidePageRightSplit(root, artmode.getRoot());
        } else {
            catalog = new LADS.Layout.NewCatalog(tourObj, exhibition);
            LADS.Util.UI.slidePageRightSplit(root, catalog.getRoot());           
        }
        // TODO: do we need this next line?
        // tagContainer.css({ 'font-size': '11pt', 'font-family': "'source sans pro regular' sans-serif" }); // Quick hack to fix bug where rin.css was overriding styles for body element -jastern 4/30
    }

    return {
        getRoot: function () {
            return root;
        },
        startPlayback: function () { // need to call this to ensure the tour will play when you exit and re-enter a tour, since sliding functionality and audio playback don't cooperate
            rin.processAll(null, 'js/RIN/web').then(function () {
                var options = 'systemRootUrl=js/RIN/web/&autoplay=true&loop=false';
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
                player.screenplayEnded.subscribe(function() { // at the end of a tour, go back to the collections view
                    setTimeout(goBack, 1000);
                });
            });
        }
    };

};
