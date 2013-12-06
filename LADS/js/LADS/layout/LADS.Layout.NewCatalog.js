LADS.Util.makeNamespace("LADS.Layout.NewCatalog");
//catalog should only get artworks and exhibitions
//LADS.Layout.NewCatalog = function (options, newCatalogCallback) {//needs to receive'split'
LADS.Layout.NewCatalog = function (backArtwork, backExhibition, container, forSplitscreen) {//needs to receive'split'

"use strict";
    ////vars from exhibition
    //options = LADS.Util.setToDefaults(options, LADS.Layout.Exhibitions.default_options);
    var root, leftbar, displayarea, displayHelp, exhibitarea, currentfolder, currentExhElements, img1,
        leftbarHeader, exhibitionLabel, selectText, exhibitionSpan, descriptiontext, loadingArea,
        titlediv = null, artworkSelected = false,

        switching = false,//boolean for switching the page
        exhibitelements = [], // this is shared between exhibitions and tours
        exhibTabSelected = true, //which tab is selected at the top (true for exhib, false for tour)
        firstLoad = true;
    var bgimage = $(document.createElement('div'));
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

    ////// vars from Catalog

    var timeline,
       timelineDiv,
       originmapDiv = null, // TODO for code cleanliness, don't need to initialize to null
       map = null,
       originButton = null,
       artistButton = null,
       yearButton = null,
       titleButton = null,
       typeButton = null,
       heatmapDiv = null,
       heatmapDivContainer = null,
       heatMap = null,
       row1 = null,
       selectedImage = null,
       mapexpanded = null,
       sortContainer = null,
       timelineDivContainer = null,
       expandarrow = null,
       mapExpansionTime = 409,
       mapContractTime = 353,
       searchAndFilterContainer = null, //Contains the filter and search divs
       search = null,//search input element
       searchTxt = null,
       artistInfo = null,
       yearInfo = null,
       filterBox = null,//filter div;
       searchFilter = null,
       searchResultsDiv = null,
       imageLoading = false,
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
        root = $(document.createElement('div'));
        root.addClass('root exhibition');
        root.css({
            width: "100%", height: "100%", position: "relative",
            "background-color": "rgb(127,127,127)"
        });

        //create loading page
        loadingArea = $(document.createElement('div'));
        loadingArea.css({
            width: "100%", height: "100%",
            position: "absolute",
        });
        loadingArea.addClass('displayarea');

        root.append(loadingArea);

        var progressCircCSS = { "position": 'absolute', 'z-index': '50', 'height': 'auto', 'width': '5%', 'left': '47.5%', 'top': '42.5%' };
        var centerhor = '0px';
        var centerver = '0px';
        loadingArea.css({ 'background-color': 'rgba(0, 0, 0, 0.7)' });
        var circle = LADS.Util.showProgressCircle(loadingArea, progressCircCSS, centerhor, centerver, false);

        //after loading finished
        // Background
        var overlay = $(document.createElement('div'));
        overlay.attr('id', 'overlay');
        overlay.css({ width: "100%", height: "100%", position: "absolute", 'background-color': 'rgba(0,0,0,0.5)' });
        bgimage.css({
            width: "100%",
            height: "100%",
            position: "absolute",
            'background-position': "center",
            'background-size': "cover",
            'opacity':'0.45',

        });
        bgimage.attr('id', 'bgimage');

        // Sidebar
        leftbar = $(document.createElement('div'));
        leftbar.addClass('leftbar');
        leftbar.css({
            width: "25%", height: "45%",
            position: "absolute",
            //"background-color": "rgba(0,0,0,0.7)"
        });

        // Header w/ back-button, exhibit, tour selectors
        leftbarHeader = $(document.createElement('div'));
        leftbarHeader.addClass('leftbar-header');
        leftbarHeader.css({
            width: '100%',
            height: '5%',
            'margin-bottom': '15%',
            'padding-left': '60px',
            'overflow': 'hide',
            // 'padding-top': '2%'
        });
        leftbar.append(leftbarHeader);

        root.append(overlay);

        row1 = $(document.createElement('div'));
        row1.addClass('row1');
        row1.css({
            position: 'relative',
            //top: '0.5%',
            'top':'0%',
            width: '100%',
            height: '12%',
            'background-color': 'rgba(0, 0, 0, 0.5)',
            'z-index': '10000'
        });
        makeTimeline();

        //var fontsz = $(row1).height() * 1.48 + 'px';//1.75
        var fontsz = LADS.Util.getMaxFontSizeEM('Artist', 0, $(row1).width(), $(window).height()*0.425*0.12*0.75, 0.1);//2.5
        var btnCCSS = ({
            float: "left",
            "margin": "0.3% 2%",
            'font-size': fontsz
        });

        artistButton = $(document.createElement("div"))
        .text("Artist").css(btnCCSS)
        .click(function () {
            changeDisplayTag(currentArtworks, "Artist");
        });

        titleButton = $(document.createElement("div"))
        .text("Title").css(btnCCSS)
        .click(function () {
            changeDisplayTag(currentArtworks, "Title");
        });

        yearButton = $(document.createElement("div"))
        .text("Year").css(btnCCSS)
        .click(function () {
            changeDisplayTag(currentArtworks, "Year");
        });

        typeButton = $(document.createElement("div"))
        .text("Type").css(btnCCSS)
        .click(function () {
            changeDisplayTag(currentArtworks, "Type");
        });

        row1.append(artistButton);
        row1.append(titleButton);
        row1.append(yearButton);
        row1.append(typeButton);


        searchTxt = $(document.createElement("div"));
        searchTxt.css({
            'width': '25%',
            'text-align': 'right',
            'float': "right",
            'color': 'white',
            "margin": "0.65% 3% 0 0",
            'font-size': $(container).height() * 0.015 + 'px',
        });

        //The search and filter begins here.
        search = $(document.createElement('input'));
        search.attr('id', 'searchInput');
        search.attr("placeholder", "Enter Keyword").blur();
        search.css({
            'max-height': $(row1).height()*0.75 + '%',
            'max-width': '15%',
            'position': 'relative',
            'right': '1%',
            'float': 'right',
            'margin-top': '0.5%',
            'border-style': 'solid',
            'background-color': 'white',
            'border-color': 'rgb(167,180,174)',
            'border-width': '0.05em',
            'font-size': $(container).height() * 0.014 + 'px',
            'color': 'rgb(120,128,119)',
            'z-index': '100'
        });

        searchAndFilterContainer = $(document.createElement('div'));//Container of both the filter and the search objct.
        searchAndFilterContainer.attr('id', 'searchFilter');
        searchAndFilterContainer.append(search);

        searchAndFilterContainer.append(searchTxt);
        row1.append(searchAndFilterContainer);
        
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
        var backbuttonArea = $(document.createElement('div'));
        backbuttonArea.addClass('backbuttonArea');
        backbuttonArea.css({
            'left': '3.5%',
            'top': '1%',
            'position': 'absolute',
            'width': '15%',
            'height': '5%',
        });
        leftbarHeader.append(backbuttonArea);

        var backbuttonIcon = $(document.createElement('img'));
        backbuttonIcon.attr('id', 'catalogBackButton');
        backbuttonIcon.attr('src', 'images/icons/Back.svg');
        backbuttonIcon.css({
            'width': '73.5%',
            'height': 'auto',
            'top': '28%',
            'position': 'relative',
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
        backbuttonArea.append(backbuttonIcon);

        // Labels (Exhibition)
        exhibitionLabel = $(document.createElement('div'));
        exhibitionLabel.attr('id', 'exhibition-label');
        
        exhibitionLabel.css({
            'text-align': 'center',
            'left': "19%",
            'height': '7%',
            'top': "2.5%",
            'position': 'absolute',
            'width': '45%',
            'margin-left': '1.22%',
        });

        exhibitionSpan = $(document.createElement('div'));

        var fontSize = LADS.Util.getMaxFontSizeEM('Collections', 2.5, $(container).width() * 0.085, 1000, 0.2);//2.5
        exhibitionLabel.css({
            'font-size': fontSize,
            'display': (!forSplitscreen && !LADS.Util.Splitscreen.on()) ? 'display' : 'none'
        });

        exhibitionSpan.text("Collections");
        exhibitionLabel.append(exhibitionSpan);
        leftbarHeader.append(exhibitionLabel);

        //have exhibition mode selected
        exhibitionSpan.mousedown(function () {
            $(this).css({ 'color': 'white' });
        });

        // Buttons for sidebar to select Exhibitions
        exhibitarea = $(document.createElement('div'));
        exhibitarea.css({
            width: '82%',//"100%",//90
            height: "88%",//"92%",
            'margin-top': '4%',
            'margin-left': '4%',
            'overflow': 'auto',
            "background-color": "rgba(0, 0, 0, 0.7)"
        });
        leftbar.append(exhibitarea);

        // Main display area
        displayarea = $(document.createElement('div'));
        displayarea.css({
            width: "75%", height: "50%",
            "left": "25%",
            position: "absolute",
        });
        displayarea.addClass('displayarea');

        // Initial text displayed in display area

        //var displayHelp = $(document.createElement('div'));
        displayHelp = $(document.createElement('div'));

        displayHelp.addClass('displayHelp');
        displayHelp.css({
            position: 'relative',
            left: "0%",
            top: "0.5%",
            width: "100%",
            height: "100%",
            "background-color": "rgba(0,0,0,0.5)",
        });
        displayarea.append(displayHelp);

        var displayHelpTitle = $(document.createElement('div'));
        displayHelpTitle.text("Welcome to the " + LADS.Worktop.Database.getMuseumName());
        displayHelpTitle.addClass('displayHelpTitle');
        displayHelpTitle.css({
            'position': 'relative',
            'padding-top': '15%',
            'margin': '0px auto',
            'width': '60%',
            'text-align': 'center',
            'font-size': '2em',
        });

        var displayHelpText = $(document.createElement('div'));
        displayHelpText.addClass('displayHelpText');
        displayHelpText.text("Select an exhibition or tour from the left menu to begin exploring artworks");
        displayHelpText.css({
            'position': 'relative',
            'margin': '0px auto',
            'width': '65%',
            'text-align': 'center',
            'font-size': '2.5em',
        });
        displayHelp.append(displayHelpTitle);
        displayHelp.append(displayHelpText);

        // gets a list of exhibitions from the server or the cache
        LADS.Worktop.Database.getExhibitions(getExhibitionsHelper, null, getExhibitionsHelper);

        /**helper function to exhibitions**/
        function getExhibitionsHelper(exhibitionsLocal) {
            root.append(bgimage);

            //append everything in callback
            root.append(leftbar);
            root.append(displayarea);
            root.append(feedbackContainer);

            currentExhElements = {};
            currentExhElements.displayareasub = displayHelp;//asign displayhelp to displayareasub to each exhibition


            // Add exhibitions to sidebar
            var gotFirst = false;
            $.each(exhibitionsLocal, function (_, e) {
                var privateState;
                if (e.Metadata.Private) {
                    privateState = (/^true$/i).test(e.Metadata.Private);
                } else {
                    privateState = false;
                }
                if (!privateState) {
                    if (!gotFirst) {
                        bgimage.css('background-image', "url(" + LADS.Worktop.Database.fixPath(e.Metadata.BackgroundImage) + ")");
                    }
                    addExhibit(e);
                    gotFirst = true;
                }
            });

            if (currExhibition !== null) {
                loadExhibit(currExhibition, currExhibition);
                showExhibition(currExhibition);
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
        toAdd.addClass('exhibition-selection');

        var titleBox = $(document.createElement('div'));
        titleBox.addClass('exhibition-title');
        
        titleBox.html(title);

        toAdd.css({
            "width": "100%",
            "height": "9.6%",
            'position': 'relative',
            'border': 'solid transparent',
            'border-width': '5px 0px 5px 0px',
            'padding-bottom': '0.75%',
            'display': 'inline-block',
            'overflow': 'none',
        });

        toAdd.append(titleBox);
        //var exhibTitleSize = LADS.Util.getMaxFontSizeEM('WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW', 0, $(toAdd).width(), $(window).height() * 0.425 * 0.12 * 0.8, 0.01);
        var size = 0.096 * 0.45 * $(window).height();
        var exhibTitleSize = LADS.Util.getMaxFontSizeEM('W', 0.25, 9999, size * 0.85, 0.1);

        titleBox.css({
            'width': '90%',
            'height': '100%',
            "font-size": exhibTitleSize,
            'display': 'inline-block',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
            'margin-left': '5%'
            
        });

        exLabels.push(toAdd);
        exhibitarea.append(toAdd);
        toAdd.attr('flagClicked', 'false');
        toAdd.attr('id', 'exhib-' + exhibition.Identifier);
        toAdd.mousedown(function () {
            $(this).css({ 'background-color': 'white', 'color': 'black' });
        });
        toAdd.mouseleave(function () {
            if ($(this).attr('flagClicked') == 'false')
                $(this).css({ 'background-color': 'transparent', 'color': 'white' });
        });

        toAdd.click(function () {
            //put this all in diff func and call in constructor 
            for (var i = 0; i < exhibitelements.length; i++) {
                // prevents animation if exhibit is already selected
                if (exhibitelements[i] != toAdd) {
                    exhibitelements[i].css({ 'background-color': 'transparent', 'color': 'white' });
                    exhibitelements[i].data("selected", false);
                    exhibitelements[i].attr('flagClicked', 'false');
                }
            }
            $(this).attr('flagClicked', 'true');
            //currExhibIndex = jQuery.inArray(toAdd, exhibitelements);
            currExhibition = exhibition;
            currentImage = null;
            loadExhibit.call(toAdd, currExhibition);
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
        displayareasub.addClass('displayareasub');
        displayareasub.css({
            'width': '100%',
            'height': '100%',
            'position': 'absolute'
        });
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
        // fixed to work at small widths (in splitscreen and in portrait mode)
        titlediv = $(document.createElement('div'));
        titlediv.addClass('exhibition-name-div');
        titlediv.text(LADS.Util.htmlEntityDecode(exhibition.Name));
        // Font size & line-height is probably the easiest thing to dynamically update here
        titlediv.css({
            'width': '96%',//'100%',
            'text-align': 'center',
            'z-index': '100',
            'white-space': 'nowrap',
            'display': 'inline-block',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
        });
        var w = $(container).width() * 0.75 * 0.8;
        

        currentExhElements.title = titlediv;

        // Display contains description, thumbnails and view button
        var display = $(document.createElement('div'));
        display.addClass('exhibition-info');

        // Might need to push this down farther (make top larger)
        // Looks fine for now, though
        display.css({
            'top': '0%',
           // "background-color": "rgba(255,255,255,0.9)",
            'position': 'absolute',
            "height": "96%",//"100%",
            "width": "98%",
            //'border-style': 'solid',
            //'border-width': '0.1em',
            //'border-color': 'rgba(16,14,12,0.92)',
        });

        displayareasub.append(display);
        currentExhElements.display = display;
        var fontSize = LADS.Util.getMaxFontSizeEM(exhibition.Name, 1.5, w, .2 * display.height(),0.2);
        titlediv.css({ 'font-size': fontSize });
        display.append(titlediv);

        // Contains text
        var contentdiv = $(document.createElement('div'));
        contentdiv.addClass('contentdiv');
        var test1 = titlediv.height();
        var test2 = display.height();
        contentdiv.css({
            'width': '94%', 'height': (display.height()-titlediv.height()-20)+"px",
            'position': 'relative',
            'top': '2%', 'left': '3%',
          //  'overflow': 'hidden',
            'text-overflow': 'ellipsis',
        });
        display.append(contentdiv);

        var w = .40 * contentdiv.width();
        var h = w / 1.4;
        var imgDiv = $(document.createElement('div'));
        imgDiv.addClass('img-container');
        imgDiv.css({
          //  "width": "32%",
            //"height": "75%",
           // "max-width": "32%",
            //"float": "left",
            //'margin-bottom': '2px',
            //'margin-left': '0'         
            height: h,
            width:w,
            position: 'absolute',
            top: '0%',
        });
        img1 = $(document.createElement('img'));
        img1.attr('src', LADS.Worktop.Database.fixPath(exhibition.Metadata.DescriptionImage1));
        img1.attr('thumbnail', LADS.Worktop.Database.fixPath(exhibition.Metadata.DescriptionImage1));
       

        img1.css({
            //'padding-right': '1%',
            "width": "100%",
            "height": "100%",
            //"max-width": "32%",
            //"float": "left",
            //'margin-bottom': '2px',
            //'margin-left': '0'
            'max-width': '100%',
            'max-height':'100%',
        }); //max : 49
        img1.attr('id', 'img1');
        
        var exploreTabText = $(document.createElement('div'));
        exploreTabText.addClass('explore-text');
        exploreTabText.css({
            //'left': '68%',
            'position': 'relative',
            'float':'right',
            'top': '8%',
            'margin-right': '3%',
            //'font-size': '200%',
        });
        var exploreTab = $(document.createElement('div'));
        exploreTab.addClass('explore-tab');
        exploreTab.css({
           //'border-width': '5px',// 0px', 
           //'border-style': 'solid', 
           // 'border-color': 'transparent', 
            'left': '0%', 
            //'width': '95%',
            //'height': '8%',
            'width': '100%',
            //'max-width':img1.width(),
            'height': '16%',
            'top':'84%',
            'color': 'white', 
            'overflow': 'hidden', 
            //'padding-top': '1.8%', 
            //'padding-bottom': '1.3%', 
            //'bottom':'2%',
            'display': 'none',
            'position': 'absolute',
            'background-color': 'rgba(0,0,0,0.4)',

        });

        //var fontSize = LADS.Util.getMaxFontSizeEM(exploreTabText, 1.5, w, 100);
        //exploreTab.css({ 'font-size': fontSize });

        exploreTabText.text("Explore");
        exploreTab.on('click', function () {
            if (artworkSelected) {
                switchPage();
            }
        });

        var exploreIcon=$(document.createElement('img'));
        exploreIcon.attr('src', 'images/icons/ExploreIcon.svg');
        exploreIcon.css({
            'width': 'auto',
            'position':'relative',
            //'left': '92%',
            //'float': 'left',
            float:'right',
            'height': '50%',
            'top': '25%',
            'margin-right': '32%'
        });
        exploreTab.append(exploreIcon);
        exploreTab.append(exploreTabText)
        

        contentdiv.append(imgDiv);
        imgDiv.append(img1);
        imgDiv.append(exploreTab);
        exploreTabText.css("font-size", LADS.Util.getMaxFontSizeEM("Explore", .5, .5 * exploreTab.width(), .7 * exploreTab.height(),0.1));

        img1.on('click', function () {//exploreTab
            if (artworkSelected) {
                switchPage();
            }
        });

        var moreInfo = $(document.createElement('div'));
        moreInfo.addClass('info-text');
        moreInfo.css({
            'float': 'left',
            'position': 'absolute',
            'display': 'inline-block',
            top:'100%',
            'left': '0',
            width:'100%',
        });
        artistInfo = $(document.createElement('div'));
        //artistInfo.addClass('info-text-artist');
        artistInfo.css({
            'float': 'left',
            'position': 'relative',
            'width': '70%',
            'white-space': 'nowrap',
                'text-overflow': 'ellipsis',
                'overflow': 'hidden',
                'color': 'white',
                'font-size': $(container).height() * 0.02 + 'px',

        });

        yearInfo = $(document.createElement('div'));
        //yearInfo.addClass('info-text-year');
        yearInfo.css({
            'float': 'right',
            'position': 'relative',
            width: '30%',//20%?
            'color': 'white',
            'text-align':'right',
            'font-size': $(container).height() * 0.02 + 'px',
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
        var w1 = h1 * 1.4;
        descriptiontext = $(document.createElement('div'));
        descriptiontext.addClass('description-text');
        descriptiontext.attr('id', 'description-text');

        descriptiontext.css({
            //"line-height": "100%",
            "height": "90%",
            'font-size': h1*0.055 + 'px',//1.5
            'color': 'white',
            'white-space': 'normal',
            'text-overflow': 'ellipsis',
            'word-wrap': 'break-word',
            "overflow-x": 'hidden',
            "overflow-y": 'auto',
           // 'margin-left': '5%',
            width: '55%',
            'position': 'absolute',
            'left':'45%',
            //height: '75%',
            //width: w1,
            //"overflow-x":"",
            
            'padding-right': '2%'
        });

        var str;
        if (exhibition.Metadata.Description)
            str = exhibition.Metadata.Description.replace(/\n\r?/g, '<br />');
        else
            str = "";
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

            if (numberOfTours == 0) {
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
            //$('.info-text').html("");
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
            if (infoSource[i]["keys"].indexOf(content) > -1) {
                matchedArts.push(currentArtworks[i]);
                //$('.titles')[i].style.background = 'rgba(255,255,51,0.6)';
            }
            else {
                unmatchedArts.push(currentArtworks[i]);
                //$('.titles')[i].style.background = 'rgba(0,0,0,0.5)';
            }
        }

        if (matchedArts.length > 0) searchTxt.text("Results Found");
        else searchTxt.text("No Matching Results");
        var numDrawn = drawTimeline(matchedArts, currentTag, 0, true);
        drawTimeline(unmatchedArts, currentTag, numDrawn, false);
        inSearch = false;
    }


    function makeTimeline() {
        timelineDivContainer = $(document.createElement("div"));
        timelineDivContainer.addClass('timelineDivContainer');
        timelineDivContainer.css({
            height: "42.5%",
            width: "100%",
            position: 'absolute',
            top: '51%',
        });

        root.append(timelineDivContainer);

        timelineDiv = $(document.createElement("div"));
        timelineDiv.css({
            height: "100%",
            top:'0%',//'0.5%',
            width: "100%",
            position: 'relative',
            'z-index': '49',
            'background-color': 'rgba(0,0,0,0.5)',
            'overflow-x': 'auto',
            'overflow-y':'hidden'

        });

        timelineDiv.scrollLeft();
        timelineDiv.addClass('timelineDiv');
        timelineDivContainer.append(row1);

        timelineDivContainer.append(timelineDiv);
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
        if (artworks == null) return;
        var sortedArtworks = sortTimeline(artworks, tag);
        //console.log("# of artworks: " + sortedArtworks.getContents().length);
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

        //while (currentWork !== null) {
        //    loadQueue.add(drawArtworkTile(currentWork, tag, onSearch, i, w, h));
        //    each = sortedArtworks.findNext(each);
        //    currentWork = (each) ? each.artwork : null;
        //    ++i;
        //}
        return works.length;
    }

    function drawArtworkTile(currentWork, tag, onSearch, i, w, h) {
        return function () {
            var main = $(document.createElement('div'));
            main.addClass("tile");
            main.css({
                height: h + "px",
                width: w + "px",
                position: 'absolute',
                'margin-left': parseInt(i / 2) * w * 1.03 + 10 + "px",
                'margin-top': (i % 2) * h * 1.05 + "px",
                'border': '1px solid black',
            });

            main.on('click', function () {
                if (img1.attr('guid') === currentWork.Identifier) {
                    switchPage();
                } else {
                    showArtwork(currentWork)();
                }
            });

            var iconCSS = ({
                'height': '250%',
                'width': 'auto',
                'opacity': '0.7',
                'z-index': '1000',
            });

            var tourLabel = $(document.createElement('img'));
            tourLabel.attr('src', 'images/icons/catalog_tour_icon.svg');
            tourLabel.css({
                         'position': "absolute",
                         "bottom": "0px",
                         "right": "5px",
                         //"background-color": "rgba(0,0,0,0.6)",
                         //"border-top-left-radius":"5px"   
                     });

            var videoLabel = $(document.createElement('img'));
            videoLabel.attr('src', 'images/icons/catalog_video_icon.svg');
            videoLabel.css({
                            'position': "absolute",
                            "bottom": "0px",
                            "right": "5px",
                            //"background-color": "rgba(0,0,0,0.6)",
                            //"border-top-left-radius":"5px"
                        });

            var image = $(document.createElement('img'));
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
            artTitle.addClass('artTitles');
            artTitle.css({
                'width': specs.width + 'px',
                'height': specs.height + 'px',
                "background-color": "rgba(0, 0, 0, 0.6)",
                'position': 'absolute',
                'opacity': '1.0',
            });


            // text div for artwork
            var artText = $(document.createElement('div'));
            artText.css({
                'font-size': ($(artTitle).height() * 0.55) + "px",
                'width': '95%',
                'margin': '0 auto',
                'text-align': 'center',
                'white-space': 'nowrap',
                'text-overflow': 'ellipsis',
                'overflow': 'hidden',
            });

            if (tag === 'Title') artText.text(LADS.Util.htmlEntityDecode(currentWork.Name));
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
        }
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
            .css('border', '1px solid white')
            .attr('guid', artwork.Identifier);
            var titleSpan = $(document.createElement('div'))
                            .text(LADS.Util.htmlEntityDecode(artwork.Name))
                            .css({
                                'font-size': ($(container).height() * 0.035) + "px",//0.025
                                'height': ($(container).height() * 0.08) + "px",
                                'margin-bottom': '15px',
                                //'white-space': 'pre-wrap',
                                'line-height': '100%',
                                'text-overflow': 'ellipsis',
                                "overflow-y": 'scroll',
                                "overflow-x": 'none',
                                //"word-wrap": 'break-word',
                            });
            var descSpan = $(document.createElement('div'))
                            .html(artwork.Metadata.Description ? artwork.Metadata.Description.replace(/\n/g, '<br />') : '');
            descSpan.css({
                'text-overflow': 'ellipsis',
                "word-wrap": 'break-word',
            });

            descriptiontext.empty();
            descriptiontext.append(titleSpan).append(descSpan);

            
        }
    }

    function sortTimeline(artworks, tag) {
        if (tag === 'Title') {
            var identical = 0;
            var comparator = function (a, b) {
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

            var valuation = function (value, compareToNode) {
                if (!compareToNode) {
                    return null;
                } else if (value < compareToNode.nameKey) {
                    return -1;
                } else if (value > compareToNode.nameKey) {
                    return 1;
                } else {
                    return 0;
                }
            }

            var avlTree = new AVLTree(comparator, valuation);
            avlTree.clear();
            for (var i = 0; i < artworks.length; i++) {
                var artNode = {
                    artwork: artworks[i],
                    nameKey: artworks[i].Name,
                }
                avlTree.add(artNode);
            }
            return avlTree;
        } else if (tag === 'Artist') {
            var identical = 0;
            var comparator = function (a, b) {
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

            var valuation = function (value, compareToNode) {
                if (!compareToNode) {
                    return null;
                } else if (value < compareToNode.artistKey) {
                    return -1;
                } else if (value > compareToNode.artistKey) {
                    return 1;
                } else {
                    return 0;
                }
            }

            var avlTree = new AVLTree(comparator, valuation);
            for (var i = 0; i < artworks.length; i++) {
                var artNode = {
                    artwork: artworks[i],
                    artistKey: artworks[i].Type === 'Empty' ? '~~~~' : artworks[i].Metadata.Artist
                }
                avlTree.add(artNode);
            }
            return avlTree;
        } else if (tag === 'Year') {
            var identical = 0;
            var comparator = function (a, b) {
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

            var valuation = function (value, compareToNode) {
                if (!compareToNode) {
                    return null;
                } else if (value < compareToNode.yearKey) {
                    return -1;
                } else if (value > compareToNode.yearKey) {
                    return 1;
                } else {
                    return 0;
                }
            }

            var avlTree = new AVLTree(comparator, valuation);
            for (var i = 0; i < artworks.length; i++) {
                var artNode = {
                    artwork: artworks[i],
                    yearKey: artworks[i].Type === 'Empty' ? '~~~~' : artworks[i].Metadata.Year
                }
                avlTree.add(artNode);
            }
            return avlTree;
        } else if (tag === 'Type') {
            var identical = 0;
            var comparator = function (a, b) {
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

            var valuation = function (value, compareToNode) {
                if (!compareToNode) {
                    return null;
                } else if (value < compareToNode.nameKey) {
                    return -1;
                } else if (value > compareToNode.nameKey) {
                    return 1;
                } else {
                    return 0;
                }
            }

            var avlTree = new AVLTree(comparator, valuation);
            for (var i = 0; i < artworks.length; i++) {
                var artNode = {
                    artwork: artworks[i],
                    nameKey: artworks[i].Name,
                    typeKey: artworks[i].Type === 'Empty' ? 1 : (artworks[i].Metadata.Type === 'Artwork' ? 2 : 3)
                }
                avlTree.add(artNode);
            }
            return avlTree;
        }
        else return null; // error case: should check 'tag'

        //console.log(avlTree.min().Name);
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
         rinPlayer = new LADS.Layout.TourPlayer(rinData, tour);//error here-in util, line 524

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
            //switchPageVideo(currentImage);
            var video = new LADS.Layout.VideoPlayer(currentImage, currExhibition);
            LADS.Util.UI.slidePageLeftSplit(root, video.getRoot());//have the page sliding to left and 
        }
        else {//if it's an image
            deepZoom = new LADS.Layout.Artmode("catalog", curOpts, currExhibition);
            LADS.Util.UI.slidePageLeftSplit(root, deepZoom.getRoot());//have the page sliding to left and 
            //var video = new LADS.Layout.VideoPlayer(currentImage, currExhibition);
            //LADS.Util.UI.slidePageLeftSplit(root, video.getRoot());//have the page sliding to left and 
        }
        root.css({ 'overflow-x': 'hidden' });
    }

    function initFeedback() {
        var feedbackContainer = $(document.createElement('div'));
        feedbackContainer.addClass('feedbackContainer');
        feedbackContainer.css({
            "width": "6%",
            "height": "auto",
            'bottom': '0%',
            'right': '1.5%',
            'position': "relative",
            'padding-top': '5.25%',
            'float': 'right',
            //'background-color': 'rgba(0,0,0,0.25)'
        });

        var feedbackIcon = $(document.createElement('img'));
        feedbackIcon.addClass('feedback-icon');
        feedbackIcon.attr('src', 'images/icons/FeedbackIcon.svg');
        feedbackIcon.css({
            'width': 'auto',
            'height': '38%',
            'position': 'absolute',
            //'left': '10%',
            'display': (!forSplitscreen && !LADS.Util.Splitscreen.on()) ? 'inline' : 'none',
            'top': '10%',//35%',
            'vertical-align': 'middle',
            'right': '5%'
        });

        var feedbackBox = LADS.Util.UI.FeedbackBox("Exhibition", getCurrentID);
        feedbackContainer.append(feedbackIcon);
        //feedbackContainer.append(feedback);
        root.append(feedbackBox);

        feedbackContainer.click(makeFeedback);
        function makeFeedback() {
            $(feedbackBox).css({ 'display': 'block' });
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