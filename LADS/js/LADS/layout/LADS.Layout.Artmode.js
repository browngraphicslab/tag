﻿LADS.Util.makeNamespace("LADS.Layout.Artmode");

/**
 * The artwork viewer, which contains a sidebar with tools and thumbnails as well
 * as a central area for the deepzoom image.
 * @class LADS.Layout.Artmode
 * @constructor
 * @param {Object} options        some options for the artwork viewer page
 * @return {Object}               some public methods
 */
LADS.Layout.Artmode = function (options) { // prevInfo, options, exhibition) {
    "use strict";

    options = options || {}; // cut down on null checks later

    var // DOM-related
        root                = LADS.Util.getHtmlAjax('Artmode.html'),
        sideBar             = root.find('#sideBar'),
        toggler             = root.find('#toggler'),
        togglerImage        = root.find('#togglerImage'),
        backButton          = root.find('#backButton'),
        locHistoryDiv       = root.find('#locationHistoryDiv'),
        info                = root.find('#info'),
        locHistoryToggle    = root.find('#locationHistoryToggle'),
        locHistory          = root.find('#locationHistory'),
        locHistoryContainer = root.find('#locationHistoryContainer'),

        // constants
        FIX_PATH            = LADS.Worktop.Database.fixPath,

        // input options
        doq            = options.doq,              // the artwork doq
        prevPage       = options.prevPage,         // the page we came from (string)
        prevScroll     = options.prevScroll || 0,  // scroll position where we came from
        prevCollection = options.prevCollection,   // collection we came from, if any

        // misc initialized vars
        locHistoryActive = false,                   // whether location history is open
        locClosing = false,                         // wheter location history is closing
        locOpening = false,                         // whether location history is opening
        drawers          = [],                      // the expandable sections for assoc media, tours, description, etc...
        mediaHolders     = [],                      // array of thumbnail buttons
        loadQueue        = LADS.Util.createQueue(), // async queue for thumbnail button creation, etc

        // misc uninitialized vars
        locationList,                      // location history data
        map,                               // Bing Maps map for location history
        annotatedImage,                    // an AnnotatedImage object
        associatedMedia;                   // object of associated media objects generated by AnnotatedImage
        
    // get things rolling if doq is defined (it better be)
    doq && init();

    /**
     * Initiate artmode with a root, artwork image and a sidebar on the left
     * @method init
     */
    function init() {
        var head,
            script,
            meta;

        // add script for displaying bing maps
        head = document.getElementsByTagName('head').item(0);
        script = document.createElement("script");
        script.charset = "UTF-8";
        script.type = "text/javascript";
        script.src = "http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0";
        head.appendChild(script);

        meta = document.createElement('meta');
        meta.httpEquiv = "Content-Type";
        meta.content = "text/html; charset=utf-8";
        head.appendChild(meta);

        locationList = LADS.Util.UI.getLocationList(doq.Metadata);

        annotatedImage = LADS.AnnotatedImage({
            root: root,
            doq:  doq,
            callback: function () {
                associatedMedia = annotatedImage.getAssociatedMedia();
                associatedMedia.guids.sort(function (a, b) {
                    return associatedMedia[a].doq.Name.toLowerCase() < associatedMedia[b].doq.Name.toLowerCase() ? -1 : 1;
                });
                try { // TODO figure out why loadDoq sometimes causes a NetworkError (still happening?)
                    annotatedImage.openArtwork(doq);
                } catch(err) {
                    debugger;
                    console.log(err); // TODO if we hit a network error, show an error message
                }
                LADS.Util.Splitscreen.setViewers(root, annotatedImage); // TODO should we get rid of all splitscreen stuff?
                makeSidebar();
                createSeadragonControls();
                console.log("viewer" + annotatedImage.viewer);
            },
            noMedia: false
        });
    }

    /**
     * Add controls and key handlers for manual Seadragon manipulation
     * @method createSeadragonControls
     */
    function createSeadragonControls() {
        var container        = root.find('#seadragonManipContainer'),
            slideButton      = root.find('#seadragonManipSlideButton'),
            tagRoot          = $('#tagRoot'),
            CENTER_X         = tagRoot.width()/2,
            CENTER_Y         = tagRoot.height()/2,
            D_PAD_TOP        = 26,
            D_PAD_LEFT       = 60,
            top              = 0,
            count            = 0,
            panDelta         = 20,
            zoomScale        = 0.1,
            containerFocused = true,
            interval;

        container.css('left', ($('#tagRoot').width() - 160) + "px"); // do this with 'right' instead

        slideButton.on('click', function () {
            count = 1 - count;
            container.animate({
                top: top
            });
            if (count === 0){
                top = 0;
                slideButton.html("Show Controls");
            } else {
                top = -100;
                slideButton.html('Hide Controls');
            }   
        });
        
        container.append(slideButton);
        container.append(createButton('leftControl',  tagPath+'images/icons/zoom_left.svg',  D_PAD_LEFT,    D_PAD_TOP+14));
        container.append(createButton('upControl',    tagPath+'images/icons/zoom_up.svg',    D_PAD_LEFT+12, D_PAD_TOP+2));
        container.append(createButton('rightControl', tagPath+'images/icons/zoom_right.svg', D_PAD_LEFT+41, D_PAD_TOP+14));
        container.append(createButton('downControl',  tagPath+'images/icons/zoom_down.svg',  D_PAD_LEFT+12, D_PAD_TOP+43));
        container.append(createButton('zinControl',   tagPath+'images/icons/zoom_plus.svg',  D_PAD_LEFT-40, D_PAD_TOP-6));
        container.append(createButton('zoutControl',  tagPath+'images/icons/zoom_minus.svg', D_PAD_LEFT-40, D_PAD_TOP+34));

        /**
         * Create a seadragon control button
         * @method createButton
         * @param {String} id        the id for the new button
         * @param {String} imgPath   the path to the button's image
         * @param {Number} left      css left property for button
         * @param {Number} top       css top property for button
         * @return {jQuery obj}      the button
         */
        function createButton(id, imgPath, left, top) {
            var img = $(document.createElement('img'));

            img.attr({
                src: imgPath,
                id:  id
            });
            
            img.css({
                left: left + "px",
                top:  top  + "px"
            });

            if (id === 'leftControl' || id === 'rightControl'){
                img.addClass('seadragonManipButtonLR');
            } else if (id === 'upControl'|| id === 'downControl'){
                img.addClass('seadragonManipButtonUD');
            } else if (id === 'zinControl'|| id === 'zoutControl'){
                img.addClass('seadragonManipButtoninout');
            }

            return img;
        }
    
        
        /**
         * Keydown handler for artwork manipulation; wrapper around doManip that first
         * prevents default key behaviors
         * @method keyHandler
         * @param {Object} evt         the event object
         * @param {String} direction   the direction in which to move the artwork
         */
        function keyHandler(evt, direction) {
            evt.preventDefault();
            clearInterval(interval);
            doManip(evt, direction);
        }

        /**
         * Click handler for button in given direction; a wrapper around doManip that also
         * executes doManip in an interval if the user is holding down a button
         * @method buttonHandler
         * @param {Object} evt         the event object
         * @param {String} direction   the direction in which to move the artwork
         */
        function buttonHandler(evt, direction) {
            doManip(evt, direction);
            clearInterval(interval);
            interval = setInterval(function() {
                doManip(evt, direction);
            }, 100);
        }

        /**
         * Do fixed manipulation in response to seadragon controls or key presses
         * @method doManip
         * @param {Object} evt         the event object
         * @param {String} direction   the direction in which to move the artwork
         */
        function doManip(evt, direction) {
            var pivot = {
                x: CENTER_X,
                y: CENTER_Y
            };

            if (direction === 'left') {
                annotatedImage.dzManip(pivot, {x: panDelta, y: 0}, 1);
            } else if (direction === 'up') {
                annotatedImage.dzManip(pivot, {x: 0, y: panDelta}, 1);
            } else if (direction === 'right') {
                annotatedImage.dzManip(pivot, {x: -panDelta, y: 0}, 1);
            } else if (direction === 'down') {
                annotatedImage.dzManip(pivot, {x: 0, y: -panDelta}, 1);
            } else if (direction === 'in') {
                annotatedImage.dzScroll(1 + zoomScale, pivot);
            } else if (direction === 'out') {
                annotatedImage.dzScroll(1 - zoomScale, pivot);
            }
        }


        // tabindex code is to allow key press controls (focus needs to be on the TAG container)
        $('#tagContainer').attr("tabindex", -1);
        $("[tabindex='-1']").focus();
        $("[tabindex='-1']").css('outline', 'none');
        $("[tabindex='-1']").on('click', function() {
            $("[tabindex='-1']").focus();
            containerFocused = true;
        });
        $("[tabindex='-1']").focus(function() {
            containerFocused = true;
        });
        $("[tabindex='-1']").focusout(function() {
            containerFocused = false;
        });

        $(document).on('keydown', function(evt) {
            if(containerFocused) {
                switch(evt.which) {
                    case 37:
                        keyHandler(evt, 'left');
                        break;
                    case 38:
                        keyHandler(evt, 'up');
                        break;
                    case 39:
                        keyHandler(evt, 'right');
                        break;
                    case 40:
                        keyHandler(evt, 'down');
                        break;
                    case 187:
                    case 61:
                        keyHandler(evt, 'in');
                        break;
                    case 189:
                    case 173:
                        keyHandler(evt, 'out');
                        break;
                }
            }
        });

        $(document).keyup(function(evt){
            clearInterval(interval);
        });
        
        $('#leftControl').on('mousedown', function(evt) {
            buttonHandler(evt, 'left');
        });
        $('#upControl').on('mousedown', function(evt) {
            buttonHandler(evt, 'up');
        });
        $('#rightControl').on('mousedown', function(evt) {
            buttonHandler(evt, 'right');
        });
        $('#downControl').on('mousedown', function(evt) {
            buttonHandler(evt, 'down');
        });
        $('#zinControl').on('mousedown', function(evt) {
            buttonHandler(evt, 'in');
        });
        $('#zoutControl').on('mousedown', function(evt) {
            buttonHandler(evt, 'out');
        });

        $('.seadragonManipButtonLR').on('mouseup mouseleave', function() {
            clearInterval(interval);
        });

        $('.seadragonManipButtonUD').on('mouseup mouseleave', function() {
            clearInterval(interval);
        });

        $('.seadragonManipButtoninout').on('mouseup mouseleave', function() {
            clearInterval(interval);
        });
    }

    /**
     * Makes the artwork viewer sidebar
     * @method makeSidebar
     */
    function makeSidebar() {
        var backBttnContainer = root.find("#backBttnContainer"),
            sideBarSections   = root.find('#sideBarSections'),
            sideBarInfo       = root.find('#sideBarInfo'),
            infoTitle         = root.find('#infoTitle'),
            infoArtist        = root.find('#infoArtist'),
            infoYear          = root.find('#infoYear'),
            assetContainer    = root.find('#assetContainer'),
            isBarOpen         = true,
            currBottom        = 0,
            item,
            fieldTitle,
            fieldValue,
            infoCustom,
            i,
            curr,
            button,
            descriptionDrawer,
            tourDrawer,
            locHistoryButton,
            mediaDrawer;


		
        backButton.attr('src',tagPath+'images/icons/Back.svg');
		togglerImage.attr("src", tagPath+'images/icons/Close.svg');
        infoTitle.text(doq.Name);
        infoArtist.text(doq.Metadata.Artist);
        infoYear.text(doq.Metadata.Year);
        

        // toggler to hide/show sidebar
        toggler.on('click', function () {
            var opts = {};
            opts.left = isBarOpen ? '-22%' : '0%'
            isBarOpen = !isBarOpen;
            sideBar.animate(opts, 1000, function () {
                togglerImage.attr('src', tagPath + 'images/icons/' + (isBarOpen ? 'Close.svg' : 'Open.svg'));
            });
        });

        LADS.Util.UI.setUpBackButton(backButton, goBack)

        function goBack() {
            var catalog;
            backButton.off('click');
            annotatedImage && annotatedImage.unload();
            catalog = new LADS.Layout.NewCatalog({
                backScroll:     prevScroll,
                backArtwork:    doq,
                backCollection: prevCollection
            });
            catalog.getRoot().css({ 'overflow-x': 'hidden' }); // TODO this line shouldn't be necessary -- do in styl file
            LADS.Util.UI.slidePageRightSplit(root, catalog.getRoot(), function () {});
        }


        // add more information for the artwork if curator added in the authoring mode
        for (item in doq.Metadata.InfoFields) {
            if(doq.Metadata.InfoFields.hasOwnProperty(item)) {
                fieldTitle = item;
                fieldValue = doq.Metadata.InfoFields[item];
                infoCustom = $(document.createElement('div'));
				infoCustom.addClass('infoCustom');
                infoCustom.text(fieldTitle + ': ' + fieldValue);
                infoCustom.appendTo(info);
            }
        }

        // make sure the info text fits in the div (TODO is this necessary?)
        LADS.Util.fitText(info, 1.1);

        // create drawers
        if (doq.Metadata.Description) {
            descriptionDrawer = createDrawer("Description");
            descriptionDrawer.contents.html(Autolinker.link(doq.Metadata.Description.replace(/\n/g, "<br />"), {email: false, twitter: false}));
            assetContainer.append(descriptionDrawer);
            currBottom = descriptionDrawer.height();
        }
 
        if (locationList.length > 0) {
            locHistoryButton = initlocationHistory();
            assetContainer.append(locHistoryButton);
            currBottom += locHistoryButton.height();
        }

        if (associatedMedia.guids.length > 0) {
            mediaDrawer = createDrawer('Associated Media');
            for(i=0; i<associatedMedia.guids.length; i++) {
                curr = associatedMedia[associatedMedia.guids[i]];
                loadQueue.add(createMediaButton(mediaDrawer.contents, curr));
            }
            assetContainer.append(mediaDrawer);
            currBottom += mediaDrawer.height();
        }

        /**
         * Creates a tour thumbnail button
         * @method createTourButton
         * @param {jQuery obj} container     the element to which we'll append this button
         * @param {doq} tour                 the tour doq
         */
        function createTourButton(container, tour) {
            return function() {
                container.append(LADS.Util.Artwork.createThumbnailButton({
                    title:       LADS.Util.htmlEntityDecode(tour.Name),
                    handler:     tourClicked(tour),
                    buttonClass: 'tourButton',
                    src:         (tour.Metadata.Thumbnail ? FIX_PATH(tour.Metadata.Thumbnail) : tagPath+'images/tour_icon.svg')
                }));
            }
        }

        /**
         * Creates a thumbnail button for an associated media
         * @method createMediaButton
         * @param {jQuery obj} container       the element to which we'll append the button
         * @param {Object} media               an associated media object (from AnnotatedImage)
         */
        function createMediaButton(container, media) {
            return function() {
                var src = '',
                    metadata = media.doq.Metadata,
                    thumb = metadata.Thumbnail;

                switch (metadata.ContentType) {
                    case 'Audio':
                        src = tagPath+'images/audio_icon.svg';
                        break;
                    case 'Video':
                        src = (thumb && !thumb.match(/.mp4/)) ? FIX_PATH(thumb) : 'images/video_icon.svg';
                        break;
                    case 'Image':
                        src = thumb ? FIX_PATH(thumb) : FIX_PATH(metadata.Source);
                        break;
                    default:
                        src = tagPath + 'images/text_icon.svg';
                        break;
                }

                container.append(LADS.Util.Artwork.createThumbnailButton({
                    title:       LADS.Util.htmlEntityDecode(media.doq.Name),
                    handler:     mediaClicked(media),
                    buttonClass: 'mediaButton',
                    buttonID:    'thumbnailButton-'+media.doq.Identifier,
                    src:         src
                }));
            }
        }

        /**
         * Generates a click handler for a specific associated media object
         * @method mediaClicked
         * @param {Object} media       the associated media object (from AnnotatedImage)
         */
        function mediaClicked(media) {
            return function () {
                locHistoryActive && toggleLocationPanel();
                media.create(); // returns if already created
                media.toggle();
                media.pauseReset();
            };
        }

        // Load tours and filter for tours associated with this artwork
        LADS.Worktop.Database.getTours(function (tours) {
            var relatedTours,
                maxHeight;

            relatedTours = tours.filter(function (tour) {
                var relatedArtworks;
                if (!tour.Metadata || !tour.Metadata.RelatedArtworks || tour.Metadata.Private === "true") {
                    return false;
                }
                relatedArtworks = JSON.parse(tour.Metadata.RelatedArtworks);
                if(!relatedArtworks || !relatedArtworks.length) {
                    return false;
                }
                return relatedArtworks.indexOf(doq.Identifier) >= 0;
            });

            if (relatedTours.length > 0) {
                tourDrawer = createDrawer('Tours');
                assetContainer.append(tourDrawer);
                currBottom += tourDrawer.height();

                tourDrawer.contents.text('');
                for(i=0; i<relatedTours.length; i++) {
                    loadQueue.add(createTourButton(tourDrawer.contents, relatedTours[i]));
                }
            }

            // set max height of drawers to avoid expanding into minimap area
            maxHeight = Math.max(1, assetContainer.height() - currBottom);
            root.find(".drawerContents").css({
                "max-height": maxHeight + "px",
            });
        });

        function tourClicked(tour) {
            return function () {
                var rinData,
                    parentid,
                    prevInfo,
                    rinPlayer;
                
                annotatedImage.unload();
                prevInfo = { artworkPrev: "artmode", prevScroll: prevScroll };
                rinData = JSON.parse(unescape(tour.Metadata.Content)),
                rinPlayer = new LADS.Layout.TourPlayer(rinData, prevCollection, prevInfo, options);
            
                LADS.Util.UI.slidePageLeftSplit(root, rinPlayer.getRoot(), rinPlayer.startPlayback);
            };
        }

        /*************************************************************************
         * MINIMAP CODE. bleveque: didn't rewrite this; separate issue
         *                         if some variable names are off now, let me know
         */

        //Create minimapContainer...
		var minimapContainer = root.find('#minimapContainer');

        sideBarSections.append(minimapContainer);

        //A white rectangle for minimap to show the current shown area for artwork
		var minimaprect = root.find('#minimaprect');

        //Load deepzoom thumbnail. 
        var img = new Image();
        var loaded = false;
        var AR = 1;//ratio between width and height.
        var minimapw = 1;//minimap width
        var minimaph = 1;//minimap height
        var minimap;
        /*
        **On load, load the image of artwork and initialize the rectangle
        */
        function minimapLoaded() {
            if (loaded) return;
            loaded = true;
            //load the artwork image
			minimap = root.find('#minimap');
            minimap.attr('src', LADS.Worktop.Database.fixPath(doq.URL));

            //make the minimap not moveable. 
            minimap.mousedown(function () {
                return false;
            });
            AR = img.naturalWidth / img.naturalHeight;
            var heightR = img.naturalHeight / $(minimapContainer).height();//the ratio between the height of image and the container.
            var widthR = img.naturalWidth / $(minimapContainer).width();//ratio between the width of image and the container.
            //make sure the whole image shown inside the container based on the longer one of height and width.
            if (heightR > widthR) {
                minimap.removeAttr("height");
                minimap.removeAttr("width");
                minimap.css({ "height": "100%" });
            }
            else {
                minimap.removeAttr("height");
                minimap.removeAttr("width");
                minimap.css({ "width": "100%" });
            }

            //make the image manipulatable. 
            var gr = LADS.Util.makeManipulatable(minimap[0],
            {
                onManipulate: onMinimapManip,
                onScroll: onMinimapScroll,
                onTapped: onMinimapTapped
            }, false);

            /**********************/
            var minimaph = minimap.height();
            var minimapw = minimap.width();

            //centers rectangle
            var minimapt = (minimapContainer.height() / 2) - (minimap.height() / 2);
            var minimapl = (minimapContainer.width() / 2) - (minimap.width() / 2);
            minimaprect.css({
                width: (minimapw - 1) + "px",
                height: (minimaph - 1) + "px",
                top: minimapt + "px",
                left: (minimapl - 1) + "px"
            });
            /*********************/
        }
        /*
        **implement specific manipulation functions for manipulating the minimap.
        */
        function onMinimapManip(evt) {
            var minimaph = minimap.height();
            var minimapw = minimap.width();
            var minimapt = minimap.position().top;
            var minimapl = parseFloat(minimap.css('marginLeft'));

            var px = evt.pivot.x;
            var py = evt.pivot.y;
            var tx = evt.translation.x;
            var ty = evt.translation.y;

            var x = px + tx;
            var y = py + ty;
            x = (x - minimapl) / minimapw;
            y = (y - minimapt) / minimaph;
            y = y / AR;
            x = Math.max(0, Math.min(x, 1));
            y = Math.max(0, Math.min(y, 1 / AR));
            var s = 1 + (1 - evt.scale);
            if (s) annotatedImage.viewer.viewport.zoomBy(s, false);
            annotatedImage.viewer.viewport.panTo(new Seadragon.Point(x, y), true);
            annotatedImage.viewer.viewport.applyConstraints();
        }
        function onMinimapScroll(res, pivot) {
            var a = 0;
        }
        function onMinimapTapped(evt) {

            console.log("tapped");

            var minimaph = minimap.height();
            var minimapw = minimap.width();
            var minimapt = minimap.position().top;
            var minimapl = parseFloat(minimap.css('marginLeft'));

            var xPos = evt.position.x;
            var yPos = evt.position.y;
            var x =(xPos-minimapl)/ minimapw;
            var y = (yPos-minimapt)/minimaph;
            y = y / AR;
            x = Math.max(0, Math.min(x, 1));
            y = Math.max(0, Math.min(y, 1 / AR));
            
            annotatedImage.viewer.viewport.panTo(new Seadragon.Point(x, y), true);
            annotatedImage.viewer.viewport.applyConstraints();
        }

        img.onload = minimapLoaded;
        //should be complete image of artwork NOT thumbnail
        img.src = LADS.Worktop.Database.fixPath(doq.URL);
        if (img.complete) {
            minimapLoaded();
        }
        /*
        **Handler for image->rectangle TODO: rectangle->image handler
        */
        function dzMoveHandler(evt) {
            var minimaph = minimap.height();
            var minimapw = minimap.width();

            //centers rectangle
            var minimapt = (minimapContainer.height() / 2) - (minimap.height() / 2);
            var minimapl = (minimapContainer.width() / 2) - (minimap.width() / 2);

            var viewport = evt.viewport;
            var rect = viewport.getBounds(true);
            var tl = rect.getTopLeft();
            var br = rect.getBottomRight();
            var x = tl.x;
            var y = tl.y;
            var xp = br.x;
            var yp = br.y;
            if (x < 0) x = 0;
            if (y < 0) y = 0;
            if (xp > 1) xp = 1;
            if (yp > 1 / AR) yp = 1 / AR;
            y = y * AR;
            yp = yp * AR;
            yp = yp - y;
            xp = xp - x;
            x = minimapl + x * minimapw;
            y = minimapt + y * minimaph;
            xp = xp * minimapw;
            yp = yp * minimaph;
            minimaprect.css({
                width: (xp-1) + "px",
                height: (yp - 1) + "px",
                top: y + "px",
                left: (x-1) + "px"
            });
        }
        annotatedImage.addAnimateHandler(dzMoveHandler);

        /*
         * END MINIMAP CODE
         ******************/
    }

    /**
     * Create a drawer with a disclosure button used to display
     * hotspots, assets, tours. The returned jQuery object has
     * a property called "contents" which should be used to add
     * buttons or messages to the contents of the drawer.
     *
     * @param title, the display title for the drawer
     * @author jastern
     */
    function initlocationHistory() {
        if(locationList.length === 0) {
            locHistoryContainer.remove();
            return;
        }

        var locHistoryPanel      = root.find('#locationHistoryPanel'),
            locHistoryToggleIcon = root.find('#locationHistoryToggleIcon'),
            mapOverlay           = $(LADS.Util.UI.blockInteractionOverlay()).addClass('mapOverlay'),
            overlayLabel         = $(document.createElement('label')),
            lpContents           = $(document.createElement('div')).addClass('lpContents'),
            lpTitle              = $(document.createElement('div')),
            lpMapDiv             = $(document.createElement('div')).addClass('lpMapDiv'),
            lpTextInfoDiv        = $(document.createElement('div')).addClass('lpTextInfoDiv'),
            lpTextDiv            = $(document.createElement('div')).addClass("lpTextDiv"),
            lpInfoDiv            = $(document.createElement('div')).addClass('lpInfoDiv');

        overlayLabel.text('Map has no location history to display.');
        overlayLabel.attr('id', 'mapOverlayLabel');
        mapOverlay.append(overlayLabel);

        lpContents.append(mapOverlay);
        locHistoryPanel.append(lpContents);

        lpTitle.attr('id', 'lpTitle');
        lpTitle.text('Location History');
        lpContents.append(lpTitle);

        lpMapDiv.attr('id', 'lpMapDiv');
        lpContents.append(lpMapDiv);

        lpContents.append(lpTextInfoDiv);
        lpTextInfoDiv.append(lpTextDiv);
        lpTextInfoDiv.append(lpInfoDiv);

        locHistoryToggle.css({
            left: '87.5%',
            'border-bottom-right-radius': '10px',
            'border-top-right-radius': '10px'
        });
        locHistoryToggleIcon.attr('src', tagPath+'images/icons/Close.svg');


        locHistoryToggle.on('click', toggleLocationPanel);
        locHistoryContainer.on('click', histOnClick);

        /**
         * A callback function to populate the location history map after it has been created
         * @method prepMap
         */
        function prepMap () {
            var unselectedCSS = {
                    'background-color': 'transparent',
                    'color': 'white'
                },
                selectedCSS = {
                    'background-color': 'white',
                    'color': 'black',
                },
                address,
                date,
                year,
                i,
                locBox,
                pushpinOptions;

            /**
             * Helper function to draw pushpin on location history map when a location's info
             * box is clicked
             * @method drawPinHelper
             * @param {Object} e    event data related to a location
             */
            function drawPinHelper(e) {
                var $this = $(this),
                    latitude,
                    longitude,
                    location,
                    viewOptions;

                LADS.Util.UI.drawPushpins(locationList, map);

                lpInfoDiv.html($this.html() + "<br/>" + (e.data.info ? e.data.info : ''));

                $('img.removeButton').attr('src', tagPath+'images/icons/minus.svg');
                $('img.editButton').attr('src', tagPath+'images/icons/edit.png');
                $('div.locations').css(unselectedCSS);

                $this.find('img.removeButton').attr('src', tagPath+'images/icons/minusB.svg');
                $this.find('img.editButton').attr('src', tagPath+'images/icons/editB.png');
                $this.css(selectedCSS);

                if (e.data.resource.latitude) {
                    location  = e.data.resource;
                } else {
                    latitude  = e.data.resource.point.coordinates[0];
                    longitude = e.data.resource.point.coordinates[1];
                    location  = new Microsoft.Maps.Location(latitude, longitude);
                }
                viewOptions = {
                    center: location,
                    zoom: 4,
                };
                map.setView(viewOptions);
            }

            for (i = 0; i < locationList.length; i++) {
                pushpinOptions = {
                    text: '' + (i + 1),
                    icon: tagPath+'images/icons/locationPin.png',
                    width: 20,
                    height: 30
                };
                address = locationList[i].address;
                date = '';
                if (locationList[i].date && locationList[i].date.year) {
                    year = locationList[i].date.year;
                    if (year < 0) { // add BC to years that are less than 0
                        year = Math.abs(year) + ' BC';
                    }
                    date = year;
                } else {
                    date = '<i>Date Unspecified</i>';
                }

                // create a box in the lower pane for each location
                locBox = $(document.createElement('div'));
                locBox.addClass('locations');
                locBox.html((i + 1) + '. ' + address + ' - ' + date + '<br>');

                lpTextDiv.append(locBox);

                // display more information about the location when locBox is clicked
                locBox.click(locationList[i], drawPinHelper);
                locBox.fadeIn();
            }

            LADS.Util.UI.drawPushpins(locationList, map);
            toggleLocationPanel();
        };

        /**
         * Click handler to expand location history window
         * @method histOnClick 
         */
        function histOnClick() {
            if (locationList.length === 0) {
                mapOverlay.show();
            }
            if (!map) {
                makeMap(prepMap);
            } else {
                toggleLocationPanel();
            }
        }

        /**
         * Toggles location panel when locHistoryContainer or toggler is clicked
         * @method toggleLocationPanel
        */
        function toggleLocationPanel() {
            if (locationList.length === 0) {
                return;
            }
            if (locOpening||locClosing){
                return;
            }
            if (locHistoryActive) {
                locHistory.text('Location History');
                locHistory.css('color', 'white');
                locClosing = true;
                locHistoryToggle.hide("slide", { direction: 'left' }, 500);
                locHistoryDiv.hide("slide", { direction: 'left' }, 500, function(){
                    toggler.show();
                    locClosing = false;
                });
            } else {
                locHistory.text('Location History');
                locHistoryToggle.hide();
                locOpening = true;
                locHistoryDiv.show("slide", { direction: 'left' }, 500, function () {
                    locHistoryToggle.show();
                    locOpening = false;
                });
                locHistoryDiv.css('display', 'inline');
                toggler.hide();
            }
            locHistoryActive = !locHistoryActive;
        }

        locHistoryContainer.append(locHistory);

        return locHistoryContainer;
    }

    /**
     * Create a drawer (e.g., for list of related tours or the artwork's description) 
     * @param {String} title        title of the drawer
     * @return {jQuery obj}         the drawer
     */
    function createDrawer(title) {
        var drawer          = $(document.createElement('div')).addClass('drawer'),
            drawerHeader    = $(document.createElement('div')).addClass('drawerHeader'),
            label           = $(document.createElement('div')).addClass('drawerLabel'),
            toggleContainer = $(document.createElement('div')).addClass('drawerToggleContainer'),
            toggle          = $(document.createElement('img')).addClass("drawerPlusToggle"),
            drawerContents  = $(document.createElement('div')).addClass("drawerContents"),
            i;

        label.text(title);
        toggle.attr({
            src: tagPath+'images/icons/plus.svg',
            expanded: false
        });

        drawer.append(drawerHeader);
        drawerHeader.append(label);
        drawerHeader.append(toggleContainer);
        toggleContainer.append(toggle);
        drawer.append(drawerContents);

        //have the toggler icon minus when is is expanded, plus otherwise.
        drawerHeader.on('click', function (evt) {
            if (toggle.attr('expanded') !== 'true') {
                $(".plusToggle").attr({
                    src: tagPath+'images/icons/plus.svg',
                    expanded: false
                });
                $(".drawerContents").slideUp();

                toggle.attr({
                    src: tagPath+'images/icons/minus.svg',
                    expanded: true
                });
            } else {
                toggle.attr({
                    src: tagPath+'images/icons/plus.svg',
                    expanded: false
                });

                for(i=0; i<associatedMedia.guids.length; i++) {
                    if(associatedMedia[associatedMedia.guids[i]].isVisible()) {
                        associatedMedia[associatedMedia.guids[i]].hide();
                    }
                }
            }
            drawerContents.slideToggle();
        });

        drawer.contents = drawerContents;
        return drawer;
    }

    /**
     * Return art viewer root element
     * @method
     * @return {jQuery obj}    root jquery object
     */
    this.getRoot = function () {
        return root;
    };

    /**
     * Make the map for location History.
     * @method makeMap
     * @param {Function} callback     function to be called when map making is complete
    */
    function makeMap(callback) {
        var mapOptions,
            viewOptions;

        mapOptions = {
            credentials:         "AkNHkEEn3eGC3msbfyjikl4yNwuy5Qt9oHKEnqh4BSqo5zGiMGOURNJALWUfhbmj",
            mapTypeID:           Microsoft.Maps.MapTypeId.road,
            showScalebar:        true,
            enableClickableLogo: false,
            enableSearchLogo:    false,
            showDashboard:       true,
            showMapTypeSelector: false,
            zoom:                2,
            center:              new Microsoft.Maps.Location(20, 0)
        };
        
        viewOptions = {
            mapTypeId: Microsoft.Maps.MapTypeId.road,
        };
        
        map = new Microsoft.Maps.Map(document.getElementById('lpMapDiv'), mapOptions);
        map.setView(viewOptions);

        callback && callback();
    }

};

LADS.Layout.Artmode.default_options = {
    catalogState: {},
    doq: null,
    split: 'L',
};
