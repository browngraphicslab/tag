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

    var TOPBAR_HEIGHT = '8';
    var TOPBAR_BGCOLOR = 'rgb(63,55,53)';
    var DEFAULT_FONT_FAMILY = '"Segoe UI", "Ebrima", "Nirmala UI", "Gadugi", "Segoe UI Symbol", "Meiryo UI", "Khmer UI", "Tunga", "Lao UI", "Raavi", "Iskoola Pota", "Latha", "Leelawadee", "Microsoft YaHei UI", "Microsoft JhengHei UI", "Malgun Gothic", "Estrangelo Edessa", "Microsoft Himalaya", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le", "Microsoft Yi Baiti", "Mongolian Baiti", "MV Boli", "Myanmar Text", "Cambria Math"'; // CSS override fix (see below) -jastern


    var root = $(document.createElement('div'));
    root.addClass('root');
    root.addClass('videoPlayer');
    var videoContainer = $(document.createElement('div'));
    var overlayOnRoot = $(document.createElement('div'));

    var that = {
        getRoot: getRoot,
    };
    videoContainer.css({
        'position': 'absolute',
        'width': '100%',
        'height': (100-2*TOPBAR_HEIGHT)+'%',
        'text-align': 'center',
        top: '8%',
    });


    var topBar = $(document.createElement('div'));
    topBar.css({
        'background-color': TOPBAR_BGCOLOR,
        'position': ' absolute',
        'width': '100%',
        'height':'8%',
    });

    var bottomBar = $(document.createElement('div'));
    bottomBar.css({
        'background-color': TOPBAR_BGCOLOR,
        'width': '100%',
        'height': TOPBAR_HEIGHT + '%',
        top: '92%',
        position: 'absolute'
    });

    //overlayOnRoot for back button
    overlayOnRoot.css({
        'position': 'absolute',
        'left': '0px',
        'top': '0px',
        'background-color': 'rgba(255,0,0,1)',
        'width': '100%',
        'height': 'auto'
    });
    root.css({
        'width': '100%',
        'height': '100%'
    });

    var video = document.createElement('video');
    $(video).attr('preload', 'none');
    $(video).attr('poster', (videoSrc.Metadata.Thumbnail && !videoSrc.Metadata.Thumbnail.match(/.mp4/)) ? LADS.Worktop.Database.fixPath(videoSrc.Metadata.Thumbnail) : '');
    video.src = LADS.Worktop.Database.fixPath(videoSrc.Metadata.Source);
    video.type = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    video.style.position = 'relative';
    $(video).css({
        'width':'100%',
        'max-width': '100%',
        'max-height': '100%',
        //'top':'25%',
    });
    video.controls = false;

    videoContainer.append(video);

    var playHolder = $(document.createElement('div'));
    var play = document.createElement('img');
    $(play).attr('src', 'images/icons/PlayWhite.svg');
    $(play).attr('id', 'playPauseButton');
    $(play).addClass('videoControls');
    $(play).css({
        'position': 'relative',
        'height': 'auto',
        'width': '100%',
        'display': 'inline-block'
    });
    playHolder.css({
        'position': 'relative',
        'height': '50%',
        'width': 'auto',
        'display': 'inline-block',
        'margin': '0.5%; 1%',
        'top': '15%',
    //    left: '0.5%'

        'margin-left': '22%',
    
    });
    playHolder.append(play);

    var volHolder = $(document.createElement('div'));
    var vol = document.createElement('img');
    $(vol).attr('src', 'images/icons/VolumeUpWhite.svg');
    $(vol).addClass('videoControls');
    $(vol).css({
        'height': 'auto',
        'width': '100%',
        'position': 'relative',
        'display': 'inline-block'
    });

    volHolder.css({
        'margin': '0px 2.5%',
        'top': '15%',
        'width': 'auto',
        'height': '40%',
        'display': 'inline-block',
        'position': 'relative'
    });
    volHolder.append(vol);

    function initVideoPlayHandlers() {
        if (video.currentTime !== 0) video.currentTime = 0;
        $(play).attr('src', 'images/icons/PlayWhite.svg');
        $(play).on('click', function () {
            if (video.paused) {
                video.play();
                $(play).attr('src', 'images/icons/PauseWhite.svg');
            } else {
                video.pause();
                $(play).attr('src', 'images/icons/PlayWhite.svg');
            }
        });

        $(vol).on('click', function () {
            if (video.muted) {
                video.muted = false;
                $(vol).attr('src', 'images/icons/VolumeUpWhite.svg');
            } else {
                video.muted = true;
                $(vol).attr('src', 'images/icons/VolumeDownWhite.svg');
            }
        });

        $(video).on('ended', function () {
            video.pause();
            $(play).attr('src', 'images/icons/PlayWhite.svg');
        });
    }
    initVideoPlayHandlers();
    var dragBar = false;
    var hoverString, setHoverValue;

    setHoverValue = function (percent) {
        var totalDuration = orchestrator.getNarrativeInfo().totalDuration;
        var hoverTime = narrativeDuration * percent;
        var minutes = Math.floor(hoverTime / 60);
        var seconds = Math.floor(hoverTime % 60);
        hoverString(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
    };

    var seekBar = document.createElement('input');
    $(seekBar).addClass('videoControls');
    seekBar.type = 'range';
    $(seekBar).attr('id', "seek-bar");
    $(seekBar).attr('value', "0");

    seekBar.style.padding = '0px';
    $(seekBar).css({
        'padding':' 1%',
        'width': '40%',
        'height': '10%',
        'margin-left': '1%',
        'display': 'inline-block'
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

    var timeContainer = document.createElement('div');
    $(timeContainer).css({
        'height': '20px',
        'width': '40px',
        'margin': '0px 1% 0px 1%',
        'padding': '0',
        'display': 'inline-block',
        'overflow': 'hidden',
    });

    var currentTimeDisplay = document.createElement('div');
    $(currentTimeDisplay).text("00:00");
    $(currentTimeDisplay).addClass('videoControls');
    $(currentTimeDisplay).css({
        width: '2%',
        height: '2%',
        'display': 'inline-block',

    });
    bottomBar.append(playHolder);
    bottomBar.append(seekBar);
    //videoContainer.append(timeContainer);

    bottomBar.append(currentTimeDisplay);
    bottomBar.append(volHolder);

    root.append(topBar);
    root.append(videoContainer);
    root.append(bottomBar);

    var backButtoncontainer = $(document.createElement("div"));
    backButtoncontainer.addClass('backButtonContainer');
    backButtoncontainer.css({
        "position": "absolute", "height": "5%", 'top': '1%', 'left':'1%'
    });

    var backButton = $(document.createElement("img"));
    backButton.addClass('backButton');
    backButton.attr("src", 'images/icons/Back.svg');
    backButton.css({ width: "85%", height: "auto" });

    backButtoncontainer.append(backButton);
    topBar.append(backButtoncontainer);
        //clicked effect for back button
    backButton.mousedown(function () {
        LADS.Util.UI.cgBackColor("backButton", backButton, false);
    });
    backButton.mouseleave(function () {
        LADS.Util.UI.cgBackColor("backButton", backButton, true);
    });

    backButton.on('click', function () {
        // backButton.off('click');
        //player.stop();
        video.pause();

        var catalog = new LADS.Layout.NewCatalog(null, exhibition);//doq vs null            

        catalog.getRoot().css({ 'overflow-x': 'hidden' });

        root.css({ 'overflow-x': 'hidden' });
        LADS.Util.UI.slidePageRightSplit(root, catalog.getRoot());
    });

        /*
    function createTimer() {
        if (!player[0].pause()) {
            return setTimeout(function () {
                backButton.fadeOut(500);
            }, 5000);
        }
    }

    var hideTimer = createTimer();

    root.on("mousemove", function () {
        if (hideTimer != null) {
            clearTimeout(hideTimer);
            hideTimer = createTimer();
            backButton.fadeIn(500);
        }
    });
    */





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
    function getRoot() {
        return root;
    }
    that.getRoot = getRoot;

    return that;
};
