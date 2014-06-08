TAG.Util.makeNamespace("TAG.Layout.TourPlayer");

/**
 * Player for RIN tours
 * @param tour         RIN tour in Javascript object (pre-parsed from JSON)
 * @param exhibition   exhibition we came from (if any) (doq object)
 * @param prevInfo   object containing previous page info 
 *    artworkPrev      value is 'artmode' when we arrive here from the art viewer
 *    prevScroll       value of scrollbar from new catalog page
 * @param artmodeOptions      options to pass into TAG.Layout.Artmode
 * @param tourObj      the tour doq object, so we can return to the proper tour in the collections screen
 */
TAG.Layout.TourPlayer = function (tour, exhibition, prevInfo, artmodeOptions, tourObj) {
    "use strict";

    var artworkPrev;
    var prevScroll = 0;
	var prevExhib = exhibition;

    var tagContainer = $('#tagRoot');

    var player,
        root = TAG.Util.getHtmlAjax('TourPlayer.html'),
        rinPlayer = root.find('#rinPlayer'),
        backButtonContainer = root.find('#backButtonContainer'),
        backButton = root.find('#backButton'),
        overlayOnRoot = root.find('#overlayOnRoot');

    currentPage = TAG.Util.Constants.pages.TOUR_PLAYER;

    // UNCOMMENT IF WE WANT IDLE TIMER IN TOUR PLAYER
    // idleTimer = TAG.IdleTimer.TwoStageTimer();
    // idleTimer.start();

    backButton.attr('src', tagPath+'images/icons/Back.svg');
    //clicked effect for back button
    backButton.on('mousedown', function(){
        TAG.Util.UI.cgBackColor("backButton", backButton, false);
    });
    backButton.on('mouseleave', function () {
        TAG.Util.UI.cgBackColor("backButton", backButton, true);
    });

    backButton.on('click', goBack);

    function goBack () {
        console.log('player: '+player);

        var artmode, catalog;

        // UNCOMMENT IF WE WANT IDLE TIMER IN TOUR PLAYER
        // idleTimer.kill();
        // idleTimer = null;
        
        if(player) {
            player.pause();
            player.screenplayEnded.unsubscribe();
            console.log('UNLOADING PLAYER');
            player.unload();
        }

        if(!player || rinPlayer.children().length === 0) {
            return; // if page hasn't loaded yet, don't exit (TODO -- should have slide page overlay)
        }

        backButton.off('click'); // prevent user from clicking twice

        if (artmodeOptions) {
            artmode = new TAG.Layout.Artmode(artmodeOptions);
            TAG.Util.UI.slidePageRightSplit(root, artmode.getRoot());

            var selectedExhib = $('#collection-' + prevExhib.Identifier);
            selectedExhib.attr('flagClicked', 'true');
        } else {
            /* nbowditch _editted 2/13/2014 : added backInfo */
            var backInfo = { backArtwork: tourObj, backScroll: prevScroll };
            catalog = new TAG.Layout.NewCatalog({
                backScroll: prevScroll,
                backArtwork: tourObj,
                backCollection: exhibition
            });
            /* end nbowditch edit */
            TAG.Util.UI.slidePageRightSplit(root, catalog.getRoot(), function () {
				artworkPrev = "catalog";
				var selectedExhib = $('#collection-' + prevExhib.Identifier);
				selectedExhib.attr('flagClicked', 'true');
				selectedExhib.css({ 'background-color': 'white', 'color': 'black' });
                if(selectedExhib[0].firstChild) {
    				$(selectedExhib[0].firstChild).css({'color': 'black'});
                }
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
                            tour.resources[key].uriReference = TAG.Worktop.Database.fixPath(tour.resources[key].uriReference);
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
