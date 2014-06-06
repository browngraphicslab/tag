LADS.Util.makeNamespace("LADS.AnnotatedImage");

/**
 * Representation of deepzoom image with associated media. Contains
 * touch handlers and a method for creating associated media objects.
 * @class LADS.AnnotatedImage
 * @constructor
 * @param {Object} options         some options for the artwork and assoc media
 * @return {Object}                some public methods and variables
 */

LADS.AnnotatedImage = function (options) { // rootElt, doq, split, callback, shouldNotLoadHotspots) {
    "use strict";


    var // input options
        root     = options.root,           // root of the artwork viewing page
        doq      = options.doq,            // doq for the artwork
        callback = options.callback,       // called after associated media are retrieved from server
        noMedia  = options.noMedia,        // should we not have assoc media? (set to true in artwork editor)

        // constants
        FIX_PATH = LADS.Worktop.Database.fixPath,   // prepend server address to given path

        // misc initialized variables
        that            = {},              // the object to be returned
        artworkName     = doq.Name,        // artwork's title
        associatedMedia = { guids: [] },   // object of associated media objects for this artwork, keyed by media GUID;
                                           //   also contains an array of GUIDs for cleaner iteration
        toManip = dzManip,                 // media to manipulate, i.e. artwork or associated media
        clickedMedia = 'artwork',
        // misc uninitialized variables
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
        getClicked: getClicked,
        setArtworkClicked: setArtworkClicked
    };


    function setArtworkClicked() {
        toManip = dzManip;                  //When the main artwork is clicked, use the Deep Zoom manipulation method
        clickedMedia = 'artwork';
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
     * Return active media to be manipulated so applicable manipulation method can be called
     * @method clickedMedia
     * @return {String}     manipulation method object
     */

    function getClicked() {
        return clickedMedia;
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
        if(!that.viewer || !doq || !doq.Metadata || !doq.Metadata.DeepZoom) {
            debugger;
            console.log("ERROR IN openDZI");
            return false;
        }
        that.viewer.openDzi(FIX_PATH(doq.Metadata.DeepZoom));
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
            that.viewer.drawer.updateOverlay(element, that.viewer.viewport.pointFromPixel(new Seadragon.Point(left, top)), placement);
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
        if (!that.viewer.isOpen()) {
            that.viewer.addEventListener('open', function () {
                that.viewer.drawer.addOverlay(element, point, placement);
                that.viewer.drawer.updateOverlay(element, point, placement);
            });
        } else {
            that.viewer.drawer.addOverlay(element, point, placement);
            that.viewer.drawer.updateOverlay(element, point, placement);
        }
    }

    /**
     * Wrapper around Seadragon.Drawer.removeOverlay. Removes an HTML overlay from the seadragon
     * canvas.
     * @method removeOverlay
     * @param {HTML element}       the ovlerlay element to remove
     */
    function removeOverlay(element) {
        if (!that.viewer.isOpen()) {
            that.viewer.addEventListener('open', function () {
                that.viewer.drawer.removeOverlay(element);
            });
        } else {
            that.viewer.drawer.removeOverlay(element);
        }
    };

    /**
     * Unloads the seadragon viewer
     * @method unload
     */
    function unload() {
        that.viewer && that.viewer.unload();
    }


    function dzManipPreprocessing() {
        toManip = dzManip;
        clickedMedia = 'artwork';
    }

    /**
     * Manipulation/drag handler for makeManipulatable on the deepzoom image
     * @method dzManip
     * @param {Object} pivot           location of the event (x,y)
     * @param {Object} translation     distance translated in x and y
     * @oaram {Number} scale           scale factor
     */
    function dzManip(pivot, translation, scale) {
        dzManipPreprocessing();
        that.viewer.viewport.zoomBy(scale, that.viewer.viewport.pointFromPixel(new Seadragon.Point(pivot.x, pivot.y)), false);
        that.viewer.viewport.panBy(that.viewer.viewport.deltaPointsFromPixels(new Seadragon.Point(-translation.x, -translation.y)), false);
        that.viewer.viewport.applyConstraints();
    }
    
    /**
     * Scroll/pinch-zoom handler for makeManipulatable on the deepzoom image
     * @method dzScroll
     * @param {Number} scale          scale factor
     * @param {Object} pivot          location of event (x,y)
     */
    function dzScroll(scale, pivot) {
        dzManip(pivot, {x: 0, y: 0}, scale);
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

        that.viewer = new Seadragon.Viewer(viewerelt[0]);
        that.viewer.setMouseNavEnabled(false);
        that.viewer.clearControls();

        canvas = $(that.viewer.canvas);
        canvas.addClass('artworkCanvasTesting');

        LADS.Util.makeManipulatable(canvas[0], {
            onScroll: function (delta, pivot) {
                dzScroll(delta, pivot);
            },
            onManipulate: function (res) {
                dzManip(res.pivot, res.translation, res.scale); // TODO change dzManip to just accept res
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
        that.viewer.addEventListener("animation", handler);
    }

    /**
     * Retrieves associated media from server and stores them in the
     * associatedMedia array.
     * @method {Function} callback    function to call after loading associated media
     */
    function loadAssociatedMedia(callback) {
        var done = 0,
            total;

        LADS.Worktop.Database.getAssocMediaTo(doq.Identifier, mediaSuccess, null, mediaSuccess);

        /**
         * Success callback frunction for .getAssocMediaTo call above. If the list of media is
         * non-null and non-empty, it gets the linq between each doq and the artwork 
         * @method mediaSuccess
         * @param {Array} doqs        the media doqs
         */
        function mediaSuccess(doqs) {
            var i;
            total = doqs ? doqs.length : 0;
            if (total > 0) {
                for (i = 0; i < doqs.length; i++) {
                    LADS.Worktop.Database.getLinq(doq.Identifier, doqs[i].Identifier, createLinqSuccess(doqs[i]), null, createLinqSuccess(doqs[i]));
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
            rootHeight     = $('#tagRoot').height(),
            rootWidth      = $('#tagRoot').width(),

            // constants
            IS_HOTSPOT      = linq.Metadata.Type ? (linq.Metadata.Type === "Hotspot") : false,
            X               = parseFloat(linq.Offset._x),
            Y               = parseFloat(linq.Offset._y),
            TITLE           = LADS.Util.htmlEntityDecode(mdoq.Name),
            CONTENT_TYPE    = mdoq.Metadata.ContentType,
            SOURCE          = mdoq.Metadata.Source,
            DESCRIPTION     = LADS.Util.htmlEntityDecode(mdoq.Metadata.Description),
            THUMBNAIL       = mdoq.Metadata.Thumbnail,
            RELATED_ARTWORK = false,

            // misc initialized variables
            mediaHidden      = true,
            currentlySeeking = false,

            // misc uninitialized variables
            circle,
            position,
            mediaLoaded,
            mediaHidden,
            mediaElt,
            titleDiv,
            descDiv,
            thumbnailButton,
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
            LADS.Util.disableDrag(outerContainer);

            // register handlers
            LADS.Util.makeManipulatable(outerContainer[0], {
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
                vol = $(document.createElement('img')).addClass('mediaControls'),
                seekBar,
                timeContainer = $(document.createElement('div')),
                currentTimeDisplay = $(document.createElement('span')).addClass('mediaControls'),
                playHolder = $(document.createElement('div')),
                volHolder = $(document.createElement('div')),
                sliderContainer = $(document.createElement('div')),
                sliderPoint = $(document.createElement('div'));

            controlPanel.attr('id', 'media-control-panel-' + mdoq.Identifier);

            play = $(document.createElement('img')).addClass('mediaControls');

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
                'margin':   '0px 1% 0px 1%',
            });

            sliderContainer.css({
                'position': 'absolute',
                'height':   '7px',
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
                'top':      '0px'
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
                var time = elt.duration * (evt.offsetX / sliderContainer.width()),
                    origPoint = evt.pageX,
                    origTime = elt.currentTime,
                    timePxRatio = elt.duration / sliderContainer.width(),
                    currTime = Math.max(0, Math.min(elt.duration, origTime)),
                    currPx   = currTime / timePxRatio,
                    minutes = Math.floor(currTime / 60),
                    seconds = Math.floor(currTime % 60),
                    adjMin = (minutes < 10) ? '0'+minutes : minutes,
                    adjSec = (seconds < 10) ? '0'+seconds : seconds;

                evt.stopPropagation();

                if(!isNaN(time)) {
                    elt.currentTime = time;
                }

                $('body').on('mousemove.seek', function(e) {
                    var currPoint = e.pageX,
                        timeDiff = (currPoint - origPoint) * timePxRatio;

                    currTime = Math.max(0, Math.min(video.duration, origTime + timeDiff));
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
                    $('body').off('mouseup.seek mouseleave.seek mousemove.seek');
                    if(!isNaN(currTime)) {
                        currentTimeDisplay.text(adjMin + ":" + adjSec);
                        elt.currentTime = currTime;
                        sliderPoint.css('width', 100*(currPx / sliderContainer.width()) + '%');
                    }
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
                img;

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
         * Repeated functionality in the outerContainer click handler and
         * media manip.
         * @method mediaManipPreprocessing
         */
        function mediaManipPreprocessing() {
            toManip = mediaManip;
            clickedMedia = 'media';
            $('.mediaOuterContainer').css('z-index', 1000);
            outerContainer.css('z-index', 1001);
        }

        outerContainer.on('click', function (event) {
            event.stopPropagation();            //Prevent the click going through to the main container
            event.preventDefault();
            mediaManipPreprocessing();
            // toManip = mediaManip;              //When you click on any media, use the manipulation method for media
            // clickedMedia = 'media'; 
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
                newW  = w * scale,
                maxW,
                minW;

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
                scale = 1;
                newW = Math.min(maxW, Math.max(minW, newW));
            }

            // zoom from touch point: change left and top of outerContainer
            if ((0 < t + h) && (t < rootHeight) && (0 < l + w) && (l< rootWidth)) {
                outerContainer.css("top",  (t + trans.y + (1 - scale) * pivot.y) + "px");
                outerContainer.css("left", (l + trans.x + (1 - scale) * pivot.x) + "px");
            } else {
                hideMediaObject();
                pauseResetMediaObject();
                return;
            }

            // zoom from touch point: change width and height of outerContainer
            outerContainer.css("width", newW + "px");
            outerContainer.css("height", "auto");

            // TODO this shouldn't be necessary; style of controls should take care of it
            // if ((CONTENT_TYPE === 'Video' || CONTENT_TYPE === 'Audio') && scale !== 1) {
            //     resizeControlElements();
            // }
        }

        /**
         * Zoom handler for associated media (e.g., for mousewheel scrolling)
         * @method onScroll
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
                circle.css('visibility', 'visible');
                addOverlay(circle[0], position, Seadragon.OverlayPlacement.TOP_LEFT);
                that.viewer.viewport.panTo(position, false);
                t = Math.max(10, (rootHeight - h)/2); // tries to put middle of outer container at circle level
                l = rootWidth/2 + circle.width()*3/4;
            } else {
                t = rootHeight * 1/10 + Math.random() * rootHeight * 2/10;
                l = rootWidth  * 3/10 + Math.random() * rootWidth  * 2/10;
            }
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
            isVisible:           isVisible
        };
    }
};