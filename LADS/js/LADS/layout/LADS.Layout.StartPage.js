LADS.Util.makeNamespace("LADS.Layout.StartPage");

LADS.Layout.StartPage = function (options, startPageCallback) {
    "use strict";

    options = LADS.Util.setToDefaults(options, LADS.Layout.StartPage.default_options);
    
    options.tagContainer = $("#tagRoot");

    var root = LADS.Util.getHtmlAjax('startPage.html'),
        overlay = root.find('#overlay'),
        serverTagBuffer = $('#serverTagBuffer'),
        serverSetUpContainer = $('#serverSetUpContainer'),
        serverDialogOverlay = $(document.createElement('div')),
        repository = options.repository;

    if (localStorage.ip && localStorage.ip.indexOf(':') !== -1) {
        localStorage.ip = localStorage.ip.split(':')[0];
    }
    var serverURL = 'http://' + (localStorage.ip ? localStorage.ip + ':8080' : "browntagserver.com:8080");

    console.log("checking server url: " + serverURL);

    var tagContainer = options.tagContainer || $('body');

    testConnection();

    /**
     * Test internet and server connections
     * @param options             Object
     *            internetURL     url of alternate site against which we'll test connectivity
     */
    function testConnection(options) {
        var internetURL = (options && options.internetURL) || "http://www.google.com/";
        $.ajax({
            url: serverURL,
            dataType: "text",
            async: true,
            cache: false,
            success: function () {
                successConnecting();
            },
            error: function (err) {
                $.ajax({  // TODO: not a good way to do this
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
        LADS.Util.Constants.set("START_PAGE_SPLASH", "images/birdtextile.jpg");

        var fullScreen = root.find('#background');
        fullScreen.css('background-image', "url(" + LADS.Worktop.Database.fixPath(main.Metadata["BackgroundImage"]) + ")");

        var overlayColor = main.Metadata["OverlayColor"];
        var overlayTransparency = main.Metadata["OverlayTransparency"];

        var backgroundColor = LADS.Util.UI.hexToRGB(overlayColor) + overlayTransparency + ')';

        var imageBgColor = '#' + main.Metadata["IconColor"];
        var logoContainer = root.find('#logoContainer');
        logoContainer.css({ 'background-color': imageBgColor });

        var logo = root.find('#logo');
        logo.attr('src', LADS.Worktop.Database.fixPath(main.Metadata["Icon"]));

        logoContainer.on('click', function (evt) {
            evt.stopPropagation();
        });

        overlay.on('click', switchPage);

        var brownInfoBox = root.find('#brownInfoBox');
        brownInfoBox.on('click', expandInfo);

        var expandInfoButton = root.find('#expandInfoButton');

        var expandImage = root.find('#expandImage');

        var tagName = root.find('#tagName');

        var fullTag = root.find('#fullTag');

        var infoExpanded = false; //used to expand/collapse info
        var brownPeople = $(document.createElement('div'));
        brownPeople.attr('id', 'brownPeople');
        brownPeople.text('Brown University \nAndy van Dam, Alex Hills, Yudi Fu, Karishma Bhatia, Gregory Chatzinoff, John Connuck, David Correa, Mohsan Elahi, Aisha Ferrazares, Jessica Fu, Kaijan Gao, Jessica Herron, Ardra Hren, Hak Rim Kim, Inna Komarovsky, Ryan Lester, Benjamin LeVeque, Josh Lewis, Jinqing Li, Jeffery Lu, Xiaoyi Mao, Ria Mirchandani, Julie Mond, Ben Most, Jonathan Poon, Dhruv Rawat, Jacob Rosenfeld, Anqi Wen, Dan Zhang, Libby Zorn');

        var sponsoredText = $(document.createElement('label'));
        sponsoredText.attr('id', 'sponsoredText');
        sponsoredText.text('Sponsored by');

        var microsoftLogo = $(document.createElement('img'));
        microsoftLogo.attr('id', 'microsoftLogo');
        microsoftLogo.attr('src', 'images/icons/MicrosoftLogo.png');

        var museumName = root.find('#museumName');
        var museumNameSpan = root.find('#museumNameSpan');

        var tempName = main.Metadata["MuseumName"];
        if (tempName === undefined) {
            tempName = "";
        }
        museumNameSpan.text(tempName);

        var museumLoc = root.find('#museumLoc');
        var museumLocSpan = root.find('#museumLocSpan');

        var tempLoc = main.Metadata["MuseumLoc"];
        if (tempLoc === undefined) {
            tempLoc = "";
        }
        museumLocSpan.text(tempLoc);

        var nameDivSize;
        var nameSpanSize;
        var fontSizeSpan;

        var loadedInterval2 = setInterval(function () {
            fixText();
            clearInterval(loadedInterval2);
        });

        function fixText() { // TODO fix this up, make it cleaner
            if (LADS.Util.elementInDocument(museumName)) {
                var subheadingFont = parseInt(museumLoc.css('font-size'), 10);
                //here we are going to construct the function
                nameDivSize = museumName.height();
                fontSizeSpan = museumName.height();
                museumNameSpan.css('font-size', nameDivSize + 'px');
                nameSpanSize = museumNameSpan.height();
                while (nameDivSize < nameSpanSize) {
                    fontSizeSpan--;
                    museumNameSpan.css('font-size', fontSizeSpan + 'px');
                    nameSpanSize = museumNameSpan.height();
                }
                museumNameSpan.css('height', nameSpanSize);
            }
        }
        that.fixText = fixText;

        var museumInfoDiv = root.find('#museumInfoDiv');

        var museumInfoSpan = root.find('#museumInfoSpan');

        var tempInfo = main.Metadata["MuseumInfo"];
        if (!tempInfo) {
            tempInfo = "";
        }
        museumInfoSpan.text(tempInfo);
        var loadedInterval = setInterval(function () {
            if (LADS.Util.elementInDocument(museumInfoDiv)) {
                var subheadingFont = parseInt(museumLoc.css('font-size'), 10);
                LADS.Util.UI.fitTextInDiv(museumInfoSpan, Math.round(subheadingFont * 2 / 3), Math.round(subheadingFont * 1 / 3));
                clearInterval(loadedInterval);
            }
        });

        var infoTextHolder = root.find('#infoTextHolder');

        var infoDiv = root.find('#infoDiv');
        infoDiv.css({
            'background-color': backgroundColor
        });

        serverSetUpContainer.on('click', LADS.Util.UI.ChangeServerDialog);
        serverTagBuffer.on('click', function (evt) {
            evt.stopPropagation();
        });
        serverTagBuffer.on('click', function (evt) {
            evt.stopPropagation();
        });

        function openServerChange() {
            serverPasswdInput.val('avd');
            serverDialogOverlay.fadeIn(500);
        }

        /**
         * Allow changing ip address of the server (shows up in bottom right corner of splash screen)
         */
        var ipSave = function () {
            // VALIDATE IP, call serverIpValidationFailed if fails
            // show spinning circle
            serverCircle.show();

            // first check authoring password to make sure it's not a museum guest changing the server ip!
            LADS.Worktop.Database.getAuth($(serverPasswdInput).val(), validateIp, serverAuthFailed);
        };

        function validateIp() {
            serverPasswordErrorMessage.hide();
            var newIp = serverDialogInput.attr('value');
            newIp = (newIp.substring(0, 7) === 'http://') ? newIp : ('http://' + newIp);

            //check to see if it's valid
            $.ajax({
                url: newIp,
                dataType: "text",
                async: true,
                success: function () {
                    var oldIp = LADS.Worktop.Database.getURL();
                    localStorage.ip = newIp;
                    LADS.Worktop.Database.setURL(newIp);
                    LADS.Worktop.Database.testIp(validIp, invalidIp(oldIp));

                },
                error: function (err) {
                    serverErrorMessage.show();
                    serverCircle.hide();
                },
            });
        }
        function setPassedTrue() {
            passedServerAuth = true;
        }
        function serverAuthFailed() {
            serverCircle.hide();
            serverErrorMessage.hide();
            serverPasswordErrorMessage.show();
            return false;
        }
        function validIp() {
            serverCircle.hide();
            serverErrorMessage.hide();
            serverPasswordErrorMessage.hide();
            clearServerInputs();
            serverDialogOverlay.fadeOut(500);
        }
        function invalidIp(oldIp) {
            return function () {
                serverCircle.hide();
                serverPasswordErrorMessage.hide();
                serverErrorMessage.show();
                LADS.Worktop.Database.setURL(oldIp);
            };
        }
        function clearServerInputs() {
            serverPasswdInput.attr("value", "");
            serverDialogInput.attr("value", "");
        }

        var serverCancelButton = $(document.createElement('button'));
        serverCancelButton.attr('type', 'button');
        serverCancelButton.css({
            'padding': '1%', 'border': '1px solid white', 'width': 'auto', 'position': 'relative', 'margin-top': '1%', 'float': "right"

        });
        serverCancelButton.text('Cancel');
        serverCancelButton[0].onclick = function () {
            serverErrorMessage.hide();
            serverCircle.hide();
            clearServerInputs();
            serverDialogOverlay.fadeOut(500);
        };

        var touchHint = root.find('#touchHint');

        var handGif = root.find('#handGif');
        LADS.Util.fitText(touchHint, 2);

        handGif.onclick = switchPage;

        function preventClickThrough(event) {
            event.cancelBubble = true;
        }

        //this handes the animation for opening/closing the div that holds the information about the project
        function expandInfo(event) {
            event.stopPropagation();
            if (infoExpanded) {
                infoExpanded = false;
                $(expandImage).css({ 'transform': 'scaleX(1)' });
                $(expandInfoButton).animate({ width: '15%', 'border-top-left-radius': '0px' }, 700);
                $(brownInfoBox).animate({ width: '20%', height: '10%', right: "0%", 'border-top-left-radius': '0px' }, 700);
                $(sponsoredText).remove();
                $(microsoftLogo).remove();
                $(fullTag).animate({ left: '20%', top: '60%', 'font-size': '90%' }, 700);
                $(tagName).animate({ left: '20%', top: '10%', 'font-size': '250%' }, 700);
                $(brownPeople).animate({ "left": "75%", "top": "75%", 'font-size': '0%' }, 500);
            }
            else {
                infoExpanded = true;
                $(expandInfoButton).animate({ width: '8%', 'border-top-left-radius': '20px' }, 700);
                $(brownInfoBox).animate({ width: '60%', height: '25%', right: "0%", 'border-top-left-radius': '20px' }, 700);
                $(brownInfoBox).append(brownPeople);
                $(brownInfoBox).append(sponsoredText);
                $(brownInfoBox).append(microsoftLogo);
                $(expandImage).css({ 'transform': 'scaleX(-1)' });
                $(brownPeople).css({ "right": "0%", "bottom": "0%", "position": "absolute", "font-size": "0%" });
                $(brownPeople).animate({ "left": "12%", "top": "40%", "position": "absolute", "font-size": "80%" }, 700, 'swing', function () { $(brownPeople).fitText(5); });
                $(tagName).animate({ left: '12%', top: '3%', 'font-size': '300%' }, 700);
                $(fullTag).animate({ left: '12%', top: '25%', 'font-size': '150%' }, 700);
            }

        }

        //opens the exhibitions page on touch/click
        function switchPage() {
            var newCatalog = new LADS.Layout.NewCatalog();
            overlay.on('click', function(){});
            LADS.Util.UI.slidePageLeft(newCatalog.getRoot());
        }

        // //opens the password dialog before allowing user to enter authoring mode
        // function openDialog() {
        //     LADS.Auth.authenticate(enterAuthoringMode);
        //     if (localStorage.ip === "tagtestserver.cloudapp.net") {
        //         $("#password").attr('value', 'BrownGFX1');
        //     } else if (localStorage.ip === "10.116.71.58") {
        //         $("#password").attr('value', 'Browngfx1');
        //     }
        //     return;
        // }

        // function enterAuthoringMode() {
        //     overlay.onclick = null; //prevent repeated clicks while switch occurs
        //     authoringModeLabelContainer.off('click');
        //     var authoringMode = new LADS.Authoring.NewSettingsView();
        //     LADS.Util.UI.slidePageLeft(authoringMode.getRoot());
        // }

        
        // function divHighlight(div) {
        //     div.mousedown(function () {
        //         div.css({
        //             'background-color': 'white',
        //             'color': 'black',
        //         });
        //     });
        //     div.mouseup(function () {
        //         div.css({
        //             'background-color': 'black',
        //             'color': 'white',
        //         });
        //     });
        //     div.mouseleave(function () {
        //         div.css({
        //             'background-color': 'black',
        //             'color': 'white',
        //         });
        //     });
        // }
    }

    // function checkDataUsage() {
    //     console.log('');
    // }

    function getRoot() {
        return root;
    }
    that.getRoot = getRoot;

    return that;
};



LADS.Layout.StartPage.default_options = {
    repository: "http://cs.brown.edu/research/lads/LADS2.0Data/repository.xml",
};