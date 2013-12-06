LADS.Util.makeNamespace("LADS.Layout.Catalog");

/*
*   The layout definition for Catalog. 
*   Author: Alex Hills
*/


//Constructor. Takes an exhibition. Options, tag should = currentSort.
//TODO: remove one of tag or currentSort
LADS.Layout.Catalog = function (exhibition, split, callback) {
    "use strict";

    //Lots of variables. Can probably remove some.
    var root, timeline,
        that = this,
        currentImage = null,
        timelineDiv,
        originmapDiv = null,
        map = null,
        originButton = null,
        artistButton = null,
        yearButton = null,
        titleButton = null,
        heatmapDiv = null,
        heatmapDivContainer = null,
        heatMap = null,
        row1 = null,
        selectedImage = null,
        sortSelector = null,
        originOption = null,
        titleOption = null,
        yearOption = null,
        artistOption = null,
        mapexpanded = null,
        sortContainer = null,
        timelineDivContainer = null,
        expandarrow = null,
        mapExpansionTime = 409,
        mapContractTime = 353,
        searchAndFilterContainer = null,//Contains the filter and search divs
        search = null,//search input element
        filterBox = null,//filter div;
        searchFilter = null,
        searchResultsDiv = null,
        filterLists = null,//never used!
        imageLoading = false,
        // options stuff
        options = LADS.Util.setToDefaults({}, LADS.Layout.Catalog.default_options),
        tag = options.tag,
        currentSort = options.currentSort;
    init();


    /*
    **Public function, will reload interactions that broke during animation for... no reason I can discern
    */
    this.loadInteraction = function () {
        timeline.setDisplayTag(options.tag);
    };
    /*
    **Creates initial structure of the page
    */
    function makeStructure() {
       
        root = $(document.createElement("div"));
        root.addClass('catalog root');
        root.css({
            width: "100%",
            height: "100%",
            position: "relative",
        });
        var overlay = $(document.createElement('div'));
        overlay.addClass('overlay');
        overlay.css({
            width: "100%",
            height: "100%",
            position: "absolute",
            'background-color': 'rgba(0,0,0,0.5)'
        });
        //create the background image
        var bgimage = $(document.createElement('div'));
        bgimage.addClass('bgimage');

        bgimage.css({
            width: '100%',//window.innerWidth + 'px',
            height: '100%',//window.innerHeight + 'px', 
            position: "absolute",
            'background-image': "url(" + LADS.Worktop.Database.fixPath(exhibition.Metadata.BackgroundImage) + ")",
            'background-position': "center",
            'background-size':"cover"
        });

        root.append(bgimage);
        root.append(overlay);
        //make the header, including the back button and the name of the exhibition
        (function makeHeader() {
            var header = $(document.createElement("div"));
            header.addClass('header');
            header.css({
                "position": "relative",
                "height": "8%",
                'overflow': 'hidden',
                'text-overflow': 'ellipsis',
            });

            var backButtonAreaLoading = $(document.createElement('div'));
            backButtonAreaLoading.css({
                "top": "25%",
                'left': '2%',
                "position": "absolute",
                'display': 'none'
            });
            var progressCircle = $(document.createElement('img'));
            progressCircle.attr('src', "images/icons/progress-circle.gif");
            progressCircle.css({ 'width': '5%', 'height': 'auto' });
            backButtonAreaLoading.append(progressCircle);

            header.append(backButtonAreaLoading);

            //left: 0px; top: 1%; width: 15%; height: 5%; position: absolute;
            var backButtonArea = $(document.createElement('div'));
            backButtonArea.css({
                'top': '0.5%',
                'left': '0px',
                'height': '1.1%',
                'width':'2.8%',
                'margin': '10px',
                'float': 'left',
                'position':'absolute'
            });
            var backButton = $(document.createElement('img'));
            backButton.attr('id', 'catalog-back-button');
            backButton.attr('src', 'images/icons/Back.svg');
            backButton.css({
                'width': '100%',
                'height': 'auto',
                'position': 'relative'
            });
            if (split === true) {
                backButton.css({ 'display': 'none' });
           }
            if (LADS.Util.Splitscreen.on()) {
                backButton.css({ 'display': 'none' });
            }
            //clicked effect
            backButton.mousedown(function () {
                LADS.Util.UI.cgBackColor("backButton", backButton, false);
            });

            backButton.mouseleave(function () {
                LADS.Util.UI.cgBackColor("backButton", backButton, true);
            });
            backButton.click(function () {
                backButton.off('click');
                if (!LADS.Util.Splitscreen.on()) { //disable going back to the exhibitions page if you are in splitscreen
                    var tempExhibitions = new LADS.Layout.Exhibitions(null, exhibitionHelper);
                    LADS.Util.UI.slidePageRightSplit(root, tempExhibitions.getRoot());
                }
                function exhibitionHelper(exhibitions) {
                    $(exhibitions).ready(function () {
                        exhibitions.clickExhibitionByDoq(exhibition);
                    });
                    root.css({ 'overflow-x': 'hidden' });
                }
            });
            backButtonArea.append(backButton);
            header.append(backButtonArea);
            var exhibitionTitle = $(document.createElement('label'));
            exhibitionTitle.text(exhibition.Name);
            exhibitionTitle.css({ 'white-space': 'nowrap', "font-size": "300%", 'width': '100%', 'text-align': 'center', 'position': 'absolute' });
            header.append(exhibitionTitle);
            root.append(header);
        })();

        // row1 (contains: map/search bar/dropdown menu)
        row1 = $(document.createElement('div'));
        row1.addClass('row1');
        row1.css({
            position: 'relative',
            top: '2%',
            width: '95%',
            height: '35%',
            left: '2.5%'
        });
        root.append(row1);

        //The search and filter begins here.
        search = $(document.createElement('input'));
        search.attr('id', 'inputField');

        search[0].value = "Keyword search";
        search.css({
            'max-height': '10%',
            'max-width': '15%', 
            'position': 'absolute',
            'right': '0px',
            'border-style': 'solid',
            'background-color': 'white',
            'border-color': 'rgb(167,180,174)',
            'border-width': '0.2em',
            'font-size': '1em',
            'color': 'rgb(120,128,119)',
            'z-index': '100'
        });
        searchResultsDiv = $(document.createElement('div'));
        searchResultsDiv.attr('id', 'backgroundSearch');
        searchResultsDiv.css({
            'position': 'absolute',
            'right': '0',
            'top': '0',
            'background-color': 'rgba(0,0,0,0.5)',
            'height': '100%',
            'visibility': 'hidden',
            'z-index': '0',
        });
        root.append(searchResultsDiv);

        filterBox = $(document.createElement('div'));//filter container

        filterBox.css({
            'max-height': '100%',//75 !important',???Why!???
            'min-height': '75%',
            'width': '23%',
            'padding': '1.1%',
            'position': 'absolute',
            'background-color': 'rgba(0,0,0,0.5)',
            'right': "22.7%",
            'color': 'white',
            'overflow-x': 'hidden',
            'overflow-y': 'scroll',
            'visibility': 'hidden'
        });
        filterBox.attr({
            id: 'filterContainer',
        });
        //keep this though we don't have a filter now
        /*
        filterLists = $(document.createElement('ul'));
        filterLists.attr('id', 'list_filters');
        filterLists.css({
            'padding-left': '0px',
            'margin': '3%',
            'z-index':'30'
        });
        */
        //filterBox.append(filterLists);
       searchAndFilterContainer = $(document.createElement('div'));//Container of both the filter and the search objct.
        searchAndFilterContainer.attr('id', 'searchFilter');

        searchAndFilterContainer.append(filterBox);
        searchAndFilterContainer.append(search);
        row1.append(searchAndFilterContainer);
        //have the search container hidden in splitscreen mode
        if (LADS.Util.Splitscreen.on() || split) {
            searchAndFilterContainer.hide();
        }

        //make the heat map
        (function makeHeatmap() {
            heatmapDivContainer = $(document.createElement("div"));
            heatmapDivContainer.css({
                height: "100%",
                width: "50%",
                position: 'relative',
                'z-index': '200',
                'background-color': 'rgba(0,0,0,0.5)',
                'overflow': 'hidden',
            });
            heatmapDivContainer.addClass('heatmapDivContainer');
            row1.append(heatmapDivContainer);

            //sort stuff
            var sortArea = $(document.createElement('div'));
            sortArea.addClass('sortArea');
            sortArea.css({
                "width": '96%',
                'margin-left': "2%",
                "margin-bottom": "1%",
                'padding-top': '1%',
                'position': 'relative',
                'overflow': 'hidden',
                'font-size': 'large',
            });

            originButton = $(document.createElement("div"));
            originButton.text("Origin").css({
                float: "left",
                "margin": "0 4%",
            });

            artistButton = $(document.createElement("div"));
            artistButton.text("Artist").css({
                float: "left",
                "margin": "0 4%",
            });

            titleButton = $(document.createElement("div"));
            titleButton.text("Title").css({
                float: "left",
                "margin": "0 4%",
            });

            yearButton = $(document.createElement("div"));
            yearButton.text("Year").css({
                float: "left",
                "margin": "0 4%",
            });

            //sortArea.append(originButton);
            sortArea.append(artistButton);
            sortArea.append(titleButton);
            sortArea.append(yearButton);
            heatmapDivContainer.append(sortArea);

            // Container for SVG
            heatmapDiv = $(document.createElement("div"));
            heatmapDiv.css({
                position: 'relative',
                height: "80%",
                width: "90%",
                'margin-left': '5%',
                'z-index': '49',
                'background-color': 'rgba(0,0,0,0.5)',
                'border-color': 'white',
                "border-style": "solid"
            });
            heatmapDiv.addClass('heatmapDiv');
            heatmapDivContainer.append(heatmapDiv);
            if (split || LADS.Util.Splitscreen.on()) {
                heatmapDiv.css('display', 'none');
                heatmapDivContainer.css({
                    'height': 'auto',
                });
            }
            
        })();

        //Map div for all maps
        (function makeMapDiv() {
            originmapDiv = $(document.createElement("div"));
            originmapDiv.addClass('originmapDiv');
            originmapDiv.attr('id', 'originmapDiv');
            originmapDiv.css({
                'margin-left': '5%',
                height: "80%",
                width: "90%",
                position: 'relative',
                'z-index': '49',
                "overflow": "hidden"
            });

            //the expanding arrow
            var expandarrowdiv = $(document.createElement('div'));
            expandarrowdiv.css({
                'position': 'absolute',
                'bottom': '0%',
                'right': '0%',
                'height': '30px',
                'width': '30px',
                'z-index': '100'
            });
            expandarrowdiv.addClass('expandarrowdiv');
            heatmapDivContainer.append(expandarrowdiv);
            if (split || LADS.Util.Splitscreen.on())
                expandarrowdiv.css('display', 'none');

            expandarrow = $(document.createElement('img'));
            expandarrow.attr('src', 'images/icons/MapExpand.jpg');
            expandarrow.css({
                'margin-top': '15%',
                'margin-left': '15%',
                'height': '85%',
                'width': '85%'
            });
            expandarrowdiv.append(expandarrow);


            mapexpanded = false;//set the map unexpanded as default

            expandarrowdiv.click(function () {

                if (!mapexpanded) {

                    if (selectedImage !== null) {//if there is already a selected artwork, have the artwork unexpanded when expanding the map
                        selectedImage.hide(600, function () { selectedImage.remove(); selectedImage = null; });
                        return;
                    }
                    row1.animate({
                        'height': '60%'
                    }, mapExpansionTime);

                    $('#filterContainer').css('visibility', 'hidden');

                    var expandedWidth = row1.width() * 0.8;

                    heatmapDivContainer.animate({
                        'height': '100%',
                        'width': '80%',

                    }, mapExpansionTime);

                    //expand originmap while expanding the div
                    var scale = expandedWidth / heatmapDivContainer.width();

                    expandarrow.attr('src', 'images/icons/MapMinimize.jpg');
                    mapexpanded = true;

                }
                else {
                    unexpandMap();
                    // ben most: Commenting this out since there are no filters currently
                    //$('#filterContainer').css('visibility', 'visible');
                }
            });

            heatmapDivContainer.append(originmapDiv);
            //originmapDiv.ready(makeOriginMap(originmapDiv));
        })();
 
        //make bing maps at the originmapDiv
        (function makeOriginMap() {
            Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: initMap });
            function initMap() {
                var mapOptions =
                {
                    credentials: "AkNHkEEn3eGC3msbfyjikl4yNwuy5Qt9oHKEnqh4BSqo5zGiMGOURNJALWUfhbmj",
                    mapTypeID: Microsoft.Maps.MapTypeId.road,
                    showScalebar: true,
                    enableClickableLogo: false,
                    enableSearchLogo: false,
                    showDashboard: false,
                    showMapTypeSelector: false,
                    zoom: 2,
                    center: new Microsoft.Maps.Location(20, 0),
                };
                var viewOptions = {
                    mapTypeId: Microsoft.Maps.MapTypeId.road,
                };

                map = new Microsoft.Maps.Map(originmapDiv[0], mapOptions);
                map.setView(viewOptions);

                //LADS.Worktop.Database.getArtworks(exhibition);
                //var alldoqs = exhibition.artworks;
                //var loclist = [];
                //for (var i = 0; i < alldoqs.length; i++) {

                //    var doq = alldoqs[i];
                //    var list = LADS.Util.UI.getLocationList(doq.Metadata);
                //    for(var j=0; j< list.length; j++){
                //        loclist.push(list[j]);
                //}
                //}
                //setTimeout(function () {
                //    LADS.Util.UI.drawPushpins(loclist, map);// pin the position of the artwork
                //}, 1);
               
            }
        })();

        //make search stuff
        (function makeSearch() {

            //div that holds dropdown menu
            sortContainer = $(document.createElement("div"));
            sortContainer.addClass('sortContainer');
            sortContainer.css({
                position: 'absolute',
                height: "36px",
                width: "15%",
                top: "50px",
                float: "right",
                right: "0%"
            });

            //dropdown menu
            sortSelector = $(document.createElement("select"));
            sortSelector.addClass('sortSelector');
            sortSelector.css({ color: "white", "border": "solid 3xp rgba(255,255,255,1)", width: "100%", height: "100%", "background-color": 'rgba(0,0,0,0.5)' });

            //menu options
            originOption = $(document.createElement("option"));
            originOption.text("Origin").css({ color: "white", "border-color": "rgba(0,0,0,0.5)", overflow: "hidden", background: "no-repeat scroll", "background-color": 'rgba(0,0,0,0.5)' });
            originOption.value = "Origin";
            titleOption = $(document.createElement("option"));
            titleOption.text("Title").css({ color: "white", "border-color": "rgba(0,0,0,0.5)", overflow: "hidden", background: "no-repeat scroll", "background-color": 'rgba(0,0,0,0.5)' });
            titleOption.value = "Title";
            artistOption = $(document.createElement("option"));
            artistOption.text("Artist").css({ color: "white", "border-color": "rgba(0,0,0,0.5)", overflow: "hidden", background: "no-repeat scroll", "background-color": 'rgba(0,0,0,0.5)' });
            artistOption.value = "Artist";
            yearOption = $(document.createElement("option"));
            yearOption.text("Year").css({ color: "white", "border-color": "rgba(0,0,0,0.5)", overflow: "hidden", background: "no-repeat scroll", "background-color": 'rgba(0,0,0,0.5)' });
            yearOption.value = "Year";

            //sortSelector.append(originOption);
            sortSelector.append(yearOption);
            sortSelector.append(artistOption);
            sortSelector.append(titleOption);

            sortContainer.append(sortSelector);
            //row1.append(sortContainer);
        })();

        //make the timeline divs to contain the artworks
        (function makeTimeline() {
            timelineDivContainer = $(document.createElement("div"));
            timelineDivContainer.css({
                height: "40%",
                width: "100%",
                position: 'absolute',
                top: '50%'
            });
            timelineDivContainer.addClass('timelineDivContainer');
            root.append(timelineDivContainer);

            timelineDiv = $(document.createElement("div"));
            timelineDiv.css({
                height: "100%",
                width: "100%",
                padding: '10px',
                position: 'relative',
                'z-index': '49',
                'background-color': 'rgba(0,0,0,0.5)'
            });
            timelineDiv.addClass('timelineDiv');
            timelineDivContainer.append(timelineDiv);
        })();
    }

    /*
    **Will flip to artmode with currently selected artwork. 
    */
    function switchPage() {
        if (!currentImage) return;//do nothing when there is no artwork in this catalog
        var curOpts, deepZoom, splitopts,
            opts = that.getState();
        //check the splitscreen states.
        if (root.parent().attr('id') === 'metascreen-R') {
            splitopts = 'R';
        } else {
            splitopts = 'L';
        }
        curOpts = { catalogState: opts, doq: currentImage, split: splitopts, };
        deepZoom = new LADS.Layout.Artmode("catalog", curOpts, exhibition);
        
        root.css({ 'overflow-x': 'hidden' });
        LADS.Util.UI.slidePageLeftSplit(root,deepZoom.getRoot());//have the page sliding to left and change to artmode animation.
    }

    /*
    **Changes the tag to a different one, and re-sorts.
    **@para:tag, which indicates how to arrange the artworks
    */
    function changeDisplayTag(tag) {
        timeline.setDisplayTag(tag);
        heatMap.setDisplayTag(tag);
        //timeline.sortTimeline(tag);
        handleSelectTags(tag);
        currentSort = tag;
        if (selectedImage) {
            unexpandedArtwork(selectedImage);
            selectedImage = null;
        }
    }

    /**
    *unexpand a selected image.
    *@param: the selected image
    */
    function unexpandedArtwork(selectedImage) {
        if (selectedImage) {
            switch (selectedImage.loc) {
                case '11': //left-top
                    selectedImage.animate({ height: "0", width: "0", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                    break;
                case '21': //right-top
                    selectedImage.animate({ height: "0", width: "0", left: selectedImage.left - timelineDiv.offset().left + "px", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                    break;
                case '12': //left-bot
                    selectedImage.animate({ height: "0", width: "0", top: timelineDiv.height() + "px", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                    break;
                case '22': //right-bot
                    selectedImage.animate({ height: "0", width: "0", top: timelineDiv.height() + "px", left: selectedImage.left - timelineDiv.offset().left + "px", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                    break;
            }
        }
    }

    /*
    **Initiate the arrangement of artworks 
    **@para:tag, the options.
    **Note:think about a better hack
    */
    function correctOptions(tag) {
        sortSelector.empty();
        sortSelector[0].onchange = function () {
            changeDisplayTag(sortSelector.val());
        };
        //make sure the text change back when user change the option.
        originOption.text("Origin");
        titleOption.text("Title");
        artistOption.text("Artist");
        yearOption.text("Year");
        //terrible hack so that the list always appears to be a dropdown
        switch (tag) {
            case "Origin":
                originOption.text("Browse by Origin");
                //sortSelector.append(originOption);
                sortSelector.append(artistOption);
                sortSelector.append(titleOption);
                sortSelector.append(yearOption);
                break;
            case "Year":
                yearOption.text("Browse by Year");
                sortSelector.append(yearOption);
                sortSelector.append(artistOption);
                sortSelector.append(titleOption);
                //sortSelector.append(originOption);
                break;
            case "Title":
                titleOption.text("Browse by Title");
                sortSelector.append(titleOption);
                sortSelector.append(artistOption);
                sortSelector.append(yearOption);
                //sortSelector.append(originOption);
                break;
            case "Artist":
                artistOption.text("Browse by Artist");
                sortSelector.append(artistOption);
                sortSelector.append(titleOption);
                sortSelector.append(yearOption);
                //sortSelector.append(originOption);
                break;
        }
        sortSelector.val("Browse by " + tag);
    }


    /*
    **make the changes on tags when selection is changed
    */
    function handleSelectTags(tag) {
        //unselected tags are gray
        originButton.css("color", "gray");
        artistButton.css("color", "gray");
        titleButton.css("color", "gray");
        yearButton.css("color", "gray");
        //sync the options.
        correctOptions(tag);

        //if (tag == "Origin") {//if the tag is Origin, hide the heatMap and show the origin map.
        //    heatmapDiv.hide();
        //    originmapDiv.show();ddfdfdefefe
        //}
        //else {//Or have the heatmap shown, and not expanded.
            originmapDiv.hide();
        //    heatmapDiv.show();
        //}
        //set the selected tag color as white.
        switch (tag) {

            case "Origin":
                originButton.css("color", "white");
                break;
            case "Artist":
                artistButton.css("color", "white");
                break;
            case "Title":
                titleButton.css("color", "white");
                break;
            case "Year":
                yearButton.css("color", "white");
                break;
        }
    }

    /*
    **creates the timeline
    */

    function testTimeline(artworks) {
        //adding map so timeline can interact with it
        timeline = new LADS.Catalog.Timeline(exhibition, $(timelineDiv)[0], that, artworks);
        timeline.setDisplayTag(tag);
        timeline.sortTimeline(currentSort);
        handleSelectTags(tag);
        timeline.addPickedHandler(artPicked);

        //change the display when one of the tag is clicked. 
        originButton.click(function () {
            changeDisplayTag("Origin");
            
        });
        artistButton.click(function () {
            changeDisplayTag("Artist");
           
        });
        titleButton.click(function () {
            changeDisplayTag("Title");
            
        });
        yearButton.click(function () {
            changeDisplayTag("Year");
        });
        //initiate the heat Map
        heatMap = new LADS.Catalog.HeatMap(heatmapDiv,artworks);
        heatMap.addPickedHandler(function (evt) {
            timeline.showFirstDocument(evt.value);//show the collection.
        });
        //have the current selected artwork unexpanded/selected when elsewhere is clicked
        $(root).mousedown(function (e) {
            if (split === true && selectedImage && timelineDivContainer.has(e.target).length === 0) {
                switch (selectedImage.loc) {
                    case ('11'): //left-top
                        selectedImage.animate({ height: "0", width: "0", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                        break;
                    case ('21'): //right-top
                        selectedImage.animate({ height: "0", width: "0", left: selectedImage.left - ($(window).width() - root.width()) + "px", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                        break;
                    case ('12'): //left-bot
                        selectedImage.animate({ height: "0", width: "0", top: timelineDiv.height() + "px", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                        break;
                    case ('22'): //right-bot
                        selectedImage.animate({ height: "0", width: "0", top: timelineDiv.height() + "px", left: selectedImage.left - ($(window).width() - root.width()) + "px", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                        break;
                }
                return;
            }
            else if (selectedImage && timelineDivContainer.has(e.target).length === 0) {
                switch (selectedImage.loc) {
                    case ('11'): //left-top
                        selectedImage.animate({ height: "0", width: "0", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                        break;
                    case ('21'): //right-top
                        selectedImage.animate({ height: "0", width: "0", left: selectedImage.left + "px", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                        break;
                    case ('12'): //left-bot
                        selectedImage.animate({ height: "0", width: "0", top: timelineDiv.height() + "px", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                        break;
                    case ('22'): //right-bot
                        selectedImage.animate({ height: "0", width: "0", top: timelineDiv.height() + "px", left: selectedImage.left + "px", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                        break;
                }
                return;
            }
        });            
    }
    /*
    **Instantiates a new instance of LADS.Catalog.SearchAndFilter that give the searchbar all of its functionality.
    */
    function testSearchFilter(artworks) {
        searchFilter = new LADS.Catalog.SearchAndFilter(
            searchAndFilterContainer, artworks, timeline,
            search, filterBox);
    }

    /*
    **Occurs when an artwork is selected
    */
    function artPicked(data) {
        if (imageLoading) {
            return;
        }
        //unselected the current artwork when other artwork is selected
        if (selectedImage) {
            switch (selectedImage.loc) {
                case ('11'): //left-top
                    selectedImage.animate({ height: "0", width: "0", opacity: "0" }, 600, function () {selectedImage && selectedImage.remove(); selectedImage = null; });
                    break;
                case ('21'): //right-top
                    selectedImage.animate({ height: "0", width: "0", left: selectedImage.left + "px", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                    break;
                case ('12'): //left-bot
                    selectedImage.animate({ height: "0", width: "0", top: timelineDiv.height() + "px", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                    break;
                case ('22'): //right-bot
                    selectedImage.animate({ height: "0", width: "0", top: timelineDiv.height() + "px", left: selectedImage.left + "px", opacity: "0" }, 600, function () { selectedImage && selectedImage.remove(); selectedImage = null; });
                    break;
            }
            return;
        }

        unexpandMap();//unexpand the map when an artwork is selected
        
        var doq = data.doq;
        var element = data.element;

        currentImage = doq;

        //make location pushpins show up on map
        var locationList = LADS.Util.UI.getLocationList(doq.Metadata);
        if (map) {
            LADS.Util.UI.drawPushpins(locationList, map);//if the map is origin, pin the position of the artwork
        }
        //position values of the selected artwork and timeline div
        var pos = $(element).offset();
        var pos2 = timelineDiv.offset();

        var top = pos.top - pos2.top;
        var left = pos.left;
        
        var d = document.createElement('div');
        var imageInfo = $(d);

        var width = timeline.getArtWid();
        //imageInfo is the div that contains the whole artwork
        imageInfo.css({ width: width, "height": "60%", "background-color": 'rgba(16,14,12,0)', top: top + 300 + "px", left: pos.left + "px", position: "absolute", 'z-index': '50', overflow: "hidden" });
        imageInfo.addClass('imageInfo');
        //add the artwork as img to imageInfo
        var imageElementDiv = $(document.createElement('div'));
        imageElementDiv.css({ width: '100%', height: '78.4%' });       

        var imageElement = $(document.createElement('img'));
        imageElement.addClass('imageElement');
        imageElement.attr('src', LADS.Worktop.Database.fixPath(doq.URL));
       
        //have a loading circle when the image is not loaded
        var progressCircCSS = { "position": 'absolute', 'z-index':'50', 'height': 'auto', 'width': '5%'};
        var circle = LADS.Util.showProgressCircle(timelineDiv, progressCircCSS, left + width / 2 + timelineDiv.scrollLeft(), top + 0.48 * timelineDiv.height() / 2, true);
        var newleft = left + timelineDiv.scrollLeft();//2000;//parseFloat($(element).parent().attr('x'));
        imageLoading = true;
        imageElement.load(function () {
            finishExpandingImage(imageElement, imageInfo, doq, width, newleft, top);
            LADS.Util.removeProgressCircle(circle);
            imageLoading = false;
        }); //image won't expand until it is loaded
        imageElement.error(function () { imageLoading = false; LADS.Util.removeProgressCircle(circle); });

    }
    /*
    **handles a series of operations including artwork information label/div and auto scrolling to show the whole image 
    **after the selected artwork has finished expanding. 
    **@para:the selected artwork, the div that contains the artwork, data.doq, width of the artwork, and left and top of imageInfo div
    */
    function finishExpandingImage(imageElement, imageInfo, doq, width, left, top) {
        
        var imWidth,//the width of image
            imHeight,//the height of the image
            panDir;//panning direction. 

        if (imageElement.height() / imageElement.width() > 3/4) { //tall image 
            imWidth = timeline.getArtWid() * 2 + 5;
            imHeight = imWidth / imageElement.width() * imageElement.height();
            imWidth += 'px';
            panDir = -2;
        }

        else { //long image
            imHeight = 0.4 * root.height();
            imWidth = imHeight / imageElement.height() * imageElement.width();
            imHeight += 'px';
            panDir = 1;
        }

        imageElement.css({ 'height': imHeight, 'width': imWidth });
        //resize the image
        if (imageElement.height() < 0.4 * root.height()) {
            imageElement.css({ 'height': 0.4 * root.height(), width: imWidth });
        }
        if (imageElement.width() < timeline.getArtWid() * 2 + 5) {//it seems like +5 makes no differences.
            imageElement.css({ 'height': imHeight, width: timeline.getArtWid() * 2 + 5 });
        }
        imageInfo.append(imageElement);

        //show the information about the selected artwork
        var imageTextHolder = $(document.createElement('div'));
        imageTextHolder.css({width:"100%", height:"21.6%", top:"78.4%",position: 'absolute', 'background-color': 'rgba(16,14,12,.5)' });

        imageInfo.append(imageTextHolder);

        var imageText = $(document.createElement('div'));
        imageText.addClass('imageText');
        imageText.css({
            'position': 'absolute',
            'left': '3%',
            'top':'7%',
            'font-size': '100%',
            'color': 'white',
            'width': "60%",
            'overflow-y': 'hidden',
            'overflow-x': 'auto',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'height': '116%',
            'float': 'left'
        });
        imageText.html('Artist: ' + doq.Metadata.Artist + "<br/>Title: " + doq.Name +
        "<br/>Year: " + doq.Metadata.Year);
        imageTextHolder.append(imageText);
        //LADS.Util.fitText(imageText, 1.7);

        //switch the page when the button is clicked
        var fullScreenButton = $(document.createElement("div"));
         
        var viewScreenLabel = $(document.createElement("label"));
        viewScreenLabel.text('View Artwork');
        viewScreenLabel.css({
            'font-weight':'bold'
        });
        fullScreenButton.append(viewScreenLabel);

        var fullScreenIcon = $(document.createElement("img"));
        fullScreenIcon.attr('src', 'images/icons/fullscreen.png');
        fullScreenIcon.css({ "width": '25%', 'height': '60%', 'top': '20%', 'left': '10%', 'position': "relative" }); //width : 60%
        fullScreenIcon.addClass('fullScreenIcon');
        fullScreenButton.append(fullScreenIcon);
        fullScreenButton.addClass('fullScreenButton');
        fullScreenButton.css({ 'right': '0%', height: "21.6%",'position':"absolute","width":"35%","bottom":"0%" });
        fullScreenButton[0].onmousedown = function () { $(fullScreenIcon).css({ 'background-color': 'gray', 'border-radius': '999px' });};
        fullScreenButton[0].onclick = switchPage;
        imageInfo.append(fullScreenButton);
        selectedImage = imageInfo;
        //unexpand the image when the image is clicked.
        imageInfo.click(function () {
            unexpandedArtwork(selectedImage);
            selectedImage = null;
        });

        //set the image location 
        var rootWidth = root.width();
        var endWidth = width * 2 + 5;
        var infoLeft = rootWidth / 2 - endWidth / 2; //old alignment for image left
        var center = timelineDiv.width() / 2 + timelineDiv.offset().left;

        imageInfo.left = left + width;
        imageInfo.loc = '1';//loc will contain two digits, the first digit: 1 is left, 2 is right, second digit:top is 1, bottom is 2
        //if the image is on the right side of the timeline, set as 2
        if (split !== true) {
            if (left + (endWidth / 2) - timelineDiv.scrollLeft() > $(window).width() / 2) {
                imageInfo.loc = '2';
            }
        }
        
        
        timelineDiv.append(imageInfo);

        //set the top of the imageInfo, also,have the loc's top/bottom digit set.
        var extraleft;
        if (split === true) {
            var newleft = left - ($(window).width() - rootWidth);
            if ((newleft + (endWidth / 2) - timelineDiv.scrollLeft() > rootWidth / 2) && newleft-timelineDiv.scrollLeft() > endWidth) {
                imageInfo.loc = '2';
            }
            //expand div........according to the position
            if (timelineDiv.height() - top < timelineDiv.height() / 2) { //bottom row
                imageInfo.css({
                    top: top+ "px",
                    left: newleft + 'px'
                });
                if (imageInfo.loc === '1') {
                    imageInfo.animate({ top: 10 + "px", "height": timelineDiv.height() / 2 + timelineDiv.height() * 0.48 + 'px', "width": endWidth + 'px', left: newleft + "px" }, 600); //10 is the padding on the timelineDiv
                }
                else {
                    imageInfo.animate({ top: 10 + "px", "height": timelineDiv.height() / 2 + timelineDiv.height() * 0.48 + 'px', "width": endWidth + 'px', left: newleft - endWidth / 2 + "px" }, 600); //10 is the padding on the timelineDiv
                }
                imageInfo.loc += '2';
            }
            else { //top row
                imageInfo.css({
                    top: top + "px",
                    left: newleft + 'px'
                });
                if (imageInfo.loc === '1') {
                    imageInfo.animate({ top: top + "px", "height": timelineDiv.height() / 2 + timelineDiv.height() * 0.48 + "px", "width": endWidth + 'px', left: newleft + "px" }, 600);
                }
                else {
                    imageInfo.animate({ top: top + "px", "height": timelineDiv.height() / 2 + timelineDiv.height() * 0.48 + "px", "width": endWidth + 'px', left: newleft - endWidth / 2 + "px" }, 600);
                }
                imageInfo.loc += '1';
            }
            //TODO: check if the div is out of screen in split mode
            //make sure the imageInfo will not go out of the screen            
            if (imageInfo.position().left > rootWidth - endWidth) {
                extraleft = imageInfo.position().left + endWidth - rootWidth;
                timelineDiv.animate({ scrollLeft: timelineDiv.scrollLeft() + extraleft - endWidth / 3 + "px" });
                imageInfo.css({ left: imageInfo.position().left - extraleft + 'px' });
            }
            else if (imageInfo.position().left < 0) {
                extraleft = -imageInfo.position().left;
                timelineDiv.animate({ scrollLeft: timelineDiv.scrollLeft() - endWidth / 6 - extraleft + "px" });
                imageInfo.css({ left: imageInfo.position().left + extraleft + 'px' });
            }
        }
            //make sure the imageInfo will not go out of the screen
        else {//normal mode 
            if (timelineDiv.height() - top < timelineDiv.height() / 2) { //bottom row
                imageInfo.css({
                    top: top + "px",
                    left: left + 'px'
                });
                if (imageInfo.loc === '1') {
                    imageInfo.animate({ top: 10 + "px", "height": timelineDiv.height() / 2 + timelineDiv.height() * 0.48 + 'px', "width": endWidth + 'px', left: left + "px" }, 600); //10 is the padding on the timelineDiv
                }
                else {
                    imageInfo.animate({ top: 10 + "px", "height": timelineDiv.height() / 2 + timelineDiv.height() * 0.48 + 'px', "width": endWidth + 'px', left: left - endWidth / 2 - 2.5 + "px" }, 600); //10 is the padding on the timelineDiv
                }
                imageInfo.loc += '2';
            }
            else { //top row
                imageInfo.css({
                    top: top + "px",
                    left: left + 'px'
                });
                if (imageInfo.loc === '1') {
                    imageInfo.animate({ top: top + "px", "height": timelineDiv.height() / 2 + timelineDiv.height() * 0.48 + "px", "width": endWidth + 'px', left: left + "px" }, 600);
                }
                else {
                    imageInfo.animate({ top: top + "px", "height": timelineDiv.height() / 2 + timelineDiv.height() * 0.48 + "px", "width": endWidth + 'px', left: left - endWidth / 2-2.5 + "px" }, 600);
                }
                imageInfo.loc += '1';
            }
            if(imageInfo.position().left > rootWidth - endWidth) {
                extraleft = imageInfo.position().left + endWidth - rootWidth;
                timelineDiv.animate({ scrollLeft: timelineDiv.scrollLeft()+extraleft-endWidth/3+"px" });
                imageInfo.css({ left: left- extraleft + 'px' });
            }
            else if (left-timelineDiv.scrollLeft() <0) {
                extraleft = -imageInfo.position().left ;
                timelineDiv.animate({ scrollLeft: timelineDiv.scrollLeft() -endWidth/6- extraleft + "px" });
                imageInfo.css({ left: imageInfo.position().left + extraleft + 'px' });
            }
        } 
        //this is for panning the image, b/c imageInfo div will only show part of the image. 
        var panMar;//the total moving distance of the image.
        if (panDir == 1 || panDir == -1) {//1 is right, and -1 is left
            panMar = -imageElement.width() + endWidth;

            //if the image's width is smaller than the imageInfo div's width, no need to pan
            if (imageElement.width() < imageInfo.width) {
                //don't pan
                return;
            }
        }

        else {
            panMar = -imageElement.height() + 0.4 * root.height();
            //if the image's height is smaller than the imageInfo div's height, no need to pan
            if (imageElement.height() < imageInfo.height) {
                //don't pan
                return;
            }
        }

        var animTime = -5.5 * panMar;
        panImage(imageElement, panDir, panMar, animTime);
    }

    /*
    **pan image after it is selected   dir: 1 = right, -1 = left, 2 = up, -2 = down
    **@para: panning image, the diretion to pan the image, the distance, and the animation time
    */
    function panImage(imToPan, dir, panMar, animTime) {
        if (!imToPan) {//no need to pan if there is no image
            return;
        }
        setTimeout(function () {

            if (dir == 1) {
                imToPan.animate({ marginLeft: panMar + "px" }, animTime, "linear", function () { panImage(imToPan, -1 * dir, panMar, animTime); });
            }

            else if (dir == -1) {
                imToPan.animate({ marginLeft: 0 + "px" }, animTime, "linear", function () { panImage(imToPan, -1 * dir, panMar, animTime); });
            }

            else if (dir == -2) {
                imToPan.animate({ marginTop: panMar + "px" }, animTime, "linear", function () { panImage(imToPan, -1 * dir, panMar, animTime); });
            }

            else {
                imToPan.animate({ marginTop: 0 + "px" }, animTime, "linear", function () { panImage(imToPan, -1 * dir, panMar, animTime); });
            } 
        }, 1750);
    }

    /*
    **shrink expanded map back to original dimensions
    */
    function unexpandMap() {
        if (mapexpanded) {
            row1.animate({
                height: '35%'
            }, mapContractTime);
            var contractedWidth = row1.width() * 0.5;
            heatmapDivContainer.animate({
                width: '50%'
            }, mapContractTime);

            //expand originmap while expanding the div
            var scale = contractedWidth / heatmapDivContainer.width();

            expandarrow.attr('src', 'images/icons/MapExpand.jpg');
            mapexpanded = false;

        }
    }

    this.getRoot = function () {
        return root;
    };

    /* 
    **Set the state of the catalog/timeline with a state object: {currentSort, exhibition, tag, currentImage} 
    */
    this.setState = function (state) {
        exhibition = state.exhibition;
        changeDisplayTag(state.currentSort);
    };
    /*
    **@return the states of the catalog/timeline.
    */
    this.getState = function () {
        return {
            currentSort: currentSort,
            exhibition: exhibition,
            tag: currentSort,
            currentImage: currentImage
        };
    };
    /*
    **have everything initiated! Yo~
    */
    function init() {
        makeStructure();
        $(document).ready(function (e) {
            // Needs to be rewritten to properly handle async
            LADS.Worktop.Database.getArtworksIn(exhibition.Identifier, function (artworks) {
                testTimeline(artworks);
                testSearchFilter(artworks);
                callback && callback(that);
            }, null);
            //since we don't have a filter now, not sure what to do with this. Keep it for now
            /*var loadedInterval = setInterval(function () {
                if (LADS.Util.elementInDocument($(filterBox))) {
                    //searchFilter.setFilterObjects(exhibition['setSearch']);//Work here and wherever you have (exhibition['setSearch']) for the coming back and forth
                    //exhibition['setSearch'] = null;
                    clearInterval(loadedInterval);
                }
            });*/
        });
    }

};

LADS.Layout.Catalog.default_options = {
    //cannot start with origin since DOM element has to be on the document
    //before bing maps can be loaded
    tag: "Title",
    currentSort:"Title"
};