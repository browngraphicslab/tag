LADS.Util.makeNamespace("LADS.AnnotatedImage");

/**
 * Representation of deepzoom image with associated media. Contains
 * touch handlers. This is a constructor function, so it adds properties
 * to 'this' rather than returning an object.
 *
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

        // misc uninitialized variables
        assetCanvas;

    // set up some properties of that
    that.viewer = null;

    init();

    return {
        getAssociatedMedia: getAssociatedMedia,
        unload: unload,
        dzManip: dzManip,
        dzScroll: dzScroll,
        openArtwork: openArtwork,
        addAnimateHandler: addAnimateHandler
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
        // var xmlhttp = LADS.Util.makeXmlRequest(url);
        // var response = xmlhttp ? xmlhttp.responseXML : null;

        //if (false && response === null) {
        //    return false;
        //} else {
            // var node = response.documentElement.querySelectorAll("Image, Size")[0];
            // width = node.getAttribute("Width");
            // height = node.getAttribute("Height");
            // aspectRatio = width / height;

        if(!that.viewer || !doq || !doq.Metadata || !doq.Metadata.DeepZoom) {
            debugger;
            console.log("ERROR IN openDZI");
            return false;
        }

        that.viewer.openDzi(FIX_PATH(doq.Metadata.DeepZoom));
        return true;
        //return true;
        //}
    }

    //what does 'doq' refer to?
    // bmost: 'doq' refers to document,
    // which is basically everything on the server (that isn't a linq).
    // They are in XML format.
    // I don't think this function should be necessary, why can't it just
    // take in the artwork (doq) in the constructor?  Then it doesn't need
    // parameters for name and id because you can call doq.Name, doq.Identifier,
    // and doq.Metadata.DeepZoom
    // this.loadDoq = function (doq) {
    //    return this.loadImage(LADS.Worktop.Database.fixPath(doq.Metadata.DeepZoom));
    //};



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
        } else {
            debugger;
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

    /**
     * Manipulation/drag handler for makeManipulatable on the deepzoom image
     * @method dzManip
     * @param {Object} pivot           location of the event (x,y)
     * @param {Object} translation     distance translated in x and y
     * @oaram {Number} scale           scale factor
     */
    function dzManip(pivot, translation, scale) {
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
        that.viewer.viewport.zoomBy(scale, that.viewer.viewport.pointFromPixel(new Seadragon.Point(pivot.x, pivot.y)));
        that.viewer.viewport.applyConstraints();
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
                dzManip(res.pivot, res.translation, res.scale);
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

                // if (linq) {
                //     assocMedia
                //     var position_x = linq.Offset._x;
                //     var position_y = linq.Offset._y;
                //     var info = {
                //         assetType: linq.Metadata.Type,
                //         title: assocMedia.Name,
                //         contentType: assocMedia.Metadata.ContentType,
                //         source: assocMedia.Metadata.Source,
                //         thumbnail: assocMedia.Metadata.Thumbnail,
                //         description: assocMedia.Metadata.Description,
                //         x: parseFloat(position_x),
                //         y: parseFloat(position_y),
                //         assetDoqID: assocMedia.Identifier,
                //         assetLinqID: linq.Identifier
                //     };
                //     createNewHotspot(info, linq.Metadata.Type ? (info.assetType === "Hotspot") : false);
                //     done++;
                //     if (done >= total && callback)
                //         callback(hotspots, assets);
                // }
            }
        }
    }

    /**
     * Creates an associated media object to be added to associatedMedia.
     * This object contains methods that could be called in Artmode.js or
     * ArtworkEditor.js. This could be in its own file.
     * @method createMediaObject
     * @param {doq} doq       the media doq
     * @param {linq} linq     the linq between the media doq and the artwork doq
     * @return {Object}       some public methods to be used in other files
     */
    function createMediaObject(doq, linq) {
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
            TITLE           = LADS.Util.htmlEntityDecode(doq.Name),
            CONTENT_TYPE    = doq.Metadata.ContentType,
            SOURCE          = doq.Metadata.Source,
            DESCRIPTION     = LADS.Util.htmlEntityDecode(doq.Metadata.Description),
            THUMBNAIL       = doq.Metadata.Thumbnail,
            RELATED_ARTWORK = false,

            // misc initialized variables
            mediaHidden      = true,
            currentlySeeking = false,


            // misc uninitialized variables
            circle,
            position,
            mediaLoaded,
            mediaHidden,
            audioElt,
            videoElt,
            titleDiv,
            descDiv,
            thumbnailButton;

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
                root.append(circle); // TODO check this
            }

            // disable dragging on the outer container (TODO why is this necessary?)
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
         */
        function initMediaControls() {
            if(CONTENT_TYPE === 'Image') {
                return;
            }

            var controlPanel,
                play,
                vol,
                seekBar,
                timeContainer,
                currentTimeDisplay,
                playHolder,
                volHolder;

            controlPanel = $(document.createElement('div'));
            controlPanel.attr('id', 'media-control-panel-' + doq.Identifier);
            controlPanel.addClass('annotatedImageMediaControlPanel');




        }

        /**
         * Load the actual image/video/audio; this can take a while if there are
         * a lot of media, so just do it when the thumbnail button is clicked
         * @method createMediaElements
         */
        function createMediaElements() {
            var elt;

            if(!mediaLoaded) {
                mediaLoaded = true;
            } else {
                return;
            }

            if (CONTENT_TYPE === 'Image') {
                elt = document.createElement('img');
                elt.src = FIX_PATH(SOURCE);
                $(elt).css({
                    position: 'relative',
                    width:    '100%',
                    height:   'auto'
                });
                mediaContainer.append(elt);
                mediaLoaded = true;
            } else if (CONTENT_TYPE === 'Video') {
                videoElt = $(document.createElement('video'));

                videoElt.attr({
                    preload:  'none',
                    poster:   (THUMBNAIL && !THUMBNAIL.match(/.mp4/)) ? FIX_PATH(THUMBNAIL) : '',
                    src:      FIX_PATH(SOURCE),
                    type:     'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
                    controls: false
                });

                // TODO need to use <source> tags rather than setting the source and type of the
                //      video in the <video> tag's attributes; see video player code
                
                videoElt.css({
                    position: 'relative',
                    width:    '100%'
                });
                

                playHolder = $(document.createElement('div'));
                play = document.createElement('img');
                $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                $(play).addClass('videoControls');
                $(play).css({
                    'position': 'relative',
                    'height': '20px',
                    'width': '20px',
                    'display': 'inline-block',
                });
                playHolder.css({
                    'position': 'relative',
                    'height': '20px',
                    'width': '20px',
                    'display': 'inline-block',
                    'margin': '0px 1% 0px 1%',
                });
                playHolder.append(play);

                volHolder = $(document.createElement('div'));
                vol = document.createElement('img');
                $(vol).attr('src', tagPath+'images/icons/VolumeUpWhite.svg');
                $(vol).addClass('videoControls');
                $(vol).css({
                    'height': '20px',
                    'width': '20px',
                    'position': 'relative',
                    'display': 'inline-block',
                });

                volHolder.css({
                    'height': '20px',
                    'width': '20px',
                    'position': 'relative',
                    'display': 'inline-block',
                    'margin': '0px 1% 0px 1%',
                });
                volHolder.append(vol);
                this.initVideoPlayHandlers = function () {
                    if (video.currentTime !== 0) video.currentTime = 0;
                    $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                    $(play).on('click', function () {
                        if (video.paused) {
                            video.play();
                            $(play).attr('src', tagPath+'images/icons/PauseWhite.svg');
                        } else {
                            video.pause();
                            $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                        }
                    });

                    $(vol).on('click', function () {
                        if (video.muted) {
                            video.muted = false;
                            $(vol).attr('src', tagPath+'images/icons/VolumeUpWhite.svg');
                        } else {
                            video.muted = true;
                            $(vol).attr('src', tagPath+'images/icons/VolumeDownWhite.svg');
                        }
                    });

                    $(video).on('ended', function () {
                        video.pause();
                        $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                    });
                };
                this.initVideoPlayHandlers();

                seekBar = document.createElement('input');
                $(seekBar).addClass('videoControls');
                seekBar.type = 'range';
                $(seekBar).attr('id', "seek-bar");
                $(seekBar).attr('value', "0");
                seekBar.style.margin = '0px 1% 0px 1%';
                seekBar.style.display = 'inline-block';
                seekBar.style.padding = '0px';
                $(seekBar).css({
                    left: '30px',
                });

                // Event listener for the seek bar
                seekBar.addEventListener("change", function (evt) {
                    evt.stopPropagation();
                    // Calculate the new time
                    var time = video.duration * (seekBar.value / 100);
                    // Update the video time
                    if (!isNaN(time)) {
                        video.currentTime = time;
                    }
                });

                $(seekBar).mouseover(function (evt) {
                    var percent = evt.offsetX / $(seekBar).width();
                    var hoverTime = video.duration * percent;
                    var minutes = Math.floor(hoverTime / 60);
                    var seconds = Math.floor(hoverTime % 60);
                    hoverString = String(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
                    seekBar.title = hoverString;
                    //console.log("minute "+ minutes+" seconds "+seconds+"hover "+ hoverString+"percent "+percent );
                });

                $(seekBar).mousedown(function (evt) {
                    dragBar = true;
                    evt.stopPropagation();
                });

                $(seekBar).mouseup(function (evt) {
                    dragBar = false;
                    evt.stopPropagation();
                });

                timeContainer = document.createElement('div');
                $(timeContainer).css({
                    'height': '20px',
                    'width': '40px',
                    'margin': '0px 1% 0px 1%',
                    'padding': '0',
                    'display': 'inline-block',
                    'overflow': 'hidden',
                });

                currentTimeDisplay = document.createElement('span');
                $(currentTimeDisplay).text("00:00");
                $(currentTimeDisplay).addClass('videoControls');

                // Update the seek bar as the video plays
                video.addEventListener("timeupdate", function () {
                    // Calculate the slider value
                    var value = (100 / video.duration) * video.currentTime;
                    // Update the slider value
                    seekBar.value = value;
                    var minutes = Math.floor(video.currentTime / 60);
                    var seconds = Math.floor(video.currentTime % 60);
                    var adjMin;
                    if (String(minutes).length < 2) {
                        adjMin = String('0' + minutes);
                    } else {
                        adjMin = String(minutes);
                    }
                    $(currentTimeDisplay).text(adjMin + String(":" + (seconds < 10 ? "0" : "") + seconds));
                });

                // if(!imgadded) {
                mediaContainer.append(video);
                mediaContainer.append(controlPanel[0]);
                //    imgadded = true;
                //}
                controlPanel.append(playHolder);
                controlPanel.append(seekBar);
                $(timeContainer).append(currentTimeDisplay);
                controlPanel.append(timeContainer);
                controlPanel.append(volHolder);
            } else if (this.contentType === 'Audio') {
                // debugger;
                audio = document.createElement('audio');
                $(audio).attr({
                    'preload': 'none'
                });
                audio.src = LADS.Worktop.Database.fixPath(this.source);
                audio.type = 'audio/ogg';
                audio.type = 'audio/mp3'; // TODO <-- we should be overwriting types!
                audio.removeAttribute('controls');

                playHolder = $(document.createElement('div'));
                play = document.createElement('img');
                $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                $(play).addClass('audioControls');
                $(play).css({
                    'position': 'relative',
                    'height': '20px',
                    'width': '20px',
                    'display': 'inline-block',
                });
                playHolder.css({
                    'position': 'relative',
                    'height': '20px',
                    'width': '20px',
                    'display': 'inline-block',
                    'margin': '0px 1% 0px 1%',
                });

                play.style.width = "32px";
                play.style.height = "32px";
                playHolder.width(32);
                playHolder.height(32);

                playHolder.append(play);

                volHolder = $(document.createElement('div'));
                vol = document.createElement('img');
                $(vol).attr('src', tagPath+'images/icons/VolumeUpWhite.svg');
                $(vol).addClass('audioControls');
                $(vol).css({
                    'height': '20px',
                    'width': '20px',
                    'position': 'relative',
                    'display': 'inline-block',
                });

                volHolder.css({
                    'height': '20px',
                    'width': '20px',
                    'position': 'relative',
                    'display': 'inline-block',
                    'margin': '0px 1% 0px 1%',
                });
                volHolder.append(vol);
                this.initAudioPlayHandlers = function () {
                    if (audio.currentTime !== 0) audio.currentTime = 0;
                    audio.pause();
                    $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                    $(play).on('click', function () {
                        if (audio.paused) {
                            audio.play();
                            $(play).attr('src', tagPath+'images/icons/PauseWhite.svg');
                        } else {
                            audio.pause();
                            $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                        }
                    });

                    $(vol).on('click', function () {
                        if (audio.muted) {
                            audio.muted = false;
                            $(vol).attr('src', tagPath+'images/icons/VolumeUpWhite.svg');
                        } else {
                            audio.muted = true;
                            $(vol).attr('src', tagPath+'images/icons/VolumeDownWhite.svg');
                        }
                    });

                    $(audio).on('ended', function () {
                        audio.pause();
                        $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                    });
                };

                this.initAudioPlayHandlers();

                seekBar = document.createElement('input');
                $(seekBar).addClass('audioControls');
                seekBar.type = 'range';
                $(seekBar).attr('id', "seek-bar");
                $(seekBar).attr('value', "0");
                seekBar.style.margin = '0px 1% 0px 1%';
                seekBar.style.display = 'inline-block';
                seekBar.style.padding = '0px';
                $(seekBar).css({
                    left: '30px',
                });

                // Event listener for the seek bar
                seekBar.addEventListener("change", function (evt) {
                    evt.stopPropagation();
                    // Calculate the new time
                    var time = audio.duration * (seekBar.value / 100);
                    // Update the audio time
                    if (!isNaN(time)) {
                        audio.currentTime = time;
                    }
                });

                $(seekBar).mouseover(function (evt) {
                    var percent = evt.offsetX / $(seekBar).width();
                    var hoverTime = audio.duration * percent;
                    var minutes = Math.floor(hoverTime / 60);
                    var seconds = Math.floor(hoverTime % 60);
                    hoverString = String(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
                    seekBar.title = hoverString;
                    //console.log("minute "+ minutes+" seconds "+seconds+"hover "+ hoverString+"percent "+percent );
                });

                $(seekBar).mousedown(function (evt) {
                    dragBar = true;
                    evt.stopPropagation();
                });

                $(seekBar).mouseup(function (evt) {
                    dragBar = false;
                    evt.stopPropagation();
                });

                timeContainer = document.createElement('div');
                $(timeContainer).css({
                    'height': '20px',
                    'width': '40px',
                    'margin': '0px 1% 0px 1%',
                    'padding': '0',
                    'display': 'inline-block',
                    'overflow': 'hidden',
                });

                currentTimeDisplay = document.createElement('span');
                $(currentTimeDisplay).text("00:00");
                $(currentTimeDisplay).addClass('audioControls');

                // Update the seek bar as the audio plays
                audio.addEventListener("timeupdate", function () {
                    // Calculate the slider value
                    var value = (100 / audio.duration) * audio.currentTime;
                    // Update the slider value
                    seekBar.value = value;
                    var minutes = Math.floor(audio.currentTime / 60);
                    var seconds = Math.floor(audio.currentTime % 60);
                    var adjMin;
                    if (String(minutes).length < 2) {
                        adjMin = String('0' + minutes);
                    } else {
                        adjMin = String(minutes);
                    }
                    $(currentTimeDisplay).text(adjMin + String(":" + (seconds < 10 ? "0" : "") + seconds));
                });

                // if(!imgadded) {
                mediaContainer.append(audio);
                mediaContainer.append(controlPanel[0]);
                //     imgadded = true;
                // }
                
                controlPanel.append(playHolder);
                controlPanel.append(seekBar);
                $(timeContainer).append(currentTimeDisplay);
                controlPanel.append(timeContainer);
                controlPanel.append(volHolder);
            }
        }

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

            // these values are somewhat arbitrary; TODO determine good values
            if (CONTENT_TYPE === 'Image') {
                maxW = 3000;
                minW = 200;
            } else if (CONTENT_TYPE === 'Video') {
                maxW = root.width();
                minW = 450;
            } else if (CONTENT_TYPE === 'Audio') {
                maxW = 800;
                minW = 450;
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
            if (CONTENT_TYPE === 'Video' || CONTENT_TYPE === 'Audio') {
                resizeControlElements();
            }
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
                top: t + "px",
                left: l + "px",
                position: "absolute",
                'z-index': 1000,
                'pointer-events': 'all'
            });

            outerContainer.show();
            assetCanvas.append(outerContainer);

            if(!thumbnailButton) {
                thumbnailButton = $('#thumbnailButton-' + doq.Identifier);
            }

            thumbnailButton.css({
                'color': 'black',
                'background-color': 'rgba(255,255,255, 0.3)'
            });

            // TODO is this necessary?
            if ((info.contentType === 'Video') || (info.contentType === 'Audio')) {
                resizeControlElements();
            }

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
                thumbnailButton = $('#thumbnailButton-' + doq.Identifier);
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
            if (CONTENT_TYPE === 'Audio' && audioElt) {
                audio.currentTime = 0;
                audio.pause();
                play.attr('src', tagPath + 'images/icons/PlayWhite.svg');
            } else if (CONTENT_TYPE === 'Video' && videoElt) {
                video.currentTime = 0;
                video.pause();
                play.attr('src', tagPath + 'images/icons/PlayWhite.svg');
            }
        }


        return {
            doq:                 doq,
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

























    //new hotspot function
    function hotspot(info, isHotspot) {
        //Hotspot info
        var imgadded = false;
        this.title = info.title;
        this.contentType = info.contentType;
        this.source = info.source;
        this.description = info.description;
        this.thumbnail = info.thumbnail;
        var assetHidden = true;
        var audio, video;

        //Create and append asset/hotspot containerscontainers
        var outerContainer = document.createElement('div');
        var containerHeight = $("#artmodeRoot").height();
        var containerWidth = $("#artmodeRoot").width();
        outerContainer.style.width = Math.min(Math.max(250, (containerWidth / 5)), 450)+'px';

        var innerContainer = document.createElement('div');
        innerContainer.style.backgroundColor = 'rgba(0,0,0,0.65)';
        var mediaContainer = $(document.createElement('div')).addClass('mediaContainer');
        outerContainer.appendChild(innerContainer);

        // media-specific
        var controlPanel = $(document.createElement('div')),
            play, vol, seekBar, timeContainer, currentTimeDisplay, playHolder, volHolder, sliderContainer, sliderPoint;

        controlPanel.addClass('media-control-panel-' + info.assetDoqID);
        controlPanel.css({
            'height': '60px',
            'position': 'relative',
            'display': 'block',
            'left': '2.5%',
            'margin-bottom': '2.5%',
        });

        //Add title   ----------------------------
        this.createTitle = function() {
            if (this.title){
                var p1 = document.createElement('div');

                $(p1).text(LADS.Util.htmlEntityDecode(this.title)).css({
                    'position': 'relative',
                    'left': '5%',
                    'width': '90%',
                    'color': 'white',
                    'top': '5px',
                    'padding-bottom': '2%',
                    'overflow': 'hidden',
                    'text-overflow': 'ellipsis',
                    'font-weight': '700'
                });

                innerContainer.appendChild(p1);
                var hoverString, setHoverValue;
            }
        }
        this.createTitle();
        
        //Load media
        this.mediaload = function(){
            if(!imgadded) {
                imgadded = true;
            } else {
                return;
            }

            //IMAGE
            if (this.contentType === 'Image') {
                
                
                var img = document.createElement('img');
                img.src = LADS.Worktop.Database.fixPath(this.source);
                $(img).css({
                    'position': 'relative',
                    width: '100%',
                    height: 'auto'
                });
                mediaContainer.append(img);
                imgadded = true;
            }

            if (this.contentType === 'Video') {
                
                    video = document.createElement('video');
                    $(video).attr('preload', 'none');
                    $(video).attr('poster', (this.thumbnail && !this.thumbnail.match(/.mp4/)) ? LADS.Worktop.Database.fixPath(this.thumbnail) : '');
                    video.src = LADS.Worktop.Database.fixPath(this.source);
                    video.type = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';//'video/mp4';
                    video.type = 'video/ogg; codecs="theora, vorbis"';//'video/ogg';
                    video.type = 'video/webm; codecs="vp8, vorbis"';//'video/webm'; // TODO this doesn't make any sense. why are we overwriting this twice?
                    video.style.position = 'relative';
                    video.style.width = '100%';
                    video.controls = false;

                    playHolder = $(document.createElement('div'));
                    play = document.createElement('img');
                    $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                    $(play).addClass('videoControls');
                    $(play).css({
                        'position': 'relative',
                        'height': '20px',
                        'width': '20px',
                        'display': 'inline-block',
                    });
                    playHolder.css({
                        'position': 'absolute',
                        'height': '20px',
                        'width': '20px',
                        //'display': 'inline-block',
                        'margin': '0px 1% 0px 1%',

                    });
                    playHolder.append(play);

                   
                    var sliderContainer = $(document.createElement('div'));
                    sliderContainer.css({
                        'position': 'absolute',
                        'height': '7px',
                        'width': '100%',
                        //'display': 'inline-block',
                        'left': '0px',
                        'bottom': '0px',
                        //'margin': '0px 1% 0px 1%',
                    });

                    var sliderPoint = $(document.createElement('div'));
        
                    sliderPoint.css({
                        'position': 'absolute',
                        'height': '100%',
                        'background-color': '#3cf',
                        'width': '0%',
                        //'display': 'inline-block',
                        'left': '0%',
                    });

                    sliderContainer.append(sliderPoint);


                    volHolder = $(document.createElement('div'));
                    vol = document.createElement('img');
                    $(vol).attr('src', tagPath+'images/icons/VolumeUpWhite.svg');
                    $(vol).addClass('videoControls');
                    $(vol).css({
                        'height': '20px',
                        'width': '20px',
                        'position': 'relative',
                        'display': 'inline-block',
                    });

                    volHolder.css({
                        'height': '20px',
                        'width': '20px',
                        'position': 'absolute',
                        //'display': 'inline-block',
                        'right': '5px',
                        'top': '0px',
                        //'margin': '0px 1% 0px 1%',
                    });
                    volHolder.append(vol);
                    this.initVideoPlayHandlers = function () {
                        if (video.currentTime !== 0) video.currentTime = 0;
                        $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                        $(play).on('click', function () {
                            if (video.paused) {
                                video.play();
                                $(play).attr('src', tagPath+'images/icons/PauseWhite.svg');
                            } else {
                                video.pause();
                                $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                            }
                        });

                        $(vol).on('click', function () {
                            if (video.muted) {
                                video.muted = false;
                                $(vol).attr('src', tagPath+'images/icons/VolumeUpWhite.svg');
                            } else {
                                video.muted = true;
                                $(vol).attr('src', tagPath+'images/icons/VolumeDownWhite.svg');
                            }
                        });

                        $(video).on('ended', function () {
                            video.pause();
                            $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                        });
                    };
                    this.initVideoPlayHandlers();

                    sliderContainer.on('mousedown', function(evt) {
                        var time = video.duration * (evt.offsetX / sliderContainer.width());    
                        if (!isNaN(time)) {
                            video.currentTime = time;
                        }
                         });


                    sliderContainer.on('mousedown', function(e){
                        e.stopPropagation();
                        console.log('mousedown');
                        var origPoint = e.pageX,
                            origTime = video.currentTime,
                            timePxRatio = video.duration / sliderContainer.width(),
                            currPx,
                            minutes,
                            seconds;
            
                        var currTime = Math.max(0, Math.min(video.duration, origTime));
                        var currPx   = currTime / timePxRatio;
                        var minutes  = Math.floor(currTime / 60);
                        var seconds  = Math.floor(currTime % 60);

                            if((""+minutes).length < 2) {
                                minutes = "0" + minutes;
                            }

                            // set up mousemove handler now that mousedown has happened
                            $(sliderContainer).on('mousemove.seek', function(evt) {
                                var currPoint = evt.pageX,
                                    timeDiff = (currPoint - origPoint) * timePxRatio;

                                currTime = Math.max(0, Math.min(video.duration, origTime + timeDiff));
                                currPx   = currTime / timePxRatio;
                                minutes  = Math.floor(currTime / 60);
                                seconds  = Math.floor(currTime % 60);

                                if((""+minutes).length < 2) {
                                    minutes = "0" + minutes;
                                }

                                // Update the video time and slider values
                                if (!isNaN(currTime)) {
                                    $(currentTimeDisplay).text(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
                                    video.currentTime = currTime;
                                    sliderPoint.css('width', currPx);
                                }
                        sliderContainer.on('mouseup.seek mouseleave.seek', function() {
                            console.log('moueup');
                            sliderContainer.off('mousemove.seek');
                            sliderContainer.off('mouseup.seek');
                            sliderContainer.off('mouseleave.seek');
                            $(currentTimeDisplay).text(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
                            video.currentTime = currTime;
                            sliderPoint.css('width', currPx);
                        });
                            });
    
                    });

/*
                    seekBar = document.createElement('input');
                    $(seekBar).addClass('videoControls');
                    seekBar.type = 'range';
                    $(seekBar).attr('id', "seek-bar");
                    $(seekBar).attr('value', "0");
                    seekBar.style.margin = '0px 1% 0px 1%';
                    seekBar.style.display = 'inline-block';
                    seekBar.style.padding = '0px';
                    $(seekBar).css({
                        left: '30px',
                    });

                    // Event listener for the seek bar
                    seekBar.addEventListener("change", function (evt) {
                        evt.stopPropagation();
                        // Calculate the new time
                        var time = video.duration * (seekBar.value / 100);
                        // Update the video time
                        if (!isNaN(time)) {
                            video.currentTime = time;
                        }
                    });

                    

                    $(seekBar).mouseover(function (evt) {
                        var percent = evt.offsetX / $(seekBar).width();
                        var hoverTime = video.duration * percent;
                        var minutes = Math.floor(hoverTime / 60);
                        var seconds = Math.floor(hoverTime % 60);
                        hoverString = String(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
                        seekBar.title = hoverString;
                        //console.log("minute "+ minutes+" seconds "+seconds+"hover "+ hoverString+"percent "+percent );
                    });

                    $(seekBar).mousedown(function (evt) {
                        dragBar = true;
                        evt.stopPropagation();
                    });

                    $(seekBar).mouseup(function (evt) {
                        dragBar = false;
                        evt.stopPropagation();
                    });

*/
                    timeContainer = document.createElement('div');
                    $(timeContainer).css({
                        'height': '20px',
                        'width': '40px',
                        'right': volHolder.width()+25+'px',
                        'position': 'absolute',
                        //'margin': '0px 1% 0px 1%',
                        'vertical-align': 'top',
                        'padding': '0',
                        'display': 'inline-block',
                        'overflow': 'hidden',
                    });

                    currentTimeDisplay = document.createElement('span');
                    $(currentTimeDisplay).text("00:00");
                    $(currentTimeDisplay).addClass('videoControls');

                    // Update the seek bar as the video plays
                    video.addEventListener("timeupdate", function () {
                        // Calculate the slider value
                        var value = (100 / video.duration) * video.currentTime;
                        // Update the slider value
                        //seekBar.value = value;
                        var minutes = Math.floor(video.currentTime / 60);
                        var seconds = Math.floor(video.currentTime % 60);
                        var adjMin;
                        var timePxRatio = video.duration /sliderContainer.width();
                        var currPx = video.currentTime / timePxRatio;

                        if(!isNaN(video.currentTime)){
                            sliderPoint.css('width', currPx);
                        }
                        if (String(minutes).length < 2) {
                            adjMin = String('0' + minutes);
                        } else {
                            adjMin = String(minutes);
                        }
                        $(currentTimeDisplay).text(adjMin + String(":" + (seconds < 10 ? "0" : "") + seconds));

                    });

                    // if(!imgadded) {
                    mediaContainer.append(video);
                    mediaContainer.append(controlPanel[0]);
                    //    imgadded = true;
                    //}
                    controlPanel.css({
                        'height': '47px',
                        'background-color': '#3f3735',
                        'width': '100%',
                    });
                    controlPanel.append(playHolder);
                    
                    //controlPanel.append(seekBar);
                    $(timeContainer).append(currentTimeDisplay);
                    controlPanel.append(timeContainer);
                    controlPanel.append(volHolder);
                    controlPanel.append(sliderContainer);
                }

                
                if (this.contentType === 'Audio') {
                    // debugger;
                    audio = document.createElement('audio');
                    $(audio).attr({
                        'preload': 'none'
                    });
                    audio.src = LADS.Worktop.Database.fixPath(this.source);
                    audio.type = 'audio/ogg';
                    audio.type = 'audio/mp3'; // TODO <-- we should be overwriting types!
                    audio.removeAttribute('controls');

                    playHolder = $(document.createElement('div'));
                    play = document.createElement('img');
                    $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                    $(play).addClass('audioControls');
                    $(play).css({
                        'position': 'relative',
                        'height': '20px',
                        'width': '20px',
                        'display': 'inline-block',
                    });
                    playHolder.css({
                        'position': 'relative',
                        'height': '20px',
                        'width': '20px',
                        'display': 'inline-block',
                        'left': '0px',
                        'top': '0px',
                        //'margin': '0px 1% 0px 1%',
                    });

                    play.style.width = "32px";
                    play.style.height = "32px";
                    playHolder.width(32);
                    playHolder.height(32);

                    playHolder.append(play);

                    volHolder = $(document.createElement('div'));
                    vol = document.createElement('img');
                    $(vol).attr('src', tagPath+'images/icons/VolumeUpWhite.svg');
                    $(vol).addClass('audioControls');
                    $(vol).css({
                        'height': '20px',
                        'width': '20px',
                        'position': 'relative',
                        'display': 'inline-block',
                    });

                    volHolder.css({
                        'height': '20px',
                        'width': '20px',
                        'position': 'relative',
                        'display': 'inline-block',
                        'margin': '0px 1% 0px 1%',
                    });
                    volHolder.append(vol);
                    this.initAudioPlayHandlers = function () {
                        if (audio.currentTime !== 0) audio.currentTime = 0;
                        audio.pause();
                        $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                        $(play).on('click', function () {
                            if (audio.paused) {
                                audio.play();
                                $(play).attr('src', tagPath+'images/icons/PauseWhite.svg');
                            } else {
                                audio.pause();
                                $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                            }
                        });

                        $(vol).on('click', function () {
                            if (audio.muted) {
                                audio.muted = false;
                                $(vol).attr('src', tagPath+'images/icons/VolumeUpWhite.svg');
                            } else {
                                audio.muted = true;
                                $(vol).attr('src', tagPath+'images/icons/VolumeDownWhite.svg');
                            }
                        });

                        $(audio).on('ended', function () {
                            audio.pause();
                            $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
                        });
                    };

                    this.initAudioPlayHandlers();

                    seekBar = document.createElement('input');
                    $(seekBar).addClass('audioControls');
                    seekBar.type = 'range';
                    $(seekBar).attr('id', "seek-bar");
                    $(seekBar).attr('value', "0");
                    seekBar.style.margin = '0px 1% 0px 1%';
                    seekBar.style.display = 'inline-block';
                    seekBar.style.padding = '0px';
                    $(seekBar).css({
                        left: '30px',
                    });

                   
                    // Event listener for the seek bar
                    seekBar.addEventListener("change", function (evt) {
                        evt.stopPropagation();
                        // Calculate the new time
                        var time = audio.duration * (seekBar.value / 100);
                        // Update the audio time
                        if (!isNaN(time)) {
                            audio.currentTime = time;
                        }
                    });

                    $(seekBar).mouseover(function (evt) {
                        var percent = evt.offsetX / $(seekBar).width();
                        var hoverTime = audio.duration * percent;
                        var minutes = Math.floor(hoverTime / 60);
                        var seconds = Math.floor(hoverTime % 60);
                        hoverString = String(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
                        seekBar.title = hoverString;
                        //console.log("minute "+ minutes+" seconds "+seconds+"hover "+ hoverString+"percent "+percent );
                    });

                    $(seekBar).mousedown(function (evt) {
                        dragBar = true;
                        evt.stopPropagation();
                    });

                    $(seekBar).mouseup(function (evt) {
                        dragBar = false;
                        evt.stopPropagation();
                    });

                    timeContainer = document.createElement('div');
                    $(timeContainer).css({
                        'height': '20px',
                        'width': '40px',
                        'margin': '0px 1% 0px 1%',
                        'padding': '0',
                        'display': 'inline-block',
                        'overflow': 'hidden',
                    });

                    currentTimeDisplay = document.createElement('span');
                    $(currentTimeDisplay).text("00:00");
                    $(currentTimeDisplay).addClass('audioControls');

                    // Update the seek bar as the audio plays
                    audio.addEventListener("timeupdate", function () {
                        // Calculate the slider value
                        var value = (100 / audio.duration) * audio.currentTime;
                        // Update the slider value
                        seekBar.value = value;
                        var minutes = Math.floor(audio.currentTime / 60);
                        var seconds = Math.floor(audio.currentTime % 60);
                        var adjMin;
                        if (String(minutes).length < 2) {
                            adjMin = String('0' + minutes);
                        } else {
                            adjMin = String(minutes);
                        }
                        $(currentTimeDisplay).text(adjMin + String(":" + (seconds < 10 ? "0" : "") + seconds));
                    });

                    // if(!imgadded) {
                    mediaContainer.append(audio);
                    mediaContainer.append(controlPanel[0]);
                    //     imgadded = true;
                    // }
                    
                    controlPanel.append(playHolder);
                    controlPanel.append(seekBar);
                    $(timeContainer).append(currentTimeDisplay);
                    controlPanel.append(timeContainer);
                    controlPanel.append(volHolder);
            }
        }

        $(innerContainer).append(mediaContainer);
       
        //Create description for asset/hotspot --------------------------
        this.createDescription = function() {
            if (this.description) {
                var p2 = document.createElement('div');
                if (typeof Windows != "undefined") {
                    // running in Win8 app
                    $(p2).html(LADS.Util.htmlEntityDecode(this.description));
                } else {  
                    // running in browser
                    $(p2).html(Autolinker.link(LADS.Util.htmlEntityDecode(this.description), {email: false, twitter: false}));
                }
                
                //CSS for description
                $(p2).css({
                    'position': 'relative',
                    'left': '5%',
                    'width': '90%',
                    'color': 'white',
                    'bottom': '5px',
                    'word-wrap': 'break-word'
                });
                innerContainer.appendChild(p2);
            }
        }
        this.createDescription();

        //Resize and scale control panel, buttons, etc.
        function resizeControlElements() {
            // scale control panel
            console.log("resizing elements");
            var cpSize = LADS.Util.constrainAndPosition(
                $(innerContainer).width()-20, $(innerContainer).height(),
                {
                    width: 1,
                    height: 1,
                    max_height: 60,
                    center_h: true,
                }
            );
            controlPanel.css({
                width: '100%',
                //width: cpSize.width + 'px',
                height: '47px',
                left: cpSize.x + 'px',
                'margin-top': '-1%',
            });
            
            var oldWidth = $(sliderPoint).width;

            $(sliderPoint).css({
                width: oldWidth * $(controlPanel).width/$(sliderContainer).width
            });

            console.log($(sliderPoint).width);

            //sliderContainer.css({
            //    width: '100%',
            //});



            // scale play button
            var playSize = LADS.Util.constrainAndPosition(
                controlPanel.width(), controlPanel.height(),
                {
                    width: 0.8 * (controlPanel.height() / controlPanel.width()),
                    height: 0.8,
                    max_height: 35,
                    max_width: 35,
                    center_v: true,
                }
            );

            $(play).css({
                width: playSize.width + 'px',
                height: playSize.height + 'px',
            });
            playHolder.css({
                top: playSize.y -1 + 'px',
                width: playSize.width + 'px',
                height: playSize.height + 'px',
                center_v: true,
            });

            // scale seek slider
            var seekSize = LADS.Util.constrainAndPosition(
                controlPanel.width(), controlPanel.height(),
                {
                    width: 0.7,
                    height: 1,
                    max_width: 620,
                    max_height: 20,
                    center_v: true,
                }
            );

            $(seekBar).css({
                width: seekSize.width + 'px',
                height: seekSize.height + 'px',
                top: seekSize.y - 7 + 'px',
            });

            // scale text element and text size
            var textEltSize = LADS.Util.constrainAndPosition(
                controlPanel.width(), controlPanel.height(),
                {
                    width: 0.09,
                    height: 0.5,
                    max_width: 40,
                    max_height: 35,
                    center_v: true,
                }
            );

            var textFontSize = LADS.Util.getMaxFontSizeEM("99:99", 0, textEltSize.width, textEltSize.height, 0.05);

            $(timeContainer).css({
                width: (textEltSize.width + 5) + 'px',
                height: textEltSize.height + 'px',
                top: textEltSize.y + 'px',
            });
            currentTimeDisplay.style.fontSize = textFontSize;

            // scale mute button
            var volSize = LADS.Util.constrainAndPosition(
                controlPanel.width(), controlPanel.height(),
                {
                    width: 0.65 * (controlPanel.height() / controlPanel.width()),
                    height: 0.65,
                    max_height: 30,
                    max_width: 30,
                    center_v: true,
                }
            );

            $(vol).css({
                height: volSize.height + 'px',
                width: volSize.width + 'px',
            });
            vol.style.height = volSize.height;
            vol.style.width = volSize.width;

            volHolder.css({
                top: volSize.y - 3 + 'px',
                height: volSize.height + 'px',
                width: volSize.width + 'px',
            });

            var eltWidth = volHolder.width() + $(timeContainer).width() + $(seekBar).width() + playHolder.width() + (0.08 * controlPanel.width());
            var currSeekWidth = $(seekBar).width();
            $(seekBar).width(currSeekWidth + controlPanel.width() - eltWidth);
        }

        // this.setRoot = function (newRoot) {
        //     var tempInnerContainer = innerContainer;
        //     outerContainer = newRoot;
        //     outerContainer.appendChild(innerContainer);
        //     if (this.contentType === "Video") {
        //         this.initVideoPlayHandlers();
        //     }
        //     if (this.contentType === "Audio") {
        //         this.initAudioPlayHandlers();
        //     }
        // };

        $(assetCanvas).append(outerContainer);
        $(outerContainer).hide();

        //Create circle for positioning of hotspot -------------------------
        var circle = document.createElement("img");
        var position = new Seadragon.Point(info.x, info.y);
        if (isHotspot){
            circle.src = tagPath+'images/icons/hotspot_circle.svg'
            $(circle).css({
                'height': '60px',
                'width': '60px',
                position: 'absolute',
                //top: y +'px',
                //left: x + 'px',
                'display': 'inline-block',
                'z-index': '100000',
                'visibility': 'hidden'
            });
            document.getElementById('tagContainer').appendChild(circle);
        }

        //To show asset ------------------------------
        this.showAsset = function() {
            //If hotspot/asset is an asset, add it to a random position
            var t = Math.min(Math.max(10, Math.random() * 100), 60);
            var h = Math.min(Math.max(30, Math.random() * 100), 70);
            if (!isHotspot){
                $(outerContainer).css({
                    top: t + "%",
                    left: h + "%",
                    position: 'absolute',
                    'z-index': 1000,
                    'pointer-events': 'all'
                });
            }
            //If it's a hotspot, add it to the area with which it is associated, and show circle
            else{
                $(circle).css({
                    'visibility':'visible'
                });
                if (!that.viewer.isOpen()) {
                    that.viewer.addEventListener('open', function () {
                        that.viewer.drawer.addOverlay(circle, position, Seadragon.OverlayPlacement.TOP_LEFT);
                    });
                }
                else {
                    that.viewer.drawer.addOverlay(circle, position, Seadragon.OverlayPlacement.TOP_LEFT);
                }
                that.viewer.drawer.updateOverlay(circle, position, Seadragon.OverlayPlacement.TOP_LEFT);
                that.viewer.viewport.panTo(position, false);

                var top = containerHeight/2 + $(circle).height()*3/4;
                var left = containerWidth/2 + $(circle).width()*3/4;

                $(outerContainer).css({
                    top: top+'px',
                    left: left+'px',
                    position: 'absolute',
                    'z-index': 1000,
                    'pointer-events': 'all'
                });
            }

            //Show hotspot
            $(outerContainer).show();
            assetCanvas.append(outerContainer);

            //Show button
            this.button.css({
                'color': 'black',
                'background-color': 'rgba(255,255,255, 0.3)',
            });

            if ((info.contentType === 'Video') || (info.contentType === 'Audio')) {
                resizeControlElements();
            }
            assetHidden = false;
        };
        // -----------------------------------------
        this.hideAsset = function() {
            this.pauseAsset();
            that.removeOverlay(circle);
            $(outerContainer).hide();   
            assetHidden = true;

            //Make button grayed-out
            if (this.button == undefined){
                this.button = $("#" + info.assetLinqID);
            }
            this.button.css({
                'color': 'white',
                'background-color': ''
            });
        };

        // -------------------------------------------
        this.toggle = function () {
            if (assetHidden) {
                this.show();
            } else {
                this.hide();
            }
        };

        // ----------------------------------------
        this.pauseAsset = function() {
            if (this.contentType === 'Audio' && audio) {
                if (audio.currentTime !== 0) audio.currentTime = 0;
                audio.pause();
                $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
            }
            else if (this.contentType === 'Video' && video) {
                if (video.currentTime > 0.1) video.currentTime = 0;
                if (!video.paused) video.pause();
                $(play).attr('src', tagPath+'images/icons/PlayWhite.svg');
            }
        }

        this.close = function () {
            document.body.removeChild(outerContainer);
        };

        //Push asset or hotspot into asset/hotspot array
        this.resizeControlElements = resizeControlElements;
        var assetInfo = {
                title: info.title,
                assetType: info.assetType,
                contentType: info.contentType,
                description: info.description,
                x: info.x,
                y: info.y,
                assetDoqID: info.assetDoqID,
                assetLinqID: info.assetLinqID,
                source: info.source,
                thumbnail: info.thumbnail,
                toggle: this.toggle,
                hide: this.hideAsset,
                show: this.showAsset,
                resize: resizeControlElements,
                pauseAsset: this.pauseAsset,
                mediaload: this.mediaload
            };

        if (info.assetType === 'Hotspot') {
            hotspots.push(assetInfo);
        } else {
            assets.push(assetInfo);
        }


        //Drag/mouse interaction controls (except click, which is in LADS.Layout.Artmode.js)
        LADS.Util.disableDrag($(outerContainer));
        var hotspotAsset = this;
        function setHandlers(currRoot) {

            //see makeManipulatable() in LADS.Util.js for what res is
            function onManip(res) {
                if (dragBar) return;
                if (this) {
                    var hotspotroot = $(currRoot);
                    var t = hotspotroot.css('top');
                    var l = hotspotroot.css('left');
                    var w = hotspotroot.css('width');
                    var h = hotspotroot.css('height');
                    var neww = parseFloat(w) * res.scale;
                    var that = this;
                    var maxConstraint = 800;
                    var minConstraint;
                    if (this.contentType === 'Video' || this.contentType === 'Audio') {
                        minConstraint = 450;
                    } else {
                        minConstraint = 200;
                    }
                    //if the new width is in the right range, scale from the point of contact and translate properly; otherwise, just translate and clamp
                    //var newClone;
                    if ((neww >= minConstraint) && (neww <= maxConstraint)) {                        
                        if (0 < parseFloat(t) + parseFloat(h) && parseFloat(t) < containerHeight && 0 < parseFloat(l) + parseFloat(w) && parseFloat(l)< containerWidth && res) {
                            hotspotroot.css("top", (parseFloat(t) + res.translation.y + (1.0 - res.scale) * (res.pivot.y)) + "px");
                            hotspotroot.css("left", (parseFloat(l) + res.translation.x + (1.0 - res.scale) * (res.pivot.x)) + "px");
                        }
                        else {
                            hotspotAsset.hideAsset();
                            that.pauseAsset;
                        }
                    } else {
                        if (0 < parseFloat(t) + parseFloat(h) && parseFloat(t) < containerHeight && 0 < parseFloat(l) + parseFloat(w) && parseFloat(l)< containerWidth && res) {
                            hotspotroot.css("top", (parseFloat(t) + res.translation.y) + "px");
                            hotspotroot.css("left", (parseFloat(l) + res.translation.x) + "px");
                            neww = Math.min(Math.max(neww, minConstraint), 800);                
                        } else {
                            hotspotAsset.hideAsset();
                            that.pauseAsset;
                            }
                    }

                    hotspotroot.css("width", neww + "px");
                    hotspotroot.css("height", "auto");

                    if (this.contentType === 'Video' || this.contentType === 'Audio') {
                        this.resizeControlElements();
                    }
                }
            }

            function onScroll(res, pivot) {
                // check if dragging the seekbar
                if (dragBar) return;

                //here, res is the scale factor
                var t = $(currRoot).css('top');
                var l = $(currRoot).css('left');
                var w = $(currRoot).css('width');
                var neww = parseFloat(w) * res;
                $(currRoot).css("width", neww + "px");

                var minConstraint;
                if (this.contentType === 'Video' || this.contentType === 'Audio') {
                    minConstraint = 450;
                } else {
                    minConstraint = 200;
                }

                if ((neww >= minConstraint) && (neww <= 800)) {
                    $(currRoot).css("top", (parseFloat(t) + (1.0 - res) * (pivot.y)) + "px");
                    $(currRoot).css("left", (parseFloat(l) + (1.0 - res) * (pivot.x)) + "px");
                }
                else {
                    neww = Math.min(Math.max(neww, minConstraint), 800);
                }

                $(currRoot).css("width", neww + "px");
                $(currRoot).css("height", "auto");

                if (this.contentType === 'Video' || this.contentType === 'Audio') {
                    this.resizeControlElements();
                }
            }
            // debugger;
            var gr = LADS.Util.makeManipulatable(currRoot, {
                onManipulate: onManip,
                onScroll: onScroll
            }, null, true); // NO ACCELERATION FOR NOW
        }
                setHandlers(outerContainer);
    }

    function createNewHotspot(info, isHotspot) {//if isHotspot is false, it's just an asset, don't add to hotspots list
        var newhotspot = new hotspot(info, isHotspot);
    }

    //Don't think it works -- ria: how can we check?
    // bmost: Doesn't appear to be used and saving hotspots
    // looks like it works without it?
    //function createHotspotInServer(title, contentType, description, url) {
    //    var newDoq = LADS.Worktop.Database.createEmptyDoq();
    //    var newDoqGuid = newDoq.childNodes[0].childNodes[2].textContent;

    //    if (contentType === "Video" || contentType === "Image") {
    //        LADS.Worktop.Database.pushXML(newDoq, newDoqGuid);
    //    }
    //    var linq = LADS.Worktop.Database.createLinq(artworkGuid, newDoqGuid);
    //}
    //createHotspotInServer("the title", "Video", "This is the description", "http://helios.gsfc.nasa.gov/image_euv_press.jpg");

    //function addMetadataToXML(xml, key, value) {

    //    var dictsNode = xml.childNodes[0].childNodes[3].childNodes[0].childNodes[0].childNodes[1].childNodes[0];
    //    dictsNode.appendChild(xml.createElement("d3p1:KeyValueOfstringanyType"));
    //    dictsNode.getElementsByTagName("d3p1:KeyValueOfstringanyType")[dictsNode.childElementCount - 1].appendChild(xml.createElement("d3p1:Key"));
    //    dictsNode.getElementsByTagName("d3p1:KeyValueOfstringanyType")[dictsNode.childElementCount - 1].getElementsByTagName("d3p1:Key")[0].textContent = key;
    //    dictsNode.getElementsByTagName("d3p1:KeyValueOfstringanyType")[dictsNode.childElementCount - 1].appendChild(xml.createElement("d3p1:Value"));

    //    dictsNode.getElementsByTagName("d3p1:KeyValueOfstringanyType")[dictsNode.childElementCount - 1].getElementsByTagName("d3p1:Value")[0].textContent = value;
    //    dictsNode.getElementsByTagName("d3p1:KeyValueOfstringanyType")[dictsNode.childElementCount - 1].getElementsByTagName("d3p1:Value")[0].setAttribute("xmlns:d8p1", "http://www.w3.org/2001/XMLSchema");
    //    dictsNode.getElementsByTagName("d3p1:KeyValueOfstringanyType")[dictsNode.childElementCount - 1].getElementsByTagName("d3p1:Value")[0].setAttribute("i:type", "d8p1:string");

    //}

    // bmost: Consider making things asynchronous by using callbacks
    // Worktop.Database might not support asynchronous requests
    // for getDoqLinqs so that might have to be added.
    

    // bmost: Consider renaming?  Its called createNewHostspot but has a paremeter 'isHotspot'.

};
