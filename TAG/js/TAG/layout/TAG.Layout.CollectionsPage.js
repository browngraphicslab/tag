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
        root             = TAG.Util.getHtmlAjax('NewCatalog.html'), // use AJAX to load html from .html file
        leftbar          = root.find('#leftbar'),                    // see .jade file to see where these fit in
        displayarea      = root.find('#displayarea'),
        displayareasub   = root.find('#displayareasub'),
        collectionArea   = root.find('#collectionArea'),
        leftbarHeader    = root.find('#leftbar-header'),
        collectionHeader = root.find('#collectionHeader'),
        bgimage          = root.find('#bgimage'),
        catalogDiv       = root.find('#catalogDiv'),
        typeButton       = root.find('#typeButton'),
        sortRow          = root.find('#sortRow'),
        searchInput      = root.find('#searchInput'),
        searchTxt        = root.find('#searchTxt'),
        loadingArea      = root.find('#loadingArea'),
        backbuttonIcon   = root.find('#catalogBackButton'),

        // input options
        scrollPos        = options.backScroll || 0,     // horizontal position within collection's catalog
        currCollection   = options.backCollection,      // the currently selected collection
        currentArtwork   = options.backArtwork,         // the currently selected artwork

        // misc initialized vars
        loadQueue        = TAG.Util.createQueue(),          // an async queue for artwork tile creation, etc
        artworkSelected  = false,                            // whether an artwork is selected
        collectionTitles = [],                               // array of collection title DOM elements
        firstLoad        = true,                             // TODO is this necessary? what is it doing?
        currentArtworks  = [],                               // array of artworks in current collection
        infoSource       = [],                               // array to hold sorting/searching information

        // constants
        DEFAULT_TAG      = "Title",                                 // default sort tag
        BASE_FONT_SIZE   = TAG.Worktop.Database.getBaseFontSize(), // base font size for current font
        FIX_PATH         = TAG.Worktop.Database.fixPath,           // prepend server address to given path

        // misc uninitialized vars
        toursIn,                        // tours in current collection
        currentThumbnail,               // img tag for current thumbnail image
        numVisibleCollections,          // number of collections that are both published and visible
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

        currentPage = TAG.Util.Constants.pages.COLLECTIONS_PAGE;

        // register back button with the telemetry service
        TAG.Telemetry.register(backbuttonIcon, 'click', 'collections_to_start');

        backbuttonIcon.attr('src', tagPath+'images/icons/Back.svg');

        idleTimer = TAG.IdleTimer.TwoStageTimer();
        idleTimer.start();

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

        //handles changing the color when clicking/mousing over on the backButton
        TAG.Util.UI.setUpBackButton(backbuttonIcon, function () {
            backbuttonIcon.off('click');
            idleTimer.kill();
            idleTimer = null;
            TAG.Layout.StartPage(null, TAG.Util.UI.slidePageRight, true);
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
     * Helper function to add collections to left bar
     * @method getCollectionsHelper
     */
    function getCollectionsHelper(collections) {
        var i,
            privateState,
            c,
            artwrk,
            toShowFirst;

        numVisibleCollections = 0;

        for(i=0; i<collections.length; i++) {
            c = collections[i];
            privateState = c.Metadata.Private ? (/^true$/i).test(c.Metadata.Private) : false;
            if(!privateState && TAG.Util.localVisibility(c.Identifier)) {
                if(numVisibleCollections) {
                    bgimage.css('background-image', "url(" + FIX_PATH(c.Metadata.BackgroundImage) + ")");
                }
                toShowFirst = toShowFirst || c;
                addCollection(c);
                numVisibleCollections++;
            }
        }

        // Single collection UI; CSS modifications for the case when there is only one collection
        if(numVisibleCollections === 1) {
            enableSingleCollectionUI()
        }

        if (currCollection) {
            clickCollection(currCollection, scrollPos, currentArtwork)();
        } else if(toShowFirst) {
            clickCollection(toShowFirst)(); // first collection selected by default
        }
        loadingArea.hide();
    }

    /**
     * When only a single collection exists, this function modifies
     * the CSS to hide the list of collections and expand the
     * description area.
     *
     * @method enableSingleCollectionUI
     * @author Athyuttam Eleti
     */
    function enableSingleCollectionUI() {
        collectionArea.css("display", "none");
        collectionHeader.css("display", "none");
        displayarea.css({
            "left": "0",
            "width": "100%"
        });

        // NOT WOKING BECAUSE THESE DIVS AREN'T YET
        // CREATED WHEN THIS CODE IS EXECUTED

        // var exhibition_info = root.find("#collection-info");
        // exhibition_info.css("width", "100%");

        // var exhibition_name_div = root.find("#collection-name-div");
        // exhibition_name_div.css("width", "100%");

        // var content_div = root.find("#content-div");
        // content_div.css({
        //     "left": "4.5%",
        //     "right": "4.5%"
        // })
    }

    /**
     * Add a collection to the left bar
     * @method addCollection
     * @param {doq} collection     the collection to add
     */
    function addCollection(collection) {
        var title    = TAG.Util.htmlEntityDecode(collection.Name),
            toAdd    = $(document.createElement('div')),
            titleBox = $(document.createElement('div')),
            text     = collection.Metadata.Description ? TAG.Util.htmlEntityDecode(collection.Metadata.Description) : "";

        text = text.replace(/<br>/g, '').replace(/<br \/>/g, '');

        toAdd.addClass('collectionClickable');
        toAdd.attr({
            'flagClicked': 'false',
            'id': 'collection-' + collection.Identifier
        });
    
        toAdd.on('mousedown', function () {
            $(this).css('background-color', 'white');
            titleBox.css('color', 'black');
        });
       
        toAdd.on('mouseleave', function () {
            var elt = $(this);
            if (elt.attr('flagClicked') === 'false') {
                elt.css({
                    'background-color': 'transparent',
                    'color': 'white'
                });
                titleBox.css('color', 'white');
            }             
        });
    
        toAdd.on('click', clickCollection(collection));
        TAG.Telemetry.register(toAdd, 'click', 'collection_title', function(tobj) {
            tobj.collection_name = title;
            tobj.collection_guid = collection.Identifier;
        });

        titleBox.attr('id' ,'collection-title-'+collection.Identifier);
        titleBox.addClass('collection-title');
        titleBox.html(title);

        toAdd.append(titleBox);
        collectionArea.append(toAdd);

        collectionTitles.push(toAdd);
    }

    /**
     * Click handler for collection title in left bar
     * @method clickCollection
     * @param {jQuery obj} elt       the element we're clicking
     * @param {Number} sPos          if undefined, set scroll position to 0, otherwise, use this
     * @param {doq} artwrk           if undefined, set currentArtwork to null, otherwise, use this
     */
    function clickCollection(collection, sPos, artwrk) {
        return function() {
            var i;
            for (i = 0; i < collectionTitles.length; i++) {
                collectionTitles[i].css({ 'background-color': 'transparent', 'color': 'white' });
                collectionTitles[i].data("selected", false);
                collectionTitles[i].attr('flagClicked', 'false');
                collectionTitles[i].children().css('color', 'white');
            }
            $('#collection-'+collection.Identifier).attr('flagClicked', 'true');
            $('#collection-title-'+collection.Identifier).css('color', 'black');
            currCollection = collection;
            currentArtwork = artwrk || null;
            loadCollection.call($('#collection-'+currCollection.Identifier), currCollection);
            scrollPos = sPos || 0;
            showCollection(currCollection);
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
        var display,
            w,
            str,
            fontSize,
            titlediv,
            contentdiv,
            exploreTabText,
            exploreTab,
            exploreIcon,
            progressCircCSS,
            circle;

        searchTxt.text("");

        catalogDiv && catalogDiv.empty();

        if (collection.Metadata.BackgroundImage) {
            bgimage.css('background-image', "url(" + FIX_PATH(collection.Metadata.BackgroundImage) + ")");
        }

        !isPrivate && this.data("selected", true);

        // Remove current contents of display area
        displayareasub.empty();

        // make title
        titlediv = $(document.createElement('div'));
        titlediv.attr('id', 'collection-name-div');
        titlediv.text(TAG.Util.htmlEntityDecode(collection.Name));

        w = $(window).width() * 0.75 * 0.8;

        // display contains description, thumbnails and view button
        display = $(document.createElement('div'));
        display.attr('id', 'collection-info');
        displayareasub.append(display);

        // TODO fix this
        fontSize = TAG.Util.getMaxFontSizeEM(TAG.Util.htmlEntityDecode(collection.Name), 1.5, w, 0.2 * display.height(),0.2);
        titlediv.css({ 'font-size': fontSize });
        display.append(titlediv);

        // Contains text
        contentdiv = $(document.createElement('div'));
        contentdiv.attr('id', 'contentdiv');
        display.append(contentdiv);

        imgDiv = $(document.createElement('div'));
        imgDiv.attr('id', 'img-container');

        currentThumbnail = $(document.createElement('img'));
        currentThumbnail.attr('id', 'currentThumbnail');
        currentThumbnail.attr('src', FIX_PATH(collection.Metadata.DescriptionImage1));
        currentThumbnail.attr('thumbnail', FIX_PATH(collection.Metadata.DescriptionImage1));
        currentThumbnail.on('click', switchPage);

        TAG.Telemetry.register(currentThumbnail, 'click', '', function() {
            if (!currentArtwork || !artworkSelected) {
                return true; // abort
            }
            tobj.work_name = currentArtwork.Name;
            tobj.work_guid = currentArtwork.Identifier;
            tobj.ttype     = 'collection_to_' + getWorkType(currentArtwork); 
        });
        
        exploreTabText = $(document.createElement('div'));
        exploreTabText.attr('id','explore-text');
        exploreTabText.css("font-size", 20 * BASE_FONT_SIZE / 30 + 'em');
        exploreTabText.text("Explore");

        exploreIcon = $(document.createElement('img'));
        exploreIcon.attr('id', 'exploreIcon');
        exploreIcon.attr('src', tagPath+'images/icons/ExploreIcon.svg');

        exploreTab = $(document.createElement('div'));
        exploreTab.attr('id', 'explore-tab');
        exploreTab.on('click', switchPage);

        exploreTab.append(exploreIcon);
        exploreTab.append(exploreTabText);

        imgDiv.append(currentThumbnail);
        imgDiv.append(exploreTab);
        contentdiv.append(imgDiv);
        
        moreInfo = $(document.createElement('div'));
        moreInfo.attr('id', 'info-text');

        artistInfo = $(document.createElement('div'));
        artistInfo.attr('id', 'artistInfo');
        artistInfo.css('font-size', 11 * BASE_FONT_SIZE / 30 + 'em');

        yearInfo = $(document.createElement('div'));
        yearInfo.attr('id', 'yearInfo');
        yearInfo.css('font-size', 11 * BASE_FONT_SIZE / 30 + 'em');

        moreInfo.append(artistInfo);
        moreInfo.append(yearInfo);
        imgDiv.append(moreInfo);

        descriptiontext = $(document.createElement('div'));
        descriptiontext.attr('id', 'description-text');

        str = collection.Metadata.Description ? collection.Metadata.Description.replace(/\n\r?/g, '<br />') : "";
        
        descriptiontext.css({
            'height': '91.5%',
            'width': '55%', 
            'font-size': 0.2 * TAG.Util.getMaxFontSizeEM(str, 1.5, 0.55 * $(contentdiv).width(), 0.915 * $(contentdiv).height(), 0.1),
        });
        
        descriptiontext.html(Autolinker.link(str, {email: false, twitter: false}));

        contentdiv.append(descriptiontext);

        progressCircCSS = {
            'position': 'absolute',
            'float': 'left',
            'left': '12%',
            'z-index': '50',
            'height': '20%',
            'width': 'auto',
            'top': '22%',
        };
        circle = TAG.Util.showProgressCircle(descriptiontext, progressCircCSS, '0px', '0px', false);

        currentThumbnail.on('load', function () {
            TAG.Util.removeProgressCircle(circle);
        });

        if (!isPrivate) {
            $(this).css({
                'background-color': 'rgb(255,255,255)',
                'color': 'black'
            });
        }
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
        }

        if (start === 0) {
            loadQueue.clear();
            catalogDiv.empty();
            drawHelper();
            
        } else {
            drawHelper();
        }

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
            h = $(catalogDiv).height() * 0.48;
            w = h * 1.4;

            works = sortedArtworks.getContents();
            for (j = 0; j < works.length; j++) {
                loadQueue.add(drawArtworkTile(works[j].artwork, tag, onSearch, i + j, w, h));
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
     * @param {Number} w            width of this tile
     * @param {Number} h            height of this tile
     */
    function drawArtworkTile(currentWork, tag, onSearch, i, w, h) {
        return function () {
            var main      = $(document.createElement('div')),
                artTitle  = $(document.createElement('div')),
                artText   = $(document.createElement('div')),
                tileImage = $(document.createElement('img')),
                tourLabel,
                videoLabel;

            main.addClass("tile");
            tileImage.addClass('tileImage');
            artTitle.addClass('artTitle');
            artText.addClass('artText');

            main.css({
                'margin-left': Math.floor(i / 2) * 16.5 + 1 + '%', // TODO do this using w rather than 16.5%
                'margin-top': (i % 2) * 12.25 + '%'
            });

            main.on('click', function () {
                if (currentThumbnail.attr('guid') === currentWork.Identifier) { // click twice to enter viewer
                    switchPage();
                } else {
                    showArtwork(currentWork)();
                    justShowedArtwork = true;
                }
            });

            TAG.Telemetry.register(main, 'click', '', function(tobj) {
                var type;
                if (currentThumbnail.attr('guid') === currentWork.Identifier && !justShowedArtwork) {
                    tobj.ttype = 'collections_to_' + getWorkType(currentWork);
                } else {
                    tobj.ttype = 'artwork_tile';
                }
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
            main.append(tileImage);
            main.append(artTitle);

            if (currentWork.Type === "Empty") {
                tourLabel = $(document.createElement('img'))
                tourLabel.addClass('tourLabel');
                tourLabel.attr('src', tagPath+'images/icons/catalog_tour_icon.svg');
                main.append(tourLabel);
            } else if (currentWork.Metadata.Medium === "Video") {
                videoLabel = $(document.createElement('img'));
                videoLabel.addClass('videoLabel');
                videoLabel.attr('src', tagPath+'images/icons/catalog_video_icon.svg');
                main.append(videoLabel);
            }
            catalogDiv.append(main);
        };
    }

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
                descSpan;

            if(!artwork) {
                return;
            }

            currentArtwork = artwork;
            artworkSelected = true;
            $('#explore-tab').css('display', 'inline-block');

            if (artwork.Type !== "Empty") {
                artistInfo.text("Artist: " + (artwork.Metadata.Artist || "Unknown"));
                yearInfo.text(artwork.Metadata.Year || " ");
            } else {
                artistInfo.text("(Interactive Tour)" );
                yearInfo.text(" " );
            }
                
            currentThumbnail.css('border', '1px solid rgba(0,0,0,0.5)')
                .attr({
                    src:  artwork.Metadata.Thumbnail ? FIX_PATH(artwork.Metadata.Thumbnail) : (tagPath+'images/no_thumbnail.svg'),
                    guid: artwork.Identifier
                });

            setTimeout(function() {
                currentThumbnail.attr('guid', '');
            }, 400); // hack to simulate double-click event
            
            titleSpan = $(document.createElement('div'))
                        .text(TAG.Util.htmlEntityDecode(artwork.Name))
                        .attr('id', 'titleSpan');
            
            descSpan = $(document.createElement('div'))
                        .attr('id', 'descSpan');
            
            descSpan.html(Autolinker.link(artwork.Metadata.Description ? artwork.Metadata.Description.replace(/\n/g, '<br />') : '', {email: false, twitter: false}));
                            
            descriptiontext.empty();
            descriptiontext.append(titleSpan).append(descSpan);            
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
        $('.rowButton').css('color', 'gray');
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

        rinPlayer = new TAG.Layout.TourPlayer(rinData, currCollection, collectionOptions, null, tour);

        if (TAG.Util.Splitscreen.on()) { // if splitscreen is on, exit it
            parentid = root.parent().attr('id');
            TAG.Util.Splitscreen.exit(parentid[parentid.length - 1]);
        }

        TAG.Util.UI.slidePageLeftSplit(root, rinPlayer.getRoot(), rinPlayer.startPlayback);
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

        idleTimer.kill();
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
            videoPlayer = new TAG.Layout.VideoPlayer(currentArtwork, currCollection, prevInfo);
            TAG.Util.UI.slidePageLeftSplit(root, videoPlayer.getRoot());
        }
        else { // artwork
            scrollPos = catalogDiv.scrollLeft();
            artworkViewer = new TAG.Layout.ArtworkViewer({
                doq: currentArtwork,
                prevScroll: scrollPos,
                prevCollection: currCollection,
                prevPage: 'catalog'
            });
            TAG.Util.UI.slidePageLeftSplit(root, artworkViewer.getRoot());
        }
        root.css({ 'overflow-x': 'hidden' });
    }

    /**
     * Show collection contents and display current artwork if there is one
     * @method showCollection
     * @param {doq} c         the relevant collection doq
     */
    function showCollection (c) {
        getCollectionContents(c, showArtwork(currentArtwork));
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
        loadCollection: loadCollection
    };
};

TAG.Layout.CollectionsPage.default_options = {};