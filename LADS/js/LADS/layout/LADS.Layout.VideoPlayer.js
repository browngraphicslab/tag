LADS.Util.makeNamespace("LADS.Layout.VideoPlayer");

/**
 * Player for RIN tours
 * @param tour      RIN tour in Javascript object (pre-parsed from JSON)
 *@param exhibition: 
 *@param prevInfo   object containing previous page info 
 *    artworkPrev      value is 'artmode' when we arrive here from the art viewer
 *    prevScroll       value of scrollbar from new catalog page
 *@param artwork:the artworks in this tour
 */
LADS.Layout.VideoPlayer = function (videoSrc, exhibition, prevInfo) {
    "use strict";

    /* nowditch _editted 2/13/2014 : added prevScroll */
    var artworkPrev;
    var prevScroll = 0;
	var prevExhib = exhibition;
    if (prevInfo) {
        artworkPrev = prevInfo.artworkPrev,
        prevScroll = prevInfo.prevScroll || 0;
    }
    /* end nbowditch edit */

    var that = {};

    var root = LADS.Util.getHtmlAjax('VideoPlayer.html'),
        video = root.find('#video'),
        sourceMP4,
        sourceWEBM,
        sourceOGG,
        videoElt = video[0],
        DURATION = parseFloat(videoSrc.Metadata.Duration),
        play = root.find('#playPauseButton'),
        vol = root.find('#videoControlsButton'),
        //sliderControl = root.find('#sliderControl'),
        sliderContainer = root.find('#sliderContainer'),
        dragBar = false,
        hoverString,
        setHoverValue,
        currTime;

    video.attr({
        poster: (videoSrc.Metadata.Thumbnail && !videoSrc.Metadata.Thumbnail.match(/.mp4/)) ? LADS.Worktop.Database.fixPath(videoSrc.Metadata.Thumbnail) : '',
        controls: false,
        preload: 'metadata'
    });

    //Adding sources for the video file
    var source = LADS.Worktop.Database.fixPath(videoSrc.Metadata.Source);
    //var source = 'http://techslides.com/demos/sample-videos/small.webm'; //Video file to test code without server conversion
    var sourceSansExtension = source.substring(0, source.lastIndexOf('.')) || input;
    sourceMP4 = sourceSansExtension + ".mp4";
    sourceWEBM = sourceSansExtension + ".webm";
    sourceOGG = sourceSansExtension + ".ogg";
    
    //video[0] converts the jQuery object 'video' into an HTML object, allowing us to use innerHTML on it
    video[0].innerHTML = '<source src="' + sourceMP4 + '" type="video/mp4; codecs="avc1.42E01E, mp4a.40.2"">';
    video[0].innerHTML += '<source src="' + sourceWEBM + '" type="video/webm; codecs="vorbis, vp8"">';
    video[0].innerHTML += '<source src="' + sourceOGG + '" type="video/ogg; codecs="theora, vorbis"">';

    timeToZero();
    initVideoPlayHandlers();

    function timeToZero() {
        if (videoElt.currentTime !== 0) {
            videoElt.currentTime = 0;
        }
        play.attr('src', tagPath+'images/icons/PlayWhite.svg');
    }

    function initVideoPlayHandlers() {
        play.attr('src', tagPath+'images/icons/PlayWhite.svg');
        play.on('click', function () {
            console.log("playbutton down");
            if (videoElt.paused) {
                videoElt.play();
                console.log("time to play");
                play.attr('src', tagPath+'images/icons/PauseWhite.svg');
            } else {
                videoElt.pause();
                play.attr('src', tagPath+'images/icons/PlayWhite.svg');
            }
        });

        $(vol).on('click', function () {
            if (videoElt.muted) {
                videoElt.muted = false;
                vol.attr('src', tagPath+'images/icons/VolumeUpWhite.svg');
            } else {
                videoElt.muted = true;
                vol.attr('src', tagPath+'images/icons/VolumeDownWhite.svg');
            }
        });

        video.on('ended', function () {
        videoElt.pause();
        timeToZero();
        // initVideoPlayHandlers(); // is this necessary here TODO
        });
    }
    



    setHoverValue = function (percent) {
        var totalDuration = orchestrator.getNarrativeInfo().totalDuration, // ???
            hoverTime = narrativeDuration * percent,
            minutes = Math.floor(hoverTime / 60),
            seconds = Math.floor(hoverTime % 60);
        hoverString(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
    };

    // handlers for seek bar
    video.on('loadedmetadata', initSeekHandlers);

    function initSeekHandlers() {
        sliderContainer.on('mousedown', function(evt) {
            console.log("seeker mousedown detected!1");
            var time = $(video).get(0).duration * (evt.offsetX / $('#sliderContainer').width());    
            if (!isNaN(time)) {
                $(video).get(0).currentTime = time;
            }
        });

        sliderContainer.on('mousedown', function(e) {
            e.stopPropagation();
            console.log("seeker mousedown detected!2");
            var origPoint = e.pageX,
                origTime = videoElt.currentTime,
                timePxRatio = DURATION / sliderContainer.width(); // sec/px
                console.log('ratio = '+timePxRatio);
                currTime = Math.max(0, Math.min(DURATION, origTime));
                var currPx = currTime / timePxRatio;
                var minutes = Math.floor(currTime / 60);
                if((""+minutes).length < 2) {
                    minutes = "0" + minutes;
                }
                var seconds = Math.floor(currTime % 60);

                //console.log("currTime1 "+origTime);

                // Update the video time and slider values
            

            $('body').on('mousemove.seek', function(evt) {
                var currPoint = evt.pageX,
                    timeDiff = (currPoint - origPoint) * timePxRatio;
                    //currPx,
                    //minutes,
                    //seconds;
                currTime = Math.max(0, Math.min(DURATION, origTime + timeDiff));
                currPx = currTime / timePxRatio;
                minutes = Math.floor(currTime / 60);
                if((""+minutes).length < 2) {
                    minutes = "0" + minutes;
                }
                seconds = Math.floor(currTime % 60);

                console.log("currTime "+currTime);

                // Update the video time and slider values
                if (!isNaN(currTime)) {
                    // debugger;
                    $('#currentTimeDisplay').text(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
                    videoElt.currentTime = currTime;
                    
                    //$('#sliderContainer').css('left', currPx);
                    $('#sliderPoint').css('width', currPx);
                }

            });

            $('body').on('mouseup.seek', function() {
                // when the mouse is released, remove the mousemove handler
                // debugger;
                $('body').off('mousemove.seek');
                $('body').off('mouseup.seek');
		$('#currentTimeDisplay').text(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
                videoElt.currentTime = currTime;
		$('#sliderPoint').css('width', currPx);
            });
        });
    }
    
    var currentTimeDisplay = root.find('#currentTimeDisplay');
    $(currentTimeDisplay).text("00:00");
    var backButton = root.find('#backButton');
    $(backButton).attr('src',tagPath+'images/icons/Back.svg');
    backButton.mousedown(function () {
        LADS.Util.UI.cgBackColor("backButton", backButton, false);
    });
    backButton.mouseleave(function () {
        LADS.Util.UI.cgBackColor("backButton", backButton, true);
    });

    backButton.on('click', function () {
        videoElt.pause();
        // delete(video[0]);
        $(videoElt).attr('src', "");

        /* nbowditch _editted 2/13/2014 : added backInfo */
        var backInfo = { backArtwork: videoSrc, backScroll: prevScroll };
        var catalog = new LADS.Layout.NewCatalog(backInfo, exhibition);
        /* end nbowditch edit */
		catalog.getRoot().css({ 'overflow-x': 'hidden' });
        LADS.Util.UI.slidePageRightSplit(root, catalog.getRoot(), function () {
				artworkPrev = "catalog";
				var selectedExhib = $('#' + 'exhib-' + prevExhib.Identifier);
				selectedExhib.attr('flagClicked', 'true');
				selectedExhib.css({ 'background-color': 'white', 'color': 'black' });
				$(selectedExhib[0].firstChild).css({'color': 'black'});
			});
    });



    // Update the seek bar as the video plays
    video.on("timeupdate", function () {
        var value,
            minutes,
            seconds,
            adjMin;

        // Calculate the slider value and update the slider value

        value = ($('#sliderContainer').width() / videoElt.duration) * videoElt.currentTime;
      // $('#sliderControl').css('left',value);
       $('#sliderPoint').css('width',value);

        minutes = Math.floor(videoElt.currentTime / 60);
        seconds = Math.floor(videoElt.currentTime % 60);
        if (String(minutes).length < 2) {
            adjMin = '0' + minutes;
        } else {
            adjMin = minutes;
        }
        currentTimeDisplay.text(adjMin + ":" + (seconds < 10 ? "0" : "") + seconds);
    });

    function getRoot() {
        return root;
    }
    that.getRoot = getRoot;

    return that;
};
