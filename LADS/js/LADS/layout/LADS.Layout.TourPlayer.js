LADS.Util.makeNamespace("LADS.Layout.TourPlayer");

/**
 * Player for RIN tours
 * @param tour         RIN tour in Javascript object (pre-parsed from JSON)
 * @param exhibition   exhibition we came from (if any) (doq object)
 * @param prevInfo   object containing previous page info 
 *    artworkPrev      value is 'artmode' when we arrive here from the art viewer
 *    prevScroll       value of scrollbar from new catalog page
 * @param artwork      options to pass into LADS.Layout.Artmode
 * @param tourObj      the tour doq object, so we can return to the proper tour in the collections screen
 */
LADS.Layout.TourPlayer = function (tour, exhibition, prevInfo, artwork, tourObj) {
    "use strict";

    /* nbowditch _editted 2/13/2014 : added prevInfo */
    var artworkPrev;
    var prevScroll = 0;
	var prevExhib = exhibition;
    if (prevInfo) {
        artworkPrev = prevInfo.artworkPrev,
        prevScroll = prevInfo.prevScroll || 0;
    }
    /* end nbowditch edit */

    var tagContainer = $('#tagRoot');

    var player,
        root = LADS.Util.getHtmlAjax('TourPlayer.html'),
        rinPlayer = root.find('#rinPlayer'),
        backButtonContainer = root.find('#backButtonContainer'),
        backButton = root.find('#backButton'),
        overlayOnRoot = root.find('#overlayOnRoot');

    backButton.attr('src', tagPath+'images/icons/Back.svg');

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
            /* nbowditch _editted 2/13/2014 : added prevInfo */
            var prevInfo = {prevPage: artworkPrev, prevScroll: prevScroll}; // for now, scrollbar will reset if you go further than 1 page
            artmode = new LADS.Layout.Artmode(prevInfo, artwork, exhibition);
            /* end nbowditch edit */
            LADS.Util.UI.slidePageRightSplit(root, artmode.getRoot());
        } else {
            /* nbowditch _editted 2/13/2014 : added backInfo */
            var backInfo = { backArtwork: tourObj, backScroll: prevScroll };
            catalog = new LADS.Layout.NewCatalog(backInfo, exhibition);
            /* end nbowditch edit */
            LADS.Util.UI.slidePageRightSplit(root, catalog.getRoot(), function () {
				artworkPrev = "catalog";
				var selectedExhib = $('#' + 'exhib-' + prevExhib.Identifier);
				selectedExhib.attr('flagClicked', 'true');
				selectedExhib.css({ 'background-color': 'white', 'color': 'black' });
				$(selectedExhib[0].firstChild).css({'color': 'black'});
			});           
        }
        // TODO: do we need this next line?
        // tagContainer.css({ 'font-size': '11pt', 'font-family': "'source sans pro regular' sans-serif" }); // Quick hack to fix bug where rin.css was overriding styles for body element -jastern 4/30
    }

    return {
        getRoot: function () {
            return root;
        },
        startPlayback: function () { // need to call this to ensure the tour will play when you exit and re-enter a tour, since sliding functionality and audio playback don't cooperate
            rin.processAll(null, tagPath+'js/RIN/web').then(function () {
                var options = 'systemRootUrl='+tagPath+'js/RIN/web/&autoplay=true&loop=false';
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
