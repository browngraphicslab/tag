TAG.Util.makeNamespace("TAG.Layout.CollectionsPage");

/**
 * The collections page
 * @class TAG.Layout.CollectionsPage
 * @constructor
 * @param {Object} options         some options for the collections page
 * @return {Object}                some public methods
 */
TAG.Layout.CollectionsPage = function (options) { // backInfo, backExhibition, container, forSplitscreen) {
    "use strict";

    options = options || {}; // cut down on null checks later

    var // DOM-related
        root                     = TAG.Util.getHtmlAjax('NewCatalog.html'), // use AJAX to load html from .html file
        infoDiv                  = root.find('#infoDiv'),
        collectionArea           = root.find('#collectionArea'),
        collectionHeader         = root.find('#collectionHeader'),
        bgimage                  = root.find('#bgimage'),
        catalogDiv               = root.find('#catalogDiv'),
        infoTilesContainer       = root.find('#infoTilesContainer'),
        sortRow                  = root.find('#sortRow'),
        searchInput              = root.find('#searchInput'),
        searchTxt                = root.find('#searchTxt'),
        selectedArtworkContainer = root.find('#selectedArtworkContainer'),
        timelineArea             = root.find('#timelineArea'),
        topBar                   = root.find('#topBar'),
        loadingArea              = root.find('#loadingArea'),

        // input options
        scrollPos        = options.backScroll || 0,     // horizontal position within collection's catalog
        currCollection   = options.backCollection,      // the currently selected collection
        currentArtwork   = options.backArtwork,         // the currently selected artwork

        // misc initialized vars
        loadQueue            = TAG.Util.createQueue(),           // an async queue for artwork tile creation, etc
        artworkSelected      = false,                            // whether an artwork is selected
        visibleCollections   = [],                               // array of collections that are visible and published
        firstLoad            = true,                             // TODO is this necessary? what is it doing?
        currentArtworks      = [],                               // array of artworks in current collection
        infoSource           = [],                               // array to hold sorting/searching information
        timelineEventCircles = [],                               // circles for timeline

        // constants
        DEFAULT_TAG      = "Title",                                // default sort tag
        BASE_FONT_SIZE   = TAG.Worktop.Database.getBaseFontSize(), // base font size for current font
        FIX_PATH         = TAG.Worktop.Database.fixPath,           // prepend server address to given path

        // misc uninitialized vars
        toShowFirst,                    // first collection to be shown (by default)
        toursIn,                        // tours in current collection
        currentThumbnail,               // img tag for current thumbnail image
        imgDiv,                         // container for thumbnail image
        descriptiontext,                // description of current collection or artwork
        loadingArea,                    // container for progress circle
        moreInfo,                       // div holding tombstone information for current artwork
        artistInfo,                     // artist tombstone info div
        yearInfo,                       // year tombstone info div
        justShowedArtwork,              // for telemetry; helps keep track of artwork tile clicks
        currentTag;                     // current sort tag

    // get things rolling
    init();

    /**
     * Sets up the collections page UI
     * @method init
     */
    function init() {
        var progressCircCSS,
            circle,
            oldSearchTerm;

        idleTimer = null;

        progressCircCSS = {
            'position': 'absolute',
            'z-index': '50',
            'height': 'auto',
            'width': '5%',
            'left': '47.5%',
            'top': '42.5%'
        };
        
        circle = TAG.Util.showProgressCircle(loadingArea, progressCircCSS, '0px', '0px', false);

        root.find('.rowButton').on('click', function() {
            changeDisplayTag(currentArtworks, $(this).attr('tagName'));
        });

        TAG.Telemetry.register(root.find('#artistButton'), 'click', '', function(tobj) {
            tobj.ttype = 'sort_by_artist';
        });

        TAG.Telemetry.register(root.find('#titleButton'), 'click', '', function(tobj) {
            tobj.ttype = 'sort_by_title';
        });

        TAG.Telemetry.register(root.find('#yearButton'), 'click', '', function(tobj) {
            tobj.ttype = 'sort_by_year';
        });

        TAG.Telemetry.register(root.find('#typeButton'), 'click', '', function(tobj) {
            tobj.ttype = 'sort_by_type';
        });

        // search on keyup
        searchInput.on('keyup', function (e) {
            doSearch();
        });
        TAG.Worktop.Database.getExhibitions(getCollectionsHelper, null, getCollectionsHelper);
    }

    /**
     * Return the type of work
     * @method getWorkType
     * @param {doq} work       the doq representing the current work
     * @return {String}        a string describing type of work ('artwork', 'video', or 'tour')
     */
    function getWorkType(work) {
        if (currentArtwork.Type === 'Empty') {
            return 'tour';
        } else if (currentArtwork.Metadata.Type === 'VideoArtwork') {
            return 'video';
        }
        return 'artwork';
    }

    /**
     * Helper function to add collections to top bar
     * @method getCollectionsHelper
     * @param collections               list of collections to add to page
     */
    function getCollectionsHelper(collections) {
        var i,
            privateState,   // Is collection private?
            c,
            j,
            collectionDotHolder  = $(document.createElement('div')),
            collectionDot;

        // Iterate through entire list of collections to to determine which are visible/not private/published.  Also set toShowFirst
        for(i=0; i<collections.length; i++) {
            c = collections[i];
            privateState = c.Metadata.Private ? (/^true$/i).test(c.Metadata.Private) : false;
            if(!privateState && TAG.Util.localVisibility(c.Identifier)) {
                toShowFirst = toShowFirst || c;
                visibleCollections.push(collections[i]);
            }
        }

        // Iterate through visible/not private/published collections, and set their prev and next values
        // Also create a scroll dot for each (under main collection title)
        collectionDotHolder.addClass('collectionDotHolder');
        for(i = 0; i < visibleCollections.length; i++) { 
            visibleCollections[i].prevCollection = visibleCollections[i - 1] ? visibleCollections[i - 1] : visibleCollections[visibleCollections.length - 1];
            visibleCollections[i].nextCollection = visibleCollections[i + 1] ? visibleCollections[i + 1] : visibleCollections[0];

            collectionDot  = $(document.createElement('div'))
                        .addClass('collectionDot')
                        .on('click', showCollection(visibleCollections[i]));

            collectionDotHolder.append(collectionDot);
            topBar.append(collectionDotHolder);

            visibleCollections[i].dot = collectionDot;
        }

        // Load collection
        if (currCollection) {
            showCollection(currCollection, privateState,  scrollPos)();
        } else if(toShowFirst) {
            loadFirstCollection();
        }

        loadingArea.hide();
    };

    /**
     * Click handler for collection title in left bar
     * @method showCollection
     * @param {jQuery obj} collection     the element we're clicking
     * @param {Boolean} isPrivate         a little bit of a hack to get private exhibits
     *                                    to show in settings view.  When set to true it just ignores anything
     *                                    that relies on 'this' since 'this' doesn't exist for a private exhibit
     *                                    (it doesn't have a label in the exhib list)
     * @param {Number} sPos               if undefined, set scroll position to 0, otherwise, use this
     * @param {doq} artwrk                if undefined, set currentArtwork to null, otherwise, use this
     */
    function showCollection(collection, isPrivate, sPos, artwrk) {
        return function(evt) {
            var i,
                title             = TAG.Util.htmlEntityDecode(collection.Name),
                nextTitle,
                prevTitle,
                mainCollection    = $(document.createElement('div')),
                nextCollection    = $(document.createElement('div')),
                prevCollection    = $(document.createElement('div')),
                titleBox          = $(document.createElement('div')),
                text              = collection.Metadata.Description ? TAG.Util.htmlEntityDecode(collection.Metadata.Description) : "";

            // if the idle timer hasn't started already, start it
            if(!idleTimer && evt) { // showCollection is called without an event to show the first collection
                idleTimer = TAG.Util.IdleTimer.TwoStageTimer();
                idleTimer.start();
            }

            // Make collection dot white and others gray
            for(i = 0; i < visibleCollections.length; i++) { 
                visibleCollections[i].dot.css('background-color','rgb(170,170,170)');
            };
            collection.dot.css('background-color', 'white');

            // Add collection title
            collectionArea.empty();
            mainCollection.addClass('mainCollection')
                          .attr({
                            'id': 'collection-' + collection.Identifier,
                           });

            titleBox.attr('id' ,'collection-title-'+collection.Identifier)
                    .addClass('collection-title')
                    .html(title);

            mainCollection.append(titleBox);
            collectionArea.append(mainCollection);

            // Add previous and next collection titles
            if (collection.nextCollection){
                nextTitle = TAG.Util.htmlEntityDecode(collection.nextCollection.Name)
                nextCollection.addClass('nextPrevCollection')
                              .attr({
                                'id': 'collection-' + collection.nextCollection.Identifier
                               })
                              .html(nextTitle)
                              .css({
                                'width': (.95 * collectionArea.width() - mainCollection.width())/2,
                                'right' : 0
                              })
                              .on('click', showCollection(collection.nextCollection, sPos, artwrk));

                collectionArea.append(nextCollection);
            };
            if (collection.prevCollection){
                prevTitle = TAG.Util.htmlEntityDecode(collection.prevCollection.Name)
                prevCollection.addClass('nextPrevCollection')
                              .attr({
                                'id': 'collection-' + collection.prevCollection.Identifier
                               })
                              .html(prevTitle)
                              .css({
                                'width': (.95 * collectionArea.width() - mainCollection.width())/2,
                                'left' : 0
                              })
                              .on('click', showCollection(collection.prevCollection, sPos, artwrk));
                collectionArea.append(prevCollection);
            };
            $('#collection-'+collection.Identifier).attr('flagClicked', 'true');
           // $('#collection-title-'+collection.Identifier).css('color', 'black');
            currCollection = collection;
            currentArtwork = artwrk || null;
            loadCollection.call($('#collection-'+ currCollection.Identifier), currCollection);
            scrollPos = sPos || 0;
            getCollectionContents(currCollection, showArtwork(currentArtwork));
        }
    }

    /**
     * When a collection is selected in the left bar, load its image and description
     * in the display area
     * @method loadCollection
     * @param {doq} collection     the collection to load
     * @param {Boolean} isPrivate  a little bit of a hack to get private exhibits
     *                             to show in settings view.  When set to true it just ignores anything
     *                             that relies on 'this' since 'this' doesn't exist for a private exhibit
     *                             (it doesn't have a label in the exhib list)
     */
    function loadCollection(collection, isPrivate) {
        var w,
            str,
            progressCircCSS,
            collectionDescription;

        searchTxt.text("");

        catalogDiv && catalogDiv.empty();

        if (collection.Metadata.BackgroundImage) {
           bgimage.css('background-image', "url(" + FIX_PATH(collection.Metadata.BackgroundImage) + ")");
        }

        !isPrivate && this.data("selected", true);

        // Remove current contents of display area
        infoDiv.empty();

        w = $(window).width() * 0.75 * 0.8;

        // Hide selected artwork container
        selectedArtworkContainer.css('display', 'none');

        // Display contains description, thumbnails and view button
        // Contains text
        collectionDescription = $(document.createElement('div'))
            .attr('id', 'collectionDescription');
        str = collection.Metadata.Description ? collection.Metadata.Description.replace(/\n\r?/g, '<br />') : "";
        collectionDescription.css({
            'font-size': 0.2 * TAG.Util.getMaxFontSizeEM(str, 1.5, 0.55 * $(infoDiv).width(), 0.915 * $(infoDiv).height(), 0.1),
        });
        collectionDescription.html(Autolinker.link(str, {email: false, twitter: false}));
        infoDiv.append(collectionDescription);

        //If there's no description, change UI so that artwork tiles take up entire bottom area
        if (!collection.Metadata.Description){
            infoDiv.css('display', 'none'); // Hide description area
            catalogDiv.css('width', '100%'); // make tile area fill entire bottom container
        } else {
            infoDiv.css('display', 'inline');
            catalogDiv.css('width', '75%');
        };

        if (!isPrivate) {
            $(this).css({
           //     'background-color': 'rgb(255,255,255)',
           //     'color': 'black'
            });
        };

    };

    /**
     * Helper function to load first collection
     * @method loadFirstCollection
     */
    function loadFirstCollection() {
        showCollection(toShowFirst)(); // first collection selected by default
    }

    /**
     * Get contents (artworks, videos, tours) in the specified collection and make catalog
     * @method getCollectionContents
     * @param {doq} collecion         the collection whose contents we want
     * @param {Function} callback     a function to call when the contents have been retrieved
     */
    function getCollectionContents(collection, callback) {
        TAG.Worktop.Database.getArtworksIn(collection.Identifier, contentsHelper, null, contentsHelper);

        /**
         * Helper function to process collection contents
         * @method contentsHelper
         * @param {Array} contents     array of doq objects for each of the contents of this collection
         */
        function contentsHelper(contents) {
            var makeNoArtworksOptionBox;

            if (!contents || !contents[0]) { // pops up box warning user there is no artwork in selected collection
                noArtworksOptionBox = TAG.Util.UI.makeNoArtworksOptionBox();
                root.append(noArtworksOptionBox);
                $(noArtworksOptionBox).fadeIn(500);
            }

            createArtTiles(contents);
            initSearch(contents);
            callback && callback();
        }
    }

    /**
     * Store the search strings for each artwork/tour
     * @method initSearch
     * @param {Array} contents    the contents of this collection (array of doqs)
     */
    function initSearch(contents) {
        var info,
            i,
            cts;

        searchInput[0].value = "";
        infoSource = [];

        for (i = 0; i < contents.length; i++) {
            cts = contents[i];
            if (!cts) {
                continue;
            }
            info = cts.Name + " " + cts.Metadata.Artist + " " + cts.Metadata.Year + " " + cts.Metadata.Type;
            infoSource.push({
                "id": i,
                "keys": info.toLowerCase()
            });
        }
    }

    /**
     * Search collection using string in search input box
     * @method doSearch
     */
    function doSearch() {
        var content = searchInput.val().toLowerCase(),
            matchedArts = [],
            unmatchedArts = [],
            i;

        if (!content) {
            searchTxt.text("");
            drawCatalog(currentArtworks, currentTag, 0, false);
            return;
        }

        for (i = 0; i < infoSource.length; i++) {
            if (infoSource[i].keys.indexOf(content) > -1) {
                matchedArts.push(currentArtworks[i]);
            } else {
                unmatchedArts.push(currentArtworks[i]);
            }
        }

        searchTxt.text(matchedArts.length > 0 ? "Results Found" : "No Matching Results");

        drawCatalog(matchedArts, currentTag, 0, true);
        drawCatalog(unmatchedArts, currentTag, matchedArts.length, false);
    }

    /**
     * Create tiles for each artwork/tour in a collection
     * @method createArtTiles
     * @param {Array} artworks     an array of doq objects
     */
    function createArtTiles(artworks) {
        currentArtworks = artworks;
        currentTag = DEFAULT_TAG;
        colorSortTags(currentTag);
        drawCatalog(currentArtworks, currentTag, 0);
    }

    /**
     * Draw the collection catalog
     * @method drawCatalog
     * @param {Array} artworks    the contents of the collection
     * @param {String} tag        current sorting tag
     * @param {Number} start      starting at start-th artwork total (note NOT start-th artwork in artworks)
     * @param {Boolean} onSearch  whether the list of artworks is a list of works matching a search term
     */
    function drawCatalog(artworks, tag, start, onSearch) {
        if (!currCollection) {
            return;
        };

        if (start === 0) {
            loadQueue.clear();
            catalogDiv.empty();
            drawHelper();
            
        } else {
            drawHelper();
        };

        createTimeline(artworks);

        // helper function to perform the actual drawing (to make sure we deal with async correctly)
        function drawHelper() {
            var sortedArtworks,
                minOfSort,
                currentWork,
                works,
                i, h, w, j;

            if (!artworks || artworks.length === 0){
                return;
            }

            sortedArtworks = sortCatalog(artworks, tag);
            minOfSort = sortedArtworks.min();
            currentWork = minOfSort ? minOfSort.artwork : null;
            i = start;
            h = catalogDiv.height() * 0.48;
            w = h * 1.4;

            works = sortedArtworks.getContents();
            for (j = 0; j < works.length; j++) {
                loadQueue.add(drawArtworkTile(works[j].artwork, tag, onSearch, i + j));
                loadQueue.add(function () {
                    if(catalogDiv.width() <= scrollPos) {
                        catalogDiv.animate({
                            scrollLeft: scrollPos
                        }, 0);
                    }
                });
            }
        }
    }

    /**
     * Creates an artwork tile in a collection's catalog
     * @method drawArtworkTile
     * @param {doq} currentWork     the artwork/tour for which we're creating a tile
     * @param {String} tag          current sort tag
     * @param {Boolean} onSearch    whether this work is a match after searching
     * @param {Number} i            index into list of all works in this collection
     */
    function drawArtworkTile(currentWork, tag, onSearch, i) {
        return function () {
            var main      = $(document.createElement('div')),
                artTitle  = $(document.createElement('div')),
                artText   = $(document.createElement('div')),
                tileImage = $(document.createElement('img')),
                tourLabel,
                videoLabel;

            currentWork.tile = main;
            main.addClass("tile");
            tileImage.addClass('tileImage');
            artTitle.addClass('artTitle');
            artText.addClass('artText');

            main.on('click', function () {
                // if the idle timer hasn't started already, start it
                if(!idleTimer) {
                    idleTimer = TAG.Util.IdleTimer.TwoStageTimer();
                    idleTimer.start();
                }

                showArtwork(currentWork)();
                justShowedArtwork = true;
            });

            TAG.Telemetry.register(main, 'click', '', function(tobj) {
                var type;
                //if (currentThumbnail.attr('guid') === currentWork.Identifier && !justShowedArtwork) {
                //    tobj.ttype = 'collections_to_' + getWorkType(currentWork);
                //} else {
                    tobj.ttype = 'artwork_tile';
                //}
                tobj.artwork_name = currentWork.Name;
                tobj.artwork_guid = currentWork.Identifier;

                justShowedArtwork = false;
            });

            if(currentWork.Metadata.Thumbnail) {
                tileImage.attr("src", FIX_PATH(currentWork.Metadata.Thumbnail));
            } else {
                tileImage.attr("src", tagPath+'images/no_thumbnail.svg');
            }

            if (tag === 'Title') {
                artText.text(TAG.Util.htmlEntityDecode(currentWork.Name));
            } else if (tag === 'Artist') {
                artText.text(currentWork.Type === 'Empty' ? '(Interactive Tour)' : currentWork.Metadata.Artist);
            } else if (tag === 'Year') {
                artText.text(currentWork.Type === 'Empty' ? '(Interactive Tour)' : currentWork.Metadata.Year);
            } else if (tag === 'Type') {
                artText.text(TAG.Util.htmlEntityDecode(currentWork.Name));
            }
            artTitle.append(artText);

            if (!onSearch && searchInput.val() !== '') {
                tileImage.css({ 'opacity': '0.3' });
                main.css('border', '1px solid black');
            } else if (onSearch) {
                tileImage.css({ 'opacity': '1.0'});
                main.css('border', '1px solid rgba(255, 255, 255, 0.5)');
            }
            main.append(tileImage)
                .append(artTitle);

            if (currentWork.Type === "Empty") {
                tourLabel = $(document.createElement('img'))
                    .addClass('tourLabel')
                    .attr('src', tagPath+'images/icons/catalog_tour_icon.svg');
                main.append(tourLabel);
            } else if (currentWork.Metadata.Medium === "Video") {
                videoLabel = $(document.createElement('img'))
                    .addClass('videoLabel')
                    .attr('src', tagPath+'images/icons/catalog_video_icon.svg');
                main.append(videoLabel);
            }
            catalogDiv.append(main);
            main.css({
                'left': Math.floor(i / 2) * (main.width() + 10), 
                'top': Math.floor(i % 2) * (main.height() + 10)
            });
        };
    }

    /**
     * Creates a timeline
     * @method createTimeline
     * @param artworks    artworks to create the timeline for
     */
     function createTimeline(artworks) {
        var avlTree,
            artNode,
            comparator,
            eventCircle,
            i,
            j,
            minDate,
            maxDate,
            timeRange,
            timelineTick,
            tick,
            timelineDateLabel,
            timelineTicks = [],
            timeline = $(document.createElement('div')),
            positionOnTimeline,
            valuation;

        timelineArea.empty();

        timeline.addClass('timeline');
        timelineArea.append(timeline);

        // If there are no artworks, return
        if (!artworks || artworks.length === 0){
            return;
        }   

        // Create ticks
        for (i = 0; i < 101; i++) { 
            tick = $(document.createElement('div'));
            tick.addClass('timelineTick');
            tick.css({
                'left' : i + '%'
            });
            timeline.append(tick);
            timelineTicks.push(tick);
        };

        // Sort artworks by year to create a range of dates to use for the timeline
        comparator = sortComparator('yearKey');
        valuation  = sortValuation('yearKey');

        avlTree = new AVLTree(comparator, valuation);
        for (i = 0; i < artworks.length; i++) {
            artNode = {
                artwork: artworks[i],
                yearKey: artworks[i].Type === 'Empty' ? '~~~~' : artworks[i].Metadata.Year // tours show up at end
            };
            avlTree.add(artNode);
        };

        // Get minimum of this search
        minDate = parseInt(avlTree.min().yearKey);
        maxDate = avlTree.max();
        while (maxDate.yearKey === '~~~~'){
            maxDate = avlTree.findPrevious(maxDate);
        };
        maxDate = parseInt(maxDate.yearKey);

        // Time range is difference between earliest and latest dates of artworks.
        //TODO: find a more effecient/logical ways to generate these numbers
        timeRange = maxDate - minDate;
        maxDate = parseInt(maxDate + timeRange/10);
        minDate = parseInt(minDate - timeRange/10);
        timeRange = maxDate - minDate;

        // Make artwork event circles and dates

        var curr = avlTree.min()
        while (avlTree.findNext(curr)){
            if (!isNaN(curr.yearKey)){
                positionOnTimeline = parseInt(100*(curr.yearKey - minDate)/timeRange);
                eventCircle = $(document.createElement('div'));
                eventCircle.addClass('timelineEventCircle')
                    .css('left', positionOnTimeline + '%')
                    .on('click', showArtwork(curr.artwork));
                timeline.append(eventCircle);
                curr.artwork.circle = eventCircle;
                timelineEventCircles.push(eventCircle);

                timelineDateLabel = $(document.createElement('div'))
                    .addClass('timelineDateLabel')
                    .text(curr.yearKey);
                eventCircle.append(timelineDateLabel);
                eventCircle.timelineDateLabel = timelineDateLabel;

                // If circles are too close together, don't add dates to both of them
                if ((avlTree.findPrevious(curr)) && (eventCircle.position().left - avlTree.findPrevious(curr).artwork.circle.position().left) < eventCircle.width()*2){
                    timelineDateLabel.css('visibility', 'hidden');
                };
            };
            curr = avlTree.findNext(curr);
        }
     };

    /**
     * Shows an artwork in the upper section; sets the current thumbnail to be the artwork's
     * and shows name, description, etc
     * @method showArtwork
     * @param {doq} artwork     the artwork doq to be shown
     *
     */
    function showArtwork(artwork) {
        return function () {
            var titleSpan,
                descSpan,
                imgDiv,
                currentThumbnail,
                exploreTabText,
                exploreTab,
                exploreIcon,
                moreInfo,
                artistInfo,
                yearInfo,
                descriptiontext,
                progressCircCSS,
                timelineDateLabel,
                circle,
                i;

            if(!artwork) {
                return;
            }

            currentArtwork = artwork;
            artworkSelected = true;
            // Div for larger description and thumbnail of selected artwork   
            selectedArtworkContainer.css({
                'display': 'inline',
                'top' : '5%',
                'left' : catalogDiv.position().left + artwork.tile.position().left + artwork.tile.width()/2 - selectedArtworkContainer.width()/2
            });
            selectedArtworkContainer.empty();

            // Title
            titleSpan = $(document.createElement('div'))
                        .text(TAG.Util.htmlEntityDecode(artwork.Name))
                        .attr('id', 'titleSpan');
            selectedArtworkContainer.append(titleSpan);

            // Div for thumnail of selected artwork
            imgDiv = $(document.createElement('div'))
                .attr('id', 'img-container');

            currentThumbnail = $(document.createElement('img'))
                .attr('id', 'currentThumbnail')
                .attr('src', artwork.Metadata.Thumbnail ? FIX_PATH(artwork.Metadata.Thumbnail) : (tagPath+'images/no_thumbnail.svg'))
                .attr('guid', artwork.Identifier)
                .on('click', switchPage);

            imgDiv.append(currentThumbnail);

            // Telemetry on artworks
            TAG.Telemetry.register(currentThumbnail, 'click', '', function(tobj) {
                if (!currentArtwork || !artworkSelected) {
                    return true; // abort
                }
                tobj.work_name = currentArtwork.Name;
                tobj.work_guid = currentArtwork.Identifier;
                tobj.ttype     = 'collection_to_' + getWorkType(currentArtwork); 
            });

            // Explore tab text, tab, and icon (on thumbnail of selected artwork)
            exploreTabText = $(document.createElement('div'))
                .attr('id','explore-text')
                .css("font-size", 20 * BASE_FONT_SIZE / 30 + 'em')
                .text("Explore");

            exploreIcon = $(document.createElement('img'))
                .attr('id', 'exploreIcon')
                .attr('src', tagPath+'images/icons/ExploreIcon.svg');

            exploreTab = $(document.createElement('div'))
                .attr('id', 'explore-tab')
                .on('click', switchPage)
                .css('display', 'inline-block');

            exploreTab.append(exploreIcon)
                .append(exploreTabText);
            imgDiv.append(exploreTab);
            selectedArtworkContainer.append(imgDiv);
        
            // Info beneath thumbnail of selected art
            moreInfo = $(document.createElement('div'))
                .attr('id', 'info-text');

            artistInfo = $(document.createElement('div'))
                .attr('id', 'artistInfo')
                .css('font-size', 11 * BASE_FONT_SIZE / 30 + 'em');

            yearInfo = $(document.createElement('div'))
                .attr('id', 'yearInfo')
                .css('font-size', 11 * BASE_FONT_SIZE / 30 + 'em');

            if (artwork.Type !== "Empty") {
                artistInfo.text("Artist: " + (artwork.Metadata.Artist || "Unknown"));
                yearInfo.text(artwork.Metadata.Year || " ");
            } else {
                artistInfo.text("(Interactive Tour)" );
                yearInfo.text(" " );
            }

            moreInfo.append(artistInfo)
                .append(yearInfo);
            imgDiv.append(moreInfo);

            //Description of artwork
            descriptiontext = $(document.createElement('div'))
                .attr('id', 'description-text');

            descSpan = $(document.createElement('div'))
                .attr('id', 'descSpan')
                .html(Autolinker.link(artwork.Metadata.Description ? artwork.Metadata.Description.replace(/\n/g, '<br />') : '', {email: false, twitter: false}));

            descriptiontext.empty()
                            .append(descSpan);  

            selectedArtworkContainer.append(descriptiontext);

            //Circle (with date) on timeline
            for (i = 0; i < timelineEventCircles.length; i++) { // Make sure all other circles are grayed-out and small
                timelineEventCircles[i].css({
                        'height'           : '20px',
                        'width'            : '20px',
                        'background-color' : 'rgba(255, 255, 255, .5)',
                        'border-radius'    : '10px',
                        'top'              : '-8px'
                    });

                if (timelineEventCircles[i].timelineDateLabel.shouldBeHidden === true){ // Make sure labels that aren't supposed to be shown are grayed out
                    timelineEventCircles[i].timelineDateLabel.css('visibility', 'hidden');
                }
            };

            // Make current circle larger and white
            if (artwork.circle){
                artwork.circle.css({
                    'height'           : '30px',
                    'width'            : '30px',
                    'background-color' : 'rgba(255, 255, 255, 1)',
                    'border-radius'    : '15px',
                    'top'              : '-12px'
                    });
                // Add label to current date
                artwork.circle.timelineDateLabel.css({
                    'visibility': 'visible',
                    'color' : 'white'  
                })
                artwork.circle.timelineDateLabel.shouldBeHidden = true // If date is not one of the perminantly-there grayed out ones, mark it to be hidden again later when different artwork is selected
            };

            // Set selectedArtwork to hide when anything else is clicked
            // $(":not(#selectedArtworkContainer)").css('onmousedown', function() {
            //     console.log('not (artworkcontainer) selected');
            //     selectedArtworkContainer.css('display', 'none');
            //     artwork.circle && artwork.circle.css({
            //             'height'           : '20px',
            //             'width'            : '20px',
            //             'background-color' : 'rgba(255, 255, 255, .5)',
            //             'border-radius'    : '10px',
            //             'top'              : '-8px'
            //     });
            // });

            //Progress circle for loading
            // TODO: is this showing up? Look into
            progressCircCSS = {
                'position': 'absolute',
                'float'   : 'left',
                'left'    : '12%',
                'z-index' : '50',
                'height'  : '20%',
                'width'   : 'auto',
                'top'     : '22%',
            };

            circle = TAG.Util.showProgressCircle(descriptiontext, progressCircCSS, '0px', '0px', false);

            currentThumbnail.on('load', function () {
                TAG.Util.removeProgressCircle(circle);
            });

            // Hack to simulate double-click event
            setTimeout(function() {
                currentThumbnail.attr('guid', '');
            }, 400);
        };
    }

    /**
     * Generates a comparator function for catalog sorting
     * @method sortComparator
     * @param {String} primary     the primary sorting property
     * @param {String} secondary   the secondary sorting property
     *                                if left undefined, a.artwork.Identifier is used
     *                                as the secondary property
     */
    function sortComparator(primary, secondary) {
        return function(a, b) {
            var aSecondary,
                bSecondary;
            if (a[primary] < b[primary]) {
                return -1;
            } else if (a[primary] > b[primary]) {
                return 1;
            } else {
                aSecondary = secondary ? a[secondary] : a.artwork.Identifier;
                bSecondary = secondary ? b[secondary] : b.artwork.Identifier;
                if (aSecondary < bSecondary) {
                    return -1;
                } else if (aSecondary > bSecondary) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
    }

    /**
     * Generates a valuation function for catalog sorting
     * @method sortValuation
     * @param {String} property     valuation property name
     */
    function sortValuation(property) {
        return function(value, compareToNode) {
            if (!compareToNode) {
                return null;
            } else if (value < compareToNode[property]) {
                return -1;
            } else if (value > compareToNode[property]) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    /**
     * Sort the catalog by the given criterium
     * @method sortCatalog
     * @param {Array} artworks    an array of doq objects to be sorted
     * @param {String} tag        the sort type
     * @return {AVLTree}          an avl tree for easy sorting
     */
    function sortCatalog(artworks, tag) {
        var comparator,
            valuation,
            avlTree,
            artNode,
            i;

        if (tag === 'Title') {
            comparator = sortComparator('nameKey');
            valuation  = sortValuation('nameKey');

            avlTree = new AVLTree(comparator, valuation);
            avlTree.clear();
            for (i = 0; i < artworks.length; i++) {
                artNode = {
                    artwork: artworks[i],
                    nameKey: artworks[i].Name,
                };
                avlTree.add(artNode);
            }
            return avlTree;
        } else if (tag === 'Artist') {
            comparator = sortComparator('artistKey');
            valuation  = sortValuation('artistKey');

            avlTree = new AVLTree(comparator, valuation);
            for (i = 0; i < artworks.length; i++) {
                artNode = {
                    artwork: artworks[i],
                    artistKey: artworks[i].Type === 'Empty' ? '~~~~' : artworks[i].Metadata.Artist // tours show up at end
                };
                avlTree.add(artNode);
            }
            return avlTree;
        } else if (tag === 'Year') {
            comparator = sortComparator('yearKey');
            valuation  = sortValuation('yearKey');

            avlTree = new AVLTree(comparator, valuation);
            for (i = 0; i < artworks.length; i++) {
                artNode = {
                    artwork: artworks[i],
                    yearKey: artworks[i].Type === 'Empty' ? '~~~~' : artworks[i].Metadata.Year // tours show up at end
                };
                avlTree.add(artNode);
            }
            return avlTree;
        } else if (tag === 'Type') {
            comparator = sortComparator('typeKey', 'nameKey');
            valuation  = sortValuation('nameKey');

            avlTree = new AVLTree(comparator, valuation);
            for (i = 0; i < artworks.length; i++) {
                artNode = {
                    artwork: artworks[i],
                    nameKey: artworks[i].Name,
                    typeKey: artworks[i].Type === 'Empty' ? 1 : (artworks[i].Metadata.Type === 'Artwork' ? 2 : 3)
                };
                avlTree.add(artNode);
            }
            return avlTree;
        }
        
        return null; // error case: falsy tag
    }

    /** 
     * Set the colors of the sort tags
     * @method colorSortTags
     * @param {String} tag    the name of the sort tag
     */
    function colorSortTags(tag) {
        $('.rowButton').css('color', 'rgb(170,170,170)');
        $('[tagName="'+tag+'"]').css('color', 'white');
    }

    /**
     * Changes the selected tag and re-sorts
     * @method changeDisplayTag
     * @param {Array} artworks     the array of artwork doqs to sort
     * @param {String} tag         the name of the sort tag
     */
    function changeDisplayTag(artworks, tag) {
        var guidsSeen   = [],
            toursArray  = [],
            artsArray   = [],
            videosArray = [],
            bigArray    = [],
            i;

        currentTag = tag;
        colorSortTags(currentTag);
        if (tag !== 'Type') {
            drawCatalog(artworks, currentTag, 0, false);
        } else {
            for (i = 0; i < artworks.length; i++) {
                if (guidsSeen.indexOf(artworks[i].Identifier) < 0) {
                    guidsSeen.push(artworks[i].Identifier);
                } else {
                    continue;
                }
                if (artworks[i].Type === "Empty") {
                    toursArray.push(artworks[i]);
                } else if (artworks[i].Metadata.Type === "Artwork") {
                    artsArray.push(artworks[i]);
                } else {
                    videosArray.push(artworks[i]);
                }
            }

            // draw tours, artworks, then videos
            bigArray.concat(toursArray).concat(artsArray).concat(videosArray);
            drawCatalog(bigArray, "Title", 0, false);
        }
        doSearch(); // search with new tag
    }

    /**
     * Switch to the tour player
     * @method switchPageTour
     * @param {doq} tour    the relevant tour doq
     */
    function switchPageTour(tour) {
        var rinData,
            rinPlayer,
            prevInfo,
            messageBox,
            collectionOptions,
            parentid;
       
        rinData = JSON.parse(unescape(tour.Metadata.Content));

        if (!rinData || !rinData.data) {
            messageBox = $(TAG.Util.UI.popUpMessage(null, "Cannot play empty tour.", null));
            messageBox.css('z-index', TAG.TourAuthoring.Constants.aboveRinZIndex + 7);
            root.append(messageBox);
            messageBox.fadeIn(500);
            return;
        }
        
        scrollPos = catalogDiv.scrollLeft();

        collectionOptions = {
            backScroll: scrollPos,
            backCollection: currCollection,
            backArtwork: currentArtwork
        }

        rinPlayer = TAG.Layout.TourPlayer(rinData, currCollection, collectionOptions, null, tour);

        if (TAG.Util.Splitscreen.on()) { // if splitscreen is on, exit it
            parentid = root.parent().attr('id');
            TAG.Util.Splitscreen.exit(parentid[parentid.length - 1]);
        }

        TAG.Util.UI.slidePageLeftSplit(root, rinPlayer.getRoot(), rinPlayer.startPlayback);

        currentPage.name = TAG.Util.Constants.pages.TOUR_PLAYER;
        currentPage.obj  = rinPlayer;
    }

    /**
     * Switch to the artwork viewer or tour player
     * @method switchPage
     */
    function switchPage() {
        var curOpts,
            artworkViewer,
            splitopts = 'L',
            opts = getState(),
            confirmationBox,
            prevInfo,
            videoPlayer;

        if (!currentArtwork || !artworkSelected) {
            return;
        }

        idleTimer && idleTimer.kill();
        idleTimer = null;

        curOpts = {
            catalogState: opts,
            doq: currentArtwork,
            split: splitopts
        };

        if (currentArtwork.Type === "Empty") { // tour
            if (TAG.Util.Splitscreen.on()) {
                confirmationBox = TAG.Util.UI.PopUpConfirmation(function(){
                    switchPageTour(currentArtwork);
                }, "By opening this tour, you will exit split screen mode. Would you like to continue?", "Continue", false, function () {
                    $(confirmationBox).remove();
                }, root);
                $(confirmationBox).css('z-index', 10001);
                root.append($(confirmationBox));
                $(confirmationBox).show();
            } else {
                switchPageTour(currentArtwork);
            }
        } else if (currentArtwork.Metadata.Type === "VideoArtwork") { // video
            scrollPos = catalogDiv.scrollLeft();
            prevInfo = {
                artworkPrev: null,
                prevScroll: scrollPos
            };
            videoPlayer = TAG.Layout.VideoPlayer(currentArtwork, currCollection, prevInfo);
            TAG.Util.UI.slidePageLeftSplit(root, videoPlayer.getRoot());

            currentPage.name = TAG.Util.Constants.pages.VIDEO_PLAYER;
            currentPage.obj  = videoPlayer;
        } else { // artwork
            scrollPos = catalogDiv.scrollLeft();
            artworkViewer = TAG.Layout.ArtworkViewer({
                doq: currentArtwork,
                prevScroll: scrollPos,
                prevCollection: currCollection,
                prevPage: 'catalog'
            });
            TAG.Util.UI.slidePageLeftSplit(root, artworkViewer.getRoot());

            currentPage.name = TAG.Util.Constants.pages.ARTWORK_VIEWER;
            currentPage.obj  = artworkViewer;
        }
        root.css({ 'overflow-x': 'hidden' });
    }

    /**
     * Gets the current state of the collections page
     * @method getState
     * @return {Object}    object containing state
     */
    function getState() {
        return {
            exhibition: currCollection,
            currentTag: DEFAULT_TAG,
            currentImage: currentArtwork
        };
    }

    /**
     * Returns the root of the collections page
     * @method getRoot
     * @return {jQuery Object}    root of the collections page
     */
    function getRoot() {
        return root;
    }

    return {
        getRoot: getRoot,
        loadCollection: loadCollection,
        loadFirstCollection: loadFirstCollection
    };
};

TAG.Layout.CollectionsPage.default_options = {};