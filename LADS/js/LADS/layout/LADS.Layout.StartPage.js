LADS.Util.makeNamespace("LADS.Layout.StartPage");


/**
* The start page for TAG, which contains mueseum info, server preferences and credits.
* @class LADS.Layout.StartPage
* @constructor
*
* @param {Object} options
* @param {Function} startPageCallback
* @return {Object} that                 collection of public methods and properties
*/
LADS.Layout.StartPage = function (options, startPageCallback) {
    "use strict";

    options = LADS.Util.setToDefaults(options, LADS.Layout.StartPage.default_options);
    
    options.tagContainer = $("#tagRoot");

    var root = LADS.Util.getHtmlAjax('StartPage.html'), // use AJAX to load html from .html file
        overlay = root.find('#overlay'),
        serverTagBuffer = root.find('#serverTagBuffer'),
        serverSetUpContainer = root.find('#serverSetUpContainer'),
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
    var backgroundColor,
        logoContainer,
        touchHint,
        handGif;    

    /**
    * sets up the entire visual layout and images of the splash screen
    * @method loadHelper
    * @param {Object} main     contains all image paths and museum info
    */
    function loadHelper(main) {
        LADS.Util.Constants.set("START_PAGE_SPLASH", tagPath+"images/birdtextile.jpg");
        if(!allowServerChange) {
            $('#serverTagBuffer').remove();
        }
    
        overlay.on('click', switchPage);
        
        setImagePaths(main);
        setUpCredits();
        setUpInfo(main);
        initializeHandlers();
        
        handGif.onclick = switchPage;
        //opens the exhibitions page on touch/click
        function switchPage() {
            var newCatalog = LADS.Layout.NewCatalog();
            overlay.on('click', function(){});
            LADS.Util.UI.slidePageLeft(newCatalog.getRoot());
        }

        // Test for browser compatibility
        if(!isBrowserCompatible()) {
            console.log("Unsupported browser.");

            var tagContainer = $('#tagRoot');

            // Creating Overlay
            var browserDialogOverlay = $(document.createElement('div'));
            browserDialogOverlay.attr('id', 'browserDialogOverlay');
            browserDialogOverlay.addClass('dialogBoxOverlay');
            tagContainer.prepend(browserDialogOverlay);

            // Creating Dialog Box Container (required for centering)
            var browserDialogContainer = $(document.createElement('div'));
            browserDialogContainer.attr('id', 'browserDialogContainer');
            browserDialogContainer.addClass('dialogBoxContainer');
            browserDialogOverlay.append(browserDialogContainer);

            // Creating Dialog Box
            var browserDialog = $(document.createElement('div'));
            browserDialog.attr('id', 'browserDialog');
            browserDialog.addClass('dialogBox');
            browserDialogContainer.append(browserDialog);

            // Content
            var browserDialogPara = $(document.createElement('p'));
            browserDialogPara.attr('id', 'dialogBoxPara');
            browserDialogPara.text("Touch Art Gallery is not supported in your browser. Please download or update to a newer browser.");
            browserDialog.append(browserDialogPara);

            // Browser Icon Container
            var browserIcons = $(document.createElement('div'));
            browserIcons.attr('id', 'browserIcons');
            browserDialog.append(browserIcons);

            // Browser Icon Links
            var ieIconLink = $(document.createElement('a')); ieIconLink.attr('href', 'http://windows.microsoft.com/ie');
            var chromeIconLink = $(document.createElement('a')); chromeIconLink.attr('href', 'https://www.google.com/chrome');
            var firefoxIconLink = $(document.createElement('a')); firefoxIconLink.attr('href', 'http://www.firefox.com');
            var safariIconLink = $(document.createElement('a')); safariIconLink.attr('href', 'http://www.apple.com/safari');

            browserIcons.append(ieIconLink, chromeIconLink, firefoxIconLink, safariIconLink);
            $('#browserIcons a').addClass('browserIconLink');

            // Browser Icon Images
            var ieIcon = $(document.createElement('img')); ieIcon.attr('title', 'Internet Explorer'); ieIconLink.append(ieIcon);
            var chromeIcon = $(document.createElement('img')); chromeIcon.attr('title', 'Google Chrome'); chromeIconLink.append(chromeIcon);
            var firefoxIcon = $(document.createElement('img')); firefoxIcon.attr('title', 'Firefox'); firefoxIconLink.append(firefoxIcon);
            var safariIcon = $(document.createElement('img')); safariIcon.attr('title', 'Safari'); safariIconLink.append(safariIcon);

            ieIcon.attr('src', tagPath+'images/icons/browserIcons/ie.png');
            chromeIcon.attr('src', tagPath+'images/icons/browserIcons/chrome.png');
            firefoxIcon.attr('src', tagPath+'images/icons/browserIcons/firefox.png');
            safariIcon.attr('src', tagPath+'images/icons/browserIcons/safari.png');

            $('#browserIcons a img').addClass('browserIcon');
        }
    }

    /**
    * @method isBrowserCompatible
    *
    * @return true if the browser is compatible with TAG, false if it isn't
    */
    function isBrowserCompatible() {
        var userAgent = navigator.userAgent.toLowerCase();
        console.log("userAgent: " + navigator.userAgent);

        if(userAgent.indexOf('android') >= 0 || userAgent.indexOf('iphone') >= 0 || userAgent.indexOf('ipad') >= 0) {
            if(userAgent.indexOf('android') >= 0) {
                console.log("Detected Android Device. Unsupported browser.");
            } else if (userAgent.indexOf('iphone') >= 0) {
                console.log("Detected iPhone. Unsupported browser.");
            } else if (userAgent.indexOf('ipad') >= 0) {
                console.log("Detected iPad. Unsupported browser.");
            }
            return false;
        } else {
            var browser = getBrowserVersion();
            console.log("Browser Version: " + browser);

            browser = browser.toLowerCase();
            var version = 0;

            if(browser.indexOf('opera') >= 0) {
                console.log("Detected Opera. Unsupported browser.");
                return false;
            } else if(browser.indexOf('chrome') >= 0) {
                version = browser.substring(browser.indexOf(' ') + 1, browser.indexOf("."));
                console.log("Detected Chrome Version: " + version);
                return(version >= 31);
            } else if(browser.indexOf('safari') >= 0) {
                var detailedVersion = browser.substring(browser.indexOf(' ', browser.indexOf(' ') + 1) + 1);
                version = detailedVersion.substring(0, detailedVersion.indexOf("."));
                console.log("Detected Safari Version: " + version);
                return(version >= 7);
            } else if(browser.indexOf('firefox') >= 0) {
                version = browser.substring(browser.indexOf(' ') + 1, browser.indexOf("."));
                console.log("Detected Firefox Version: " + version);
                return(version >= 28);
            } else if(browser.indexOf('msie') >= 0 || browser.indexOf('ie') >= 0) {
                version = browser.substring(browser.indexOf(' ') + 1, browser.indexOf("."));
                console.log("Detected IE Version: " + version);
                return(version >= 10);
            } else {
                return false;
            }
        }
    }

    /** 
    * @method getBrowserVersion
    *
    * @return Browser name followed by version e.g. "Chrome 34.0.1847.116"
    */
    function getBrowserVersion() {
        var ua= navigator.userAgent, tem, 
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];

        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }

        M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];

        return M.join(' ');
    }
    
    /**
    * adjusts the text to fit the screen size
    * @method fixText
    */
    function fixText() { // TODO fix this up, make it cleaner
            var nameDivSize,
                nameSpanSize,
                fontSizeSpan,
                subheadingFont;
            if (LADS.Util.elementInDocument(museumName)) {
                subheadingFont = parseInt(museumLoc.css('font-size'), 10);
                nameDivSize = museumName.height();
                fontSizeSpan = museumName.height();
    
                museumNameSpan.css('height', nameSpanSize);
            }
        }

    /**
    * initializes the handlers for various 'click' functions including setting up a server
    * @method initializeHandlers
    */
    function initializeHandlers(){
        logoContainer.on('click', function (evt) {
            evt.stopPropagation();
        });

        serverSetUpContainer.on('click', function() {
            LADS.Util.UI.ChangeServerDialog();
        });

        serverTagBuffer.on('click', function (evt) {
            evt.stopPropagation();
        });

        overlay.on('click', 'a', function (evt) {
            //this == the link that was clicked
            var href = $(this).attr("href");
            evt.stopPropagation();
        });
    }


    /**
    * gets the paths for all the images displayed on the splash screen
    * @method setImagePaths
    * @param {Object} main    contains all the image links
    */
    function setImagePaths(main){
        var fullScreen,
            overlayColor,
            overlayTransparency,
            imageBgColor,
            logo;
        // set image paths
        root.find('#expandImage').attr('src', tagPath+'images/icons/Left.png');
        root.find('#handGif').attr('src', tagPath+'images/RippleNewSmall.gif');

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
    }

    
    /**
    * Sets up the credits box with its content including text and images. Also includes function for animation of credits.
    * @method setUpCredits
    */
    function setUpCredits(){
        var brownInfoBox,
            expandInfoButton,
            expandImage,
            tagName,
            fullTag,
            infoExpanded,
            brownPeople,
            sponsoredText,
            microsoftLogo;

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
        sponsoredText.css('overflow', 'hidden');
        sponsoredText.css('white-space', 'pre');
        sponsoredText.text('Sponsored by');

        microsoftLogo = $(document.createElement('img'));
        microsoftLogo.attr('id', 'microsoftLogo');
        microsoftLogo.attr('src', tagPath+'images/icons/MicrosoftLogo.png');

        /**
        * animation of credits when user clicks 
        * @method expandInfo
        * @param {Object} event     the trigger event for animation, in this case a click
        */
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
                brownPeople.animate({ "left": "12%", "top": "51%", "position": "absolute", "font-size": "61%" }, 700, 'swing', function () { $(brownPeople).fitText(5); });
                tagName.animate({ left: '12%', top: '3%', 'font-size': '300%' }, 700);
                fullTag.animate({ left: '12%', top: '35%', 'font-size': '130%' }, 700);
            }
        }
    }

    
    /**
    * sets up the info div which contains all the museum information
    * @method setUpInfo
    * @param {Object} main    contains all the museum information
    */
    function setUpInfo(main){
        var infoTextHolder,
            infoDiv;
        
        infoTextHolder = root.find('#infoTextHolder');
        infoDiv = root.find('#infoDiv');
        infoDiv.css({
            'background-color': backgroundColor
        });

        touchHint = root.find('#touchHint');
        handGif = root.find('#handGif');

        setUpMuseumInfo(main);

    }

    
    /**
    * Fills in all museum info including name and location
    * @method setUpMuseumInfo
    * @param {Object} main     contains all the museum information
    */
    function setUpMuseumInfo(main){
        var museumName,
            museumNameSpan,
            tempName,
            museumLoc,
            museumLocSpan,
            tempLoc,
            museumInfoDiv,
            museumInfoSpan,
            tempInfo;
            
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

        that.fixText = fixText;

        museumInfoDiv = root.find('#museumInfoDiv');

        museumInfoSpan = root.find('#museumInfoSpan');
        tempInfo = main.Metadata["MuseumInfo"];
        if (!tempInfo) {
            tempInfo = "";
        }

        if (typeof Windows != "undefined") {
            // running in Win8 app
            museumInfoSpan.html(tempInfo);
        } else {  
            // running in browser
            museumInfoSpan.html(Autolinker.link(tempInfo , {email: false, twitter: false}));
        }
    }
    

    /**
    * @method getRoot
    * @return    the root of the splash screen DOM
    */
    function getRoot() {
        return root;
    }
    that.getRoot = getRoot;

    return that;
};

LADS.Layout.StartPage.default_options = {
    repository: "http://cs.brown.edu/research/lads/LADS2.0Data/repository.xml",
};
