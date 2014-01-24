LADS.Util.makeNamespace("LADS.Layout.StartPage");

LADS.Layout.StartPage = function (options, startPageCallback) {
    "use strict";

    options = LADS.Util.setToDefaults(options, LADS.Layout.StartPage.default_options);
    
    options.tagContainer = $("#tagRoot"); // TODO more general

    var root = LADS.Util.getHtmlAjax('startPage.html'), // use AJAX to load html from .html file
        overlay = root.find('#overlay'),
        serverTagBuffer = root.find('#serverTagBuffer'),
        serverSetUpContainer = root.find('#serverSetUpContainer'),
        // repository = options.repository,
        serverURL,
        tagContainer;

    if (localStorage.ip && localStorage.ip.indexOf(':') !== -1) {
        localStorage.ip = localStorage.ip.split(':')[0];
    }
    
    serverURL = 'http://' + (localStorage.ip ? localStorage.ip + ':8080' : "browntagserver.com:8080");
    tagContainer = options.tagContainer || $('body');

    testConnection();

    /**
     * Test internet and server connections
     * @param options             Object
     *            internetURL     url of alternate site against which we'll test connectivity
     */
    function testConnection(options) {
        var internetURL = (options && options.internetURL) || "http://www.google.com/";
        console.log("checking server url: " + serverURL);
        $.ajax({
            url: serverURL,
            dataType: "text",
            async: true,
            cache: false,
            success: function () {
                successConnecting();
            },
            error: function (err) {
                $.ajax({  // TODO: not a solid way to do this
                    url: internetURL,
                    dataType: "text",
                    async: false,
                    cache: false,
                    success: function () {
                        tagContainer.empty();
                        tagContainer.append((new LADS.Layout.InternetFailurePage("Server Down")).getRoot());
                    },
                    error: function (err) {
                        tagContainer.empty();
                        tagContainer.append((new LADS.Layout.InternetFailurePage("No Internet")).getRoot());
                    }
                });
            }
        });
    }

    function successConnecting() {
        LADS.Worktop.Database.getMain(loadHelper, function () {
            tagContainer.empty();
            tagContainer.append((new LADS.Layout.InternetFailurePage("Server Down")).getRoot());
        });
        if (startPageCallback) {
            startPageCallback(root);
        }
    }

    var that = {};

    //sets up the entire visual layout and images of the splash screen
    function loadHelper(main) {
        var fullScreen,
            overlayColor,
            overlayTransparency,
            backgroundColor,
            imageBgColor,
            logoContainer,
            logo,
            brownInfoBox,
            expandInfoButton,
            expandImage,
            tagName,
            fullTag,
            infoExpanded,
            brownPeople,
            sponsoredText,
            microsoftLogo,
            museumName,
            museumNameSpan,
            tempName,
            museumLoc,
            museumLocSpan,
            tempLoc,
            museumInfoDiv,
            museumInfoSpan,
            tempInfo,
            infoTextHolder,
            infoDiv,
            touchHint,
            handGif;

        LADS.Util.Constants.set("START_PAGE_SPLASH", "images/birdtextile.jpg");

        fullScreen = root.find('#background');
        fullScreen.css('background-image', "url(" + LADS.Worktop.Database.fixPath(main.Metadata["BackgroundImage"]) + ")");

        overlayColor = main.Metadata["OverlayColor"];
        overlayTransparency = main.Metadata["OverlayTransparency"];

        backgroundColor = LADS.Util.UI.hexToRGB(overlayColor) + overlayTransparency + ')';

        imageBgColor = '#' + main.Metadata["IconColor"];
        logoContainer = root.find('#logoContainer');
        logoContainer.css({ 'background-color': imageBgColor });

        logo = root.find('#logo');
        logo.attr('src', LADS.Worktop.Database.fixPath(main.Metadata["Icon"]));

        logoContainer.on('click', function (evt) {
            evt.stopPropagation();
        });

        overlay.on('click', switchPage);

        brownInfoBox = root.find('#brownInfoBox');
        brownInfoBox.on('click', expandInfo);

        expandInfoButton = root.find('#expandInfoButton');
        expandImage = root.find('#expandImage');
        tagName = root.find('#tagName');
        fullTag = root.find('#fullTag');

        infoExpanded = false; //used to expand/collapse info
        brownPeople = $(document.createElement('div'));
        brownPeople.attr('id', 'brownPeople');
        brownPeople.text('Brown University \nAndy van Dam, Alex Hills, Yudi Fu, Karishma Bhatia, Gregory Chatzinoff, John Connuck, David Correa, Mohsan Elahi, Aisha Ferrazares, Jessica Fu, Kaijan Gao, Jessica Herron, Ardra Hren, Hak Rim Kim, Inna Komarovsky, Ryan Lester, Benjamin LeVeque, Josh Lewis, Jinqing Li, Jeffery Lu, Xiaoyi Mao, Ria Mirchandani, Julie Mond, Ben Most, Jonathan Poon, Dhruv Rawat, Jacob Rosenfeld, Anqi Wen, Dan Zhang, Libby Zorn');

        sponsoredText = $(document.createElement('label'));
        sponsoredText.attr('id', 'sponsoredText');
        sponsoredText.text('Sponsored by');

        microsoftLogo = $(document.createElement('img'));
        microsoftLogo.attr('id', 'microsoftLogo');
        microsoftLogo.attr('src', 'images/icons/MicrosoftLogo.png');

        museumName = root.find('#museumName');
        museumNameSpan = root.find('#museumNameSpan');

        tempName = main.Metadata["MuseumName"];
        if (tempName === undefined) {
            tempName = "";
        }
        museumNameSpan.text(tempName);

        museumLoc = root.find('#museumLoc');
        museumLocSpan = root.find('#museumLocSpan');

        tempLoc = main.Metadata["MuseumLoc"];
        if (tempLoc === undefined) {
            tempLoc = "";
        }
        museumLocSpan.text(tempLoc);

        var loadedInterval2 = setInterval(function () { // TODO is this interval necessary?
            fixText();
            clearInterval(loadedInterval2);
        });

        function fixText() { // TODO fix this up, make it cleaner
            var nameDivSize,
                nameSpanSize,
                fontSizeSpan,
                subheadingFont;
            if (LADS.Util.elementInDocument(museumName)) {
                subheadingFont = parseInt(museumLoc.css('font-size'), 10);
                //here we are going to construct the function
                nameDivSize = museumName.height();
                fontSizeSpan = museumName.height();
		/*                
		museumNameSpan.css('font-size', nameDivSize + 'px');
                nameSpanSize = museumNameSpan.height();
                while (nameDivSize < nameSpanSize) {
                    fontSizeSpan--;
                    museumNameSpan.css('font-size', fontSizeSpan + 'px');
                    nameSpanSize = museumNameSpan.height();
                }*/
                museumNameSpan.css('height', nameSpanSize);
            }
        }
        that.fixText = fixText;

        museumInfoDiv = root.find('#museumInfoDiv');

        museumInfoSpan = root.find('#museumInfoSpan');

        tempInfo = main.Metadata["MuseumInfo"];
        if (!tempInfo) {
            tempInfo = "";
        }
        museumInfoSpan.text(tempInfo);
	
	/*
        var loadedInterval = setInterval(function () { // TODO must be a better way...
            if (LADS.Util.elementInDocument(museumInfoDiv)) {
                var subheadingFont = parseInt(museumLoc.css('font-size'), 10);
                LADS.Util.UI.fitTextInDiv(museumInfoSpan, Math.round(subheadingFont * 2 / 3), Math.round(subheadingFont * 1 / 3));
                clearInterval(loadedInterval);
            }
        });*/

        infoTextHolder = root.find('#infoTextHolder');

        infoDiv = root.find('#infoDiv');
        infoDiv.css({
            'background-color': backgroundColor
        });

        serverSetUpContainer.on('click', function() {
            LADS.Util.UI.ChangeServerDialog()
        });
        serverTagBuffer.on('click', function (evt) {
            evt.stopPropagation();
        });

        touchHint = root.find('#touchHint');

        handGif = root.find('#handGif');
        //LADS.Util.fitText(touchHint, 2);

        handGif.onclick = switchPage;

        //this handes the animation for opening/closing the div that holds the information about the project
        function expandInfo(event) {
            event.stopPropagation();
            if (infoExpanded) {
                infoExpanded = false;
                expandImage.css({ 'transform': 'scaleX(1)' });
                expandInfoButton.animate({ width: '15%', 'border-top-left-radius': '0px' }, 700);
                brownInfoBox.animate({ width: '20%', height: '10%', right: "0%", 'border-top-left-radius': '0px' }, 700);
                sponsoredText.remove();
                microsoftLogo.remove();
                fullTag.animate({ left: '20%', top: '60%', 'font-size': '90%' }, 700);
                tagName.animate({ left: '20%', top: '10%', 'font-size': '200%' }, 700);
                brownPeople.animate({ "left": "75%", "top": "75%", 'font-size': '0%' }, 500);
            }
            else {
                infoExpanded = true;
                expandInfoButton.animate({ width: '8%', 'border-top-left-radius': '20px' }, 700);
                brownInfoBox.animate({ width: '60%', height: '25%', right: "0%", 'border-top-left-radius': '20px' }, 700);
                brownInfoBox.append(brownPeople);
                brownInfoBox.append(sponsoredText);
                brownInfoBox.append(microsoftLogo);
                expandImage.css({ 'transform': 'scaleX(-1)' });
                brownPeople.css({ "right": "0%", "bottom": "0%", "position": "absolute", "font-size": "0%" });
                brownPeople.animate({ "left": "12%", "top": "51%", "position": "absolute", "font-size": "81%" }, 700, 'swing', function () { $(brownPeople).fitText(5); });
                tagName.animate({ left: '12%', top: '3%', 'font-size': '300%' }, 700);
                fullTag.animate({ left: '12%', top: '35%', 'font-size': '130%' }, 700);
            }
        }

        //opens the exhibitions page on touch/click
        function switchPage() {
            var newCatalog = new LADS.Layout.NewCatalog();
            overlay.on('click', function(){});
            LADS.Util.UI.slidePageLeft(newCatalog.getRoot());
        }
    }

    function getRoot() {
        return root;
    }
    that.getRoot = getRoot;

    return that;
};



LADS.Layout.StartPage.default_options = {
    repository: "http://cs.brown.edu/research/lads/LADS2.0Data/repository.xml",
};
