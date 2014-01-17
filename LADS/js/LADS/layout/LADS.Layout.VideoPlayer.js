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


    var root = LADS.Util.getHtmlAjax('VideoPlayer.html');



    var that = {
        getRoot: getRoot,
    };
   /*
    var video = document.createElement('video');
    $(video).attr('preload', 'none');
    $(video).attr('poster', (videoSrc.Metadata.Thumbnail && !videoSrc.Metadata.Thumbnail.match(/.mp4/)) ? LADS.Worktop.Database.fixPath(videoSrc.Metadata.Thumbnail) : '');
    video.src = LADS.Worktop.Database.fixPath(videoSrc.Metadata.Source);
    video.type = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
	*/
    var video=root.find('#video');
    $(video).attr('poster', (videoSrc.Metadata.Thumbnail && !videoSrc.Metadata.Thumbnail.match(/.mp4/)) ? LADS.Worktop.Database.fixPath(videoSrc.Metadata.Thumbnail) : '');
    $(video).attr('src', LADS.Worktop.Database.fixPath(videoSrc.Metadata.Source));
    $(video).attr('type','video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    video.controls = "false";


    var play=root.find('#playPauseButton');
    var vol=root.find('#videoControlsButton');


    function initVideoPlayHandlers() {
        if ($(video).get(0).currentTime !== 0) $(video).get(0).currentTime = 0;
        $(play).attr('src', 'images/icons/PlayWhite.svg');
        $(play).on('click', function () {
            if ($(video).get(0).paused) {
		
                $(video).get(0).play();
                $(play).attr('src', 'images/icons/PauseWhite.svg');
            } else {
		
                $(video).get(0).pause();
                $(play).attr('src', 'images/icons/PlayWhite.svg');
            }
        });

        $(vol).on('click', function () {
            if ($(video).get(0).muted) {
                $(video).get(0).muted = false;
                $(vol).attr('src', 'images/icons/VolumeUpWhite.svg');
            } else {
                $(video).get(0).muted = true;
                $(vol).attr('src', 'images/icons/VolumeDownWhite.svg');
            }
        });

        video.on('ended', function () {
            $(video).get(0).pause();
	   
            $(play).attr('src', 'images/icons/PlayWhite.svg');
	    initVideoPlayHandlers();
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

    /*
    var seekBar = root.find('#seek-bar');
  
    
    // Event listener for the seek bar
      $(seekBar).get(0).addEventListener("change", function (evt) {
        evt.stopPropagation();
        // Calculate the new time
        var time = $(video).get(0).duration * ($(seekBar).get(0).value / 100);
        // Update the video time
        if (!isNaN(time)) {
            $(video).get(0).currentTime = time;
        }
    });
	
    seekBar.mouseover(function (evt) {
        var percent = evt.offsetX / $(seekBar).width();
        var hoverTime = $(video).get(0).duration * percent;
        var minutes = Math.floor(hoverTime / 60);
        var seconds = Math.floor(hoverTime % 60);
	//console.log(minutes);
	//console.log(seconds);
        hoverString = String(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
        seekBar.title = hoverString;
        //console.log("minute "+ minutes+" seconds "+seconds+"hover "+ hoverString+"percent "+percent );
    });

    seekBar.mousedown(function (evt) {
	dragBar = true;
        evt.stopPropagation();
    });

    seekBar.mouseup(function (evt) {
        dragBar = false;
        evt.stopPropagation();
    });

   */

     var sliderControl=root.find('#sliderControl');
     var sliderContainer=root.find('#sliderContainer');
        sliderContainer.click(function(evt) {
		
		var time = $(video).get(0).duration * (evt.offsetX/$('#sliderContainer').width()); 	
		if (!isNaN(time)) {
            		$(video).get(0).currentTime = time;
        	}

	});



	sliderControl.on('mousedown', function() {
	   
	    // when the point has been clicked, add a move handler
	    $('body').on('mousemove', function(evt) {
		// move the point accordingly (in the x-direction)
		// update the time of the video accordingly
		 var percent = evt.offsetX / $('#sliderContainer').width();
		var hoverTime = $(video).get(0).duration * percent;
		var minutes = Math.floor(hoverTime / 60);
		var seconds = Math.floor(hoverTime % 60);

		hoverString = String(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);	    

	          var time = $(video).get(0).duration * (parseFloat(evt.offsetX-$('#sliderContainer').offset().left)/$('#sliderContainer').width());
		if(time<0)
			time=0;
		if(time>$(video).get(0).duration)
			time=$(video).get(0).duration;

        	// Update the video time
        	if (!isNaN(time)) {
            		$(video).get(0).currentTime = time;
			//console.log('time is'+time);
        	}

		});
		$('body').on('mouseup', function() {
		    // when the mouse is released, remove the mousemove handler
		    $('body').off('mousemove');
		});

	   
	});

	



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
        // backButton.off('click');
        //player.stop();
        $(video).get(0).pause();

        var catalog = new LADS.Layout.NewCatalog(null, exhibition);//doq vs null            

        catalog.getRoot().css({ 'overflow-x': 'hidden' });

        LADS.Util.UI.slidePageRightSplit(root, catalog.getRoot());
    });



    // Update the seek bar as the video plays
    $(video).get(0).addEventListener("timeupdate", function () {
        // Calculate the slider value
        var value = ($('#sliderContainer').width() / $(video).get(0).duration) * $(video).get(0).currentTime;
        // Update the slider value
	$('#sliderControl').css('left',value);
	$('#sliderPoint').css('width',value);

        var minutes = Math.floor($(video).get(0).currentTime / 60);
        var seconds = Math.floor($(video).get(0).currentTime % 60);
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
