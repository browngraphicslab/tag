LADS.Util.makeNamespace("LADS.Layout.NewCatalog");
//catalog should only get artworks and exhibitions

// backInfo: {backArtwork: [artwork selected], backScroll: [int; position of scroll on timelineDiv] }

LADS.Layout.NewCatalog = function (backInfo, backExhibition, container, forSplitscreen) {
    "use strict";

    /* nbowditch _editted 2/13/2014 */
    var backArtwork;
    var scrollPos = 0;
    if (backInfo) {
        backArtwork = backInfo.backArtwork;
        scrollPos = backInfo.backScroll || 0;
    }
    /* end nbowditch edit */

    //vars from exhibition
    var root = LADS.Util.getHtmlAjax('NewCatalog.html'), // use AJAX to load html from .html file
        leftbar = root.find('#leftbar'), // back-button, exhibit, tour selectors
        displayarea = root.find('#displayarea'), 
        displayHelp, 
        exhibitarea = root.find('#exhibitarea'), 
        currentExhElements, 
        img1,
        leftbarHeader = root.find('#leftbar-header'), 
        exhibitionLabel = root.find('#exhibition-label'), 
        exhibitionSpan = root.find('#exhibitionSpan'), 
        contentdiv,
        imgDiv,
        descriptiontext,
        loadingArea,
        titlediv, 
        artworkSelected = false,
        switching = false, //boolean for switching the page
        exhibitelements = [], // this is shared between exhibitions and tours
        exhibTabSelected = true, //which tab is selected at the top (true for exhib, false for tour)
        firstLoad = true;

    var bgimage = root.find('#bgimage');

    var currExhibition = null,
        currentImage = null;

    // set values passed from previous page
    if (backExhibition) currExhibition = backExhibition;
    if (backArtwork) currentImage = backArtwork;
    var currExhibIndex = 0;
    var currTour = null;
    var numberOfTours, noTours, noArtworks;
    var toursGlobal;
    var loadQueue = LADS.Util.createQueue();
    var that = {
        getRoot: getRoot,
        loadExhibit: loadExhibit
    };
    container = container || window;

    var exLabels = [];
    that.exLabels = exLabels;

    // vars from Catalog
    var timelineDiv = root.find('#timelineDiv'),
        artistButton = root.find('#artistButton'),
        yearButton = root.find('#yearButton'),
        titleButton = root.find('#titleButton'),
        typeButton = root.find('#typeButton'),
        row = root.find('#row'),
        timelineDivContainer = root.find('#timelineDivContainer'),
        search = root.find('#searchInput'),
        searchTxt = root.find('#searchTxt'),
        searchFilter = root.find('#searchFilter'), // contains searchInput and searchTxt
        moreInfo,
        artistInfo,
        yearInfo,
        currentArtworks = [],
        infoSource = [],
        inSearch = false,
        defaultTag = "Title",
        currentTag;

    init();

    return that;

    /**
    *initiates UI stuff
    */
    function init() {
        // create loading page
        loadingArea = $(document.createElement('div'));
        loadingArea.attr('id', 'loadingArea');
        root.append(loadingArea);

        // set image paths
        root.find('#catalogBackButton').attr('src', tagPath+'images/icons/Back.svg');
        root.find('#feedback-icon').attr('src', tagPath+'images/icons/FeedbackIcon.svg');

        var progressCircCSS = { "position": 'absolute', 'z-index': '50', 'height': 'auto', 'width': '5%', 'left': '47.5%', 'top': '42.5%' };
        var centerhor = '0px';
        var centerver = '0px';
        var circle = LADS.Util.showProgressCircle(loadingArea, progressCircCSS, centerhor, centerver, false);

        // after loading finishes
        var overlay = root.find('#overlay');

        makeTimeline();

        artistButton
        .addClass('rowButton')
        .click(function () {
            changeDisplayTag(currentArtworks, "Artist");
        });

        titleButton
        .addClass('rowButton')
        .click(function () {
            changeDisplayTag(currentArtworks, "Title");
        });

        yearButton
        .addClass('rowButton')
        .click(function () {
            changeDisplayTag(currentArtworks, "Year");
        });

        typeButton
        .addClass('rowButton')
        .click(function () {
            changeDisplayTag(currentArtworks, "Type");
        });

        searchTxt.css({
            'font-size': '80%'
        });

        //The search and filter begins here.
        search.attr("placeholder", "Enter Keyword").blur();
        search.css({
            'max-height': $(row).height()*0.75 + '%',
            'font-size': '80%'
        });
        
        // the following mousedown and mouseup handlers deal with clicking the 'X' in the search box
        var oldSearchTerm;
        $(search).on('mousedown', function () {
            oldSearchTerm = $(search).val().toLowerCase();
        });

        $(search).mouseup(function () {
            setTimeout(function () {
                if ($(search).val().toLowerCase() !== oldSearchTerm) {
                    doSearch();
                }
            }, 1);
        });

        // search on keyup
        $(search).on('keyup', function (e) {
            doSearch();
        });

        var feedbackContainer = initFeedback();

        // Back button/overlay area
        var backbuttonArea = root.find('#backbuttonArea');

        var backbuttonIcon = root.find('#catalogBackButton');
        backbuttonIcon.css({
            'display': (!forSplitscreen && !LADS.Util.Splitscreen.on()) ? 'block' : 'none'
        });

        //handles changing the color when clicking/mousing over on the backButton
        backbuttonIcon.mouseleave(function () {
            LADS.Util.UI.cgBackColor("backButton", backbuttonIcon, true);
        });
        backbuttonIcon.mousedown(function () {
            LADS.Util.UI.cgBackColor("backButton", backbuttonIcon, false);
        });

        //opens the splash screen when the back button is clicked
        backbuttonIcon.click(function () {
            backbuttonIcon.off('click');
            LADS.Layout.StartPage(null, function (root) {
                LADS.Util.Splitscreen.setOn(false);
                LADS.Util.UI.slidePageRight(root);
            }, true);
        });

        // Labels (Exhibition)
        //var fontSize = LADS.Util.getMaxFontSizeEM('Collections', 2.5, $(container).width() * 0.085, 1000, 0.2);
        exhibitionLabel.css({
            //'font-size': '2.1em',
            'display': (!forSplitscreen && !LADS.Util.Splitscreen.on()) ? 'display' : 'none'
        });

        //have exhibition mode selected
        exhibitionSpan.mousedown(function () {
            $(this).css({ 'color': 'white' });
        });

        // Main display area
        // Initial text displayed in display area
        displayHelp = $(document.createElement('div'));
        displayHelp.attr('id', 'displayHelp');
        displayarea.append(displayHelp);

        var displayHelpTitle = $(document.createElement('div'));
        displayHelpTitle.attr('id', 'displayHelpTitle');
        displayHelpTitle.text("Welcome to the " + LADS.Worktop.Database.getMuseumName());

        var displayHelpText = $(document.createElement('div'));
        displayHelpText.attr('id' ,'displayHelpText');
        displayHelpText.text("Select an exhibition or tour from the left menu to begin exploring artworks");

        displayHelp.append(displayHelpTitle);
        displayHelp.append(displayHelpText);

        // gets a list of exhibitions from the server or the cache
        LADS.Worktop.Database.getExhibitions(getExhibitionsHelper, null, getExhibitionsHelper);

        /**helper function to exhibitions**/
        function getExhibitionsHelper(exhibitionsLocal) {
            currentExhElements = {};
            currentExhElements.displayareasub = displayHelp; //asign displayhelp to displayareasub to each exhibition

            // Add exhibitions to sidebar
            var gotFirst = false;
            $.each(exhibitionsLocal, function (_, e) {
                var privateState;
                if (e.Metadata.Private) {
                    privateState = (/^true$/i).test(e.Metadata.Private);
                } else {
                    privateState = false;
                }
                if (!privateState && LADS.Util.localVisibility(e.Identifier)) {
                    if (!gotFirst) {
                        bgimage.css('background-image', "url(" + LADS.Worktop.Database.fixPath(e.Metadata.BackgroundImage) + ")");
                    }
                    addExhibit(e);
                    gotFirst = true;
                }
            });

            if (currExhibition) {
                loadExhibit(currExhibition, currExhibition);
                showExhibition(currExhibition);
                // debugger;
                $("#exhib-" + currExhibition.Identifier).css({ 'background-color': 'rgb(255,255,255)', 'color': 'black' });
            }
            else clickExhibition(0);//have the first exhibition selected
            loadingArea.hide();
        }   // end getting exhibition

    }   //end init()

    function clickExhibition(i) {
        if (exhibitelements[i])
            exhibitelements[i].click();
    }

    /**
     * Adds exhibitions to page
     *@param: exhibition to add
     * Creates button in sidebar
     */
    function addExhibit(exhibition) {
        var title = LADS.Util.htmlEntityDecode(exhibition.Name),
            toAddImage = $(document.createElement('img')),
            toAdd = $(document.createElement('div')),
            subInfo = $(document.createElement('div')),
            text = exhibition.Metadata.Description || "",
            shortenedText = text ? text.substr(0, 18) + "..." : "";

        text = text.replace(/<br>/g, '').replace(/<br \/>/g, '');

        toAdd = $(document.createElement('div'));
        toAdd.attr('id' ,'exhibition-selection');

        var titleBox = $(document.createElement('div'));
        titleBox.attr('id' ,'exhibition-title');
        
        titleBox.html(title);

        toAdd.append(titleBox);
        var size = 0.096 * 0.45 * $(window).height();
        
        // var exhibTitleSize = LADS.Util.getMaxFontSizeEM('W', 0.25, 9999, size * 0.85, 0.1);

		/*
        titleBox.css({
            "font-size": '1.4em' //exhibTitleSize,            
        });
		*/

        exLabels.push(toAdd);
        exhibitarea.append(toAdd);
        toAdd.attr('flagClicked', 'false');
        toAdd.attr('id', 'exhib-' + exhibition.Identifier);
        toAdd.mousedown(function () {
            $(this).css({ 'background-color': 'white', 'color': 'black' });
            titleBox.css({'color': 'black'});
        });
        toAdd.mouseleave(function () {
            if ($(this).attr('flagClicked') == 'false') {
                $(this).css({ 'background-color': 'transparent', 'color': 'white' });
            }             
        });

        toAdd.on('click', function () {
            //put this all in diff func and call in constructor 
            for (var i = 0; i < exhibitelements.length; i++) {
                // prevents animation if exhibit is already selected
                if (exhibitelements[i] != toAdd) {
                    exhibitelements[i].css({ 'background-color': 'transparent', 'color': 'white' });
                    exhibitelements[i].data("selected", false);
                    exhibitelements[i].attr('flagClicked', 'false');
                    exhibitelements[i].children().css({'color': 'white'});
                }
            }
            $(this).attr('flagClicked', 'true');
            titleBox.css({'color': 'black'});
            currExhibition = exhibition;
            currentImage = null;
            loadExhibit.call(toAdd, currExhibition);
            scrollPos = 0; // nbowditch _editted 2/13/2014 
            showExhibition(currExhibition);
        });

        exhibitelements.push(toAdd);
    }


    /**
     * When exhibition is selected in sidebar,
     * this function creates description to display in main display area
     * @param: selected exhibition
     */
    // BM - privateExhib is a little bit of a hack to get private exhibits
    // to show in settings view.  When set to true it just ignores anything
    // that relies on 'this' since 'this' doesn't exist for a private exhibit
    // (it doesn't have a label in the exhib list)
    
    function loadExhibit(exhibition, privateExhib) {
        searchTxt.text("");

        timelineDiv && timelineDiv.empty();

        //this refers to toAdd- just particular one
        if (exhibition) {
            bgimage.css('background-image', "url(" + LADS.Worktop.Database.fixPath(exhibition.Metadata.BackgroundImage) + ")");// RIA ADDED
        }
        if (!privateExhib && this.data("selected")) { return; }//if the exhibition has already been selected, do nothing

        if (!privateExhib) {
            this.data("selected", true);
        }
        // Start loading artwork now in background

        // Remove current contents of display area
        var d;
        if (firstLoad) {
            d = currentExhElements.displayareasub;
            d.remove();
            firstLoad = false;
        }
        else if (currentExhElements) {
            currentExhElements.block.remove();
            d = currentExhElements.displayareasub;
            d.css('z-index', 1000);
            d.remove();
        }

        var displayareasub = $(document.createElement('div'));
        displayareasub.attr('id' ,'displayareasub');
        displayarea.append(displayareasub);

        currentExhElements = {};
        currentExhElements.block = $(document.createElement('div'));
        if (!privateExhib) {
            currentExhElements.block.css({
                "top": $(this).position().top, "left": "100%", "height": $(this).css('height'),
                "width": "4%", "font-size": "1.5em", 'position': 'absolute',
                'border': 'solid transparent', 'border-width': '5px 0px 5px 0px',
                'background-color': 'rgba(255,255,255,0)', 'z-index': '50'
            });
        }

        // Make titles
        titlediv = $(document.createElement('div'));
        titlediv.attr('id', 'exhibition-name-div');
        titlediv.text(LADS.Util.htmlEntityDecode(exhibition.Name));

        var w = $(container).width() * 0.75 * 0.8;
        
        currentExhElements.title = titlediv;

        // Display contains description, thumbnails and view button
        // TODO Might need to push this down farther (make top larger), Looks fine for now, though
        var display = $(document.createElement('div'));
        display.attr('id', 'exhibition-info');

        displayareasub.append(display);

        currentExhElements.display = display;
        var fontSize = LADS.Util.getMaxFontSizeEM(exhibition.Name, 1.5, w, 0.2 * display.height(),0.2);
        titlediv.css({ 'font-size': fontSize });
        display.append(titlediv);

        // Contains text
        contentdiv = $(document.createElement('div'));
        contentdiv.attr('id', 'contentdiv');
        contentdiv.css({
            'width': '94%', 
            'height': '80%', //(display.height()-titlediv.height()-20)+"px",
        });
        display.append(contentdiv);

        imgDiv = $(document.createElement('div'));
        imgDiv.attr('id', 'img-container');
        imgDiv.css({       
            height: '91.5%', 
            width: '40%', 
            position: 'absolute',
            top: '0%',
        });

        img1 = $(document.createElement('img'));
        img1.attr('id', 'image');
        img1.attr('src', LADS.Worktop.Database.fixPath(exhibition.Metadata.DescriptionImage1));
        img1.attr('thumbnail', LADS.Worktop.Database.fixPath(exhibition.Metadata.DescriptionImage1));       
        
        var exploreTabText = $(document.createElement('div'));
        exploreTabText.attr('id','explore-text');

        var exploreTab = $(document.createElement('div'));
        exploreTab.addClass('explore-tab');

        exploreTabText.text("Explore");
        exploreTab.on('click', function () {
            if (artworkSelected) {
                switchPage();
            }
        });

        var exploreIcon = $(document.createElement('img'));
        exploreIcon.attr('id', 'exploreIcon');
        exploreIcon.attr('src', tagPath+'images/icons/ExploreIcon.svg');

        exploreTab.append(exploreIcon);
        exploreTab.append(exploreTabText);    

        contentdiv.append(imgDiv);
        imgDiv.append(img1);
        imgDiv.append(exploreTab);
        exploreTabText.css("font-size", LADS.Util.getMaxFontSizeEM("Explore", 0.5, 0.5 * exploreTab.width(), 0.7 * exploreTab.height(),0.1));

        img1.on('click', function () {//exploreTab
            if (artworkSelected) {
                switchPage();
            }
        });

        moreInfo = $(document.createElement('div'));
        moreInfo.attr('id', 'info-text');

        artistInfo = $(document.createElement('div'));
        artistInfo.attr('id', 'artistInfo');
        artistInfo.css({
            'font-size': '0.65em' 
        });

        yearInfo = $(document.createElement('div'));
        yearInfo.attr('id', 'yearInfo');
        yearInfo.css({
            'font-size': '0.65em' 
        });

        moreInfo.append(artistInfo);
        moreInfo.append(yearInfo);
        imgDiv.append(moreInfo);

        var progressCircCSS = {
            'position': 'absolute',
            'float': 'left',
            'left': '12%',
            'z-index': '50',
            'height': '20%',
            'width': 'auto',
            'top': '22%',
        };
        

        var h1 = $(display).height() * 0.9;

        descriptiontext = $(document.createElement('div'));
        descriptiontext.attr('id', 'description-text');

        var str;
        if (exhibition.Metadata.Description) {
            str = exhibition.Metadata.Description.replace(/\n\r?/g, '<br />');
        } else {
            str = "";
        }
        
        descriptiontext.css({
            'height': '91.5%',
            'width': '55%', 
            'font-size': 0.2 * LADS.Util.getMaxFontSizeEM(exhibition.Metadata.Description, 1.5, 0.55 * $(contentdiv).width(), 0.915 * $(contentdiv).height(), 0.1), // h1*0.055 + 'px',
        });
           
        descriptiontext.html(str);
        contentdiv.append(descriptiontext);
        var circle = LADS.Util.showProgressCircle(descriptiontext, progressCircCSS, '0px', '0px', false);
        img1.load(function () {
            LADS.Util.removeProgressCircle(circle);
        });

        if (!privateExhib)
            $(this).css({ 'background-color': 'rgb(255,255,255)', 'color': 'black' });

        currentExhElements.displayareasub = displayareasub;

        $(document).ready(function () {
            displayareasub.css({ 'width': '100%', 'height': '100%', 'left': '0%' });
        });

    }


    function getTours(exhib, callback) {//dont send in anything
        //LADS.Worktop.Database.getTours(tourHelper, null, tourHelper);///getartwrksin
        LADS.Worktop.Database.getArtworksIn(exhib.Identifier, tourHelper, null, tourHelper);///getartwrksin

        function tourHelper(tours) {
            numberOfTours = tours.length;
            var publicTours=[];
            var k=0;
            for (var i = 0; i < tours.length; i++) {
                if (tours[i].Metadata.Private !== "true") {
                    //publicTours[tours.length-numberOfTours]=tours[i];//filter tours
                    numberOfTours--;
                }
                else {
                    publicTours.push(tours[i]);
                    k++;
                }
            }

            if (numberOfTours === 0) {
                noTours = true;
            }
            else {
                noTours = false;
            }

            //return tours;
            toursGlobal = publicTours;
            callback && callback();
        }
        //check in gettoursand artworks if both are empty using a flag
    }

    function getArtworks(exhibition, callback) {//get rid of this func
         LADS.Worktop.Database.getArtworksIn(exhibition.Identifier, getArtworksHelper, null, getArtworksHelper);

        function getArtworksHelper(artworks) {
            if (!artworks || !artworks[0]) {//pops up a box warning user there is no artwork in the selected exhibition
                var noArtworksOptionBox = LADS.Util.UI.makeNoArtworksOptionBox();
                root.append(noArtworksOptionBox);
                $(noArtworksOptionBox).fadeIn(500);
                noArtworks = true;
               // return;
            }
            else { noArtworks = false; }

            //create tiles for artworks here
            if (toursGlobal && toursGlobal.length) {
                artworks = toursGlobal.concat(artworks || []);//$.merge(toursGlobal, artworks);//causes error
            }
            createArtTiles(artworks);
            initSearch(artworks);
            callback && callback();
        }
    }

    // store sorting source
    function initSearch(artworks) {
        $(search)[0].value = "";
        infoSource = [];
        for (var i = 0; i < artworks.length; i++) {
            var infos;
            if (!artworks[i]) { continue; }
            infos = artworks[i].Name + " "
                + artworks[i].Metadata.Artist + " "
                + artworks[i].Metadata.Year + " "
                + artworks[i].Metadata.Type;
            infos = infos.toLowerCase();
            infoSource.push({ "id": i, "keys": infos });
        }
    }

    function doSearch() {
        var content = $(search).val().toLowerCase();
        if (content === "") {
            searchTxt.text("");
            drawTimeline(currentArtworks, currentTag, 0, false);
            return;
        }
        inSearch = true;
        var matchedArts = [], unmatchedArts = [];

        for (var i = 0; i < infoSource.length; i++) {
            if (infoSource[i].keys.indexOf(content) > -1) {
                matchedArts.push(currentArtworks[i]);
            }
            else {
                unmatchedArts.push(currentArtworks[i]);
            }
        }

        if (matchedArts.length > 0) searchTxt.text("Results Found");
        else searchTxt.text("No Matching Results");
        var numDrawn = drawTimeline(matchedArts, currentTag, 0, true);
        drawTimeline(unmatchedArts, currentTag, numDrawn, false);
        inSearch = false;
    }


    function makeTimeline() {
        timelineDiv.scrollLeft();
    }

    function createArtTiles(artworks) {
        currentArtworks = artworks;
        currentTag = defaultTag;
        handleSelectTags(currentTag);
        drawTimeline(currentArtworks, currentTag, 0);
    }

    // artworks: artworks to be sorted
    // tag: current tag to be sorted by
    // start: the index in the array to start sort from
    // onSearch: used only for matched results to make it highlighted
    function drawTimeline(artworks, tag, start, onSearch) {
        if (!currExhibition) return;
        if (start === 0) {
            console.log('currExhib = ' + currExhibition.Name);
            loadQueue.clear();
            setTimeout(function () {
                timelineDiv.empty();
            });
        }
        if (artworks === null) return;
        var sortedArtworks = sortTimeline(artworks, tag);
        var each = sortedArtworks.min();
        var currentWork = (each) ? each.artwork : null;
        var i = start;
        var h = $(timelineDiv).height() * 0.48;
        var w = h * 1.4;

        var works = sortedArtworks.getContents();
        for (var j = 0; j < works.length; j++) {
            var k = j;
            loadQueue.add(drawArtworkTile(works[k].artwork, tag, onSearch, k+i, w, h));
        }
        loadQueue.add(function () { timelineDiv.animate({ scrollLeft: scrollPos }, 1000);});

        return works.length;
    }

    function drawArtworkTile(currentWork, tag, onSearch, i, w, h) {
        return function () {
            var main = $(document.createElement('div'));
            main.addClass("tile");
            //if (i >= 2) return;
            main.css({
                'height': '48%', 
                'width': '16%', 
                'position': 'absolute',
                'margin-left': parseInt(i / 2) * 16.5 + 1 + '%', // (parseInt(i / 2) * $(timelineDiv).width() * 0.16 * 1.03) + 10 + "px",
                'margin-top': (i % 2) * 12.25 + '%', // ((i % 2) * $(timelineDiv).height() * 0.48 * 1.05) + "px",
                'border': '1px solid rgba(0,0,0,0.85)',
            });

            main.on('click', function () {
                if (img1.attr('guid') === currentWork.Identifier) {
                    switchPage();
                } else {
                    showArtwork(currentWork)();
                }
            });

            var tourLabel = $(document.createElement('img'));
            tourLabel.attr('id', 'tourLabel');
            tourLabel.attr('src', tagPath+'images/icons/catalog_tour_icon.svg');
            tourLabel.css({
                'height': '50%', 
                'width': '36%', 
            });

            var videoLabel = $(document.createElement('img'));
            videoLabel.attr('id', 'videoLabel');
            videoLabel.attr('src', tagPath+'images/icons/catalog_video_icon.svg');
            videoLabel.css({
                'height': '50%', 
                'width': '36%', 
            });

            var image = $(document.createElement('img'));
            // debugger;
            image.attr("src", LADS.Worktop.Database.fixPath(currentWork.Metadata.Thumbnail));
            image.css({ width: '100%', height: "100%", position: 'absolute' });

            var specs = LADS.Util.constrainAndPosition(w, h,
            {
                center_h: true,
                center_v: true,
                width: 1.0,
                height: 0.20,
                max_height: 35,
            });

            var artTitle = $(document.createElement('div'));
            artTitle.attr('id', 'artTitle');
            artTitle.css({
                'width': '100%', 
                'height': '20%', 
            });

            // text div for artwork
            var artText = $(document.createElement('div'));
            artText.attr('id', 'artText');
			
			/*
            artText.css({
                'font-size': '0.6em', // ($(artTitle).height() * 0.55) + "px",
            });
			*/

            if (tag === 'Title') {
                artText.text(LADS.Util.htmlEntityDecode(currentWork.Name));
            }
            else if (tag === 'Artist') artText.text(currentWork.Type === 'Empty' ? '(Interactive Tour)' : currentWork.Metadata.Artist);
            else if (tag === 'Year') artText.text(currentWork.Type === 'Empty' ? '(Interactive Tour)' : currentWork.Metadata.Year);
            else if (tag === 'Type') artText.text(LADS.Util.htmlEntityDecode(currentWork.Name));
            artTitle.append(artText);

            if (!onSearch && $(search).val() !== '') {
                image.css({ 'opacity': '0.3' });
                main.css('border', '1px solid black');
            } else if (inSearch) {
                image.css({ 'opacity': '0.3' });
                main.css('border', '1px solid black');
            } else if (onSearch) {
                image.css({ 'opacity': '1.0'});
                main.css('border', '1px solid white');
            }
            main.append(image);
            main.append(artTitle);

            if (currentWork.Type === "Empty") {
                main.append(tourLabel);
            }
            else if (currentWork.Metadata.Medium === "Video") {
                main.append(videoLabel);
            }
            timelineDiv.append(main);
        };
    }

    function showArtwork(artwork) {
        return function () {
            currentImage = artwork;
            artworkSelected = true;
            $('.explore-tab').css('display', 'inline-block');

            if (artwork.Type != "Empty") {
                if (artwork.Metadata.Artist === undefined) {
                    artistInfo.text("Artist: Unknown");
                } else {
                    artistInfo.text("Artist: " + artwork.Metadata.Artist);
                }
                
                if (artwork.Metadata.Year === undefined) {
                    yearInfo.text("");
                } else {
                    yearInfo.text(artwork.Metadata.Year);
                }
            }
            else {
                artistInfo.text("Interactive Tour" );
                yearInfo.text(" " );
            }
                
            img1.attr("src", LADS.Worktop.Database.fixPath(artwork.Metadata.Thumbnail))
                .css('border', '1px solid rgba(0,0,0,0.5)')
                .attr('guid', artwork.Identifier);
            
            var titleSpan = $(document.createElement('div'))
                            .text(LADS.Util.htmlEntityDecode(artwork.Name))
                            .attr('id', 'titleSpan')
            
            var descSpan = $(document.createElement('div'))
                            .attr('id', 'descSpan')
                            .html(artwork.Metadata.Description ? artwork.Metadata.Description.replace(/\n/g, '<br />') : '');

            descriptiontext.empty();
            descriptiontext.append(titleSpan).append(descSpan);            
        };
    }

    function sortTimeline(artworks, tag) {
        var identical = 0;
        var comparator;
        var valuation;
        var avlTree;
        var artNode;
        var i;
        if (tag === 'Title') {
            identical = 0;
            comparator = function (a, b) {
                if (a.nameKey < b.nameKey) {
                    return -1;
                } else if (a.nameKey > b.nameKey) {
                    return 1;
                } else {
                    if (a.artwork.Identifier > b.artwork.Identifier) {
                        return 1;
                    }
                    else if (a.artwork.Identifier < b.artwork.Identifier) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            };

            valuation = function (value, compareToNode) {
                if (!compareToNode) {
                    return null;
                } else if (value < compareToNode.nameKey) {
                    return -1;
                } else if (value > compareToNode.nameKey) {
                    return 1;
                } else {
                    return 0;
                }
            };

            avlTree = new AVLTree(comparator, valuation);
            avlTree.clear();
            for (i = 0; i < artworks.length; i++) {
                artNode = {
                    artwork: artworks[i],
                    nameKey: artworks[i].Name,
                };
                avlTree.add(artNode);
            }
            return avlTree;
        } else if (tag === 'Artist') {
            identical = 0;
            comparator = function (a, b) {
                if (a.artistKey < b.artistKey) {
                    return -1;
                } else if (a.artistKey > b.artistKey) {
                    return 1;
                } else {
                    if (a.artwork.Identifier > b.artwork.Identifier) {
                        return 1;
                    } 
                    else if (a.artwork.Identifier < b.artwork.Identifier) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            };

            valuation = function (value, compareToNode) {
                if (!compareToNode) {
                    return null;
                } else if (value < compareToNode.artistKey) {
                    return -1;
                } else if (value > compareToNode.artistKey) {
                    return 1;
                } else {
                    return 0;
                }
            };

            avlTree = new AVLTree(comparator, valuation);
            for (i = 0; i < artworks.length; i++) {
                artNode = {
                    artwork: artworks[i],
                    artistKey: artworks[i].Type === 'Empty' ? '~~~~' : artworks[i].Metadata.Artist
                };
                avlTree.add(artNode);
            }
            return avlTree;
        } else if (tag === 'Year') {
            identical = 0;
            comparator = function (a, b) {
                if (a.yearKey < b.yearKey) {
                    return -1;
                } else if (a.yearKey > b.yearKey) {
                    return 1;
                } else {
                    if (a.artwork.Identifier > b.artwork.Identifier) {
                        return 1;
                    }
                    else if (a.artwork.Identifier < b.artwork.Identifier) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            };

            valuation = function (value, compareToNode) {
                if (!compareToNode) {
                    return null;
                } else if (value < compareToNode.yearKey) {
                    return -1;
                } else if (value > compareToNode.yearKey) {
                    return 1;
                } else {
                    return 0;
                }
            };

            avlTree = new AVLTree(comparator, valuation);
            for (i = 0; i < artworks.length; i++) {
                artNode = {
                    artwork: artworks[i],
                    yearKey: artworks[i].Type === 'Empty' ? '~~~~' : artworks[i].Metadata.Year
                };
                avlTree.add(artNode);
            }
            return avlTree;
        } else if (tag === 'Type') {
            identical = 0;
            comparator = function (a, b) {
                if (a.typeKey < b.typeKey) {
                    return -1;
                } else if (a.typeKey > b.typeKey) {
                    return 1;
                } else {
                    if (a.nameKey > b.nameKey) {
                        return 1;
                    }
                    else if (a.nameKey < b.nameKey) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            };

            valuation = function (value, compareToNode) {
                if (!compareToNode) {
                    return null;
                } else if (value < compareToNode.nameKey) {
                    return -1;
                } else if (value > compareToNode.nameKey) {
                    return 1;
                } else {
                    return 0;
                }
            };

            avlTree = new AVLTree(comparator, valuation);
            for (i = 0; i < artworks.length; i++) {
                artNode = {
                    artwork: artworks[i],
                    nameKey: artworks[i].Name,
                    typeKey: artworks[i].Type === 'Empty' ? 1 : (artworks[i].Metadata.Type === 'Artwork' ? 2 : 3)
                };
                avlTree.add(artNode);
            }
            return avlTree;
        }
        else return null; // error case: should check 'tag'
    }

    function handleSelectTags(tag) {
        //unselected tags are gray
        artistButton.css("color", "gray");
        titleButton.css("color", "gray");
        yearButton.css("color", "gray");
        typeButton.css("color", "gray");

        switch (tag) {
            case "Artist":
                artistButton.css("color", "white");
                break;
            case "Title":
                titleButton.css("color", "white");
                break;
            case "Year":
                yearButton.css("color", "white");
                break;
            case "Type":
                typeButton.css("color", "white");
                break;
        }
    }

    /*
    **Changes the tag to a different one, and re-sorts.
    **@para:tag, which indicates how to arrange the artworks
    */
    function changeDisplayTag(artworks, tag) {
        var guidsSeen = [];
        currentTag = tag;
        handleSelectTags(currentTag);
        if (tag !== 'Type') drawTimeline(artworks, currentTag, 0, false);
        else { // sort by Type
            var toursArray = [], artsArray = [], videosArray = [];
            for (var i = 0; i < artworks.length; i++) {
                if (guidsSeen.indexOf(artworks[i].Identifier) < 0) {
                    guidsSeen.push(artworks[i].Identifier);
                } else {
                    continue;
                }
                if (artworks[i].Type === "Empty") {
                    toursArray.push(artworks[i]);
                }
                else if (artworks[i].Metadata.Type === "Artwork") {
                    artsArray.push(artworks[i]);
                }
                else {
                    videosArray.push(artworks[i]);
                }
            } //  done sorting
            drawTimeline(toursArray, "Title", 0, false);
            drawTimeline(artsArray, "Title", toursArray.length, false);
            drawTimeline(videosArray, "Title", toursArray.length + artsArray.length, false);
        }
        doSearch(); // should sort by new tag
    }

    function switchPageTour(tour) {
        var rinData, rinPlayer;
       
        rinData = JSON.parse(unescape(tour.Metadata.Content));
            if (!rinData || !rinData.data) {
                var messageBox = $(LADS.Util.UI.popUpMessage(null, "Cannot play empty tour.", null));
                messageBox.css('z-index', LADS.TourAuthoring.Constants.aboveRinZIndex + 7);
                root.append(messageBox);
                messageBox.fadeIn(500);
                switching = false;
                return;
            }
            /* nbowditch _editted 2/13/2014 : added prevInfo */
            scrollPos = timelineDiv.scrollLeft();
            var prevInfo = { artworkPrev: null, prevScroll: scrollPos };
            rinPlayer = new LADS.Layout.TourPlayer(rinData, currExhibition, prevInfo, null, tour);//error here-in util, line 524
            /* end nbowditch edit */

            if (LADS.Util.Splitscreen.on()) {//if the splitscreen is on, exit it.
                var parentid = root.parent().attr('id');
                LADS.Util.Splitscreen.exit(parentid[parentid.length - 1]);
            }

            LADS.Util.UI.slidePageLeftSplit(root, rinPlayer.getRoot(), rinPlayer.startPlayback);
        
    }

    function switchPage() {
        if (!currentImage)
            return;//do nothing when there is no artwork in this catalog
        var curOpts, deepZoom, splitopts,
            opts = getState(), confirmationBox;
        //check the splitscreen states.
        if (root.parent().attr('id') === 'metascreen-R') {
            splitopts = 'R';
        } else {
            splitopts = 'L';
        }
        curOpts = { catalogState: opts, doq: currentImage, split: splitopts };

        if (currentImage.Type === "Empty") {
            // put in a check for splitscreen here
            if (LADS.Util.Splitscreen.on()) {
                confirmationBox = LADS.Util.UI.PopUpConfirmation(function(){
                    switchPageTour(currentImage);
                }, "By opening this tour, you will exit split screen mode. Would you like to continue?",
                "Continue", false, function () {
                    $(confirmationBox).remove();
                }, root);
                $(confirmationBox).css('z-index', 10001);
                root.append($(confirmationBox));
                $(confirmationBox).show();
            } else {
                switchPageTour(currentImage);
            }
        }
        else if (currentImage.Metadata.Type === "VideoArtwork") {
            /* nbowditch _editted 2/13/2013 : added prevInfo */
            scrollPos = timelineDiv.scrollLeft();
            var prevInfo = {artworkPrev: null, prevScroll: scrollPos};
            var video = new LADS.Layout.VideoPlayer(currentImage, currExhibition, prevInfo);
            /* end nbowditch edit */
            LADS.Util.UI.slidePageLeftSplit(root, video.getRoot());//have the page sliding to left and 
        }
        else {//if it's an image
            
            /* nbowditch _editted 2/13/2014 : added prevInfo */
            scrollPos = timelineDiv.scrollLeft();
            var prevInfo = {prevPage: "catalog", prevScroll: scrollPos};
            deepZoom = new LADS.Layout.Artmode(prevInfo, curOpts, currExhibition);
            /* end nbowditch edit */
            LADS.Util.UI.slidePageLeftSplit(root, deepZoom.getRoot());//have the page sliding to left and 
        }
        root.css({ 'overflow-x': 'hidden' });
    }

    function initFeedback() {
        var feedbackContainer = root.find('#feedbackContainer'); 

        var feedbackIcon = root.find('#feedbackIcon'); 
        feedbackIcon.css({
            'display': (!forSplitscreen && !LADS.Util.Splitscreen.on()) ? 'inline' : 'none',
        });

        var feedbackBox = LADS.Util.UI.FeedbackBox("Exhibition", getCurrentID);
        root.append(feedbackBox);

        feedbackContainer.click(makeFeedback);
        function makeFeedback() {
            $(feedbackBox).css({ 
                'display': 'block'
            });
        }

        return feedbackContainer;
    }

    function getCurrentID() {
        if (currExhibition) {
            return currExhibition.Identifier;
        } else {
            return "";
        }
    }

    function showExhibition (e) {
        getTours(e, function () { // TODO make this better
            getArtworks(e, function () {
                if (currentImage)
                    showArtwork(currentImage)();
            });
        });
    }

    function getState() {
        return {
            exhibition: currExhibition,
            currentTag: defaultTag,
            currentImage: currentImage
        };
    }

    function getRoot() {
        return root;
    }

};

LADS.Layout.NewCatalog.default_options = {};