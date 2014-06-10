TAG.Util.makeNamespace("TAG.AnnotatedImage");

/**
 * Representation of deepzoom image with associated media. Contains
 * touch handlers and a method for creating associated media objects.
 * @class TAG.AnnotatedImage
 * @constructor
 * @param {Object} options         some options for the artwork and assoc media
 * @return {Object}                some public methods and variables
 */

TAG.AnnotatedImage = function (options) { // rootElt, doq, split, callback, shouldNotLoadHotspots) {
    "use strict";


    var // input options
        root     = options.root,           // root of the artwork viewing page
        doq      = options.doq,            // doq for the artwork
        callback = options.callback,       // called after associated media are retrieved from server
        noMedia  = options.noMedia,        // should we not have assoc media? (set to true in artwork editor)

        // constants
        FIX_PATH = TAG.Worktop.Database.fixPath,   // prepend server address to given path

        // misc initialized variables
        artworkName     = doq.Name,        // artwork's title
        associatedMedia = { guids: [] },   // object of associated media objects for this artwork, keyed by media GUID;
                                           //   also contains an array of GUIDs for cleaner iteration
        toManip         = dzManip,         // media to manipulate, i.e. artwork or associated media
        rootHeight     = $('#tagRoot').height(),
        rootWidth      = $('#tagRoot').width(),
        outerContainerDimensions = {height: rootHeight, width: rootWidth},  //dimensions of active media to manipulate

        // misc uninitialized variables
        outerContainerDimensions,
        viewer,
        assetCanvas;

    // get things rolling
    init();

    return {
        getAssociatedMedia: getAssociatedMedia,
        unload: unload,
        dzManip: dzManip,
        dzScroll: dzScroll,
        openArtwork: openArtwork,
        addAnimateHandler: addAnimateHandler,
        getToManip: getToManip,
        getMediaDimensions: getMediaDimensions,
        setArtworkClicked: setArtworkClicked,
        viewer: viewer
    };

    /**
     * Sets the artwork as active and the Deep Zoom manipulation method is used zooming and panning
     * @method setArtworkClicked
     */
    function setArtworkClicked() {
        dzManipPreprocessing();
    }

    /**
     * Return applicable manipulation method
     * @method getToManip
     * @return {Object}     manipulation method object
     */
    function getToManip() {
        return toManip;   
    }


    /**
     * Return the dimensions of the active associated media or artwork
     * @method getMediaDimensions
     * @return {String}     object with dimensions
     */
    function getMediaDimensions() {
        return outerContainerDimensions;   
    }


    /**
     * Return list of associatedMedia
     * @method getAssociatedMedia
     * @return {Object}     associated media object
     */
    function getAssociatedMedia() {
        return associatedMedia;
    }

    /**
     * Open the deepzoom image
     * @method openArtwork
     * @param {doq} doq           artwork doq to open
     * @return {Boolean}          whether opening was successful
     */
    function openArtwork(doq) {
        if(!viewer || !doq || !doq.Metadata || !doq.Metadata.DeepZoom) {
            debugger;
            console.log("ERROR IN openDZI");
            return false;
        }
        viewer.openDzi(FIX_PATH(doq.Metadata.DeepZoom));
        return true;
    }

    /**
     * Wrapper around Seadragon.Drawer.updateOverlay; moves an HTML element "overlay."
     * Used mostly in conjunction with hotspot circles (this function is currently
     * only called from ArtworkEditor.js)
     * @method updateOverlay
     * @param {HTML element} element                   the overlay element to move
     * @param {Seadragon.OverlayPlacement} placement   the new placement of the overlay
     */
    function updateOverlay(element, placement) {
        var $elt = $(element),
            top  = parseFloat($elt.css('top')),
            left = parseFloat($elt.css('left'));
        if (top && left) { // TODO is this check necessary?
            viewer.drawer.updateOverlay(element, viewer.viewport.pointFromPixel(new Seadragon.Point(left, top)), placement);
        }
    }

    /**
     * Wrapper around Seadragon.Drawer.addOverlay; adds an HTML overlay to the seadragon
     * canvas. Currently only used in ArtworkEditor.js.
     * @method addOverlay
     * @param {HTML element} element                   the overlay element to add
     * @param {Seadragon.Point} point                  the point at which to add the overlay
     * @param {Seadragon.OverlayPlacement} placement   the placement at the given point
     */
    function addOverlay(element, point, placement) {
        if (!viewer.isOpen()) {
            viewer.addEventListener('open', function () {
                viewer.drawer.addOverlay(element, point, placement);
                viewer.drawer.updateOverlay(element, point, placement);
            });
        } else {
            viewer.drawer.addOverlay(element, point, placement);
            viewer.drawer.updateOverlay(element, point, placement);
        }
    }

    /**
     * Wrapper around Seadragon.Drawer.removeOverlay. Removes an HTML overlay from the seadragon
     * canvas.
     * @method removeOverlay
     * @param {HTML element}       the ovlerlay element to remove
     */
    function removeOverlay(element) {
        if (!viewer.isOpen()) {
            viewer.addEventListener('open', function () {
                viewer.drawer.removeOverlay(element);
            });
        } else {
            viewer.drawer.removeOverlay(element);
        }
    };

    /**
     * Unloads the seadragon viewer
     * @method unload
     */
    function unload() {
        viewer && viewer.unload();
    }

    /**
     * When the artwork is active, sets the manipulation method and dimensions for the active container
     * @method dzManipPreprocessing
     */
    function dzManipPreprocessing() {
        outerContainerDimensions = {height: rootHeight, width: rootWidth};
        toManip = dzManip;
    }

    /**
     * Manipulation/drag handler for makeManipulatable on the deepzoom image
     * @method dzManip
     * @param {Object} res             object containing hammer event info
     */

    function dzManip(res) {
        var scale = res.scale,
            trans = res.translation,
            pivot = res.pivot;

        dzManipPreprocessing();
        viewer.viewport.zoomBy(scale, viewer.viewport.pointFromPixel(new Seadragon.Point(pivot.x, pivot.y)), false);
        viewer.viewport.panBy(viewer.viewport.deltaPointsFromPixels(new Seadragon.Point(trans.x, trans.y)), false);
        viewer.viewport.applyConstraints();
    }
    
    /**
     * Scroll/pinch-zoom handler for makeManipulatable on the deepzoom image
     * @method dzScroll
     * @param {Number} scale          scale factor
     * @param {Object} pivot          location of event (x,y)
     */
    function dzScroll(scale, pivot) {
        dzManip({
                scale: scale,
                translation: {
                    x: 0,
                    y: 0
                },
                pivot: pivot
        });
    }

    /**
     * Initialize seadragon, set up handlers for the deepzoom image, load assoc media if necessary
     * @method init
     */
    function init() {
        var viewerelt,
            canvas;

        if(Seadragon.Config) {
            Seadragon.Config.visibilityRatio = 0.8; // TODO see why Seadragon.Config isn't defined; should it be?
        }

        viewerelt = $(document.createElement('div'));
        viewerelt.attr('id', 'annotatedImageViewer');
        viewerelt.on('mousedown scroll click mousemove resize', function(evt) {
            evt.preventDefault();
        });
        root.append(viewerelt);

        viewer = new Seadragon.Viewer(viewerelt[0]);
        viewer.setMouseNavEnabled(false);
        viewer.clearControls();

        canvas = $(viewer.canvas);
        canvas.addClass('artworkCanvasTesting');

        TAG.Util.makeManipulatable(canvas[0], {
            onScroll: function (delta, pivot) {
                dzScroll(delta, pivot);
            },
            onManipulate: function (res) {
                res.translation.x = - res.translation.x;        //Flip signs for dragging
                res.translation.y = - res.translation.y;
                dzManip(res); 
            }
        }, null, true); // NO ACCELERATION FOR NOW

        assetCanvas = $(document.createElement('div'));
        assetCanvas.attr('id', 'annotatedImageAssetCanvas');
        root.append(assetCanvas);

        // this is stupid, but it seems to work (for being able to reference zoomimage in artmode)
        noMedia ? setTimeout(function() { callback && callback() }, 1) : loadAssociatedMedia(callback);
    }

    /**
     * Adds an animation handler to the annotated image. This is used to allow the image to move
     * when the minimap is manipulated.
     * @method addAnimationHandler
     * @param {Function} handler      the handler to add
     */
    function addAnimateHandler(handler) {
        viewer.addEventListener("animation", handler);
    }

    /**
     * Retrieves associated media from server and stores them in the
     * associatedMedia array.
     * @method {Function} callback    function to call after loading associated media
     */
    function loadAssociatedMedia(callback) {
        var done = 0,
            total;

        TAG.Worktop.Database.getAssocMediaTo(doq.Identifier, mediaSuccess, null, mediaSuccess);

        /**
         * Success callback function for .getAssocMediaTo call above. If the list of media is
         * non-null and non-empty, it gets the linq between each doq and the artwork 
         * @method mediaSuccess
         * @param {Array} doqs        the media doqs
         */
        function mediaSuccess(doqs) {
            var i;
            total = doqs ? doqs.length : 0;
            if (total > 0) {
                for (i = 0; i < doqs.length; i++) {
                    TAG.Worktop.Database.getLinq(doq.Identifier, doqs[i].Identifier, createLinqSuccess(doqs[i]), null, createLinqSuccess(doqs[i]));
                }
            } else {
                callback && callback(associatedMedia);
            }
        }

        /**
         * Helper function for the calls to .getLinq above. It accepts an assoc media doc and returns
         * a success callback function that accepts a linq. Using this information, it creates a new
         * hotspot from the doq and linq
         * @method createLinqSuccess
         * @param {doq} assocMedia        the relevant associated media doq
         */
        function createLinqSuccess(assocMedia) {
            return function (linq) {
                associatedMedia[assocMedia.Identifier] = createMediaObject(assocMedia, linq);
                associatedMedia.guids.push(assocMedia.Identifier);

                if (++done >= total && callback) {
                    callback(associatedMedia);
                }
            }
        }
    }


    /**
     * Creates an associated media object to be added to associatedMedia.
     * This object contains methods that could be called in Artmode.js or
     * ArtworkEditor.js. This could be in its own file.
     * @method createMediaObject
     * @param {mdoq} doq       the media doq
     * @param {linq} linq     the linq between the media doq and the artwork doq
     * @return {Object}       some public methods to be used in other files
     */
    function createMediaObject(mdoq, linq) {
        var // DOM-related
            outerContainer = $(document.createElement('div')).addClass('mediaOuterContainer'),
            innerContainer = $(document.createElement('div')).addClass('mediaInnerContainer'),
            mediaContainer = $(document.createElement('div')).addClass('mediaMediaContainer'),

            // constants
            IS_HOTSPOT      = linq.Metadata.Type ? (linq.Metadata.Type === "Hotspot") : false,
            X               = parseFloat(linq.Offset._x),
            Y               = parseFloat(linq.Offset._y),
            TITLE           = TAG.Util.htmlEntityDecode(mdoq.Name),
            CONTENT_TYPE    = mdoq.Metadata.ContentType,
            SOURCE          = mdoq.Metadata.Source,
            DESCRIPTION     = TAG.Util.htmlEntityDecode(mdoq.Metadata.Description),
            THUMBNAIL       = mdoq.Metadata.Thumbnail,
            RELATED_ARTWORK = false,

            // misc initialized variables
            mediaHidden      = true,
            currentlySeeking = false,
            movementTimeouts = [],

            // misc uninitialized variables
            circle,
            position,
            mediaLoaded,
            mediaHidden,
            mediaElt,
            titleDiv,
            descDiv,
            thumbnailButton,
            startLocation,
            play;

        // get things rolling
        initMediaObject();

        /**
         * Initialize various parts of the media object: UI, manipulation handlers
         * @method initMediaObject
         */
        function initMediaObject() {
            // set up divs for the associated media
            outerContainer.css('width', Math.min(Math.max(250, (rootWidth / 5)), 450) + 'px');
            innerContainer.css('backgroundColor', 'rgba(0,0,0,0.65)');

            if (TITLE) {
                titleDiv = $(document.createElement('div'));
                titleDiv.addClass('annotatedImageMediaTitle');
                titleDiv.text(TITLE);

                innerContainer.append(titleDiv);
            }

            innerContainer.append(mediaContainer);

            if (DESCRIPTION) {
                descDiv = $(document.createElement('div'));
                descDiv.addClass('annotatedImageMediaDescription');
                descDiv.html(Autolinker.link(DESCRIPTION, {email: false, twitter: false}));
                
                innerContainer.append(descDiv);
            }

            if (RELATED_ARTWORK) {
                // TODO append related artwork button here
            }

            outerContainer.append(innerContainer);
            assetCanvas.append(outerContainer);
            outerContainer.hide();

            // create hotspot circle if need be
            if (IS_HOTSPOT) {
                circle = $(document.createElement("img"));
                position = new Seadragon.Point(X, Y);
                circle.attr('src', tagPath + 'images/icons/hotspot_circle.svg');
                circle.addClass('annotatedImageHotspotCircle');
                root.append(circle);
            }

            // allows asset to be dragged, despite the name
            TAG.Util.disableDrag(outerContainer);

            // register handlers
            TAG.Util.makeManipulatable(outerContainer[0], {
                onManipulate: mediaManip,
                onScroll:     mediaScroll
            }, null, true); // NO ACCELERATION FOR NOW
        }

        /**
         * Initialize any media controls
         * @method initMediaControls
         * @param {HTML element} elt      video or audio element
         */
        function initMediaControls() {
            var elt = mediaElt,
                $elt = $(elt),
                controlPanel = $(document.createElement('div')).addClass('annotatedImageMediaControlPanel'),
                vol = $(document.createElement('img')).addClass('mediaVolButton'),
                timeContainer = $(document.createElement('div')).addClass('mediaTimeContainer'),
                currentTimeDisplay = $(document.createElement('span')).addClass('mediaTimeDisplay'),
                playHolder = $(document.createElement('div')).addClass('mediaPlayHolder'),
                volHolder = $(document.createElement('div')).addClass('mediaVolHolder'),
                sliderContainer = $(document.createElement('div')).addClass('mediaSliderContainer'),
                sliderPoint = $(document.createElement('div')).addClass('mediaSliderPoint');

            controlPanel.attr('id', 'media-control-panel-' + mdoq.Identifier);

            play = $(document.createElement('img')).addClass('mediaPlayButton');

            play.attr('src', tagPath + 'images/icons/PlayWhite.svg');
            vol.attr('src', tagPath+'images/icons/VolumeUpWhite.svg');
            currentTimeDisplay.text("00:00");

            // TODO move this css to styl file
            play.css({
                'position': 'relative',
                'height':   '20px',
                'width':    '20px',
                'display':  'inline-block',
            });

            playHolder.css({
                'position': 'relative',
                'height':   '20px',
                'width':    '20px',
                'display':  'inline-block',
                'margin':   '2px 1% 0px 1%',
            });

            sliderContainer.css({
                'position': 'absolute',
                'height':   '15px',
                'width':    '100%',
                'left':     '0px',
                'bottom':   '0px'
            });

            sliderPoint.css({
                'position': 'absolute',
                'height':   '100%',
                'background-color': '#3cf',
                'width':    '0%',
                'left':     '0%'
            });

            vol.css({
                'height':   '20px',
                'width':    '20px',
                'position': 'relative',
                'display':  'inline-block',
            });

            volHolder.css({
                'height':   '20px',
                'width':    '20px',
                'position': 'absolute',
                'right':    '5px',
                'top':      '2px'
            });

            timeContainer.css({
                'height':   '20px',
                'width':    '40px',
                'right':    volHolder.width() + 25 + 'px',
                'position': 'absolute',
                'vertical-align': 'top',
                'padding':  '0',
                'display':  'inline-block',
                'overflow': 'hidden',
            });

            playHolder.append(play);
            sliderContainer.append(sliderPoint);
            volHolder.append(vol);
            
            // set up handlers
            play.on('click', function () {
                if (elt.paused) {
                    elt.play();
                    play.attr('src', tagPath + 'images/icons/PauseWhite.svg');
                } else {
                    elt.pause();
                    play.attr('src', tagPath + 'images/icons/PlayWhite.svg');
                }
            });

            vol.on('click', function () {
                if (elt.muted) {
                    elt.muted = false;
                    vol.attr('src', tagPath + 'images/icons/VolumeUpWhite.svg');
                } else {
                    elt.muted = true;
                    vol.attr('src', tagPath + 'images/icons/VolumeDownWhite.svg');
                }
            });

            $elt.on('ended', function () {
                elt.pause();
                play.attr('src', tagPath + 'images/icons/PlayWhite.svg');
            });

            sliderContainer.on('mousedown', function(evt) {
                var time = elt.duration * ((evt.pageX - $(evt.target).offset().left) / sliderContainer.width()),
                    origPoint = evt.pageX,
                    timePxRatio = elt.duration / sliderContainer.width(),
                    currTime = Math.max(0, Math.min(elt.duration, elt.currentTime)),
                    origTime = time,
                    currPx   = currTime / timePxRatio,
                    minutes = Math.floor(currTime / 60),
                    seconds = Math.floor(currTime % 60),
                    adjMin = (minutes < 10) ? '0'+minutes : minutes,
                    adjSec = (seconds < 10) ? '0'+seconds : seconds;

                evt.stopPropagation();

                if(!isNaN(time)) {
                    currentTimeDisplay.text(adjMin + ":" + adjSec);
                    elt.currentTime = time;
                    sliderPoint.css('width', 100*(currPx / sliderContainer.width()) + '%');
                }

                sliderContainer.on('mousemove.seek', function(e) {
                    var currPoint = e.pageX,
                        timeDiff = (currPoint - origPoint) * timePxRatio;

                    currTime = Math.max(0, Math.min(elt.duration, origTime + timeDiff));
                    currPx   = currTime / timePxRatio;
                    minutes  = Math.floor(currTime / 60);
                    seconds  = Math.floor(currTime % 60);
                    adjMin   = (minutes < 10) ? '0'+minutes : minutes;
                    adjSec   = (seconds < 10) ? '0'+seconds : seconds;

                    if(!isNaN(currTime)) {
                        currentTimeDisplay.text(adjMin + ":" + adjSec);
                        elt.currentTime = currTime;
                        sliderPoint.css('width', 100*(currPx / sliderContainer.width()) + '%');
                    }
                });

                $('body').on('mouseup.seek mouseleave.seek', function() {
                    sliderContainer.off('mouseup.seek mouseleave.seek mousemove.seek');
                    // if(!isNaN(getCurrTime())) {
                    //     currentTimeDisplay.text(adjMin + ":" + adjSec);
                    //     elt.currentTime = getCurrTime();
                    //     sliderPoint.css('width', 100*(currPx / sliderContainer.width()) + '%');
                    // }
                });
            });

            // Update the seek bar as the video plays
            $elt.on("timeupdate", function () {
                var value = 100 * elt.currentTime / elt.duration,
                    timePxRatio = elt.duration / sliderContainer.width(),
                    currPx = elt.currentTime / timePxRatio,
                    minutes = Math.floor(elt.currentTime / 60),
                    seconds = Math.floor(elt.currentTime % 60),
                    adjMin = (minutes < 10) ? '0' + minutes : minutes,
                    adjSec = (seconds < 10) ? '0' + seconds : seconds;

                if(!isNaN(elt.currentTime)) {
                    currentTimeDisplay.text(adjMin + ":" + adjSec);
                    sliderPoint.css('width', 100*(currPx / sliderContainer.width()) + '%');
                }
            });

            mediaContainer.append(elt);
            mediaContainer.append(controlPanel);

            controlPanel.append(playHolder);
            controlPanel.append(sliderContainer);
            timeContainer.append(currentTimeDisplay);
            controlPanel.append(timeContainer);
            controlPanel.append(volHolder);
        }

        /**
         * Load the actual image/video/audio; this can take a while if there are
         * a lot of media, so just do it when the thumbnail button is clicked
         * @method createMediaElements
         */
        function createMediaElements() {
            var $mediaElt,
                img,
                closeButton = createCloseButton();

            mediaContainer.append(closeButton[0]);
            closeButton.on('click', function() {
                hideMediaObject();
            });

            if(!mediaLoaded) {
                mediaLoaded = true;
            } else {
                return;
            }

            if (CONTENT_TYPE === 'Image') {
                img = document.createElement('img');
                img.src = FIX_PATH(SOURCE);
                $(img).css({
                    position: 'relative',
                    width:    '100%',
                    height:   'auto'
                });
                mediaContainer.append(img);
                mediaLoaded = true;
            } else if (CONTENT_TYPE === 'Video') {
                mediaElt = document.createElement('video');
                $mediaElt = $(mediaElt);

                $mediaElt.attr({
                    preload:  'none',
                    poster:   (THUMBNAIL && !THUMBNAIL.match(/.mp4/)) ? FIX_PATH(THUMBNAIL) : '',
                    src:      FIX_PATH(SOURCE),
                    type:     'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
                    controls: false
                });

                // TODO need to use <source> tags rather than setting the source and type of the
                //      video in the <video> tag's attributes; see video player code
                
                $mediaElt.css({
                    position: 'relative',
                    width:    '100%'
                });

                initMediaControls(mediaElt);

            } else if (CONTENT_TYPE === 'Audio') {
                mediaElt = document.createElement('audio');
                $mediaElt = $(mediaElt);

                $mediaElt.attr({
                    preload:  'none',
                    type:     'audio/mp3',
                    src:      FIX_PATH(SOURCE),
                    controls: false
                });

                initMediaControls(mediaElt);
            }
        }

        /**
         * Stores the dimensions and points to the media manipulation method  of the active associated media, also sends it to the front
         * media manip.
         * @method mediaManipPreprocessing
         */
        function mediaManipPreprocessing() {
            var w = outerContainer.width(),
                h = outerContainer.height();
            outerContainerDimensions = {height: h, width: w};
            toManip = mediaManip;
            $('.mediaOuterContainer').css('z-index', 1000);
            outerContainer.css('z-index', 1001);
        }

        //When the associated media is clicked, set it to active(see mediaManipPreprocessing() above )
        outerContainer.on('click', function (event) {
            event.stopPropagation();            //Prevent the click going through to the main container
            event.preventDefault();
            TAG.Util.IdleTimer.restartTimer();
            mediaManipPreprocessing();

        });

     
        /**
         * Drag/manipulation handler for associated media
         * @method mediaManip
         * @param {Object} res     object containing hammer event info
         */
        function mediaManip(res) {
            if (currentlySeeking || !res) {
                return;
            }
            
            var scale = res.scale,
                trans = res.translation,
                pivot = res.pivot,
                t     = parseFloat(outerContainer.css('top')),
                l     = parseFloat(outerContainer.css('left')),
                w     = outerContainer.width(),
                h     = outerContainer.height(),
                timestepConstant = 50,
                newW  = w * scale,
                maxW,
                minW,
                timer,
                initialPosition,
                deltaPosition,
                finalPosition,
                currentTime,
                initialVelocity;

            // If event is initial touch on artwork, save current position of media object to use in movement method
            if (res.eventType === 'start') {
                startLocation = {
                    x: l,
                    y: t
                };
            }

            mediaManipPreprocessing();

            // these values are somewhat arbitrary; TODO determine good values
            if (CONTENT_TYPE === 'Image') {
                maxW = 3000;
                minW = 200;
            } else if (CONTENT_TYPE === 'Video') {
                maxW = 1000;
                minW = 250;
            } else if (CONTENT_TYPE === 'Audio') {
                maxW = 800;
                minW = 250;
            }

            // constrain new width
            if(newW < minW || maxW < newW) {
                newW = Math.min(maxW, Math.max(minW, newW));
                scale = newW / w;
            }

           //Manipulation for touch and drag events
            if (newW === w){ //If media object is being dragged (not resized)
                if ((0 < t + h) && (t < rootHeight) && (0 < l + w) && (l< rootWidth)) { // and is still on screen
                    
                    currentTime = Date.now();

                    //Position of object on manipulation
                    if (res.eventType) { //If initial values were set with a mouseDown or touch event
                        initialPosition = {
                            x: l, 
                            y: t
                        };
                    } else { //If initial values were set with seadragon controls or key touches
                        initialPosition = {
                            x: outerContainer.position().left,
                            y: outerContainer.position().top
                        };
                    }

                    //Where object should be moved to
                    if (res.center) { //As above, if movement is caused by mouse or touch event (hammer):
                        finalPosition = {
                            x: res.center.pageX - (res.startEvent.center.pageX - startLocation.x),
                            y: res.center.pageY - (res.startEvent.center.pageY - startLocation.y)
                        };
                    } else { //Or if it was set with seadragon controls or key touches:
                        finalPosition = {
                            x: initialPosition.x + res.translation.x,
                            y: initialPosition.y + res.translation.y,                            
                        };
                    }

                    //Total distance to travel
                    deltaPosition = {
                        x: finalPosition.x - initialPosition.x,
                        y: finalPosition.y - initialPosition.y
                    },

                    //Initial velocity is proportional to distance traveled
                    initialVelocity = {
                        x: deltaPosition.x/timestepConstant,
                        y: deltaPosition.y/timestepConstant
                    };
                    
                    //Recursive function to move object between start location and final location with proper physics
                    move(initialVelocity, initialPosition, finalPosition, timestepConstant/50);
                    viewer.viewport.applyConstraints();

                } else { //If object isn't within bounds, hide and reset it.
                    hideMediaObject();
                    pauseResetMediaObject();
                    return;
                }
            } else{ // zoom from touch point: change width and height of outerContainer
                outerContainer.css("top",  (t + trans.y + (1 - scale) * pivot.y) + "px");
                outerContainer.css("left", (l + trans.x + (1 - scale) * pivot.x) + "px");
                outerContainer.css("width", newW + "px");
                outerContainer.css("height", "auto"); 
            }


            // TODO this shouldn't be necessary; style of controls should take care of it
            // if ((CONTENT_TYPE === 'Video' || CONTENT_TYPE === 'Audio') && scale !== 1) {
            //     resizeControlElements();
            // }
        }

        function move(prevVelocity, prevLocation, finalPos, delay){
            //If object is not on screen, reset and hide it
            if (!(
                (0 < outerContainer.position().top+ outerContainer.height()) 
                && (outerContainer.position().top < rootHeight) 
                && (0 < outerContainer.position().left + outerContainer.width()) 
                && (outerContainer.position().left < rootWidth))) 
                {
                    hideMediaObject();
                    pauseResetMediaObject();
                    return;
            };

            //If velocity is almost 0, stop movement
            if ((Math.abs(prevVelocity.x) < .1) && (Math.abs(prevVelocity.y) < .1)) {
                return;
            };

            //Current position is previous position + movement from velocity * time
            var currentPosition = { 
                    x: prevLocation.x + delay*prevVelocity.x,
                    y: prevLocation.y + delay*prevVelocity.y                  
                },

                // New velocity is proportional to distance left to travel
                newVelocity = {
                    x: (finalPos.x - currentPosition.x)/(delay*50),
                    y: (finalPos.y - currentPosition.y)/(delay*50)
                },

                timer;

            outerContainer.css({'left': currentPosition.x, 'top': currentPosition.y});

            //Clear all previously-set timers used for movement on this object
            for (var i = 0; i < movementTimeouts.length; i++) {
                clearTimeout(movementTimeouts[i]);
            }
            movementTimeouts = [];
            movementTimeouts.push( 
                setTimeout(function () {
                move(newVelocity, currentPosition, finalPos, delay);
                }, 1)
            );
        }

        /**
         * Zoom handler for associated media (e.g., for mousewheel scrolling)
         * @method mediaScroll
         * @param {Number} scale     scale factor
         * @param {Object} pivot     point of contact
         */
        function mediaScroll(scale, pivot) {
            mediaManip({
                scale: scale,
                translation: {
                    x: 0,
                    y: 0
                },
                pivot: pivot
            });
        }
        
        /**
         * Create a closeButton for associated media
         * @method createCloseButton
         * @return {HTML element} the button as a 'div'
         */
        function createCloseButton() {
            var closeButton = $(document.createElement('div'));
            closeButton.text('X');
            closeButton.css({
                'position': 'absolute',
                'top': '0.4em',
                'left': '-2em',
                'width': '0.7em',
                'height': '0.7em',
                'text-align': 'center',
                //'color': 'black',
                'line-height': '0.5em',
                //'border': '10px solid black',
                //'border-radius': '2em',
                'background-color': 'black',
                'margin-left': '107%'
            });
            return closeButton;
        }
         
        /**
         * Show the associated media on the seadragon canvas. If the media is not
         * a hotspot, show it in a slightly random position.
         * @method showMediaObject
         */
        function showMediaObject() {
            var t,
                l,
                h = outerContainer.height(),
                w = outerContainer.width();
                
            if(IS_HOTSPOT) {
                console.log("---------------------------------------------- is hotspot");
                circle.css('visibility', 'visible');
                addOverlay(circle[0], position, Seadragon.OverlayPlacement.TOP_LEFT);
                viewer.viewport.panTo(position, false);
                viewer.viewport.applyConstraints()
                t = circle.offset().top + circle.width()*4;
                l = circle.offset().left + circle.width()*4;

                console.log("pointFromPixel: " + viewer.viewport.pointFromPixel(position));

                console.log("circle.width: " + circle.width());

                //t = Math.max(10, (rootHeight - h)/2); // tries to put middle of outer container at circle level
                //l = rootWidth/2 + circle.width()*3/4;
            } else {
                t = rootHeight * 1/10 + Math.random() * rootHeight * 2/10;
                l = rootWidth  * 3/10 + Math.random() * rootWidth  * 2/10;
            };
            outerContainer.css({
                'top':            t + "px",
                'left':           l + "px",
                'position':       "absolute",
                'z-index':        1000,
                'pointer-events': 'all'
            });

            outerContainer.show();
            assetCanvas.append(outerContainer);

            if(!thumbnailButton) {
                thumbnailButton = $('#thumbnailButton-' + mdoq.Identifier);
            }

            thumbnailButton.css({
                'color': 'black',
                'background-color': 'rgba(255,255,255, 0.3)'
            });
            
            // TODO is this necessary?
            // if ((info.contentType === 'Video') || (info.contentType === 'Audio')) {
            //     resizeControlElements();
            // }

            mediaHidden = false;
        }

        /**
         * Hide the associated media
         * @method hideMediaObject
         */
        function hideMediaObject() {
            pauseResetMediaObject();
            IS_HOTSPOT && removeOverlay(circle[0]);
            outerContainer.hide();   
            mediaHidden = true;

            if(!thumbnailButton) {
                thumbnailButton = $('#thumbnailButton-' + mdoq.Identifier);
            }

            thumbnailButton.css({
                'color': 'white',
                'background-color': ''
            });
            TAG.Util.IdleTimer.restartTimer();              
            dzManipPreprocessing();                     //When an object is hidden, set the artwork as active

        }

        /**
         * Show if hidden, hide if shown
         * @method toggleMediaObject
         */
        function toggleMediaObject() {
            mediaHidden ? showMediaObject() : hideMediaObject();
        }

        /**
         * Returns whether the media object is visible
         * @method isVisible
         * @return {Boolean}
         */
        function isVisible() {
            return !mediaHidden;
        }

        /**
         * Pauses and resets (to time 0) the media if the content type is video or audio
         * @pauseResetMediaObject
         */
        function pauseResetMediaObject() {
            if(!mediaElt || mediaElt.readyState < 4) { // see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
                return;
            }
            mediaElt.currentTime = 0;
            mediaElt.pause();
            play.attr('src', tagPath + 'images/icons/PlayWhite.svg');
        }


        return {
            doq:                 mdoq,
            linq:                linq,
            show:                showMediaObject,
            hide:                hideMediaObject,
            create:              createMediaElements,
            pauseReset:          pauseResetMediaObject,
            toggle:              toggleMediaObject,
            createMediaElements: createMediaElements,
            isVisible:           isVisible,
            mediaManipPreprocessing: mediaManipPreprocessing
        };
    }
};