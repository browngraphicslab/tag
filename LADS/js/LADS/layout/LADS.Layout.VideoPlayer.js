LADS.Util.makeNamespace("LADS.Layout.VideoPlayer");

/**
 * Player for RIN tours
 * @param tour      RIN tour in Javascript object (pre-parsed from JSON)
 *@param exhibition: 
 *@param artworkPrev: thumbnail of the artwork
 *@param artwork:the artworks in this tour
 */
LADS.Layout.VideoPlayer = function (videoSrc, exhibition) {
    "use strict";

    var that = {};

    var root = LADS.Util.getHtmlAjax('VideoPlayer.html'),
        video = root.find('#video'),
        videoElt = video[0],
        DURATION = parseFloat(videoSrc.Metadata.Duration),
        play = root.find('#playPauseButton'),
        vol = root.find('#videoControlsButton'),
        sliderControl = root.find('#sliderControl'),
        sliderContainer = root.find('#sliderContainer'),
        dragBar = false,
        hoverString,
        setHoverValue,
        currTime;

    video.attr({
        poster: (videoSrc.Metadata.Thumbnail && !videoSrc.Metadata.Thumbnail.match(/.mp4/)) ? LADS.Worktop.Database.fixPath(videoSrc.Metadata.Thumbnail) : '',
        src: LADS.Worktop.Database.fixPath(videoSrc.Metadata.Source),
        type: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
        controls: false,
        preload: 'metadata'
    });

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
        var totalDuration = orchestrator.getNarrativeInfo().totalDuration,
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

        sliderControl.on('mousedown', function(e) {
            e.stopPropagation();
            console.log("seeker mousedown detected!2");
            var origPoint = e.pageX,
                origTime = videoElt.currentTime,
                timePxRatio = DURATION / sliderContainer.width(); // sec/px
            console.log('ratio = '+timePxRatio);
            $('body').on('mousemove.seek', function(evt) {
                var currPoint = evt.pageX,
                    timeDiff = (currPoint - origPoint) * timePxRatio,
                    currPx,
                    minutes,
                    seconds;
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
                    
                    $('#sliderControl').css('left', currPx);
                    $('#sliderPoint').css('width', currPx);
                }

            });
            $('body').on('mouseup.seek', function() {
                // when the mouse is released, remove the mousemove handler
                // debugger;
                $('body').off('mousemove.seek');
                $('body').off('mouseup.seek');
                videoElt.currentTime = currTime;
            });
        });
    }
    
    var currentTimeDisplay = root.find('#currentTimeDisplay');
    $(currentTimeDisplay).text("00:00");
    var backButton = root.find('#backButton');

    backButton.mousedown(function () {
        LADS.Util.UI.cgBackColor("backButton", backButton, false);
    });
    backButton.mouseleave(function () {
        LADS.Util.UI.cgBackColor("backButton", backButton, true);
    });

    backButton.on('click', function () {
        videoElt.pause();
        // delete(video[0]);
        $(videoElt).attr('src',"");
        var catalog = new LADS.Layout.NewCatalog(videoSrc, exhibition);

        LADS.Util.UI.slidePageRightSplit(root, catalog.getRoot());
    });



    // Update the seek bar as the video plays
    video.on("timeupdate", function () {
        var value,
            minutes,
            seconds,
            adjMin;

        // Calculate the slider value and update the slider value

        value = ($('#sliderContainer').width() / videoElt.duration) * videoElt.currentTime;
	$('#sliderControl').css('left',value);
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
