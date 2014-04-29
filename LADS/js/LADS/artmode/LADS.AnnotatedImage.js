﻿LADS.Util.makeNamespace("LADS.AnnotatedImage");


LADS.AnnotatedImage = function (rootElt, doq, split, callback, shouldNotLoadHotspots) {
    "use strict";
    var artworkName = doq.Name;
    var artworkGuid = doq.Identifier;

    //LADS.Worktop.Database.getDoqByGuid(artworkGuid);

    this.viewer = null;
    var imageLocation = null;
    var rootElement = rootElt;
    var height = null;
    var width = null;
    var aspectRatio;
    var that = this;
    var hotspots = [];
    var assets = [];
    var assetCanvas;
    var tempDoq; // temp hack to make hotspots function // do we keep doing this way?\
    var dragBar = false;

    // load hotspots
    this.getHotspots = function (fromServer, callback) {
        if (fromServer) {
            loadHotspots(callback);
        }
        return hotspots;
    };

    this.getAssets = function (fromServer, callback) {
        if (fromServer) {
            loadHotspots(callback);
        }
        return assets;
    };

    this.loadImage = function (url) {
        var xmlhttp = LADS.Util.makeXmlRequest(url);
        var response = xmlhttp ? xmlhttp.responseXML : null;

        if (response === null) {
            return false;
        } else {
            var node = response.documentElement.querySelectorAll("Image, Size")[0];
            width = node.getAttribute("Width");
            height = node.getAttribute("Height");
            aspectRatio = width / height;
            that.viewer.openDzi(url);
            return true;
        }
    };
    //what does 'doq' refer to?
    // bmost: 'doq' refers to document,
    // which is basically everything on the server (that isn't a linq).
    // They are in XML format.
    // I don't think this function should be necessary, why can't it just
    // take in the artwork (doq) in the constructor?  Then it doesn't need
    // parameters for name and id because you can call doq.Name, doq.Identifier,
    // and doq.Metadata.DeepZoom
    this.loadDoq = function (doq) {
        tempDoq = doq;
        return this.loadImage(LADS.Worktop.Database.fixPath(doq.Metadata.DeepZoom));
    };

    this.updateOverlay = function (element, placement) {
        var top = parseFloat($(element).css('top'));
        var left = parseFloat($(element).css('left'));
        if (top && left)
            that.viewer.drawer.updateOverlay(element, that.viewer.viewport.pointFromPixel(new Seadragon.Point(left, top)), placement);
    };

    this.addOverlayToDZ = function (element, point, placement) {
        if (!that.viewer.isOpen()) {
            that.viewer.addEventListener('open', function () {
                that.viewer.drawer.addOverlay(element, point, placement);
            });
        }
        else {
            that.viewer.drawer.addOverlay(element, point, placement);
        }
        that.viewer.drawer.updateOverlay(element, point, placement);
    };

    this.removeOverlay = function (element) {
        if (!that.viewer.isOpen()) {
            that.viewer.addEventListener('open', function () {
                that.viewer.drawer.removeOverlay(element);
            });
        }
        else that.viewer.drawer.removeOverlay(element);
    };

    this.unload = function () {
        if (this.viewer) this.viewer.unload();
    };

    //deprecated? //what does this mean? // it's outdated and should be phased out
    //function addAsset(htmlelement, info) {
    //    $(htmlelement).css({ "white-space": "normal", "margin": "5px", "border": "solid grey 4px", "border-radius": "10px", "background-color": "black", width: "200px", });

    //    function onManip(res) {
    //        var t = $(htmlelement).css('top');
    //        var l = $(htmlelement).css('left');
    //        var w = $(htmlelement).css('width');
    //        var neww = parseFloat(w) * res.scale;
    //        neww = Math.min(Math.max(neww, 200), 800);
    //        $(htmlelement).css("top", (parseFloat(t) + res.translation.y) + "px");
    //        $(htmlelement).css("left", (parseFloat(l) + res.translation.x) + "px");
    //        $(htmlelement).css("width", neww + "px");
    //        updateOverlay(htmlelement);
    //    }

    //    function onScroll(res, pivot) {
    //        var w = $(htmlelement).css('width');
    //        var neww = parseFloat(w) * res;
    //        neww = Math.min(Math.max(neww, 200), 800);
    //        $(htmlelement).css("width", neww + "px");
    //        updateOverlay(htmlelement);
    //    }

    //    var gr = LADS.Util.makeManipulatableWin(htmlelement, {
    //        onManipulate: onManip,
    //        onScroll: onScroll
    //    });

    //    gr.gestureSettings = Windows.UI.Input.GestureSettings.manipulationRotate |
    //        Windows.UI.Input.GestureSettings.manipulationTranslateX |
    //        Windows.UI.Input.GestureSettings.manipulationTranslateY |
    //        Windows.UI.Input.GestureSettings.manipulationScale |
    //        Windows.UI.Input.GestureSettings.manipulationRotateInertia |
    //        Windows.UI.Input.GestureSettings.manipulationScaleInertia |
    //        Windows.UI.Input.GestureSettings.manipulationTranslateInertia |
    //        Windows.UI.Input.GestureSettings.Hold |
    //        Windows.UI.Input.GestureSettings.HoldWithMouse |
    //        Windows.UI.Input.GestureSettings.tap;

    //    //indicator variables
    //    var isInfoShowing = false;
    //    var isOn = false;
    //    var title = title;

    //    function toggle() {
    //        if (isInfoShowing) {
    //            $(htmlelement).remove();
    //            isInfoShowing = false;
    //        }
    //        else {
    //            var t = Math.min(Math.max(20, Math.random() * 100), 80);
    //            var l = Math.min(Math.max(20, Math.random() * 100), 80);
    //            $(htmlelement).css({ top: t + "%", left: l + "%" });
    //            assetCanvas.append(htmlelement);
    //            isInfoShowing = true;
    //        }
    //    }
    //}

    function getCoordinatePoint(x, y) {
        return new Seadragon.Point(x / width, y / height);
    }

    function dzManip(pivot, translation, scale) {

        that.viewer.viewport.zoomBy(scale, that.viewer.viewport.pointFromPixel(new Seadragon.Point(pivot.x, pivot.y)), false);
        that.viewer.viewport.panBy(that.viewer.viewport.deltaPointsFromPixels(new Seadragon.Point(-translation.x, -translation.y)), false);

        that.viewer.viewport.applyConstraints();
    }
    this.dzManip = dzManip;

    function dzScroll(delta, pivot) {
        that.viewer.viewport.zoomBy(delta, that.viewer.viewport.pointFromPixel(new Seadragon.Point(pivot.x, pivot.y)));
        that.viewer.viewport.applyConstraints();
    }

    this.dzScroll = dzScroll;

    function init() {
        if(Seadragon.Config) {
            Seadragon.Config.visibilityRatio = 0.8; // TODO see why Seadragon.Config isn't defined; should it be?
        }

        var viewerelt = $(document.createElement('div'));

        viewerelt.on('mousedown scroll click mousemove resize', function(evt) {
            evt.preventDefault();
        });
        viewerelt.css({ height: "100%", width: "100%", position: "absolute", 'z-index': 0 });

        $(rootElement).append(viewerelt);

        that.viewer = new Seadragon.Viewer(viewerelt[0]);
        that.viewer.setMouseNavEnabled(false);
        that.viewer.clearControls();

        var canvas = that.viewer.canvas;
        $(canvas).addClass('artworkCanvasTesting');
        LADS.Util.makeManipulatable(canvas, {
            onScroll: function (delta, pivot) {
                dzScroll(delta, pivot);
            },
            onManipulate: function (res) {
                // debugger;
                dzManip(res.pivot, res.translation, res.scale);
            }
        }, null, true); // NO ACCELERATION FOR NOW

        assetCanvas = $(document.createElement('div'));
        assetCanvas.css({
            height: "100%", width: "100%",
            position: "absolute",
            "overflow-x": "hidden", "overflow-y": "hidden", 'z-index': 50, 'pointer-events':'none'
        });
        $(rootElement).append(assetCanvas);

        // this is stupid, but it seems to work (for being able to reference zoomimage in artmode)
        if (callback) {
            shouldNotLoadHotspots ? setTimeout(callback, 1) : loadHotspots(callback);
        }
    }

    this.addAnimateHandler = function (handler) {
        that.viewer.addEventListener("animation", handler);
    };

    init();



function loadHotspots(callback) {
        // retrieve linqs from server
        hotspots = [];
        assets = [];
        //var linqs = LADS.Worktop.Database.getDoqLinqs(artworkGuid);
        // TODO: Make work properly with async
        var done = 0;
        var total;
        LADS.Worktop.Database.getAssocMediaTo(artworkGuid, loadAssocMedia, null, null);
        function loadAssocMedia(doqs) {
            total = doqs && doqs.length || 0;
            if (doqs && doqs.length > 0) {
                var assocMedia;
                for (var i = 0; i < doqs.length; i++) {
                    LADS.Worktop.Database.getLinq(artworkGuid, doqs[i].Identifier, loadLinqHelper(doqs[i]), null, loadLinqHelper(doqs[i]));
                }
            } else {
                callback && callback(hotspots,assets);
            }
        }

        function loadLinqHelper(assocMedia) {
            return function (linq) {
                if (linq) {
                    var position_x = linq.Offset._x;
                    var position_y = linq.Offset._y;
                    var info = {
                        assetType: linq.Metadata.Type,
                        title: assocMedia.Name,
                        contentType: assocMedia.Metadata.ContentType,
                        source: assocMedia.Metadata.Source,
                        thumbnail: assocMedia.Metadata.Thumbnail,
                        description: assocMedia.Metadata.Description,
                        x: parseFloat(position_x),
                        y: parseFloat(position_y),
                        assetDoqID: assocMedia.Identifier,
                        assetLinqID: linq.Identifier
                    };
                    createNewHotspot(info, linq.Metadata.Type ? (info.assetType === "Hotspot") : false);
                    done++;
                    if (done >= total && callback)
                        callback(hotspots, assets);
                }
            }
        }
        //if (linqs) {
        //    for (var i = 0; i < linqs.length; i++) {
        //        //get the hotspot doc
        //        var hotspotDoqID = linqs[i].Targets.BubbleRef[1].BubbleContentID;
        //        var hotspotDoq = LADS.Worktop.Database.getDoqByGuid(hotspotDoqID);

        //        //in seadragon coordinates [0,1]*[0,height/width]
        //        var position_x = linqs[i].Offset._x;
        //        var position_y = linqs[i].Offset._y;

        //        var info = {
        //            assetType: linqs[i].Metadata.Type,
        //            title: hotspotDoq.Name,
        //            contentType: hotspotDoq.Metadata.ContentType,
        //            source: hotspotDoq.Metadata.Source,
        //            description: hotspotDoq.Metadata.Description,
        //            x: parseFloat(position_x),
        //            y: parseFloat(position_y),
        //            assetDoqID: hotspotDoqID,
        //            assetLinqID: linqs[i].Identifier
        //        };
        //        createNewHotspot(info, (linqs[i].Metadata.Type.text === "Hotspot"));
        //    }
        //}
    }

    this.loadHotspots = loadHotspots;




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
            play, vol, seekBar, timeContainer, currentTimeDisplay, playHolder, volHolder;

        controlPanel.addClass('media-control-panel-' + info.assetDoqID);
        controlPanel.css({
            'height': '40px',
            'position': 'relative',
            'display': 'block',
            'left': '2.5%',
            'margin-bottom': '2.5%',
        });

        //Add title
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

        $(innerContainer).append(mediaContainer);
       
        //Create description for asset/hotspot
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
            var cpSize = LADS.Util.constrainAndPosition(
                $(innerContainer).width()-20, $(innerContainer).height(),
                {
                    width: 1,
                    height: 1,
                    max_height: 40,
                    center_h: true,
                }
            );
            controlPanel.css({
                width: cpSize.width + 'px',
                height: cpSize.height + 'px',
                left: cpSize.x + 'px',
                'margin-top': '-1%',
            });

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
                top: playSize.y + 2 + 'px',
                width: playSize.width + 'px',
                height: playSize.height + 'px',
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

        this.setRoot = function (newRoot) {
            var tempInnerContainer = innerContainer;
            outerContainer = newRoot;
            outerContainer.appendChild(innerContainer);
            if (this.contentType === "Video") {
                this.initVideoPlayHandlers();
            }
            if (this.contentType === "Audio") {
                this.initAudioPlayHandlers();
            }
        };

        $(assetCanvas).append(outerContainer);
        $(outerContainer).hide();

        //Create circle for positioning of hotspot
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

        //To show asset
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

        this.toggle = function () {
            if (assetHidden) {
                this.show();
            } else {
                this.hide();
            }
        };

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
