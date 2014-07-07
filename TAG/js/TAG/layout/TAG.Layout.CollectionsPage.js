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
        collectionDots       = {},                               // dict of collection dots, keyed by collection id
        artworkCircles       = {},                               // dict of artwork circles in timeline, keyed by artwork id                  
        artworkTiles         = {},                               // dict of artwork tiles in bottom region, keyed by artwork id
        firstLoad            = true,                             // TODO is this necessary? what is it doing?
        currentArtworks      = [],                               // array of artworks in current collection
        infoSource           = [],                               // array to hold sorting/searching information
        timelineEventCircles = [],                               // circles for timeline
        timelineTicks        = [],                               // timeline ticks
        artworkShown         = false,                            // whether an artwork pop-up is currently displayed

        // constants
        // TO-DO: If no timeline, default tag should be "Title"
        DEFAULT_TAG      = "Year",                                 // default sort tag
        BASE_FONT_SIZE   = TAG.Worktop.Database.getBaseFontSize(), // base font size for current font
        FIX_PATH         = TAG.Worktop.Database.fixPath,           // prepend server address to given path
        MAX_YEAR         = (new Date()).getFullYear(),              // Maximum display year for the timeline is current year
        EVENT_CIRCLE_WIDTH = 20,                                   // pixel width of event circles
        LEFT_SHIFT         = 9,                                    // pixel shift of timeline event circles to center on ticks 

        // misc uninitialized vars
        fullMinDisplayDate,             // minimum display date of full timeline
        fullMaxDisplayDate,             // maximum display date of full timeline
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
     * Helper function to add collections to top bar.  Also creates an array of visible artworks
     * @method getCollectionsHelper
     * @param collections               list of collections to add to page
     */
    function getCollectionsHelper(collections) {
        var i,
            privateState,   // Is collection private?
            c,
            j,
            lastCollectionIndex,
            firstCollectionIndex,
            collectionDotHolder = $(document.createElement('div')),
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
            if(visibleCollections.length<=2){ 
                lastCollectionIndex = null;
                firstCollectionIndex = null;
            } else {
                lastCollectionIndex = visibleCollections.length - 1;
                firstCollectionIndex = 0;
            }
            visibleCollections[i].prevCollectionIndex = visibleCollections[i - 1] ? i - 1 : lastCollectionIndex;
            visibleCollections[i].nextCollectionIndex = visibleCollections[i + 1] ? i + 1 : firstCollectionIndex;
           
            collectionDot  = $(document.createElement('div'))
                        .addClass('collectionDot')
                        .on('click', loadCollection(visibleCollections[i]));

            collectionDotHolder.append(collectionDot);
            topBar.append(collectionDotHolder);

            collectionDots[visibleCollections[i].Identifier] = collectionDot;
        }

        // Load collection
        if (currCollection) {
            loadCollection(currCollection, scrollPos)();
        } else if(toShowFirst) {
            loadFirstCollection();
        }

        loadingArea.hide();
    };

    /**
     * Shows collection and title
     * @method loadCollection
     * @param {jQuery obj} collection     the element currently being clicked
     * @param {Number} sPos               if undefined, set scroll position to 0, otherwise, use this
     * @param {doq} artwrk                if undefined, set currentArtwork to null, otherwise, use this
     */
    function loadCollection(collection, sPos, artwrk) {
        return function(evt) {
            var i,
                title             = TAG.Util.htmlEntityDecode(collection.Name),
                nextTitle,
                prevTitle,
                mainCollection    = $(document.createElement('div')),
                nextCollection    = $(document.createElement('div')),
                prevCollection    = $(document.createElement('div')),
                titleBox          = $(document.createElement('div')),
                collectionDescription = $(document.createElement('div')),
                str,
                text              = collection.Metadata.Description ? TAG.Util.htmlEntityDecode(collection.Metadata.Description) : "";

            // if the idle timer hasn't started already, start it
            if(!idleTimer && evt) { // loadCollection is called without an event to show the first collection
                idleTimer = TAG.Util.IdleTimer.TwoStageTimer();
                idleTimer.start();
            }

            // Clear search box
            searchTxt.text("");

            // Clear catalog div (with info and artwork tiles)
            catalogDiv.empty();

            //Set background image
            if (collection.Metadata.BackgroundImage) {
               bgimage.css('background-image', "url(" + FIX_PATH(collection.Metadata.BackgroundImage) + ")");
            }

            //Make collection dot white and others gray
            for(i = 0; i < visibleCollections.length; i++) { 
                collectionDots[visibleCollections[i].Identifier].css('background-color','rgb(170,170,170)');
            }
            collectionDots[collection.Identifier].css('background-color', 'white');

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
            if (collection.nextCollectionIndex||collection.nextCollectionIndex===0){
                nextTitle = TAG.Util.htmlEntityDecode(visibleCollections[collection.nextCollectionIndex].Name)
                nextCollection.addClass('nextPrevCollection')
                              .attr({
                                'id': 'collection-' + visibleCollections[collection.nextCollectionIndex].Identifier
                               })
                              .html(nextTitle)
                              .css({
                                'width': (.95 * collectionArea.width() - mainCollection.width())/2,
                                'right' : 0
                              })
                              .on('click', loadCollection(visibleCollections[collection.nextCollectionIndex], sPos, artwrk));
                collectionArea.append(nextCollection);
            };
            if (collection.prevCollectionIndex||collection.prevCollectionIndex===0){
                prevTitle = TAG.Util.htmlEntityDecode(visibleCollections[collection.prevCollectionIndex].Name)
                prevCollection.addClass('nextPrevCollection')
                              .attr({
                                //'id': 'collection-' + collection.prevCollection.Identifier
                                'id': 'collection-' + visibleCollections[collection.prevCollectionIndex].Identifier
                               })
                              .html(prevTitle)
                              .css({
                                'width': (.95 * collectionArea.width() - mainCollection.width())/2,
                                'left' : 0
                              })
                              .on('click', loadCollection(visibleCollections[collection.prevCollectionIndex], sPos, artwrk));
                collectionArea.append(prevCollection);
            };

            // Hide selected artwork container, as nothing is selected yet
            selectedArtworkContainer.css('display', 'none');


            collectionDescription.attr('id', 'collectionDescription');
            str = collection.Metadata.Description ? collection.Metadata.Description.replace(/\n\r?/g, '<br />') : "";
            collectionDescription.css({
                'font-size': 0.2 * TAG.Util.getMaxFontSizeEM(str, 1.5, 0.55 * $(infoDiv).width(), 0.915 * $(infoDiv).height(), 0.1),
            });
            collectionDescription.html(Autolinker.link(str, {email: false, twitter: false}));
            infoDiv.empty();
            infoDiv.append(collectionDescription);
            catalogDiv.append(infoDiv);

            //If there's no description, change UI so that artwork tiles take up entire bottom area
            collection.Metadata.Description ? infoDiv.css('width', '25%') : infoDiv.css('width', '0');

            currCollection = collection;
            currentArtwork = artwrk || null;
            //loadCollection.call($('#collection-'+ currCollection.Identifier), currCollection);
            scrollPos = sPos || 0;
            getCollectionContents(currCollection, showArtwork(currentArtwork));
        }
    };

    /**
     * Helper function to load first collection
     * @method loadFirstCollection
     */
    function loadFirstCollection() {
        loadCollection(toShowFirst)(); // first collection selected by default
    };

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
    };

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
    };

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
    };

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
    };

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
            drawHelper();
            
        } else {
            drawHelper();
        };

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
            minOfSort      = sortedArtworks.min();
            currentWork    = minOfSort ? minOfSort.artwork : null;
            i = start;
            h = catalogDiv.height() * 0.48;
            w = h * 1.4;

            timelineEventCircles = [];
            timelineTicks = [],
            initTimeline(artworks);

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

            artworkTiles[currentWork.Identifier] = main;
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
                //TO-DO add panning here 
                zoomTimeline(parseYear(currentWork), fullMinDisplayDate, fullMaxDisplayDate);
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

            // Set tileImage to thumbnail image, if it exists
            if(currentWork.Metadata.Thumbnail) {
                tileImage.attr("src", FIX_PATH(currentWork.Metadata.Thumbnail));
            } else {
                tileImage.attr("src", tagPath+'images/no_thumbnail.svg');
            }

            // Add title
            if (tag === 'Title') {
                artText.text(TAG.Util.htmlEntityDecode(currentWork.Name));
            } else if (tag === 'Artist') {
                artText.text(currentWork.Type === 'Empty' ? '(Interactive Tour)' : currentWork.Metadata.Artist);
            } else if (tag === 'Year') {
                artText.text(currentWork.Type === 'Empty' ? '(Interactive Tour)' :  TAG.Util.htmlEntityDecode(currentWork.Name));
            } else if (tag === 'Type') {
                artText.text(TAG.Util.htmlEntityDecode(currentWork.Name));
            }
            artTitle.append(artText);

            // Styling for searches
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

            // Align tile so that it follows the grid pattern we want
            catalogDiv.append(main);
            main.css({
                'left': Math.floor(i / 2) * (main.width() + 10) + infoDiv.width(), 
                'top' : Math.floor(i % 2) * (main.height() + 10)
            });
        };
    }


    /**Initializes timeline for a collection of artworks
     * @method initTimeline
     * @param  {Array} artworks              list of artworks in the collection
     */
    function initTimeline(artworks){
        var avlTree,
            maxNode,
            maxDate,
            minDate;

        if (!artworks || artworks.length === 0){
            return;
        };

        //Sort artworks by year and find the minimum and maximum
        avlTree = sortByYear(artworks);
        maxNode = avlTree.max();

        //Skip before tours and artworks with incompatible dates
        while (maxNode.yearKey === Number.POSITIVE_INFINITY){
            maxNode = avlTree.findPrevious(maxNode);
        };

        maxDate = parseInt(maxNode.yearKey);
        minDate = parseInt(avlTree.min().yearKey);

        //Save the original maximum and minimum display date
        fullMaxDisplayDate = maxDate;
        fullMinDisplayDate = minDate;

        //TO-DO: calculate and pass in numTicks based on number of years
        
        prepTimelineArea(minDate, maxDate);
        prepTimelineCircles(avlTree, minDate, maxDate);

        /**Helper function to prepare timeline area including 'ticks'
        * @method prepTimelineArea
        * @param  {Integer} minDate          minimum artwork date
        * @param  {Integer} maxDate          maximum artwork date
        * @param  {Integer} numTicks         optional specification for number of timeline ticks
        * @return {Object}  timeline         div representing timeline ticks 
        */
        function prepTimelineArea(minDate, maxDate, numTicks){
            var timeline = $(document.createElement('div')),
                i,
                //TO-DO: constrain so numTicks can never be greater than 101
                numTicks = numTicks ? numTicks : 101,
                tick;

            timelineArea.empty();
            timeline.addClass('timeline');
            timelineArea.append(timeline);

            //Create ticks
            for (i = 0; i < numTicks; i++) { 
                tick = $(document.createElement('div'));
                tick.addClass('timelineTick');
                tick.css({
                    'left' : i/(numTicks-1)*100 + '%'
                });
                //Save ticks left position for zooming 
                tick.leftPosition = tick.position().left;
                timeline.append(tick);
                timelineTicks.push(tick);
            };
            return timeline;
        };

        /**Helper function to prepare and append the timeline event circles
        * @method prepTimelineCircles
        * @param  {AVLTree} avlTree        avlTree for access to artworks in year order
        * @param  {Number}  minDate        minimum date of artworks in collection
        * @param  {Number}  maxDate        maximum date of artworks in collection
        */
        function prepTimelineCircles(avlTree, minDate, maxDate){
            var curr,
                timeRange,
                art,
                positionOnTimeline,
                eventCircle,
                timelineCircleArea = $(document.createElement('div')),
                yearText,
                timelineDateLabel,
                prevNode,
                circleOverlap,
                labelOverlap;

            timeRange = maxDate - minDate;

            timelineCircleArea.addClass('timelineCircleArea');
            timelineArea.append(timelineCircleArea);

            curr = avlTree.min();
            art = curr.artwork;
       
            while (curr&& curr.yearKey!==Number.POSITIVE_INFINITY){
                if (!isNaN(curr.yearKey)){
                    positionOnTimeline = parseInt(100*(curr.yearKey - minDate)/timeRange);

                    //Create and append event circle
                    eventCircle = $(document.createElement('div'));                
                    eventCircle.addClass('timelineEventCircle')
                                .css('left', positionOnTimeline + '%')
                                .on('click', (function(art) {
                                    return function() {
                                    if (artworkShown === true && currentArtwork === art) {
                                        zoomTimeline(null, minDate, maxDate);
                                        hideArtwork(art)();
                                        artworkShown = false;
                                    } else {
                                    //TO-DO: make panning happen at first too if it makes sense 
                                    //panTimeline(art.circle, minDate, maxDate);
                                    zoomTimeline(artworkCircles[art.Identifier].yearKey, fullMinDisplayDate, fullMaxDisplayDate);
                                    showArtwork(art)();
                                    artworkShown  = true;
                                } 
                            }      
                        })(art));
                    timelineCircleArea.append(eventCircle);

                    //Shift circles left by half their width so they are centered on ticks
                    eventCircle.css('left', eventCircle.position().left - LEFT_SHIFT + 'px');

                    //Artworks before year 0 are automatically given the 'BCE' tag
                    if (curr.yearKey<0){
                        yearText = curr.yearKey.toString().replace(/-/g,'') + ' ' + 'BCE';
                    } else{
                        yearText = curr.yearKey.toString();
                    }

                    //Create and append timeline date labels
                    timelineDateLabel = $(document.createElement('div'))
                            .text(yearText)
                            .addClass('timelineDateLabel');
                    eventCircle.append(timelineDateLabel);

                    //Information for zooming:
                    //TO-DO: make sure eventCircle isn't given any unneccessary pieces of info
                    eventCircle.leftPosition = eventCircle.position().left;
                    eventCircle.yearKey = curr.yearKey;
                    eventCircle.originalPosition = eventCircle.position().left;
                    eventCircle.timelineDateLabel = timelineDateLabel;
                    eventCircle.labelwidth = $(timelineDateLabel).width();
                    eventCircle.artwork = art;
                
                    timelineEventCircles.push(eventCircle);
                    artworkCircles[curr.artwork.Identifier] = eventCircle;

                    //Decide whether to display labels:
                    if (avlTree.findPrevious(curr) && artworkCircles[avlTree.findPrevious(curr).artwork.Identifier]){
                        prevNode = avlTree.findPrevious(curr);
                    //Find the previous visible timeline label:
                    while (avlTree.findPrevious(prevNode) && $(artworkCircles[prevNode.artwork.Identifier].timelineDateLabel).css('visibility')!=='visible'){
                        prevNode = avlTree.findPrevious(prevNode);
                    }
                    //Check to see if the current circle is overlapping the circle of the last label: 
                    circleOverlap = areOverlapping(artworkCircles[prevNode.artwork.Identifier].position().left, eventCircle.position().left);
                    //Check to see if the label of the current circle would overlap that of the previously labelled artwork:
                    labelOverlap = labelsAreOverlapping(artworkCircles[prevNode.artwork.Identifier].position().left, eventCircle.position().left, artworkCircles[prevNode.artwork.Identifier].labelwidth); 
                    //Overlapping circles should only have 1 label: 
                    if (artworkCircles[prevNode.artwork.Identifier] && !circleOverlap && !labelOverlap){
                            timelineDateLabel.css('visibility', 'visible');
                    } else{
                        timelineDateLabel.css('visibility', 'hidden');
                    } 
                }
            }
            curr = avlTree.findNext(curr);
            if(curr) { art = curr.artwork; }
        }
    };
    };


    /** Zooms timeline to center on particular yearKey
     * @methdd zoomTimeline
     * @param  {Number} yearKey          yearKey of clicked artwork to zoom in on.
     * @param  {Number} minDisplayDate   minimum date on timeline before (additional) zoom 
     * @param  {Number} maxDisplayDate   maximum date on timeline before (additional) zoom
     * @param  {Boolean} panning         whether we are panning (sticking on same zoom level)
     */
    function zoomTimeline(yearKey, minDisplayDate, maxDisplayDate, panning){
        var initTimeRange,
            initPercentOnTimeline,
            beforeDiff,
            afterDiff,
            buffer,
            minDisplayDate,
            maxDisplayDate,
            timeRange,
            tickPercent,
            yearKeyTickIndex = 0,
            minPositionDistance = Number.MAX_VALUE,
            firstTickIndex = 0,
            positionDifference,
            numTicks=101,
            i,
            k,
            j,
            timeline,
            finalTickPositions,
            scaleTick,
            fractionOnTimeline,
            positionOnTimeline,
            timelineCircleArea,
            first = true,
            fullOverlap,
            position1,
            position2, 
            labelwidth,
            art;


        if (yearKey===0||yearKey){

            initTimeRange = maxDisplayDate - minDisplayDate;
            //TO-DO: add condition for if initTimeRange is 0. 
            initPercentOnTimeline = parseInt(100*(yearKey - minDisplayDate)/initTimeRange);

            beforeDiff = Math.round(yearKey - minDisplayDate);
            afterDiff = Math.round(maxDisplayDate - yearKey);
            //Scale correctly if already zoomed in and clicking on first dot
            beforeDiff === 0 ? buffer= Math.max(afterDiff,1) : buffer = Math.min(beforeDiff, afterDiff);
            //Don't allow minimum display date to be less than 1 year before full minimum display date
            if (minDisplayDate-buffer<fullMinDisplayDate){
                buffer = 1;
            }
            console.log("buffer: " + buffer);
            //If zoomed in to last marker, add a 1 year buffer for clear display
            afterDiff === 0 ? buffer = 1 : buffer = Math.min(buffer, afterDiff);
            console.log("buffer: " + buffer);
            minDisplayDate = Math.round(yearKey- buffer);
            maxDisplayDate = Math.round(yearKey + buffer);
            timeRange = maxDisplayDate - minDisplayDate;

            //If less than 100 years each tick is a year. 
            if (timeRange<100){
                numTicks = timeRange + 1; 
            }

        }

        //TO-DO: sync up animation (have it occur for both ticks and circles in one call), try css3 annimations for comparison
        
        timelineArea.empty();
        timeline = $(document.createElement('div'));
        timeline.addClass('timeline');
        timelineArea.append(timeline);

        //Figure out tick index of first tick displayed and yearKey's tick
        if (initTimeRange>=100){
            yearKeyTickIndex = initPercentOnTimeline;
        }else {
            //TO-DO: put in print lines here and check for calculation erros
            for (i=0; i<timelineTicks.length; i++){
                if (timelineTicks[i].css('visibility')!=='hidden'){
                    tickPercent = Math.round(100*timelineTicks[i].leftPosition/$(timeline).width());
                    positionDifference = Math.abs(tickPercent - initPercentOnTimeline);
                    if (positionDifference<minPositionDistance){
                        minPositionDistance = positionDifference;
                        yearKeyTickIndex = i;
                    }
                }
            }
            firstTickIndex = yearKeyTickIndex - timeRange/2;   
        }

        finalTickPositions = [];
        
        //Calculate final positions for timeline ticks:
        i=0;
        for (k=0; k<timelineTicks.length;k++){
            timelineTicks[k].css({'visibility': 'visible'});
            if (yearKey===null){
                finalTickPositions[k] = parseInt((k/100)*$(timeline).width());
            }
            else { //if (k>=firstTickIndex && k<= firstTickIndex+timeRange){
                fractionOnTimeline = i/(numTicks-1);
                positionOnTimeline = parseInt(fractionOnTimeline*$(timeline).width());
                finalTickPositions[k] = positionOnTimeline;
                i++;
            //}
            //else {
            //if (k<firstTickIndex || k> firstTickIndex+timeRange+1){
                //timelineTicks[k].css({'visibility': "hidden"});
            //}
            }
        }

        //TO-DO: wrapping for panning (can use 'panning' parameter if useful, if not get rid of)

        //Append and move the ticks that we are using- others should zoom off accordingly
        for (k=0; k<timelineTicks.length; k++){
            timelineTicks[k].css({left:timelineTicks[k].leftPosition});
            timeline.append(timelineTicks[k]);
            $(timelineTicks[k]).animate({
                left: finalTickPositions[k] + 'px'},
                400, function(){
                timeline.append(timelineTicks[k]);
            });
            timelineTicks[k].leftPosition = finalTickPositions[k];
        }

        //Add in extra ticks for scaling at small time ranges
        if (timeRange<5){
            for (k=0;k<timelineTicks.length; k++){
                if (k>=firstTickIndex&&k<=firstTickIndex+timeRange){
                    scaleTick = $(document.createElement('div'));
                    scaleTick.addClass('timelineTick');
                    scaleTick.css({left: timelineTicks[k].leftPosition + $(timeline).width()/timeRange/2});
                    timeline.append(scaleTick);
                }
            }
        }

        timelineCircleArea = $(document.createElement('div'));
        timelineCircleArea.addClass('timelineCircleArea');
        timelineArea.append(timelineCircleArea);
        timelineCircleArea.overlapping = false;

        
        var finalCirclePositions = [];

        //Calculate final positions for timeline circles:
        for (k=0; k<timelineEventCircles.length; k++){
            //zooming back out:
            if (yearKey===null){
                finalCirclePositions[k] = timelineEventCircles[k].originalPosition;
            } else{
                fractionOnTimeline = (timelineEventCircles[k].yearKey - minDisplayDate)/timeRange;
                positionOnTimeline = parseInt(fractionOnTimeline*$(timeline).width());
                positionOnTimeline = positionOnTimeline - LEFT_SHIFT;
                finalCirclePositions[k] = positionOnTimeline;
            } 
        }
        
        for (i=0; i<timelineEventCircles.length; i++){
                timelineEventCircles[i].css('left', timelineEventCircles[i].leftPosition);
                timelineCircleArea.append(timelineEventCircles[i]);
                $(timelineEventCircles[i]).animate({
                    left: finalCirclePositions[i] + 'px'},
                    400, function(){
                    timelineCircleArea.append(timelineEventCircles[i]);
                });
                timelineEventCircles[i].leftPosition = finalCirclePositions[i];
                //First label displayed is always visible:
                if (first){
                    timelineEventCircles[i].timelineDateLabel.css('visibility', 'visible');
                }
                if (timelineEventCircles[i].yearKey>=minDisplayDate && timelineEventCircles[i].yearKey<=maxDisplayDate){
                    first = false;
                }
                //Check for any overlaps:
                j = i-1;
                if (j>=0 && timelineEventCircles[j].yearKey>=minDisplayDate){
                    position1 = timelineEventCircles[j].leftPosition;
                    position2 = timelineEventCircles[i]. leftPosition;
                    labelwidth = timelineEventCircles[j].labelwidth;
                    fullOverlap = position1 === position2; 
                    if (!fullOverlap && (areOverlapping(position1, position2)||labelsAreOverlapping(position1,position2,labelwidth))){
                        timelineCircleArea.overlapping = true;
                    } 
                }
                //Decide whether to display labels:
                while (j>0 && timelineEventCircles[j].timelineDateLabel.css('visibility')!=='visible' && timelineEventCircles[j].yearKey>= minDisplayDate){
                    j = j-1;
                }
                if (j>=0 && !first && timelineEventCircles[j].yearKey>= minDisplayDate){
                    position1 = timelineEventCircles[j].leftPosition;
                    position2 = timelineEventCircles[i]. leftPosition;
                    labelwidth = timelineEventCircles[j].labelwidth;
                    if (!areOverlapping(position1, position2)&&!labelsAreOverlapping(position1, position2, labelwidth)){
                        timelineEventCircles[i].timelineDateLabel.css('visibility', 'visible');
                    } else{
                    timelineEventCircles[i].timelineDateLabel.css('visibility', 'hidden');
                    }
                }
                timelineEventCircles[i].append(timelineEventCircles[i].timelineDateLabel);
        }

        //Re-add on-click functions (they don't seem to stick around) TO-DO: define this somewhere else or pass in (factor out)
        for (k=0; k<timelineEventCircles.length; k++){
            art = timelineEventCircles[k].artwork;
            timelineEventCircles[k].on('click', (function(art) {
                                            return function() {
                                                if (artworkShown === true && currentArtwork === art) {
                                                    zoomTimeline(null, fullMinDisplayDate, fullMaxDisplayDate);
                                                    hideArtwork(art)();
                                                    artworkShown = false;
                                                } else {
                                                    if (timelineCircleArea.overlapping){
                                                        zoomTimeline(artworkCircles[art.Identifier].yearKey, minDisplayDate, maxDisplayDate);
                                                    } else {
                                                        panTimeline(artworkCircles[art.Identifier].yearKey, minDisplayDate, maxDisplayDate);
                                                    }
                                                    showArtwork(art)();
                                                    artworkShown  = true;
                                                } 
                                            }      
                                        })(art));
        }

    }; 

    /* Pans timeline to specific yearKey while maintaining current zoom level
     * @param  {Number} yearKey         yearKey of circle/artwork to pan to
     * @param  {Number} minDisplayDate  minimum display date of timeline before panning
     * @param  {Number} maxDisplayDate  maximum display date of timeline before panning
     */
    function panTimeline(yearKey, minDisplayDate, maxDisplayDate){
        var timeRange,
            half;
        timeRange = maxDisplayDate - minDisplayDate;
        half = Math.round(timeRange/2);
        yearKey - half < fullMinDisplayDate ? minDisplayDate = minDisplayDate : minDisplayDate = yearKey - half;
        yearKey + half > fullMaxDisplayDate ? maxDisplayDate = maxDisplayDate : maxDisplayDate = yearKey + half;
        zoomTimeline(yearKey, minDisplayDate, maxDisplayDate, true);
    }

    /* Helper function to determine if two event circles are overlapping
     * @method areOverlapping
     * @param  {Number} position1     left pixel position of the circle that is further left
     * @param  {Number}  position2    left pixel position of the circle that is further right
     * @return {Boolean}              whether the circles are overlapping
     */
    function areOverlapping(position1, position2){
        //TO-DO: add fullOverlap here
        return Math.round(position2) - Math.round(position1) < EVENT_CIRCLE_WIDTH;
    }

    /*Helper function to determine if the labels of two event cirlces are overlapping
     * @method labelsAreOverlapping
     * @param  {Number} position1       left pixel position of the circle that is further left
     * @param  {Number} position2       left pixel position of the circle that is further right
     * @param  {Number} labelWidth      the width of the label of the circle that is further left
     * @return {Boolean}                whether the labels of the two circles are overlapping
     */
    function labelsAreOverlapping(position1, position2, labelWidth){
        //Hard-coded 2 pixel buffer between labels for clarity 
        return Math.round(position1) + labelWidth + 2 > position2;
    }

    /**
      * Close the pop-up outset box of an artwork preview in the collections page
      * @method hideArtwork
      * @param {doq} artwork        the artwork doq to be hidden
      */
    function hideArtwork(artwork) {
        return function() {
            var sub = $('#selectedArtworkContainer');
            sub.css('display', 'none');
            artworkCircles[artwork.Identifier] && artworkCircles[artwork.Identifier].css({
                'height'           : '20px',
                'width'            : '20px',
                'background-color' : 'rgba(255, 255, 255, .5)',
                'border-radius'    : '10px',
                'top'              : '-8px'
            });
            artworkCircles[artwork.Identifier].timelineDateLabel.css({
                'color' : 'rgb(170,170,170)'  
            });
            artworkShown = false;
        };
    }

    /**
     * Close the pop-up outset box of an artwork preview in the collections page
     * @method hideArtwork
     * @param {doq} artwork        the artwork doq to be hidden
     */
    function hideArtwork(artwork) {
        return function() {
            var sub = $('#selectedArtworkContainer');
            sub.css('display', 'none');
            artworkCircles[artwork.Identifier] && artworkCircles[artwork.Identifier].css({
                'height'           : '20px',
                'width'            : '20px',
                'background-color' : 'rgba(255, 255, 255, .5)',
                'border-radius'    : '10px',
                'top'              : '-8px'
            });
            artworkShown = false;
        };
    }


    /**
     * Shows an artwork as an outset box and shows name, description, etc
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
            artworkShown = true;

            // Div for larger description and thumbnail of selected artwork   
            selectedArtworkContainer.css({
                'display': 'inline',
                'top' : '5%',
                'left' : catalogDiv.position().left + artworkTiles[artwork.Identifier].position().left + artworkTiles[artwork.Identifier].width()/2 - selectedArtworkContainer.width()/2
            });


            // Set selected artwork to hide when anything else is clicked
            //TO-DO: factor out parts that are same as 'hideArtwork'
            $(document).mouseup(function(e) {
                var subject = $('#selectedArtworkContainer');
                if (e.target.id != subject.attr('id') && !$(e.target).hasClass('timelineEventCircle') && !subject.has(e.target).length) {
                    subject.css('display', 'none');
                    artworkCircles[artwork.Identifier] && artworkCircles[artwork.Identifier].css({
                         'height'           : '20px',
                         'width'            : '20px',
                         'background-color' : 'rgba(255, 255, 255, .5)',
                         'border-radius'    : '10px',
                         'top'              : '-8px'
                    });
                    artworkCircles[artwork.Identifier] && artworkCircles[artwork.Identifier].timelineDateLabel.css({
                        //TO-DO- decide if should be visible//'visibility': 'visible',
                        'color' : 'rgb(170,170,170)'  
                    });
                    zoomTimeline(null, fullMinDisplayDate, fullMaxDisplayDate);
                    artworkShown = false;
                }
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
                timelineEventCircles[i].timelineDateLabel.css({
                    'color' : 'rgb(170,170,170)'
                });

                if ($(timelineEventCircles[i].timelineDateLabel).text()===artworkCircles[artwork.Identifier].timelineDateLabel.text()){
                    timelineEventCircles[i].timelineDateLabel.css('visibility','hidden');
                }
            };

            // Make current circle larger and white
            if (artworkCircles[artwork.Identifier]){
                artworkCircles[artwork.Identifier].css({
                    'height'           : '30px',
                    'width'            : '30px',
                    'background-color' : 'rgba(255, 255, 255, 1)',
                    'border-radius'    : '15px',
                    'top'              : '-12px'
                    });
                // Add label to current date
                artworkCircles[artwork.Identifier].timelineDateLabel.css({
                    'visibility': 'visible',
                    'color' : 'white'  
                })
            };

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

            return sortByYear(artworks);

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

    /**Helper function for sorting artwork tiles and timeline markers
     * Also used to catch common non-integer input date forms and generate timeline 
     * years for their display. 
     * @method sortByYear
     * @param  {Object} artworks      list of artworks to sort
     * @return {AVLTree} avlTree      sorted tree so order can be easily accessed
    **/
    function sortByYear(artworks){
        var comparator,
            valuation,
            avlTree,
            artNode,
            yearKey,
            i;
        comparator = sortComparator('yearKey');
        valuation  = sortValuation('yearKey');
        avlTree = new AVLTree(comparator, valuation);
        for (i = 0; i < artworks.length; i++) {
            yearKey = parseYear(artworks[i]);
            /**
            if (artworks[i].Metadata.Year) {
                yearKey = artworks[i].Metadata.Year
                //Catches 'ad', 'bc', 'bce' case, spacing, and order insensitive
                yearKey = yearKey.replace(/ad/gi,'')
                                 .replace(/( |\d)ce/gi,'')
                                 .replace(/\s/g,'');
                if (yearKey.search(/bce?/gi)>=0){
                    yearKey = yearKey.replace(/bce?/gi,'');
                    yearKey = "-" + yearKey;
                }
                yearKey = parseInt(yearKey);
            }
            **/
            if (!isNaN(yearKey)){
                artNode = {
                    artwork: artworks[i],
                    yearKey: artworks[i].Type === 'Empty' ? Number.POSITIVE_INFINITY : yearKey //Tours set to Infinity to show up at end of 'Year' sort
                    };
            } else{                        
                artNode = {
                    artwork: artworks[i],
                    yearKey: Number.POSITIVE_INFINITY //Set unintelligible dates to Infinity to show up at end of 'Year' sort 
                };
            }
            avlTree.add(artNode);
        }
        return avlTree;
    }

    function parseYear(artwork){
        var yearKey;
        if (artwork.Metadata.Year) {
            yearKey = artwork.Metadata.Year
            //Catches 'ad', 'bc', 'bce' case, spacing, and order insensitive
            yearKey = yearKey.replace(/ad/gi,'')
                             .replace(/( |\d)ce/gi,'')
                             .replace(/\s/g,'');
            if (yearKey.search(/bce?/gi)>=0){
                yearKey = yearKey.replace(/bce?/gi,'');
                yearKey = "-" + yearKey;
            }
            yearKey = parseInt(yearKey);
        }
        return yearKey
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