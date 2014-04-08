﻿LADS.Util.makeNamespace("LADS.Layout.Artmode");

//Constructor. Takes in prevInfo object {prevPage: [string (currently "catalog" or "exhibitions")], prevScroll: [int value of scrollbar
// on NewCatalog page, used for backbutton]}, {previousState, doq, split}, exhibition
//TODO: Adjust this so the back button can go to any arbitrary layout, not just Timeline

/**
 * The artwork viewer, which contains a sidebar with tools
 * and thumbnails as well as a central area for the deepzoom image.
 * @class LADS.Layout.Artmode
 * @constructor
 * @param {Object} prevInfo      contains information about returning to the previous page
 * @param {Object} options       information about current artwork and whether we're in splitscreen mode
 * @param {Doq} exhibition       the exhibition we came from (if any)
 */
LADS.Layout.Artmode = function (prevInfo, options, exhibition) {
    "use strict";

    var prevPage,
        prevScroll,
        prevExhib = exhibition,
        locationList = LADS.Util.UI.getLocationList(options.doq.Metadata),
        initialized = false,
        root, doq, map, splitscreen, locsize, backButton,
        sideBar, toggler, togglerImage, locationHistoryDiv, info, //Need to be instance vars for splitscreen
        zoomimage = null,
        locationHistoryToggle,
        locationHistoryContainer,
        locationHistory,
        direction, //direction for location history panel
        mapMade = false,
        locationHistoryActive = false,//have the location history panel hidden as default.
        drawers = [],
        hotspotsHolderArray = [],
        hotspotsArray = [],
        assets, hotspots,
        loadQueue = LADS.Util.createQueue(),
        switching = false,
        confirmationBox,
        tagContainer = $('#tagRoot') || $('body'),
        NUM_DRAWERS = 0;

    if (prevInfo) {
        prevPage = prevInfo.prevPage,
        prevScroll = prevInfo.prevScroll || 0;
    }
        
    options = LADS.Util.setToDefaults(options, LADS.Layout.Artmode.default_options);
    doq = options.doq;

    init();

    /**
     * Initiate artmode with a root, artwork image and a sidebar on the left.
     * @method init
     */
    function init() {
        // add elements to the header for displaying bing maps
        var head,
            script,
            meta;

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

        root = LADS.Util.getHtmlAjax('Artmode.html');
        root.data('split', options.split);

        //get the artwork
        if (doq) {
            zoomimage = new LADS.AnnotatedImage(root, doq, options.split, function () {
                hotspots = zoomimage.getHotspots();
                assets = zoomimage.getAssets();
                hotspots.sort(function (a, b) { return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1; });
                assets.sort(function (a, b) { return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1; });
                try { // TODO figure out why loadDoq sometimes causes a NetworkError (still happening?)
                    zoomimage.loadDoq(doq);
                } catch(err) {
                    console.log(err); // TODO if we hit a network error, show an error message
                }
                LADS.Util.Splitscreen.setViewers(root, zoomimage); // TODO should we get rid of all splitscreen stuff?
                makeSidebar();
                createSeadragonControls();
                initialized = true;
            });
            
        }
    }

    /**
     * Add controls for manual Seadragon manipulation
     * This was written for testing purposes and was not carefully written
     * DO NOT KEEP THIS AS IS!!!!!!
     * @method createSeadragonControls
     */
    function createSeadragonControls() {
        var container = $(document.createElement('div'));
        container.attr('id', 'seadragonManipContainer');
        container.css({
            'left': ($('#tagRoot').width()-120) + "px"
        });
        root.append(container);

        container.append(createButton('leftControl', '<', 0, 40));
        container.append(createButton('upControl', '^', 40, 0));
        container.append(createButton('rightControl', '>', 80, 40));
        container.append(createButton('downControl', 'v', 40, 80));
        container.append(createButton('zinControl', '+', 80, 0));
        container.append(createButton('zoutControl', '-', 0, 0));

        function createButton(id, text, left, top) {
            var button = $(document.createElement('div'));
            button.attr('id', id);
            button.css({
                left: left,
                top: top
            });
            button.addClass('seadragonManipButton');
            button.text(text);
            return button;
        }

        var delt = 40,
            scrollDelt = 0.1;

        var interval;

        $('#leftControl').on('mousedown', function() {
            zoomimage.dzManip({x: $('#tagRoot').width()/2, y: $('#tagRoot').height()/2}, {x: delt, y: 0}, 1);
            interval = setInterval(function() {
                zoomimage.dzManip({x: $('#tagRoot').width()/2, y: $('#tagRoot').height()/2}, {x: delt, y: 0}, 1);
            }, 100);
        });
        $('#upControl').on('mousedown', function() {
            zoomimage.dzManip({x: $('#tagRoot').width()/2, y: $('#tagRoot').height()/2}, {x: 0, y: delt}, 1);
            interval = setInterval(function() {
                zoomimage.dzManip({x: $('#tagRoot').width()/2, y: $('#tagRoot').height()/2}, {x: 0, y: delt}, 1);
            }, 100);
        });
        $('#rightControl').on('mousedown', function() {
            zoomimage.dzManip({x: $('#tagRoot').width()/2, y: $('#tagRoot').height()/2}, {x: -delt, y: 0}, 1);
            interval = setInterval(function() {
                zoomimage.dzManip({x: $('#tagRoot').width()/2, y: $('#tagRoot').height()/2}, {x: -delt, y: 0}, 1);
            }, 100);
        });
        $('#downControl').on('mousedown', function() {
            zoomimage.dzManip({x: $('#tagRoot').width()/2, y: $('#tagRoot').height()/2}, {x: 0, y: -delt}, 1);
            interval = setInterval(function() {
                zoomimage.dzManip({x: $('#tagRoot').width()/2, y: $('#tagRoot').height()/2}, {x: 0, y: -delt}, 1);
            }, 100);
        });
        $('#zinControl').on('mousedown', function() {
            zoomimage.dzScroll(1+scrollDelt, {x: $('#tagRoot').width()/2, y: $('#tagRoot').height()/2});
            interval = setInterval(function() {
                zoomimage.dzScroll(1+scrollDelt, {x: $('#tagRoot').width()/2, y: $('#tagRoot').height()/2});
            }, 100);
        });
        $('#zoutControl').on('mousedown', function() {
            zoomimage.dzScroll(1-scrollDelt, {x: $('#tagRoot').width()/2, y: $('#tagRoot').height()/2});
            interval = setInterval(function() {
                zoomimage.dzScroll(1-scrollDelt, {x: $('#tagRoot').width()/2, y: $('#tagRoot').height()/2});
            }, 100);
        });
        $('.seadragonManipButton').on('mouseup', function() {
            clearInterval(interval);
        });
    }

    /**
     * Makes the artwork viewer sidebar
     * @method makeSidebar
     */
    function makeSidebar() {
        var i;
        var button;
        //sideBar is the outermost container for sidebar
        //Sets entire sidebar to this...
        var sideBarWidth = window.innerWidth * 0.20; //innerWidth Define width in absolute terms to work with split screen
		sideBar = root.find('#sideBar');

		toggler = root.find('#toggler');
		togglerImage = root.find('#togglerImage');

        //Switch side based on splitscreen state, if it is the right half screen, move the sidebar to right.
        if (root.data('split') === 'R' && prevPage !== "artmode") {//if user doesn't go back from the tourplayer too.
            sideBar.css({ right: '0px'});
            toggler.css({
                left: '-12%',
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px"
            });
            togglerImage.attr("src", tagPath+'images/icons/Open.svg');

        }
        else {
            sideBar.css({ left: '0px', });
            toggler.css({
                right: '-12%',
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px"
            });
				togglerImage.attr("src", tagPath+'images/icons/Close.svg');
        }
        
        //set sidebar open as default.
        var isBarOpen = true;
        //click toggler to hide/show sidebar
        toggler.click(function () {
            var opts = {};
	    
            //when the bar is open, set the sidebar position according to splitscreen states.
            if (root.data('split') === 'R') {
                opts.right = isBarOpen ? '-22%' : '0%';
            } else {
                opts.left = isBarOpen ? '-22%' : '0%';
            }
            isBarOpen = !isBarOpen;

            //when click the toggler, the arrow will rotate 180 degree to change direction.
            $(sideBar).animate(opts, 1000, function () {
                togglerImage.attr('src', tagPath + 'images/icons/' + (isBarOpen ? 'Close.svg' : 'Open.svg'));
            });
        });


        //Create back button TODO: See todo in constructor
		var backBttnContainer = root.find("#backBttnContainer");
		backButton = root.find('#backButton');
        $(backButton).attr('src',tagPath+'images/icons/Back.svg');

        //change the backColor to show the button is being clicked
        //mouseleave for lifting the finger from the back button
        backButton.on('mouseleave mouseup', function () {
            LADS.Util.UI.cgBackColor("backButton", backButton, true);
        });
        //mousedown for pressing the back button
        backButton.on('mousedown', function () {
            LADS.Util.UI.cgBackColor("backButton", backButton, false);
        });

        //click function for back button based on previous page.
        //this is called when the user entered the artmode from catalog, 
		// have the "artmode" case because if user goes back to artmode from tourplayer, the prevpage will stay as artmode. 
		backButton.on('click', function () {
			backButton.off('click'); // prevent user from clicking twice
			zoomimage && zoomimage.unload();
			var backInfo = { backArtwork: doq, backScroll: prevScroll };
			var catalog = new LADS.Layout.NewCatalog(backInfo, exhibition);
			catalog.getRoot().css({ 'overflow-x': 'hidden' }); // TODO this line shouldn't be necessary -- do in styl file
			LADS.Util.UI.slidePageRightSplit(root, catalog.getRoot(), function () {
                if(prevExhib && prevExhib.Identifier) {
    				var selectedExhib = $('#exhib-' + prevExhib.Identifier);
    				selectedExhib.attr('flagClicked', 'true');
    				selectedExhib.css({ 'background-color': 'white', 'color': 'black' });
                    if(selectedExhib[0] && selectedExhib[0].firstChild) {
    	       			$(selectedExhib[0].firstChild).css({'color': 'black'});
                    }
                }
			});
		});

        //second outermost div to contain contents in sidebar.
		var sideBarSections = root.find('#sideBarSections');

        //div for artinfo info and other stuff except for minimapContainer
		var sideBarInfo = root.find('#sideBarInfo');

        //this contains basic info about the artwork
		info = root.find('#info');

        //The title of artwork. Currently, we have the text overflow as ellipsis, may implement auto scroll later...
		var infoTitle = root.find('#infoTitle');
        infoTitle.text(doq.Name);

        //The artist of artwork
		var infoArtist = root.find('#infoArtist');
        infoArtist.text(doq.Metadata.Artist);
		
        //The year of artwork
		var infoYear = root.find('#infoYear');
        infoYear.text(doq.Metadata.Year);

        //add more information for the artwork if curator add in the authoring mode
        for (var item in doq.Metadata.InfoFields) {
            var fieldTitle = item;
            var fieldValue = doq.Metadata.InfoFields[item];

                var infoCustom = $(document.createElement('div'));
				infoCustom.addClass('infoCustom');
                infoCustom.text(fieldTitle + ': ' + fieldValue);
                infoCustom.appendTo(info);

        }
        //make sure the info text fits in the div
        LADS.Util.fitText(info, 1.1);
        
        /*var splitscreenContainer = initSplitscreen();
        if (LADS.Util.Splitscreen.on()) {
            splitscreenContainer.hide();
        }*/

		var assetContainer = root.find('#assetContainer');

        //Descriptions, Hotspots, Assets and Tours drawers
        var existsDescription = !!doq.Metadata.Description;
        
        if (existsDescription) {
            NUM_DRAWERS++;
            var descriptionDrawer = createDrawer("Description", !existsDescription);
            if (doq.Metadata.Description) {
                var descrip = doq.Metadata.Description.replace(/\n/g, "<br />");
                
                if (typeof Windows != "undefined") {
                    // running in Win8 app
                    descriptionDrawer.contents.html(descrip);
                } else {  
                    // running in browser
                    descriptionDrawer.contents.html(Autolinker.link(descrip, {email: false, twitter: false}));
                }
            }
            var test = doq;
            assetContainer.append(descriptionDrawer);
        }

        //location history
        locationList = LADS.Util.UI.getLocationList(options.doq.Metadata); 
        if (locationList.length !== 0) {
            NUM_DRAWERS++;
            var locationHistorysec = initlocationHistory();
            assetContainer.append(locationHistorysec);
        }

        

        ///////////////////////////////////////
        function downhelper(elt) {
            return function () {
                //elt.css('background-color', 'rgba(255,255,255,0.75');
            };
        }

        function uphelper(elt) {
            return function () {
                elt.css('background-color', '');
                elt.css('color', 'rgb(255, 255, 255)');
            };
        }

        function createTourHolder(container, tour) { // after release, make this more general, combine with createMediaHolder TODO
            return function () {
                var holder = $(document.createElement('div'));
                holder.addClass("tourHolder");
                holder.css({
                    'height': 0.15 * $("#tagRoot").height() + "px"
                });

                holder.on("click", tourClicked(tour));
                holder.on("mousedown", downhelper(holder));
                holder.on("mouseup", uphelper(holder));
                container.append(holder);

                var mediaHolderDiv = $(document.createElement('div'));
                mediaHolderDiv.addClass('mediaHolderDiv');
                holder.append(mediaHolderDiv);

                var holderContainer = $(document.createElement('div')).addClass('holderContainer');
                mediaHolderDiv.append(holderContainer);

                var holderInnerContainer = $(document.createElement('div')).addClass('holderInnerContainer');
                holderContainer.append(holderInnerContainer);

                var mediaHolderImage = $(document.createElement('img'));
                mediaHolderImage.addClass('assetHolderImage');
                mediaHolderImage.attr('src', (tour.Metadata.Thumbnail ? LADS.Worktop.Database.fixPath(tour.Metadata.Thumbnail) : tagPath+'images/tour_icon.svg'));
                mediaHolderImage.removeAttr('width');
                mediaHolderImage.removeAttr('height');

                mediaHolderImage.css({ // TODO do this the right way... this isn't flexible at all, but it will probably do for the release
                    'max-height': 0.15 * 0.7 * $("#tagRoot").height() + "px",
                    'max-width': 0.22 * 0.89 * 0.95 * 0.40 * 0.92 * $("#tagRoot").width() + "px" // these are all the % widths propagating down from the tag root
                });

                holderInnerContainer.append(mediaHolderImage);

                var title = $(document.createElement('div'));
				title.addClass('mediaHolderTitle');
                title.text(LADS.Util.htmlEntityDecode(tour.Name));
                holder.append(title);
            };
        }

        function createMediaHolder(container, media, isHotspot) {
            return function () {
                var holder = $(document.createElement('div'));
                holder.addClass("assetHolder");
                holder.css({
                    'height': 0.15 * $("#tagRoot").height() + "px"
                });
                holder.attr("id", media.assetLinqID);
                holder.data("assetHidden", true);
                holder.data("ishotspot", isHotspot);

                holder.data('info', media);

                holder.on("click", hotspotAssetClick(media, holder));
                holder.on("mousedown", downhelper(holder));
                holder.on("mouseup", uphelper(holder));
                container.append(holder);
                hotspotsHolderArray.push(holder);
                hotspotsArray.push(media);

                var mediaHolderDiv = $(document.createElement('div'));
                mediaHolderDiv.addClass('mediaHolderDiv');
                holder.append(mediaHolderDiv);

                var holderContainer = $(document.createElement('div')).addClass('holderContainer');
                mediaHolderDiv.append(holderContainer);

                var holderInnerContainer = $(document.createElement('div')).addClass('holderInnerContainer');
                holderContainer.append(holderInnerContainer);

                var mediaHolderImage = $(document.createElement('img'));
                mediaHolderImage.addClass('assetHolderImage');
                switch (media.contentType) {
                    case 'Audio':
                        mediaHolderImage.attr('src', tagPath+'images/audio_icon.svg');
                        break;
                    case 'Video':
                        mediaHolderImage.attr('src', (media.thumbnail && !media.thumbnail.match(/.mp4/)) ? LADS.Worktop.Database.fixPath(media.thumbnail) : 'images/video_icon.svg');
                        break;
                    case 'Image':
                        mediaHolderImage.attr('src', media.thumbnail ?  LADS.Worktop.Database.fixPath(media.thumbnail) :LADS.Worktop.Database.fixPath(media.source));
                        break;
                    default:
                        mediaHolderImage.attr('src', tagPath+'images/text_icon.svg');
                        break;
                }

                mediaHolderImage.removeAttr('width');
                mediaHolderImage.removeAttr('height');

                mediaHolderImage.css({
                    'max-height': 0.15 * 0.7 * $("#tagRoot").height() + "px",
                    'max-width': 0.22 * 0.89 * 0.95 * 0.40 * 0.92 * $("#tagRoot").width() + "px"
                });

                holderInnerContainer.append(mediaHolderImage);

                var title = $(document.createElement('div'));
				title.addClass('mediaHolderTitle');
                title.text(LADS.Util.htmlEntityDecode(media.title));
                holder.append(title);
            };
        }
        ///////////////////////////////////////
        
        //get the hotspots for the artwork
        if (hotspots.length != 0) {
            NUM_DRAWERS++;
            var hotspotsDrawer = createDrawer('Hotspots', (hotspots.length === 0));
            for (var k = 0; k < hotspots.length; k++) {
                loadQueue.add(createMediaHolder(hotspotsDrawer.contents, hotspots[k], true));
            }
            assetContainer.append(hotspotsDrawer);
        }

        if (assets.length != 0) {
            NUM_DRAWERS++;
            var assetsDrawer = createDrawer('Assets', (assets.length===0));
            for (var j = 0; j< assets.length; j++) {
                loadQueue.add(createMediaHolder(assetsDrawer.contents, assets[j], false));
            }
            assetContainer.append(assetsDrawer);
        }

        function hotspotAssetClick(hotspotsAsset, btn) {//check if the location history is open before you click the button, if so, close it
            return function () {
                hotspotsAsset.mediaload();
                if (locationHistoryActive) {
                    locationHistoryActive = false;
                    locationHistory.css({
                        'color': locationList.length ? 'white' : "rgb(136, 136, 136)",
                        "font-size": "25px",
                    });
                    locationHistoryToggle.hide();
                    locationHistoryToggle.hide("slide", { direction: direction }, 500);
                    locationHistoryDiv.hide("slide", { direction: direction }, 500);
                    toggler.show();//show the toggler for sidebar and hide the locationhistory toggler.
                }
                var circle = hotspotsAsset.toggle();

                if (btn.data("ishotspot")) {//btn change for hotspots
                    if (btn.data("assetHidden") && $(circle).css('display') === 'block') {
                        btn.css({
                            'color': 'black',
                            'background-color': 'rgba(255,255,255, 0.3)',
                        });
                        btn.data("assetHidden", false);
                    }
                    else {
                        btn.css({
                            'color': 'white',
                            'background-color': ''
                        });

                        btn.data("assetHidden", true);
                    }
                } else {//btn change for assets
                    if (btn.data("assetHidden")) {
                        btn.css({
                            'color': 'black',
                            'background-color': 'rgba(255,255,255, 0.3)',
                        });
                        btn.data("assetHidden", false);
                    } else {
                        btn.css({
                            'color': 'white',
                            'background-color': ''
                        });

                        btn.data("assetHidden", true);
                    }
                }
                hotspotsAsset.pauseAsset();
                if (circle) {
                    setTimeout(function () { circle.click(); }, 500); // has to be a better way.....
                }
            };
        }

        var toursDrawer;
        // Load tours and filter for tours associated with this artwork
        LADS.Worktop.Database.getTours(function (tours) {
            var relatedTours = tours.filter(function (tour) {
                if (!tour.Metadata || !tour.Metadata.RelatedArtworks || tour.Metadata.Private === "true")
                    return false;
                var relatedArtworks = JSON.parse(tour.Metadata.RelatedArtworks);
                return relatedArtworks instanceof Array && relatedArtworks.indexOf(doq.Identifier) > -1;
            });

            if (relatedTours.length != 0) {
                NUM_DRAWERS++;
                toursDrawer = createDrawer('Tours', relatedTours.length === 0);
                assetContainer.append(toursDrawer);
                if (relatedTours.length > 0) {
                    toursDrawer.contents.text('');
                    $.each(relatedTours, function (index, tour) {
                        loadQueue.add(createTourHolder(toursDrawer.contents, tour));
                    });
                }
            }

            var maxHeight= $("#assetContainer").height() - $('.drawerHeader').height() * NUM_DRAWERS - 10;
            if (maxHeight<=0)
                maxHeight=1;
            root.find(".drawerContents").css({
                "max-height": maxHeight +"px",
            });
        });

        

        function tourClicked(tour) {
            return function () {
                if (LADS.Util.Splitscreen.on()) {
                    confirmationBox = LADS.Util.UI.PopUpConfirmation(function () {
                        if (!switching) {
                            switching = true;
                            zoomimage.unload();
                            /* nbowditch _editted 2/13/2014 : added prevInfo */
                            prevInfo = { artworkPrev: "artmode", prevScroll: prevScroll };
                            var rinData = JSON.parse(unescape(tour.Metadata.Content)),
                            rinPlayer = new LADS.Layout.TourPlayer(rinData, exhibition, prevInfo, options);
                            /* end nbowditch edit */
                            //check if the screen split is on, exit the other one if splitscreen is on to play the tour on full screen.
                            if (LADS.Util.Splitscreen.on()) {
                                var parentid = $(root).parent().attr('id');
                                LADS.Util.Splitscreen.exit(parentid[parentid.length - 1]);
                            }
                            LADS.Util.UI.slidePageLeftSplit(root, rinPlayer.getRoot(), rinPlayer.startPlayback);
                        }
                    },
                    "By opening this tour, you will exit split screen mode. Would you like to continue?",
                    "Continue",
                    false,
                    function () {
                        $(confirmationBox).remove();
                    },
                    root);
                    $(confirmationBox).css('z-index', 10001);
                    root.append($(confirmationBox));
                    $(confirmationBox).show();
                } else {
                    if (!switching) {
                        switching = true;
                        zoomimage.unload();
                        /* nbowditch _editted 2/13/2014 */
                        prevInfo = { artworkPrev: "artmode", prevScroll: prevScroll };
                        var rinData = JSON.parse(unescape(tour.Metadata.Content)),
                        rinPlayer = new LADS.Layout.TourPlayer(rinData, exhibition, prevInfo, options);
                        /* end nbowditch edit */
                        //check if the screen split is on, exit the other one if splitscreen is on to play the tour on full screen.
                        if (LADS.Util.Splitscreen.on()) {
                            var parentid = $(root).parent().attr('id');
                            LADS.Util.Splitscreen.exit(parentid[parentid.length - 1]);
                        }
                        LADS.Util.UI.slidePageLeftSplit(root, rinPlayer.getRoot(), rinPlayer.startPlayback);
                    }
                }
            };
        }
        

        

        //Send Feedback (bleveque: commented it out for Curtis, need to put it back in)
        var feedbackContainer = $('notmatchinganything'); // TODO initFeedback();

        //Create minimapContainer...
		var minimapContainer = root.find('#minimapContainer');
        // minimapContainer.on('scroll', function(evt){
        //     evt.preventDefault();
        // });

        sideBarSections.append(minimapContainer);

        feedbackContainer.css("top", (minimapContainer.position().top - 0.05 * $(document).height()) + "px");//set feedback location


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
            if (s) zoomimage.viewer.viewport.zoomBy(s, false);
            zoomimage.viewer.viewport.panTo(new Seadragon.Point(x, y), true);
            zoomimage.viewer.viewport.applyConstraints();
        }
        function onMinimapScroll(res, pivot) {
            var a = 0;
        }
        function onMinimapTapped(evt) {
            var a = 0;
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
        zoomimage.addAnimateHandler(dzMoveHandler);

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
        //create container div for locationhistory
		locationHistoryContainer = root.find('#locationHistoryContainer');
		
        //have the container clickable. check histOnClick for more details.
        locationHistoryContainer.click(histOnClick);
        //create the icon for location history
        //create the div for text
		locationHistory = root.find('#locationHistory');

        locationHistory.text('Location History');
        locationHistory.css({
            'color': locationList.length ? 'white' : 'rgb(136,136,136)'
        });

        //panel that slides out when location history is clicked
		locationHistoryDiv = root.find('#locationHistoryDiv');
        var offsetSide = window.innerWidth * 0.22,
		locwidth = (!LADS.Util.Splitscreen.on()) ?//if the splitscreen is not on, set the width as 78% of current window width.
					window.innerWidth * 0.78 ://else set the width based on the side of screen. 
					((root.data('split') === 'L') ?
						$('#metascreen-L').width() - window.innerWidth * 0.22 :
						$('#metascreen-R').width() - window.innerWidth * 0.22);

        //create the panel for location history.
		var locationHistoryPanel = root.find('#locationHistoryPanel');

        //set the position of outtermost div and panel for locationhistory based on the which splitscreen
        if (root.data('split') === 'R') {
            var locpaneloffset = locwidth * 0.125;
            locationHistoryPanel.css({
                position: 'relative',
                left: locpaneloffset + 'px'
            });
        } else {
            //locationHistoryDiv.css({ left: offsetSide });
        }

        var mapOverlay = $(LADS.Util.UI.blockInteractionOverlay());//overlay for when 'edit ink' component option is selected while playhead is not over the art track
        $(mapOverlay).addClass('mapOverlay');
        var overlayLabel = $('<label>').text("Map has no location history to display.");
        overlayLabel.attr("id", "mapOverlayLabel");
        mapOverlay.append(overlayLabel);

        var lpContents = $(document.createElement('div'));
        lpContents.addClass('lpContents');

        lpContents.append(mapOverlay);
        //
        locationHistoryPanel.append(lpContents);

        //create a div for title
        var lpTitle = $(document.createElement('div'));
        lpTitle.attr("id", "lpTitle");
        lpTitle.text('Location History');

        lpContents.append(lpTitle);
        //create a div for map
        var lpMapDiv = $(document.createElement('div'));
        
        //set the id of map div according to the splitscreen position.
        if (root.data('split') === 'R') {
            lpMapDiv.attr('id', 'lpMapDivR');
        } else {
            lpMapDiv.attr('id', 'lpMapDiv');
        }
        lpMapDiv.addClass('lpMapDiv');

        lpContents.append(lpMapDiv);
        //this div contains all text information about the artwork's location history.
        var lpTextInfoDiv = $(document.createElement('div'));
        lpTextInfoDiv.addClass('lpTextInfoDiv');

        lpContents.append(lpTextInfoDiv);
        //this div contains a list of locations for the artwork.
        var lpTextDiv = $(document.createElement('div'));
        lpTextDiv.addClass("lpTextDiv");

        lpTextInfoDiv.append(lpTextDiv);
        //this div gives details about one specific location history when one location is clicked.
        var lpInfoDiv = $(document.createElement('div'));
        lpInfoDiv.addClass('lpInfoDiv');

        lpTextInfoDiv.append(lpInfoDiv);

        //create the toggler to close the location history. Same arrow as sidebar toggler. 
        locationHistoryToggle = root.find('#locationHistoryToggle');

        var locationHistoryToggleIcon = root.find('#locationHistoryToggleIcon');

        //set the toggler based on the splitscreen.
        if (root.data('split') === 'R') {
            locationHistoryToggle.css({
                right: '87.5%',
                'border-bottom-left-radius': '10px',
                'border-top-left-radius': '10px'
            });
            locationHistoryToggleIcon.attr('src', tagPath+'images/icons/Open.svg');
        } else {
            locationHistoryToggle.css({
                left: '87.5%',
                'border-bottom-right-radius': '10px',
                'border-top-right-radius': '10px'
            });
            locationHistoryToggleIcon.attr('src', tagPath+'images/icons/Close.svg');
        }

        locationHistoryToggle.click(toggleLocationPanel);

        /**
         * This is the click function LocationHistoryContainer. 
         */
        function histOnClick() {
            console.log("clicking on location history");

            locationList = LADS.Util.UI.getLocationList(options.doq.Metadata); //Location List is LOADED HERE

            if (locationList.length === 0) {
                mapOverlay.show();
            }
            if (!mapMade || !map) {
                console.log("in if");
                var prepMap = function () {
                    console.log("in prepMap");
                    //make location pushpins show up on map
                    locationList = LADS.Util.UI.getLocationList(options.doq.Metadata); //Location List is LOADED HERE
                    LADS.Util.UI.drawPushpins(locationList, map);


                    //traverse locationList and populate the location list
                    //lptext.information contains further information to be displayed when clicked
                    function drawPinHelper(e) {
                        LADS.Util.UI.drawPushpins(locationList, map);

                        //display location information
                        if (e.data.info !== undefined)
                            lpInfoDiv.html($(this).html() + "<br/>" + e.data.info);
                        else
                            lpInfoDiv.html($(this).html() + "<br/>");

                        $('div.locations').css(unselectedCSS);
                        $('img.removeButton').attr('src', tagPath+'images/icons/minus.svg');
                        $('img.editButton').attr('src', tagPath+'images/icons/edit.png');
                        $(this).find('img.removeButton').attr('src', tagPath+'images/icons/minusB.svg');
                        $(this).find('img.editButton').attr('src', tagPath+'images/icons/editB.png');
                        $(this).css(selectedCSS);
                        var lat, long, location;
                        if (e.data.resource.latitude) {
                            location = e.data.resource;
                        } else {
                            lat = e.data.resource.point.coordinates[0];
                            long = e.data.resource.point.coordinates[1];
                            location = new Microsoft.Maps.Location(lat, long);
                        }
                        var viewOptions = {
                            center: location,
                            zoom: 4,
                        };
                        map.setView(viewOptions);
                    }

                    for (var i = 0; i < locationList.length; i++) {

                        var unselectedCSS = {
                            'background-color': 'transparent',
                            'color': 'white'
                        };
                        var selectedCSS = {
                            'background-color': 'white',
                            'color': 'black',
                        };
                        var pushpinOptions = {
                            text: String(i + 1),
                            icon: tagPath+'images/icons/locationPin.png',
                            width: 20,
                            height: 30
                        };
                        var address = locationList[i].address;
                        var date = '';
                        if (locationList[i].date && locationList[i].date.year) {
                            var year = locationList[i].date.year;
                            if (year < 0) {
                                //add BC to years that are less than 0
                                year = Math.abs(year) + ' BC';
                            }
                            date = " - " + year;
                        } else {
                            date = ' - <i>Date Unspecified</i>';
                        }
                        //create a div for each location.
                        var newDiv = $(document.createElement('div'));
                        newDiv.addClass('locations');
                        newDiv.html((i + 1) + '. ' + address + date + '<br>');

                        lpTextDiv.append(newDiv);

                        LADS.Util.UI.drawPushpins(locationList, map);

                        //display more information about the location when newdiv is clicked
                        newDiv.click(locationList[i], drawPinHelper);
                        newDiv.fadeIn();
                    }

                    console.log("here 1");
                    toggleLocationPanel();
                };

                console.log("here 2");
                makeMap(prepMap);
            } else {
                console.log("in else");
                toggleLocationPanel();
            }
        }
        /*
        **toggles location panel when LocationHistoryContainer or toggler is clicked.
        **@return: locationHistoryContainer
        */
        function toggleLocationPanel() {
            console.log("toggle location panel");
            if (locationList.length === 0) return;
            if (LADS.Util.Splitscreen.on()) {
                return;
            }
            //set the direction based on the splitscreen position
            if (root.data('split') === 'R') {
                direction = 'right';
            } else {
                direction = 'left';
            }
            //if the panel is currently shown, hide it.
            if (locationHistoryActive) {
                locationHistory.text('Location History');
                locationHistory.css({ 'color': 'white' });
                locationHistoryToggle.hide();
                locationHistoryToggle.hide("slide", { direction: direction }, 500);
                locationHistoryDiv.hide("slide", { direction: direction }, 500);
                toggler.show();//show the toggler for sidebar and hide the locationhistory toggler.
                locationHistoryActive = false;
            }
            else {//show the panel if it is hidden when clicked
                locationHistory.text('Location History');
                locationHistoryToggle.hide();
                locationHistoryDiv.show("slide", { direction: direction }, 500, function () {
                    locationHistoryToggle.show();
                });
                locationHistoryDiv.css({ display: 'inline' });
                toggler.hide();
                locationHistoryActive = true;
            }
        }

        locationHistoryContainer.append(locationHistory);

        if (LADS.Util.Splitscreen.on()) {
            locationHistory.css('opacity', '0.5');
        }

        return locationHistoryContainer;
    }

    /*
    **this function create drawer for hotspots, assets and tour. 
    **@para: title of the drawer
    */
    function createDrawer(title, grayOut) {
        //here goes the basic UI elements for drawer: Outtermost div, header, iconContainer, icon and etc
        var drawer = $(document.createElement('div'));

        drawer.addClass('drawer');

        var drawerHeader = $(document.createElement('div'));
        drawerHeader.addClass('drawerHeader');
        drawerHeader.appendTo(drawer);

        var label = $(document.createElement('div'));
        label.addClass('label');
        label.text(title);
        label.css({
            'color': grayOut ? '#888888' : 'white'
        });
        label.appendTo(drawerHeader);

        if (!grayOut) {
            var toggleContainer = $(document.createElement('div'));
            toggleContainer.addClass('toggleContainer');
            toggleContainer.appendTo(drawerHeader);

            var toggle = $(document.createElement('img'));
            toggle.addClass("plusToggle");
            toggle.attr('src', tagPath+'images/icons/plus.svg');

            toggle.appendTo(toggleContainer);
            drawer.isslided = false;
            var drawerContents = $(document.createElement('div'));
            drawerContents.addClass("drawerContents");
            // var maxHeight= $("#assetContainer").height() - $('.drawerHeader').height() * NUM_DRAWERS - 15; // 165;
            // if (maxHeight<=0)
            //     maxHeight=1;
            // drawerContents.css({
            //     "max-height": maxHeight +"px",
            // });
            drawerContents.appendTo(drawer);

            //have the toggler icon minus when is is expanded, plus otherwise.
            drawerHeader.on('click', function (evt) {
                if (drawer.isslided === false) {
                    root.find(".plusToggle").attr('src', tagPath+'images/icons/plus.svg');//ensure only one shows.
                    root.find(".drawerContents").slideUp();

                    $.each(drawers, function () {
                        this.isslided = false;
                    });
                    toggle.attr('src', tagPath+'images/icons/minus.svg');
                    drawer.isslided = true;
                }
                else {
                    toggle.attr('src', tagPath+'images/icons/plus.svg');
                    $.each(hotspotsHolderArray, function () {
                        if (!this.data("assetHidden")) {
                            this.css({
                                'color': 'white',
                                'background-color': ''
                            });

                            this.data("assetHidden", true);
                        }
                    });
                    $.each(hotspotsArray, function () {
                        this.hide();
                    });
                    drawer.isslided = false;
                }
                drawerContents.slideToggle();
            });

            drawer.contents = drawerContents;
        }
        drawers.push(drawer);

        return drawer;
    }

    function splitscreenAdjustments() {
        splitscreen.text('Exit Split Screen');
    }

    // exhibition picker
    function createExhibitionPicker(artworkObj) {
        // debugger; // this shouldn't be called in the web app...
        var exhibitionPicker = $(document.createElement('div'));
        exhibitionPicker.addClass("exhibitionPicker");

        var infoLabel = $(document.createElement('div'));
        infoLabel.addClass("infoLabel");

        infoLabel.text('Choose an exhibition in which to view the artwork.');
        exhibitionPicker.append(infoLabel);

        var exhibitionsList = $(document.createElement('div'));
        exhibitionsList.addClass("exhibitionsList");

        exhibitionPicker.append(exhibitionsList);

        var cancelButton = $(document.createElement('button'));
        cancelButton.attr('type', 'button');
        cancelButton.addClass("cancelButton");

        cancelButton.text('Cancel');

        cancelButton.click(function () {
            exhibitionPicker.detach();
        });
        exhibitionPicker.append(cancelButton);

        root.append(exhibitionPicker);

        exhibitionSelect(artworkObj);

        function exhibitionSelect(artwork) {
            var i;
            var xml = LADS.Worktop.Database.getDoqXML(artwork.Identifier);
            var parser = new DOMParser();
            var artworkXML = parser.parseFromString(xml, 'text/xml');
            var selected;
            var currentExhibitions = [];
            var exhibitionLabelArray = [];

            for (i = 0; i < artworkXML.getElementsByTagName('FolderId').length; i++) {
                var exhib_id = artworkXML.getElementsByTagName('FolderId')[i].textContent;
                currentExhibitions.push(exhib_id);
            }

            for (i = 0; i < currentExhibitions.length; i++) {
                var exhibitionLabelWrapper = document.createElement('div');
                var exhibitionLabel = $(document.createElement('div'));
                exhibitionLabel.addClass(".exhibitionLabel");
                exhibitionLabel.css({
                    width: '80%',
                    color: 'white',
                    'font-size': '180%',
                });
                exhibitionLabel.text(currentExhibitions[i].Name);
                var exhibitionObject = currentExhibitions[i];
                $(exhibitionLabelWrapper).append(exhibitionLabel);
                exhibitionLabelArray.push(exhibitionLabelWrapper);
            }

            $.each(currentExhibitions, function (i, exhibition) {
                var toAdd = LADS.Worktop.Database.getDoq(exhibition);
                if (toAdd.Metadata.Private === "true" || toAdd.Metadata.Type !== "Exhibit" || toAdd.Metadata.Deleted) { return; }
                else {
                    var name = toAdd.Name;
                    var preview = LADS.Worktop.Database.fixPath(toAdd.Metadata.BackgroundImage);
                    var listCell = $(document.createElement('div'));
                    listCell.addClass("exhibitions-list-cell");

                    listCell.mousedown(function () {
                        listCell.css({
                            'background-color': 'white',
                            'color': 'black',
                        });
                    });
                    listCell.mouseup(function () {
                        listCell.css({
                            'background-color': 'black',
                            'color': 'white',
                        });
                    });
                    listCell.mouseleave(function () {
                        listCell.css({
                            'background-color': 'black',
                            'color': 'white',
                        });
                    });

                    var textBox = $(document.createElement('div'));
                    textBox.addClass("textbox");

                    textBox.text(name);

                    // Create an img element to load the image
                    var img = $(document.createElement('img'));
                    img.addClass("imgLoader");
                    img.attr('src', preview);

                    listCell.append(img);
                    listCell.append(textBox);

                    // Create a progress circle
                    var progressCircCSS = {
                        'position': 'absolute',
                        'left': '40%',
                        'top': '40%',
                        'z-index': '50',
                        'height': 'auto',
                        'width': '20%'
                    };

                    var circle = LADS.Util.showProgressCircle(img, progressCircCSS, '0px', '0px', true);

                    img.load(function () {
                        LADS.Util.removeProgressCircle(circle);
                    });

                    exhibitionsList.append(listCell);
                    listCell.click(function () {

                        /* nbowditch _editted 2/14/2013 : added backInfo */
                        var backInfo = { backArtwork: null, backScroll: prevScroll };
                        var newSplit = new LADS.Layout.NewCatalog(backInfo, toAdd);
                        /* end nbowditch edit */
                        LADS.Util.Splitscreen.init(root, newSplit.getRoot());
                        splitscreen.text('Exit Split Screen');
                        locsize = $('#metascreen-L').width() - window.innerWidth * 0.2;
                        $('.exhibitionPicker').remove();

                        newSplit.loadInteraction();

                        backButton.off('click');
                        backButton.on('click', function () {
                            backButton.off('click');
                            zoomimage && zoomimage.unload();
                            /* nbowditch _editted 2/13/2014 */
                            var backInfo = { backArtwork: doq, backScroll: prevScroll };
                            var catalog = new LADS.Layout.NewCatalog(backInfo, toAdd);
                            /* end nbowditch edit */

                            catalog.getRoot().css({ 'overflow-x': 'hidden' });
                            LADS.Util.UI.slidePageRightSplit(root, catalog.getRoot(), function () {
                                catalog.getRoot().css({ 'overflow-x': 'hidden' });
                                var newState = {};
                                newState.currentSort = "Title";
                                newState.exhibition = toAdd;
                                newState.tag = "Title";
                                newState.currentImage = artwork;
                                //catalog.setState;  //commented out due to jshint error and unknown purpose
                            });
                        });
                    });
                }
            });
        }
    }

    function initFeedback() {

        var feedbackContainer = root.find('#feedbackContainer');

        var feedback = root.find('#feedback-text');
        feedback.text('Send Feedback');

         var feedbackIcon = root.find('#feedback-icon');

        feedbackIcon.attr('src', tagPath+'images/icons/FeedbackIcon.svg');

        var feedbackBox = LADS.Util.UI.FeedbackBox("Artwork", doq.Identifier);//initiate the send feedback box
        setTimeout(function () {
           tagContainer.append(feedbackBox);
        }, 750);
        //pop up the feedback editing box when Send Feedback is clicked.
        // disable for now
        feedbackContainer.click(makeFeedback);
        function makeFeedback() {
            $(feedbackBox).css({ 'display': 'block' });
        }

        return feedbackContainer;
    }

    function initSplitscreen() {

        //Split screen sidebar button
        var splitscreenContainer = root.find('#splitscreenContainer');
        //create splitscreen Icon
        var splitscreenIcon = root.find('#splitscreenIcon');

        splitscreenIcon.attr('src', tagPath+'images/icons/SplitW.svg');

        splitscreenContainer.click(function () {
            if (locationHistoryActive) {
                locationHistory.text('Location History');
                locationHistory.css({ 'color': 'white' });
                locationHistoryToggle.hide();
                locationHistoryToggle.hide("slide", { direction: direction }, 500);
                locationHistoryDiv.hide("slide", { direction: direction }, 500);
                toggler.show();//show the toggler for sidebar and hide the locationhistory toggler.
                locationHistoryActive = false;
            }
            if (prevPage === "catalog" && initialized === true) {
                enterSplitScreen(true);
            } else {
                enterSplitScreen();
            }
        });
        function enterSplitScreen(fromTour) {//click function for splitscreenContainer
            fromTour = fromTour || 0;
            $('.locations').css({
                display: 'block',
                'white-space': 'nowrap',
                'text-overflow': 'ellipsis',
                '-o-text-overflow': 'ellipsis',
                '-ms-text-overflow': 'ellipsis',
                overflow: 'hidden'
            });

            if (!LADS.Util.Splitscreen.on()) {
                locationHistory.css('opacity', '0.5');
                //if the user enter artmode from tour tab in exhibition
                var newSplit;
                if (exhibition) {
                    /* nbowditch _editted 2/13/2014 : added backInfo */
                    var backInfo = { backArtwork: doq, backScroll: prevScroll };
                    newSplit = new LADS.Layout.NewCatalog(backInfo, exhibition, null, true);
                    /* end nbowditch edit */
                    (function () {
                        splitscreenContainer.hide();
                        LADS.Util.Splitscreen.init(root, newSplit.getRoot());
                        zoomimage.viewer.scheduleUpdate();

                        LADS.Util.Splitscreen.setViewers(root, zoomimage);
                        locsize = $('#metascreen-L').width() - window.innerWidth * 0.2;
                    })();

                }
                else if (fromTour !== 0) {
                    createExhibitionPicker(doq);
                }
            }
            else {//if the splitscreen is on, exit it.
                var parentid = $(root).parent().attr('id');
                splitscreenContainer.show();
                var parentSide = parentid[parentid.length - 1];
                zoomimage.viewer.scheduleUpdate();
                LADS.Util.Splitscreen.exit(parentSide);
                locationHistory.css('opacity', '1');
            }
        }

        return splitscreenContainer;
    }

    /**
     * Return art viewer root element
     * @method
     * @return {Object}    root jquery object
     */
    this.getRoot = function () {
        return root;
    };

    /**
     * Make the map for location History.
     * @method
     * @param {Function} callback     function to be called when map making is complete
    */
    function makeMap(callback) {
        console.log("in make map");
        var initMap = function () {
            console.log("making map");
            var mapOptions =
            {
                credentials: "AkNHkEEn3eGC3msbfyjikl4yNwuy5Qt9oHKEnqh4BSqo5zGiMGOURNJALWUfhbmj",
                mapTypeID: Microsoft.Maps.MapTypeId.road,
                showScalebar: true,
                enableClickableLogo: false,
                enableSearchLogo: false,
                showDashboard: true,
                showMapTypeSelector: false,
                zoom: 2,
                center: new Microsoft.Maps.Location(20, 0),
            };
            var viewOptions = {
                mapTypeId: Microsoft.Maps.MapTypeId.road,
            };
            //create the map based on splitscreen position.
            if (root.data('split') === 'R') {
                map = new Microsoft.Maps.Map(document.getElementById('lpMapDivR'), mapOptions);
            } else {
                map = new Microsoft.Maps.Map(document.getElementById('lpMapDiv'), mapOptions);
            }
            map.setView(viewOptions);

            mapMade = true;
            callback();
        };

        initMap();
    }

};

LADS.Layout.Artmode.default_options = {
    catalogState: {},
    doq: null,
    split: 'L',
};
