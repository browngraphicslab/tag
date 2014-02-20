LADS.Util.makeNamespace("LADS.Layout.Exhibitions");

LADS.Layout.Exhibitions = function (options, exhibitionCallback) {
    "use strict";

    options = LADS.Util.setToDefaults(options, LADS.Layout.Exhibitions.default_options);
    var root, leftbar, displayarea, exhibitarea, currentfolder, currentExhElements, leftbarHeader, exhibitionLabel, toursLabel, selectText, exhibitionSpan, toursSpan, loadingArea,
        titlediv = null,
        sub1 = null,
        sub2 = null,
        switching = false,//boolean for switching the page
        exhibitelements = [], // this is shared between exhibitions and tours
        exhibTabSelected = true, //which tab is selected at the top (true for exhib, false for tour)
        firstLoad = true;
    var bgimage = $(document.createElement('div'));
    var currExhibition = null;
    var currTour = null;
    var relatedTours = []; // Object to store associated tours
    var numberOfTours;

    var that = {
        getRoot: getRoot,
        clickExhibition: clickExhibition,
        clickExhibitionByDoq: clickExhibitionByDoq,
        clickTourByDoq: clickTourByDoq,
        selectTourTab: selectTourTab,
        loadExhibit: loadExhibit,
    };

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
            'background-size': "cover"
        });
        bgimage.attr('id', 'bgimage');

        // Sidebar
        leftbar = $(document.createElement('div'));
        leftbar.addClass('leftbar');
        leftbar.css({
            width: "25%", height: "100%",
            position: "absolute",
            "background-color": "rgba(0,0,0,0.7)"
        });

        // Header w/ back-button, exhibit, tour selectors
        leftbarHeader = $(document.createElement('div'));
        leftbarHeader.addClass('leftbar-header');
        leftbarHeader.css({
            width: '100%',
            height: '5%',
            'margin-bottom': '4.5%',
            'padding-left': '60px',
            'overflow': 'hide',
            // 'padding-top': '2%'
        });
        leftbar.append(leftbarHeader);

        // Back button/overlay area
        var backbuttonArea = $(document.createElement('div'));
        backbuttonArea.addClass('backbuttonArea');
        backbuttonArea.css({
            'left': '2.5%',
            'top': '0%',
            'position': 'absolute',
            'width': '15%',
            'height': '5%',
        });
        leftbarHeader.append(backbuttonArea);

        var backbuttonIcon = $(document.createElement('img'));
        backbuttonIcon.attr('src', 'images/icons/Back.svg');
        backbuttonIcon.css({
            'width': '73.5%',
            'height': 'auto',
            'top': '28%',
            'position': 'relative',
            'display': 'block'
        });

        //wen
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

        // Labels (Exhibition, Tours)
        exhibitionLabel = $(document.createElement('div'));
        exhibitionLabel.attr('id', 'exhibition-label');
        exhibitionLabel.css({
            //'font-size': '2em',
            'text-align': 'center',
            'left': "18%",
            'height': '7%',
            'top': "1%",
            'position': 'absolute',
            'width': '45%',
            'margin-left': '1.22%',
        });

        exhibitionSpan = $(document.createElement('span'));
        var fontSize = LADS.Util.getMaxFontSizeEM('Exhibitions', 1, $(window).width() * 0.1, 1000);
        exhibitionSpan.css({
            'font-size': fontSize,
        });
        exhibitionSpan.text("Exhibitions");
        //LADS.Util.fitText(exhibitionLabel, 0.5);
        exhibitionLabel.append(exhibitionSpan);
        leftbarHeader.append(exhibitionLabel);

        //have exhibition mode selected
        exhibitionSpan.mousedown(function () {
            $(this).css({ 'color': 'white' });
            toursSpan.css({ 'color': 'gray' });
        });

        toursLabel = $(document.createElement('div'));
        toursLabel.attr('id', 'tours-label');
        toursLabel.css({
            //'font-size': '2em',
            top: '1%',
            height: '7%',
            left: '55.5%',
            'text-align': 'center',
            position: 'absolute',
            color: 'rgb(85,85,85)',
            width: '25%',
            'margin-left': '1.2%',
        });

        toursSpan = $(document.createElement('span'));
        toursSpan.css({
            'font-size': fontSize,
        });
        toursSpan.text("Tours");
        //LADS.Util.fitText(toursLabel, 0.5);
        toursLabel.append(toursSpan);
        leftbarHeader.append(toursLabel);
        toursSpan.mousedown(function () {
            toursSpan.css({ 'color': 'white' });
            exhibitionSpan.css({ 'color': 'gray' });
        });

        // Buttons for sidebar to select Exhibitions
        exhibitarea = $(document.createElement('div'));
        exhibitarea.css({ width: "100%", height: "92%", 'margin-top': '4%', 'overflow': 'auto' });
        leftbar.append(exhibitarea);

        //initiates feedback, currently commented out.
        var feedbackContainer = initFeedback();
        leftbar.append(feedbackContainer);

        // Main display area
        displayarea = $(document.createElement('div'));
        displayarea.css({
            width: "75%", height: "100%",
            "left": "25%",
            position: "absolute",
        });
        displayarea.addClass('displayarea');

        // Initial text displayed in display area
        var displayHelp = $(document.createElement('div'));
        displayHelp.addClass('displayHelp');
        displayHelp.css({
            position: 'relative',
            left: "0%",
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
            'padding-top': '25%',
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
            LADS.Worktop.Database.getTours(getAllToursHelper, null, getAllToursHelper);

            function getAllToursHelper(tours) {
                root.append(bgimage);
                root.append(overlay);

                //append everything in callback
                root.append(leftbar);
                root.append(displayarea);

                //click funtions for Exhibitions and Tours tabs
                exhibitionSpan.click(function () {
                    var gotFirst = false,
                        firstIndex = 0;
                    if (!exhibTabSelected) {
                        exhibTabSelected = true;
                        exhibitarea.empty();
                        exhibitelements = [];
                        if (exhibitionsLocal[0]) {
                            $.each(exhibitionsLocal, function (i, e) {
                                var privateState;
                                if (e.Metadata.Private) {
                                    privateState = (/^true$/i).test(e.Metadata.Private);
                                } else {
                                    privateState = false;
                                }
                                if (!privateState) {
                                    if (!gotFirst) {
                                        firstIndex = i;
                                    }
                                    addExhibit(e);
                                    gotFirst = true;
                                }
                            });
                            if (currExhibition === null) {
                                clickExhibition(0);//have the first exhibition selected
                            }
                            else {
                                clickExhibitionByDoq(currExhibition);
                            }
                        }
                        toursLabel.css('color', 'rgb(85,85,85)');
                        exhibitionLabel.css('color', 'white');
                    }
                });

                toursSpan.click(function () {
                    var gotFirst = false,
                        firstIndex = 0;
                    if (exhibTabSelected) {
                        exhibTabSelected = false;
                        exhibitarea.empty();
                        exhibitelements = [];
                        if (tours[0]) {
                            $.each(tours, function (i, e) {
                                var privateState;
                                if (e.Metadata.Private) {
                                    privateState = (/^true$/i).test(e.Metadata.Private);
                                } else {
                                    privateState = false;
                                }
                                if (!privateState) {
                                    if (!gotFirst) {
                                        firstIndex = i;
                                    }
                                    addTour(e, tours);
                                    gotFirst = true;
                                }
                            });
                            if (!currTour) {
                                clickExhibition(firstIndex);//have the first tour selected
                            }
                            else {
                                clickTourByDoq(currTour);//have the previous tour selected if there is one
                            }
                        }
                        exhibitionLabel.css('color', 'rgb(85,85,85)');
                        toursLabel.css('color', 'white');
                    }
                });

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
                //a space below the last exhibition div so that if there are many exhibitions, leftbar/exhibitarea will be scrollable
                var moreSpace = $(document.createElement('div'));
                moreSpace.addClass("moreSpace");
                moreSpace.css({ "width": "100%", "height": "8.5%", "font-size": "1.5em", 'position': 'relative', 'border': 'solid transparent', 'border-width': '5px 0px 5px 0px' });
                exhibitarea.append(moreSpace);

                changeOrientation();
                loadingArea.hide();
                //console.log("in get exhibition helper");
                if (exhibitionCallback) {
                    exhibitionCallback(that);
                }
            }  // end getting tour
        }   // end getting exhibition
    }   //end init()

    /**
    *create send feedback
    *@return: feedbackContainer  
    */
    function initFeedback() {
        var feedbackContainer = $(document.createElement('div'));
        feedbackContainer.addClass('feedbackContainer');
        feedbackContainer.css({
            "width": "100%",
            "height": "7%",
            'bottom': '0%',
            'position': "absolute",
            'padding-top': '5.25%',
            'float': 'left',
            'background-color': 'rgba(0,0,0,0.75)'
        });
        var feedback = $(document.createElement('div'));
        feedback.addClass('feedback-text');
        feedback.text('Send Feedback');
        feedback.css({
            "font-size": "1.8em",
            'height': '60%',
            'position': "absolute",
            'display': 'inline',
            'left': '25%',
            'top': '28%',
        });
        var feedbackIcon = $(document.createElement('img'));
        feedbackIcon.addClass('feedback-icon');
        feedbackIcon.attr('src', 'images/icons/FeedbackIcon.svg');
        feedbackIcon.css({
            'width': 'auto',
            'height': '35%',
            'position': 'absolute',
            'left': '10%',
            'display': 'inline',
            'top': '35%',
            'vertical-align': 'middle',
            //'opacity': .5, //change when we have working feedback
        });

        var feedbackBox = LADS.Util.UI.FeedbackBox(getCurrentType, getCurrentID);
        root.append(feedbackBox);
        feedbackContainer.append(feedbackIcon);
        feedbackContainer.append(feedback);

        feedbackContainer.click(makeFeedback);
        function makeFeedback() {
            $(feedbackBox).css({ 'display': 'block' });
        }
        return feedbackContainer;
    }

    function getCurrentType() {
        if (exhibTabSelected) {
            return "Exhibition";
        } else {
            return "Tour";
        }
    }

    function getCurrentID() {
        if (exhibTabSelected) {
            if (currExhibition) {
                return currExhibition.Identifier;
            } else {
                return "";
            }
        } else {
            if (currTour) {
                return currTour.Identifier;
            } else {
                return "";
            }
        }
    }

    /**
     * Adds exhibitions to page
     *@param: exhibition to add
     * Creates button in sidebar
     */
    function addExhibit(exhibition) {

        var title = exhibition.Name,
            toAddImage = $(document.createElement('img')),
            imgSrc = LADS.Worktop.Database.fixPath(exhibition.Metadata.BackgroundImage),
            toAdd = $(document.createElement('div')),
            subInfo = $(document.createElement('div')),
            text = exhibition.Metadata.Description ? exhibition.Metadata.Description : "",
            shortenedText = text.substr(0, 18) + "...";

        text = text.replace(/<br>/g, '').replace(/<br \/>/g, '');

        // intelligent truncate + ellipses insertion
        // BM - CSS3 is more intelligent
        //if (title.length > 15) {
        //    var hasSpace = false;
        //    var scanLength = Math.min(title.length, 24);
        //    for (var i = 14; i < scanLength ; i++) {
        //        if (title[i] === " " && !hasSpace) {
        //            title = title.substr(0, i) + "...";
        //            hasSpace = true;
        //        } else if (title[i] === "-" && i !== (scanLength - 1) && !hasSpace) {
        //            if (title[i + 1] === " ") {
        //                title = title.substr(0, i) + "...";
        //                hasSpace = true;
        //            }
        //        }
        //    }
        //    if (!hasSpace) {
        //        title = title.substr(0, 16) + "...";
        //    }
        //}

        //thumbnail for the exhibition
        toAddImage = $(document.createElement('img'));
        imgSrc = LADS.Worktop.Database.fixPath(exhibition.Metadata.BackgroundImage);
        toAddImage.attr("src", imgSrc);
        toAddImage.css({
            "width": "18%",
            "height": "90%",
            "float": "left",
            'margin-right': '4%',
            'margin-left': '6%',
            "top": '5%',
            'border': '1px solid black',
            'display': 'inline-block',
        });

        toAdd = $(document.createElement('div'));
        toAdd.addClass('exhibition-selection');
        toAdd.css({
            "width": "95%",
            "height": "6%",
            "font-size": "200%",
            'position': 'relative',
            'border': 'solid transparent',
            'border-width': '5px 0px 5px 0px',
            'padding-top': '1.8%',
            'padding-bottom': '1.3%',
            'display': 'inline-block',
            'overflow': 'hidden',
        });
        var titleBox = $(document.createElement('div'));
        titleBox.addClass('exhibition-title');
        titleBox.css({
            'margin-top': '0.5%',
            'width': '70%',
            'height': '100%',
            "font-size": "100%",
            'display': 'inline-block',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
        });
        var screenWidth = root.width();
        titleBox.text(title);
        if (screenWidth <= 1366) {
            //$(titleBox).fitText(0.35);
        } else {
            //$(titleBox).fitText(0.26);
        }

        var progressCircCSS = {
            'position': 'absolute',
            'left': '10%',
            'z-index': '50',
            'height': 'auto',
            'width': '9%',
            'top': '25%',
        };
        var circle = LADS.Util.showProgressCircle(toAdd, progressCircCSS, '0px', '0px', false);
        toAddImage.load(function () {
            LADS.Util.removeProgressCircle(circle);
        });

        toAdd.append(toAddImage);
        toAdd.append(titleBox);


        //subInfo = $(document.createElement('div'));
        //subInfo.css({
        //    width: "100%", left: "0%", top: "0%",
        //    'font-size': '60%', position: "relative", 'text-align': 'left'
        //});
        //text = exhibition.Metadata.Description ? exhibition.Metadata.Description : "";
        //text = text.replace(/<br>/g, '').replace(/<br \/>/g, '');
        //shortenedText = text.substr(0, 25) + "...";
        //subInfo.text(shortenedText);
        //toAdd.append(subInfo);

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
            for (var i = 0; i < exhibitelements.length; i++) {
                // prevents animation if exhibit is already selected
                if (exhibitelements[i] != toAdd) {
                    exhibitelements[i].css({ 'background-color': 'transparent', 'color': 'white' });
                    exhibitelements[i].data("selected", false);
                    exhibitelements[i].attr('flagClicked', 'false');
                }
            }
            $(this).attr('flagClicked', 'true');
            currExhibition = exhibition;
            loadExhibit.call(toAdd, exhibition);
        });

        exhibitelements.push(toAdd);
    }

    /**
     * Adds tour to page
     * Creates button in sidebar
     *@param: tour to add,
     *@param: all the tours
     */
    function addTour(tour, allTours) {
        var title = tour.Name,
            toAddImage = $(document.createElement('img')),
            imgSrc = LADS.Worktop.Database.fixPath(tour.Metadata.Thumbnail),
            toAdd = $(document.createElement('div')),
            subInfo = $(document.createElement('div')),
            text = tour.Metadata.Description || "",
            shortenedText = text.substr(0, 20) + "...";

        text = text.replace(/<br>/g, '').replace(/<br \/>/g, '');

        // intelligent truncate + ellipses insertion
        //if (title.length > 15) {
        //    var hasSpace = false;
        //    var scanLength = Math.min(title.length, 24);
        //    for (var i = 14; i < scanLength ; i++) {
        //        if (title[i] === " " && !hasSpace) {
        //            title = title.substr(0, i) + "...";
        //            hasSpace = true;
        //        } else if (title[i] === "-" && i !== (scanLength - 1) && !hasSpace) {
        //            if (title[i + 1] === " ") {
        //                title = title.substr(0, i) + "...";
        //                hasSpace = true;
        //            }
        //        }
        //    }
        //    if (!hasSpace) {
        //        title = title.substr(0, 16) + "...";
        //    }
        //}

        toAddImage = $(document.createElement('img'));
        imgSrc = LADS.Worktop.Database.fixPath(tour.Metadata.Thumbnail);
        toAddImage.attr("src", imgSrc);
        toAddImage.css({
            "width": "18%",
            "height": "90%",
            "float": "left",
            'margin-right': '5%',
            'margin-left': '6%',
            "top": '5%',
            'border': '1px solid black',
            'display': 'inline-block',
        });

        toAdd = $(document.createElement('div'));
        toAdd.addClass('tour-selection');
        toAdd.css({
            "width": "95%",
            "height": "6%",
            "font-size": "200%",
            'position': 'relative',
            'border': 'solid transparent',
            'border-width': '5px 0px 5px 0px',
            'padding-top': '1.8%',
            'padding-bottom': '1.3%',
            'display': 'inline-block',
            'overflow': 'hidden',
        });

        var progressCircCSS = {
            'position': 'absolute',
            'left': '10%',
            'z-index': '50',
            'height': 'auto',
            'width': '9%',
            'top': '25%',
        };
        var circle = LADS.Util.showProgressCircle(toAdd, progressCircCSS, '0px', '0px', false);
        toAddImage.load(function () {
            LADS.Util.removeProgressCircle(circle);
        });

        var titleBox = $(document.createElement('div'));
        titleBox.addClass('tour-title');
        titleBox.css({
            'margin-top': '1%',
            'width': '60%',
            'height': '100%',
            "font-size": "100%",
            'display': 'inline-block',
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
        });
        titleBox.text(title);
        var screenWidth = root.width();
        titleBox.text(title);
        if (screenWidth <= 1366) {
            //$(titleBox).fitText(0.35);
        } else {
            //$(titleBox).fitText(0.26);
        }
        toAdd.append(toAddImage);
        toAdd.append(titleBox);

        //toAdd.text(title);
        //subInfo = $(document.createElement('div'));
        //subInfo.css({
        //    width: "100%", left: "0%", top: "0%",
        //    'font-size': '60%', position: "relative", 'text-align': 'left'
        //});
        //text = tour.Metadata.Description ? tour.Metadata.Description : "";
        //text = text.replace(/<br>/g, '').replace(/<br \/>/g, '');
        //shortenedText = text.substr(0, 20) + "...";
        //subInfo.text(shortenedText);
        //toAdd.append(subInfo);

        exhibitarea.append(toAdd);

        toAdd.attr('flagClicked', 'false');
        toAdd.mousedown(function () {
            $(this).css({ 'background-color': 'white', 'color': 'black' });
        });
        toAdd.mouseleave(function () {
            if ($(this).attr('flagClicked') == 'false')
                $(this).css({ 'background-color': 'transparent', 'color': 'white' });
        });
        toAdd.mousedown(function () {
            $(this).css({ 'background-color': 'white', 'color': 'black' });

        });

        toAdd.click(function () {
            for (var i = 0; i < exhibitelements.length; i++) {
                // prevents animation if exhibit is already selected
                if (exhibitelements[i] != toAdd) {
                    exhibitelements[i].css({ 'background-color': 'transparent', 'color': 'white' });
                    exhibitelements[i].data("selected", false);
                    exhibitelements[i].attr('flagClicked', 'false');
                }
            }
            // the div that is clicked is passed as the context i.e. 'this'
            $(this).attr('flagClicked', 'true');
            currTour = tour;
            loadTour.call(toAdd, tour, allTours);
        });

        exhibitelements.push(toAdd);
    }

    /**
    *have a exhibition/tour selected
    *@param: index of selected exhibition
    */
    function clickExhibition(i) {
        if (exhibitelements[i])
            exhibitelements[i].click();
    }

    /**
    *return to the exhibition when clicks back button from catalog
    *@param: current exhibition
    */
    function clickExhibitionByDoq(doq) {
        exhibitionSpan.click();

        var i, currentEx, text,
            title = doq.Name;
        // intelligent truncate + ellipses insertion
        //if (title.length > 15) {
        //    var hasSpace = false;
        //    var scanLength = Math.min(title.length, 24);
        //    for (var i = 14; i < scanLength ; i++) {
        //        if (title[i] === " " && !hasSpace) {
        //            title = title.substr(0, i) + "...";
        //            hasSpace = true;
        //        } else if (title[i] === "-" && i !== (scanLength - 1) && !hasSpace) {
        //            if (title[i + 1] === " ") {
        //                title = title.substr(0, i) + "...";
        //                hasSpace = true;
        //            }
        //        }
        //    }
        //    if (!hasSpace) {
        //        title = title.substr(0, 16) + "...";
        //    }
        //}

        for (i = 0; i < exhibitelements.length; i++) {
            currentEx = exhibitelements[i];
            text = currentEx[0].innerText;
            if (text === title) {
                loadExhibit.call(exhibitelements[i], doq);
                currentEx[0].click();//have the current exhibition selected when go back to exhibition page
                break;
            }
        }
    }

    /**
    *return to tours page in exhibition mode when clicks back button from artmode.
    *@param: current artwork mode
    */
    function clickTourByDoq(doq) {
        toursSpan.click();
        var i, currTour, text,
            title = doq.Name;

        //if (title.length > 15) {
        //    var hasSpace = false;
        //    var scanLength = Math.min(title.length, 24);
        //    for (var i = 14; i < scanLength ; i++) {
        //        if (title[i] === " " && !hasSpace) {
        //            title = title.substr(0, i) + "...";
        //            hasSpace = true;
        //        } else if (title[i] === "-" && i !== (scanLength - 1) && !hasSpace) {
        //            if (title[i + 1] === " ") {
        //                title = title.substr(0, i) + "...";
        //                hasSpace = true;
        //            }
        //        }
        //    }
        //    if (!hasSpace) {
        //        title = title.substr(0, 16) + "...";
        //    }
        //}
        for (i = 0; i < exhibitelements.length; i++) {
            var currentTour = exhibitelements[i];
            text = currentTour[0].innerText;
            if (text === title) {
                loadTour.call(currentTour, doq);
                currentTour[0].click();//have the current exhibition selected when go back to exhibition page
                break;
            }
        }
    }

    /** 
    *Function to select the tour tab from a different page before switching to this page 
    */
    function selectTourTab() {
        toursSpan.click();
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

        if (!privateExhib && this.data("selected")) { return; }//if the exhibition has already been selected, do nothing

        if (!privateExhib)
            this.data("selected", true);
        // Start loading artwork now in background

        // Remove current contents of display area
        var d;
        if (firstLoad) {
            d = currentExhElements.displayareasub;
            d.animate({ 'opacity': 0 }, 100, function () {
                d.remove();
            });
            firstLoad = false;
        }
        else if (currentExhElements) {
            currentExhElements.block.remove();
            d = currentExhElements.displayareasub;
            d.css('z-index', 1000);
            d.animate({
                'left': '20%',
                top: '20%',
                width: '150%',
                height: '150%',
                opacity: 0,
            },
            500, function () {
                d.remove();
            });
        }

        var displayareasub = $(document.createElement('div'));
        displayareasub.addClass('displayareasub');
        displayareasub.css({ 'width': '100%', 'height': '100%', 'position': 'absolute' });
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
        titlediv.attr('id', 'exhibition-title');

        titlediv.addClass('exhibition-title');
        titlediv.text(exhibition.Name);
        // Font size & line-height is probably the easiest thing to dynamically update here
        titlediv.css({
            'width': '90%',
            'margin-left': "10%", 'margin-top': "2%",
            'text-align': 'left',
            'z-index': '40',
            'white-space': 'nowrap'
        });
        var w = $(window).width() * 0.75 * 0.9;
        var fontSize = LADS.Util.getMaxFontSizeEM(exhibition.Name, 1.5, w, 100);
        titlediv.css({ 'font-size': fontSize });

        //LADS.Util.fitText(titlediv, 0.7);
        displayareasub.append(titlediv);
        currentExhElements.title = titlediv;
        //subtitle1
        sub1 = $(document.createElement('div'));
        sub1.addClass('exhibition-subtitle-1');
        sub1.attr('id', 'exhibition-subtitle-1');

        sub1.css({
            'width': '85%',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
            'margin-left': "10%",
            'font-size': '4em',
            'text-align': 'left',
            'z-index': '40',
            'white-space': 'nowrap'
        });

        sub1.html(exhibition.Metadata.Subheading1);
        //LADS.Util.fitText(sub1, 1.5);
        displayareasub.append(sub1);
        currentExhElements.sub1 = sub1;
        //subtitle2
        sub2 = $(document.createElement('div'));
        sub2.addClass('exhibition-subtitle-2');
        sub2.attr('id', 'exhibition-subtitle-2');

        sub2.css({
            'width': '90%',
            'margin-left': "10%",
            'font-size': '3em',
            'text-align': 'left',
            'z-index': '40',
            'white-space': 'nowrap'
        });
        sub2.html(exhibition.Metadata.Subheading2);
        // LADS.Util.fitText(sub2, 2);
        displayareasub.append(sub2);
        currentExhElements.sub2 = sub2;

        // Display contains description, thumbnails and view button
        var display = $(document.createElement('div'));
        display.addClass('exhibition-info');

        // Might need to push this down farther (make top larger)
        // Looks fine for now, though
        display.css({
            'top': '30%',
            'left': '10%',
            "background-color": "rgba(255,255,255,0.9)",
            'position': 'absolute',
            "height": "65%", "width": "83%",
            'border-style': 'solid',
            'border-width': '1.3em',
            'border-color': 'rgba(16,14,12,0.92)',
        });

        displayareasub.append(display);

        currentExhElements.display = display;

        // Contains text
        var contentdiv = $(document.createElement('div'));
        contentdiv.addClass('contentdiv');
        contentdiv.css({
            'width': '94%', 'height': '96%',
            'position': 'relative',
            'top': '2%', 'left': '3%',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
        });
        display.append(contentdiv);

        // Exhibition description container
        var descContainer = $(document.createElement('div'));
        descContainer.addClass('description-container');
        descContainer.css({
            width: '98%',
            height: '60%',
            overflow: 'auto',
            'padding-right': '2%'
        });
        contentdiv.append(descContainer);

        // Thumbnails
        var img1 = $(document.createElement('img'));
        img1.attr('src', LADS.Worktop.Database.fixPath(exhibition.Metadata.DescriptionImage1));
        img1.css({ 'padding-right': '1%', "width": "auto", "height": "60%", "float": "right", 'margin-bottom': '2px', 'margin-left': '2%' }); //max : 49
        img1.attr('id', 'img1');
        descContainer.append(img1);

        var progressCircCSS = {
            'position': 'absolute',
            'float': 'right',
            'right': '13%',
            'z-index': '50',
            'height': '20%',
            'width': 'auto',
            'top': '10%',
        };
        var circle = LADS.Util.showProgressCircle(descContainer, progressCircCSS, '0px', '0px', false);
        img1.load(function () {
            LADS.Util.removeProgressCircle(circle);
        });
        // View button

        var selectExhibition = $(document.createElement('div'));
        selectExhibition.addClass('selectExhibition');
        selectExhibition.css({
            'margin': '.90909% 1% 5px 0.5%',
            'width': '30%',
            'height': 'auto',
            'float': 'right',
            'clear': 'right',
            'border': '3px solid black',
            'overflow': 'hidden',
        });
        descContainer.append(selectExhibition);

        var selectButton = $(document.createElement('img'));
        selectButton.addClass('selectButton');
        selectButton.attr('src', 'images/icons/forward.png');

        selectButton.css({
            'z-index': 50,
            'display': 'inline-block',
            'float': 'left',
            'width': '12%',
            'height': 'auto',
            'padding': '1.5%'
        });
        selectExhibition.append(selectButton);

        bgimage.css('background-image', "url(" + LADS.Worktop.Database.fixPath(exhibition.Metadata.BackgroundImage) + ")");

        // create a spinning circle
        var displayLoading = $(document.createElement('div'));
        displayLoading.addClass('exhibitionLoading');
        displayLoading.css({
            'top': '30%',
            'left': '10%',
            "background-color": "rgba(0,0,0,0.5)",
            'position': 'absolute',
            'z-index': '40',
            "height": "65%", "width": "83%",
            'border-style': 'solid',
            'border-width': '1.3em',
            'border-color': 'rgba(16,14,12,0.92)',
            'display': 'none'
        });
        displayareasub.append(displayLoading);

        // create gray overlay
        var overlayOnRoot = $(document.createElement('div'));
        overlayOnRoot.attr('id', 'overlay1');
        overlayOnRoot.addClass('overlayOnRoot');
        overlayOnRoot.css({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'none',
            'background-color': 'rgba(0,0,0,0.6)',
        });
        root.append(overlayOnRoot);
        //have the selectbutton not draggable, change to black when clicked and change back to white when mouse leave.
        selectExhibition.mousedown(function () {
            LADS.Util.UI.cgBackColor("forwardButton", selectExhibition);
            $(selectText).css({ 'color': 'black' });
        });
        selectExhibition.mouseleave(function () {
            selectExhibition.css({ 'background-color': "transparent" });
        });

        //opens the exhibition we have just selected
        selectExhibition.click(function () {
            overlayOnRoot.show();
            //LADS.Util.showLoading(overlayOnRoot, '5%'); DisplayAreaSub already creates a loading circle
            LADS.Worktop.Database.getArtworksIn(exhibition.Identifier, getArtworksHelper, null, getArtworksHelper);

            function getArtworksHelper(artworks) {
                if (!artworks || !artworks[0]) {//pops up a box warning user there is no artwork in the selected exhibition
                    var noArtworksOptionBox = LADS.Util.UI.makeNoArtworksOptionBox();
                    root.append(noArtworksOptionBox);
                    $(noArtworksOptionBox).fadeIn(500);
                    overlayOnRoot.fadeOut();
                    return;
                }
                switchPage(exhibition);
                overlayOnRoot.fadeOut();
            }
        });

        selectText = $(document.createElement('div'));
        selectText.addClass('select-text');
        selectText.attr('id', 'exhibition-select-text');

        selectText.text("Explore this exhibition");
        selectText.css({
            'font-size': LADS.Util.getMaxFontSizeEM("Explore this exhibition", 1, 1000, selectExhibition.height()),
            'color': 'black',
            'display': 'inline-block',
            'right': '2%',
            'padding': '2%'
        });
        selectExhibition.append(selectText);
        //LADS.Util.fitText(selectText, .8); //josh

        //descriptiontext 
        var descriptiontext = $(document.createElement('div'));
        descriptiontext.addClass('description-text');
        descriptiontext.attr('id', 'description-text');

        descriptiontext.css({
            "line-height": "90%",
            "height": "100%",
            "width": "100%",
            'font-size': '1.6em',
            'color': 'black',
            'white-space': 'normal',
            'text-overflow': 'ellipsis',
        });
        //create the text fadeout effect for the top
        var topfadeout = $(document.createElement('div'));
        topfadeout.addClass('topfadeout');
        topfadeout.css({
            'position': 'absolute',
            'display': 'none',
            'top': '0%',
            'left': '0px',
            'width': '98%',
            'height': '5%',
            'background': '-ms-linear-gradient(top,  rgba(237, 237, 237,1) 0%,rgba(237, 237, 237,0) 52%,rgba(237, 237, 237,0) 100%)'
        });
        descContainer.append(topfadeout);
        //create the text fadeout effect for the bottom
        var bottomfadeout = $(document.createElement('div'));
        bottomfadeout.addClass('Exhibitionbottomfadeout');
        bottomfadeout.css({
            'position': 'absolute',
            'top': '55%',
            'left': '0px',
            'width': '98%',
            'height': '5%',
            'background': '-ms-linear-gradient(top,  rgba(237, 237, 237,0) 0%,rgba(237, 237, 237,0) 52%,rgba(237, 237, 237,1) 100%)'
        });
        descContainer.append(bottomfadeout);
        //check the scroll state to make fadeout effect divs appear and disappear.
        descContainer.bind('scroll', function () {
            //if it reaches the bottom, hide the bottom fadeout effect. Otherwise, show it
            if (descContainer.scrollTop() + descContainer.innerHeight() >= descContainer[0].scrollHeight) {
                bottomfadeout.css({ 'display': 'none' });
            }
            else {
                bottomfadeout.css({ 'display': 'block' });
            }
            //if the scroller is not at the top, show the top fadeout effect. Otherwise, hide it.
            if (descContainer.scrollTop() > 0) {
                topfadeout.css({ 'display': 'block' });
            }
            else {
                topfadeout.css({ 'display': 'none' });
            }
        });
        var str;
        if (exhibition.Metadata.Description)
            str = exhibition.Metadata.Description.replace(/\n\r?/g, '<br>');
        else
            str = "";
        descriptiontext.html(str);
        //LADS.Util.fitText(descriptiontext, 2.5);
        descContainer.append(descriptiontext);

        //this is the area that contains a list of atours.
        var tourBar = $(document.createElement('div'));
        tourBar.addClass('tourBar');
        tourBar.css({
            position: 'absolute',
            width: '100%',
            bottom: '5%',
            height: '30%',

        });
        var text = $(document.createElement('div'));
        text.html("<b>Interactive Tours in this Exhibition</b>");
        text.css({
            bottom: '100%',
            color: 'black',
            'font-size': '120%',
        });
        tourBar.append(text);
        var artworkContent = $(document.createElement('div'));
        artworkContent.addClass('artworkContent');
        artworkContent.css({
            height: '92%',
            'padding-bottom': '2%',
            'overflow-x': 'auto',
            'overflow-y': 'hidden',
            'white-space': 'nowrap'
        });
        tourBar.append(artworkContent);
        contentdiv.append(tourBar);

        //create left fadeout for tourbar
        var leftfadeout = $(document.createElement('div'));
        leftfadeout.addClass('leftfadeout');
        leftfadeout.css({
            'position': 'absolute',
            'display': 'none',
            'left': '0px',
            'width': '5%',
            'height': '100%',
            'background': '-ms-linear-gradient(left,  rgba(237, 237, 237,1) 0%,rgba(237, 237, 237,0) 52%,rgba(237, 237, 237,0) 100%)'
        });
        artworkContent.append(leftfadeout);
        //create the right fadeout for tourBar
        var rightfadeout = $(document.createElement('div'));
        rightfadeout.addClass('rightfadeout');
        rightfadeout.css({
            'position': 'absolute',
            'right': '0px',
            'width': '5%',
            'height': '100%',
            'background': '-ms-linear-gradient(left,  rgba(237, 237, 237,0) 0%,rgba(237, 237, 237,0) 52%,rgba(237, 237, 237,1) 100%)'
        });
        artworkContent.append(rightfadeout);
        //check the scroll state to make fadeout effect divs appear and disappear.
        artworkContent.bind('scroll', function () {
            //if it reaches the bottom, hide the bottom fadeout effect. Otherwise, show it
            if (artworkContent.scrollLeft() + artworkContent.innerWidth() >= artworkContent[0].scrollWidth) {
                rightfadeout.css({ 'display': 'none' });
            }
            else {
                rightfadeout.css({ 'display': 'block' });
            }
            //if div scrolls to the left, show the top fadeout effect. Otherwise, hide it.
            if (artworkContent.scrollLeft() > 0) {
                leftfadeout.css({ 'display': 'block' });
            }
            else {
                leftfadeout.css({ 'display': 'none' });
            }
        });


        LADS.Util.showLoading(overlayOnRoot, '8%', '60%', '60%');
        overlayOnRoot.show();

        //get all the tours that are related
        LADS.Worktop.Database.getTours(tourHelper, null, tourHelper);

        function tourHelper(tourInfo) {
            numberOfTours = 0;
            relatedTours = [];

            function exhibArtworksHelper(exhibition_artworks) {
                if (exhibition_artworks && exhibition_artworks[0]) {
                    for (var i = 0; i < tourInfo.length; i++) {
                        if (tourInfo[i].Metadata.Private !== "true" && tourInfo[i].Metadata.RelatedArtworks) {
                            var relatedarts = JSON.parse(tourInfo[i].Metadata.RelatedArtworks);
                            for (var j = 0; j < relatedarts.length; j++) {
                                for (var k = 0; k < exhibition_artworks.length; k++) {
                                    if (exhibition_artworks[k].Identifier === relatedarts[j]) {
                                        // Add tour to viewer
                                        var tour = tourInfo[i];
                                        if (relatedTours.indexOf(tour) < 0) {
                                            artworkContent.append(makeTour(tour));
                                            relatedTours.push(tour);
                                            numberOfTours++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }


                if (numberOfTours === 0) {
                    //hide tour bar and show more text
                    text.css('visibility', 'hidden');
                    descContainer.css({ height: '100%' });
                    img1.css({ height: '39%' });
                    //img2.css({ height: '39%' }); //only one at present
                    //selectExhibition.css({ height: '8.5%' });
                    //hide bottomfadeout so it doesn't block the text
                    $('.Exhibitionbottomfadeout').css({ 'top': '95%' });
                    tourBar.hide();
                }

                else {
                    //adjusts size specific stuff only when it is loaded
                    text.css('visibility', 'visible');
                    tourBar.ready(function () {
                        tourBar.on("load", function () {
                            $('.tour').outerWidth(tourBar.outerWidth() / 4);
                            artworkContent.outerWidth($('.tour').outerWidth() * (1 + numberOfTours));
                        });
                    });
                }
            }
            if (tourInfo.length > 0) {
                LADS.Worktop.Database.getArtworksIn(exhibition.Identifier, exhibArtworksHelper, null, exhibArtworksHelper);
            }
            else {
                //no tour at all

                //hide tour bar and show more text
                text.css('visibility', 'hidden');
                descContainer.css({ height: '100%' });
                img1.css({ height: '39%' });
                //img2.css({ height: '39%' });
                //selectExhibition.css({ height: '8.5%' });
            }

            overlayOnRoot.fadeOut();

            // hackish fix for overlay not fading out.
            setTimeout(function () {
                overlayOnRoot.fadeOut();
            }, 50);
        }
        if (!privateExhib)
            $(this).css({ 'background-color': 'rgb(255,255,255)', 'color': 'black' });

        currentExhElements.displayareasub = displayareasub;

        changeOrientation();

        $(document).ready(function () {
            displayareasub.css({ 'width': '60%', 'height': '60%' });
            setTimeout(function () {
                displayareasub.animate({
                    'width': '100%', 'height': '100%', 'left': '0%'
                }, 500);
            });
        });
    }

    /**
     * When a tour is selected in sidebar,
     * this function creates description to display in main display area
     * -David C.
     */
    function loadTour(tour, allTours) {
        if (this.data("selected")) { return; }//if the tour is already selected, do nothing

        this.data("selected", true);
        // Start loading artwork now in background
        var d;
        // Remove current contents of display area
        if (firstLoad) {
            d = currentExhElements.displayareasub;
            d.animate({ 'opacity': 0 }, 100, function () {
                d.remove();
            });
            firstLoad = false;
        }
        else if (currentExhElements) {
            currentExhElements.block.remove();
            d = currentExhElements.displayareasub;
            d.css('z-index', 1000);
            d.animate({
                'left': '20%',
                top: '20%',
                width: '150%',
                height: '150%',
                opacity: 0,
            },
            500, function () {
                d.remove();
            });
        }

        var displayareasub = $(document.createElement('div'));
        displayareasub.addClass('displayareasub');
        displayareasub.css({ 'width': '100%', 'height': '100%', 'position': 'absolute' });
        displayarea.append(displayareasub);

        currentExhElements = {};
        currentExhElements.block = $(document.createElement('div'));
        currentExhElements.block.css({
            "top": this.position().top, "left": "100%", "height": this.css('height'),
            "width": "4%", "font-size": "1.5em", 'position': 'absolute',
            'border': 'solid transparent', 'border-width': '5px 0px 5px 0px',
            'background-color': 'rgba(255,255,255,0)', 'z-index': '50'
        });

        // Make titles
        // fixed to work at small widths (in splitscreen and in portrait mode)
        titlediv = $(document.createElement('div'));
        titlediv.attr('id', 'tour-title');

        titlediv.addClass('tour-title');
        titlediv.css({
            'width': '85%',
            'margin-left': "10%", 'margin-top': "2%", "margin-right": "4%",
            'font-size': '2.7em',
            'text-align': 'left',
            'z-index': '40',
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'height': '25%',
        });
        titlediv.html(tour.Name);
        // LADS.Util.fitText(titlediv, 1); //prev 0.7
        displayareasub.append(titlediv);
        currentExhElements.title = titlediv;

        /*****************************
        This is where the setting of the heading and the subheadin begin.*/

        sub1 = $(document.createElement('div'));
        sub1.addClass('tour-subtitle-1');
        sub1.attr('id', 'tour-subtitle-1');

        sub1.css({
            'width': '90%',
            'margin-left': "10%",
            'font-size': '4em',
            'text-align': 'left',
            'z-index': '40',
            'white-space': 'nowrap'
        });
        sub1.html(tour.Metadata.Subheading1);
        //LADS.Util.fitText(sub1, 1.5);
        displayareasub.append(sub1);
        currentExhElements.sub1 = sub1;

        sub2 = $(document.createElement('div'));
        sub2.addClass('tour-subtitle-2');
        sub2.attr('id', 'tour-subtitle-2');

        sub2.css({
            'width': '90%',
            'margin-left': "10%",
            'font-size': '3em',
            'text-align': 'left',
            'z-index': '40',
            'white-space': 'nowrap'
        });
        sub2.html(tour.Metadata.Subheading2);
        //LADS.Util.fitText(sub2, 2);
        displayareasub.append(sub2);
        currentExhElements.sub2 = sub2;
        /****************************************************************/


        // Display contains description, thumbnails and view button
        var display = $(document.createElement('div'));
        display.addClass('tour-info');

        // Might need to push this down farther (make top larger)
        display.css({
            'top': '30%',
            'left': '10%',
            "background-color": "rgba(255,255,255,0.9)",
            'position': 'absolute',
            "height": "65%", "width": "83%",
            'border-style': 'solid',
            'border-width': '1.3em',
            'border-color': 'rgba(16,14,12,0.92)',
        });

        displayareasub.append(display);

        currentExhElements.display = display;

        // Contains text
        var contentdiv = $(document.createElement('div'));
        contentdiv.addClass('contentdiv');
        contentdiv.css({
            'width': '94%', 'height': '96%',
            'position': 'relative',
            'top': '2%', 'left': '3%',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
        });
        display.append(contentdiv);

        // Tour description container
        var descContainer = $(document.createElement('div'));
        descContainer.addClass('description-container');
        descContainer.css({
            width: '100%',
            height: '60%',
            overflow: 'auto',
            'padding-right': '2%'
        });
        contentdiv.append(descContainer);


        // Thumbnails
        var imgwrapper = $(document.createElement('div'));
        imgwrapper.addClass("imgwrapper");
        imgwrapper.css({ 'width': '40%', 'float': 'right', 'height': '60%', 'margin-left': '2%', 'background-repeat': 'no-repeat' });
        var img1 = $(document.createElement('img'));
        img1.attr('src', LADS.Worktop.Database.fixPath(tour.Metadata.Thumbnail));
        img1.css({ "width": "auto", "height": "100%", "float": "right", 'margin-bottom': '2px', 'margin-left': '2%' }); //max : 49
        img1.attr('id', 'img1');
        imgwrapper.append(img1);
        descContainer.append(imgwrapper);

        /*******************************************
                I comment out all the images
                var img2 = $(document.createElement('img'));
                img2.attr('src', tour.Metadata.DescriptionImage2);
                img2.css({ "width": "auto", "height": "60%", "float": "right", 'margin-right': '5px', 'margin-left': '1%', 'margin-bottom': '1px' }); //height 73
                img2.attr('id', 'img2');
                contentdiv.append(img2);        contentdiv.append(img1); //append img1 second to preserve order
        
                descContainer.append(img2);
                **********************************************/

        // View button
        var selectTour = $(document.createElement('div'));
        selectTour.addClass('selectTour');
        selectTour.css({
            'margin-top': '1%',
            'margin-bottom': '5%',
            width: '21%',
            'margin-right': '5%',
            height: '9.9%',
            float: 'right',
            clear: 'right',
            'border': '3px solid black',
            'overflow': 'hidden',
        });

        descContainer.append(selectTour);

        var selectButton = $(document.createElement('img'));
        selectButton.addClass('selectButton');
        selectButton.attr('src', 'images/icons/Play.svg');

        selectButton.css({
            'padding-top': '2px',
            'padding-left': '3px',
            'z-index': 50,
            'vertical-align': 'middle',
            'float': 'left',
            'width': 'auto',
            'height': '90%',
        });

        bgimage.css('background-image', "url(" + LADS.Worktop.Database.fixPath(tour.Metadata.Thumbnail) + ")");

        selectTour.off('mousedown');
        selectTour.on('mousedown', function () {
            LADS.Util.UI.cgBackColor("forwardButton", selectTour);
            selectText.css({ 'color': 'white' });
        });
        selectTour.off('mouseleave');
        selectTour.on('mouseleave', function () {
            selectTour.css({ 'color': 'white', 'background-color': 'transparent' });
            selectText.css('color', 'black');
        });
        selectTour.off('click');
        selectTour.on('click', function () {
            switchPageTour(tour);
        });

        selectTour.append(selectButton);

        selectText = $(document.createElement('div'));
        selectText.addClass('select-text');
        selectText.attr('id', 'toue-select-text');

        selectText.text("Begin Tour");
        selectText.css({
            'font-size': LADS.Util.getMaxFontSizeEM("Begin Tour", 1, 1000, $(window).height() * 0.03),
            'color': 'black',
            'display': 'block',
            'position': 'relative',
            'left': '5%',
            'top': '5%',
        });
        selectTour.append(selectText);
        //LADS.Util.fitText(selectText, .5);

        var descriptiontext = $(document.createElement('div'));
        descriptiontext.addClass('description-text');
        descriptiontext.attr('id', 'description-text');

        descriptiontext.css({
            "line-height": "90%",
            "height": "90%",
            "width": "100%",
            'font-size': '1.6em',
            'color': 'black',
            'white-space': 'normal',
            'text-overflow': 'ellipsis',
        });
        var string = '';
        if (tour.Metadata.Description) {
            string = tour.Metadata.Description.replace(/\n\r?/g, '<br>');
        }
        descriptiontext.html(string);
        //LADS.Util.fitText(descriptiontext, 2.5);
        descContainer.append(descriptiontext);

        //**************************************************************************
        //This is the part that varies from the artworks example.
        //It creates the "related artworks container"
        //If you want to comment it out comment out the following text until the next comments.
        //create the text fadeout effect for the top
        var topfadeout = $(document.createElement('div'));
        topfadeout.addClass('topfadeout');
        topfadeout.css({
            'position': 'absolute',
            'display': 'none',
            'top': '0%',
            'left': '0px',
            'width': '98%',
            'height': '5%',
            'background': '-ms-linear-gradient(top,  rgba(237, 237, 237,1) 0%,rgba(237, 237, 237,0) 52%,rgba(237, 237, 237,0) 100%)'
        });
        descriptiontext.append(topfadeout);
        //create the text fadeout effect for the bottom
        var bottomfadeout = $(document.createElement('div'));
        bottomfadeout.addClass('bottomfadeout');
        bottomfadeout.css({
            'position': 'absolute',
            'top': '55%',
            'left': '0px',
            'width': '98%',
            'height': '5%',
            'background': '-ms-linear-gradient(top,  rgba(237, 237, 237,0) 0%,rgba(237, 237, 237,0) 52%,rgba(237, 237, 237,1) 100%)'
        });
        descriptiontext.append(bottomfadeout);
        //check the scroll state to make fadeout effect divs appear and disappear.
        descContainer.bind('scroll', function () {
            //if it reaches the bottom, hide the bottom fadeout effect. Otherwise, show it
            if (descContainer.scrollTop() + descContainer.innerHeight() >= descContainer[0].scrollHeight) {
                bottomfadeout.css({ 'display': 'none' });
            }
            else {
                bottomfadeout.css({ 'display': 'block' });
            }
            //if the scroller is not at the top, show the top fadeout effect. Otherwise, hide it.
            if (descContainer.scrollTop() > 0) {
                topfadeout.css({ 'display': 'block' });
            }
            else {
                topfadeout.css({ 'display': 'none' });
            }
        });
        var artworksBar = $(document.createElement('div'));
        artworksBar.addClass('artworksBar');
        artworksBar.css({
            position: 'absolute',
            width: '100%',
            bottom: '5%',
            height: '30%',
        });

        var artworkContent = $(document.createElement('div'));
        artworkContent.addClass('artworkContent');
        artworkContent.css({
            height: '92%',
            'padding-bottom': '2%',
            'overflow-x': 'auto',
            'overflow-y': 'hidden',
            'white-space': 'nowrap'
        });
        var text = $(document.createElement('div'));
        text.html("<b>Artworks in this Interactive Tour</b>");
        text.css({
            bottom: '100%',
            color: 'black',
            'font-size': '120%',
        });
        artworksBar.append(text);
        artworksBar.append(artworkContent);

        //create left fadeout for tourbar
        var leftfadeout = $(document.createElement('div'));
        leftfadeout.addClass('leftfadeout');
        leftfadeout.css({
            'position': 'absolute',
            'display': 'none',
            'left': '0px',
            'width': '5%',
            'height': '100%',
            'background': '-ms-linear-gradient(left,  rgba(237, 237, 237,1) 0%,rgba(237, 237, 237,0) 52%,rgba(237, 237, 237,0) 100%)'
        });
        artworkContent.append(leftfadeout);
        //create the right fadeout for tourBar
        var rightfadeout = $(document.createElement('div'));
        rightfadeout.addClass('rightfadeout');
        rightfadeout.css({
            'position': 'absolute',
            'right': '0px',
            'width': '5%',
            'height': '100%',
            'background': '-ms-linear-gradient(left,  rgba(237, 237, 237,0) 0%,rgba(237, 237, 237,0) 52%,rgba(237, 237, 237,1) 100%)'
        });
        artworkContent.append(rightfadeout);

        //check the scroll state to make fadeout effect divs appear and disappear.
        artworkContent.bind('scroll', function () {
            //if it reaches the bottom, hide the bottom fadeout effect. Otherwise, show it
            if (artworkContent.scrollLeft() + artworkContent.innerWidth() >= artworkContent[0].scrollWidth) {
                rightfadeout.css({ 'display': 'none' });
            }
            else {
                rightfadeout.css({ 'display': 'block' });
            }
            //if div scrolls to the left, show the top fadeout effect. Otherwise, hide it.
            if (artworkContent.scrollLeft() > 0) {
                leftfadeout.css({ 'display': 'block' });
            }
            else {
                leftfadeout.css({ 'display': 'none' });
            }
        });

        contentdiv.append(artworksBar);
        //****************************************************** END of artworks

        var relatedArts = JSON.parse(tour.Metadata.RelatedArtworks);

        var displayLoading = $(document.createElement('div'));
        displayLoading.addClass('tourLoading');
        displayLoading.css({
            'top': '30%',
            'left': '10%',
            "background-color": "rgba(0,0,0,0.5)",
            'position': 'absolute',
            "height": "65%", "width": "83%",
            'border-style': 'solid',
            'border-width': '1.3em',
            'border-color': 'rgba(16,14,12,0.92)'
        });

        displayareasub.append(displayLoading);

        var overlayOnRoot = $(document.createElement('div'));
        overlayOnRoot.attr('id', 'overlay2');
        overlayOnRoot.css({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            'background-color': 'rgba(0,0,0,0.6)',
        });
        root.append(overlayOnRoot);
        LADS.Util.showLoading(displayLoading);
        //get all related artwork
        var artsAdded = {};

        function relatedArtHelperWrapper(i) {
            return function (nextArt) {
                relatedArtHelper(nextArt, i);
            }
        }

        function relatedArtHelper(nextArt, flag) {
            var _relatedTours = [];
            if (artsAdded[nextArt.Identifier]) return;
            artsAdded[nextArt.Identifier] = true;

            //if (allTours) {
            //    for (var k = 0; k < allTours.length; k++) {
            //        var currentTour = allTours[k];
            //        var privateState;
            //        if (currentTour.Metadata.Private) {
            //            privateState = (/^true$/i).test(currentTour.Metadata.Private);
            //        } else {
            //            privateState = false;
            //        }
            //        if (currentTour.Metadata.RelatedArtworks && !privateState) {
            //            var relatedarts = JSON.parse(currentTour.Metadata.RelatedArtworks);
            //            for (var j = 0; j < relatedarts.length; j++) {
            //                if (nextArt.Identifier === relatedarts[j]) {
            //                    // Add tour to viewer
            //                    if (_relatedTours.indexOf(currentTour) < 0) {
            //                        _relatedTours.push(currentTour);
            //                    }
            //                }
            //            }
            //        }
            //    }
            //}
            artworkContent.append(makeRelatedArt(nextArt, tour, _relatedTours));
            if (flag == relatedArts.length - 1) {
                overlayOnRoot.fadeOut();
                displayLoading.fadeOut();
            }
        }

        for (var i = 0; i < relatedArts.length; i++) {
            LADS.Worktop.Database.getDoq(relatedArts[i], relatedArtHelperWrapper(i));

        }

        if (relatedArts.length !== 0) {
            text.css('visibility', 'visible');
            descContainer.css({ height: "60%" });
            selectTour.css({ height: "12.3%" });
            artworksBar.ready(function () {
                artworksBar.on("load", function () {
                    $('.tour').outerWidth(artworksBar.outerWidth() / 4);
                    artworkContent.outerWidth($('.tour').outerWidth() * (1 + relatedArts.length));
                });
            });
        } else {
            overlayOnRoot.fadeOut();
            displayLoading.fadeOut();
            text.css('visibility', 'hidden');
        }

        this.css({ 'background-color': 'rgb(255,255,255)', 'color': 'black' });

        currentExhElements.displayareasub = displayareasub;

        changeOrientation();

        $(document).ready(function () {
            displayareasub.css({ 'width': '60%', 'height': '60%' });
            setTimeout(function () {
                overlayOnRoot.fadeOut();
                displayLoading.fadeOut();
                displayareasub.animate({
                    'width': '100%', 'height': '100%', 'left': '0%'
                }, 500);
            });
        });

    }

    /**
    * Function to add a related art to a tour at the bottom of the tour information section.  Takes the name of the tour to allow
    * the user to return to the appropriate tour when exiting artmode after entering it from the related art.
    *@return: related artworks
    */
    function makeRelatedArt(artInfo, tour, relatedTours) {
        //var xml = LADS.Worktop.Database.getDoqXML(artInfo.Identifier);
        //var parser = new DOMParser();
        //var artworkXML = parser.parseFromString(xml, 'text/xml');
        if (artInfo.Folders.length <= 1) {//if the artwork is not in any exhibition, don't show.
            return;
        }
        var art = $(document.createElement('div'));
        art.addClass('tour');
        art.css({
            display: 'inline-block',
            width: '30%',
            height: '100%',
            'margin-right': '1%',
            'background-color': 'black',
            'background-image': 'url(' + LADS.Worktop.Database.fixPath(artInfo.Metadata.Thumbnail) + ')',
            'background-size': 'contain',
            'background-repeat': 'no-repeat',
            'background-position': 'center center',
            overflow: 'hidden',
        });


        var artName = $(document.createElement('div'));
        artName.addClass('tourName');
        artName.css({
            width: '100%',
            height: '20%',
            padding: '3px 10px',
            'font-size': '150%',
            background: 'rgba(0,0,0,.6)',
        });

        var artTextName = artInfo.Name;

        if (artInfo.Name.length > 16) {
            artTextName = artTextName.substr(0, 16) + '...';
        }

        artName.text(artTextName);

        art.append(artName);
        //go to selected artwork mode when clicked
        art.click(function () {
            /* nbowditch _editted 2/13/2014 : added prevInfo */
            var prevInfo = { prevPage: "exhibitions", prevScroll: 0 };
            var curOpts = { catalogState: null, doq: artInfo, split: null };
            curOpts.split = 'L';
            var deepZoom = new LADS.Layout.Artmode(prevInfo, curOpts, tour);
            /* end nbowditch edit */
            root.css({ 'overflow-x': 'hidden' });
            LADS.Util.UI.slidePageLeftSplit(root, deepZoom.getRoot());
        });

        return art;
    }

    /**
    *add related tours to an exhibition in the exhibition information section. 
    *@param: tourInfo 
    *@return: interactive tours to this exhibition
    */
    function makeTour(tourInfo) {
        var tour = $(document.createElement('div'));
        tour.addClass('tour');
        tour.css({
            display: 'inline-block',
            width: '30%',
            height: '100%',
            'margin-right': '1%',
            'background-color': 'black',
            'background-image': 'url(' + LADS.Worktop.Database.fixPath(tourInfo.Metadata.Thumbnail) + ')',
            'background-size': 'contain',
            'background-repeat': 'no-repeat',
            'background-position': 'center center',
            overflow: 'hidden',
        });


        var tourName = $(document.createElement('div'));
        tourName.addClass('tourName');
        tourName.css({
            width: '100%',
            height: '20%',
            padding: '3px 10px',
            'font-size': '150%',
            background: 'rgba(0,0,0,.6)',
        });

        var tourTextName = tourInfo.Name;

        if (tourInfo.Name.length > 18) {
            tourTextName = tourTextName.substr(0, 18) + '...';
        }
        tourName.text(tourTextName);

        tour.append(tourName);

        tour.click(function () {
            switchPageTour(tourInfo);
        });

        return tour;
    }

    /**
    *switch the exhibition page to catalog/artmode
    */
    function switchPage(exhibition) {
        if (!switching) {
            switching = true;
            var catalog = new LADS.Layout.Catalog(exhibition);

            LADS.Util.UI.slidePageLeftSplit(root, catalog.getRoot(), function () {
                catalog.loadInteraction();
            });
        }
    }

    /**
    *switch player when currently in a tour page in exhibition
    */
    function switchPageTour(tour) {
        var rinData, rinPlayer;
        if (!switching) {
            switching = true;
            rinData = JSON.parse(unescape(tour.Metadata.Content));
            if (!rinData || !rinData.data) {
                var messageBox = $(LADS.Util.UI.popUpMessage(null, "Cannot play empty tour.", null));
                messageBox.css('z-index', LADS.TourAuthoring.Constants.aboveRinZIndex + 7);
                root.append(messageBox);
                messageBox.fadeIn(500);
                switching = false;
                return;
            }
            rinPlayer = new LADS.Layout.TourPlayer(rinData, tour);

            if (LADS.Util.Splitscreen.on()) {//if the splitscreen is on, exit it.
                var parentid = root.parent().attr('id');
                LADS.Util.Splitscreen.exit(parentid[parentid.length - 1]);
            }

            LADS.Util.UI.slidePageLeftSplit(root, rinPlayer.getRoot(), rinPlayer.startPlayback);
        }
    }

    /**
     * Function for reflowing page based on orientation / for splitscreen
     */
    function changeOrientation() {
        if (LADS.Util.Splitscreen.on()) { // Splitscreen and portrait mode
            leftbarHeader.css({
                height: '5%',
                width: '100%'
            });
            exhibitionLabel.css({
                width: '45%',
            });
            toursLabel.css({
                width: '45%',
            });
            if (selectText !== undefined) {
                selectText.css({
                    'font-size': '1em',
                    'letter-spacing': '0em',
                });
                titlediv.css({
                    'font-size': '3em',
                    'letter-spacing': '0em',
                });
                sub1.css({
                    'font-size': '1.5em',
                    'letter-spacing': '0em',
                });
                sub2.css({
                    'font-size': '1em',
                    'letter-spacing': '0em',
                });
            }
        } else { // Default
            leftbarHeader.css({
                height: '5%',
                width: '100%'
            });
            exhibitionLabel.css({
                width: '45%',
            });
            toursLabel.css({
                width: '45%',
            });
            if (selectText !== undefined) {
                selectText.css({
                    'font-size': LADS.Util.getMaxFontSizeEM("Begin Tour", 1, 1000, $(window).height() * 0.03),
                    'letter-spacing': 'inherit',
                });
                titlediv.css({
                    //'font-size': ,
                    'letter-spacing': 'inherit',
                });
                if (sub1) {
                    sub1.css({
                        'font-size': '3em',
                        'letter-spacing': 'inherit',
                    });
                }
                if (sub2) {
                    sub2.css({
                        'font-size': '2em',
                        'letter-spacing': 'inherit',
                    });
                }
            }
        }
    }

    function getRoot() {
        return root;
    }

};

LADS.Layout.Exhibitions.default_options = {};