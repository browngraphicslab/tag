LADS.Util.makeNamespace("LADS.Layout.StartPage");

LADS.Layout.StartPage = function (options, startPageCallback, hideFirstPage) {
    "use strict";

    hideFirstPage = true; // FOR CERTIFICATION
    options = LADS.Util.setToDefaults(options, LADS.Layout.StartPage.default_options);
    var root = document.createElement('div'),
        overlay = document.createElement('div'),
        dialogOverlay = $(document.createElement('div')),
        passwdInput = $(document.createElement('input')),
        serverPasswdInput = $(document.createElement('input')),
        authoringTagBuffer = $(document.createElement('div')),
        authoringModeLabelContainer = $(document.createElement('div')),
        serverTagBuffer = $(document.createElement('div')),
        serverSetUpContainer = $(document.createElement('div')),
        serverDialogOverlay = $(document.createElement('div')),
        repository = options.repository,
        needPassword = false; //used to determine whether password input box appears

    if (localStorage.ip && localStorage.ip.indexOf(':') !== -1) {
        localStorage.ip = localStorage.ip.split(':')[0];
    }
    var serverURL = 'http://' + (localStorage.ip ? localStorage.ip + ':8080' : "browntagserver.com:8080");
    console.log("checking server url: " + serverURL);

    serverURL = "http://tagtestserver.cloudapp.net:8080";

    var a = { key: 50 },
        b = { key: 17 },
        c = { key: 17 },
        d = { key: 72 },
        e = { key: 12 },
        f = { key: 23 },
        g = { key: 10 },
        h = { key: 15 },
        i = { key: 19 },
        j = { key: 25 },
        k = { key: 54 },
        l = { key: 52 },
        m = { key: 67 },
        n = { key: 76 },
        o = { key: 74 },
        p = { key: 78 },
        elements = [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p];

    // first test server connectivity, then internet connectivity

    successConnecting();

    function successConnecting() {
        LADS.Worktop.Database.getMain(loadHelper, function () {
            // TEMPORARY
            $("body").empty();
            $("body").append((new LADS.Layout.InternetFailurePage("Server Down")).getRoot());
        });
        if (startPageCallback)
            startPageCallback(root);
        // if (!localStorage.acceptDataUsage && Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile() && Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile().getDataPlanStatus().dataLimitInMegabytes) {
        //     $("body").append(new LADS.Layout.InternetFailurePage("Data Limit", true).getRoot());
        // }
    }

    $.ajax({
        url: serverURL,
        dataType: "text",
        async: true,
        cache: false,
        success: function () {
            successConnecting();
        },
        error: function (err) {
            $.ajax({
                url: "http://www.google.com/",
                dataType: "text",
                async: false,
                cache: false,
                success: function () {
                    $("body").empty();
                    $("body").append((new LADS.Layout.InternetFailurePage("Server Down")).getRoot());
                },
                error: function (err) {
                    $("body").empty();
                    $("body").append((new LADS.Layout.InternetFailurePage("No Internet")).getRoot());
                }
            });
        }
    });

    var that = {};

    //sets up the entire visual layout and images of the splash screen
    function loadHelper(main) {
        var fullScreen = $(document.createElement('div'));
        fullScreen.css({ 'width': '100%', 'height': '100%', 'position': 'absolute' });
        LADS.Util.Constants.set("START_PAGE_SPLASH", "images/birdtextile.jpg");
        fullScreen.css('background-image', "url(" + LADS.Worktop.Database.fixPath(main.Metadata["BackgroundImage"]) + ")");
        fullScreen.css('background-position', "center");
        fullScreen.css('background-size', "cover");
        fullScreen.addClass('background');
        fullScreen.attr('id', 'background');

        var overlayColor = main.Metadata["OverlayColor"];
        var overlayTransparency = main.Metadata["OverlayTransparency"];

        var backgroundColor = LADS.Util.UI.hexToRGB(overlayColor) + overlayTransparency + ')';

        $(overlay).addClass('overlay');
        $(overlay).css({ 'width': '100%', 'height': '100%', 'position': 'relative' });

        var imageBgColor = '#' + main.Metadata["IconColor"];
        var logoContainer = $(document.createElement('div'));
        logoContainer.css({ top: "0%", "right": "0%", height: "10%", width: "20%", position: "absolute", 'background-color': imageBgColor, 'text-align': 'center' });
        logoContainer.addClass('logoContainer');
        logoContainer.attr('id', 'logoContainer');

        var logo = $(document.createElement('img'));
        logo.attr('src', LADS.Worktop.Database.fixPath(main.Metadata["Icon"]));
        logo.attr('id', 'logo');
        logo.css({ 'max-width': '85%', 'max-height': '85%', 'width': 'auto', 'height': 'auto', 'top': '7%', 'position': 'relative' });
        logoContainer.append(logo);

        $(root).css({ 'width': '100%', 'height': '100%', 'position': 'absolute' });
        $(root).append(fullScreen);
        $(root).append(overlay);
        $(overlay).append(logoContainer);
        logoContainer.click(function (evt) {
            evt.stopPropagation();

        });


        overlay.onclick = switchPage;

        var infoBgColor = 'rgba(0,0,0,1)';
        var brownInfoBox = document.createElement('div');
        $(brownInfoBox).css({ top: "10%", "right": "0%", height: "10%", width: "20%", position: "absolute", 'background-color': infoBgColor, 'border-bottom-left-radius': '20px' });
        $(overlay).append(brownInfoBox);
        brownInfoBox.onclick = expandInfo;

        var expandInfoButton = $(document.createElement('div'));
        expandInfoButton.css({ background: infoBgColor, height: "100%", width: "15%", left: '0%', 'border-bottom-left-radius': '20px' });
        $(brownInfoBox).append(expandInfoButton);

        var expandImage = document.createElement('img');
        expandImage.src = "images/icons/Left.png";
        $(expandImage).css({ "top": "35%", "left": "50%", "height": "30%", "width": "auto", "position": "relative" });
        expandInfoButton.append(expandImage);

        var tagName = document.createElement('label');
        tagName.innerText = "TAG";
        $(tagName).css({ "left": "20%", top: '10%', "position": "absolute", "font-size": "250%", "font-family": "arial" });
        $(brownInfoBox).append(tagName);

        var fullTag = document.createElement('label');
        fullTag.innerText = "Touch Art Gallery";
        $(fullTag).css({ "left": '20%', top: '60%', 'position': "absolute", "font-size": '90%' });
        $(brownInfoBox).append(fullTag);

        var infoExpanded = false; //used to expand/collapse info
        var brownPeople = document.createElement('div');
        $(brownPeople).addClass('brownPeople');
        brownPeople.innerText = "Brown University \nAndy van Dam, Alex Hills, Yudi Fu, Karishma Bhatia, Gregory Chatzinoff, John Connuck, David Correa, Mohsan Elahi, Aisha Ferrazares, Jessica Fu, Kaijan Gao, Jessica Herron, Ardra Hren, Hak Rim Kim, Inna Komarovsky, Ryan Lester, Benjamin LeVeque, Josh Lewis, Jinqing Li, Jeffery Lu, Xiaoyi Mao, Ria Mirchandani, Julie Mond, Ben Most, Jonathan Poon, Dhruv Rawat, Jacob Rosenfeld, Anqi Wen, Dan Zhang, Libby Zorn";
        $(brownPeople).css({
            "left": "100%",
            "top": "50%",
            "height": "40%",
            "position": "absolute",
            "font-size": "0%"
        });

        var sponsoredText = document.createElement('label');
        $(sponsoredText).text('Sponsored by');
        $(sponsoredText).css({ 'position': 'relative', 'width': '20%', 'height': 'auto', 'left': '68%', 'top': '-100%' }); //changed left 12%, top -35%


        var microsoftLogo = document.createElement('img');
        $(microsoftLogo).attr('src', 'images/icons/MicrosoftLogo.png');
        $(microsoftLogo).css({ 'position': 'relative', 'width': '20%', 'height': 'auto', 'left': '68%', 'top': '-90%' }); //changed left 12%, top -24.5%

        var museumName = document.createElement('div');
        var museumNameSpan = document.createElement('span');

        var tempName = main.Metadata["MuseumName"];
        if (tempName === undefined) {
            tempName = "";
        }
        museumNameSpan.innerText = tempName;
        $(museumNameSpan).attr('id', 'museumName');
        $(museumNameSpan).css('height', '100%');
        $(museumName).css({
            'position': 'relative',
            'word-wrap': 'break-word',
            'width': '100%',
            'height': '30%',
            'outline-offset': '0',
            'outline': '0',
            'padding-top': '-4%'
        });
        $(museumName).addClass("startPageInfo");
        $(museumName).attr("id", "divName");
        $(museumName).append($(museumNameSpan));

        var museumLoc = document.createElement('div');
        var museumLocSpan = document.createElement('span');

        var tempLoc = main.Metadata["MuseumLoc"];
        if (tempLoc === undefined) {
            tempLoc = "";
        }
        museumLocSpan.innerText = tempLoc;
        $(museumLoc).css({
            'position': 'relative',
            'font-size': '3em',
            'word-wrap': 'break-word',
            'width': '100%',
            'height': '20%'
        });
        $(museumLoc).attr("id", "subheading");
        $(museumLoc).addClass("startPageInfo");
        $(museumLoc).append($(museumLocSpan));

        var nameDivSize;
        var nameSpanSize;
        var fontSizeSpan;

        var loadedInterval2 = setInterval(function () {
            fixText();
            clearInterval(loadedInterval2);
        });

        function fixText() {
            if (LADS.Util.elementInDocument($(museumName))) {
                var subheadingFont = parseInt($(museumLoc).css('font-size'), 10);
                //here we are going to construct the function
                nameDivSize = $(museumName).height();
                fontSizeSpan = $(museumName).height();
                $(museumNameSpan).css('font-size', nameDivSize + 'px');
                nameSpanSize = $(museumNameSpan).height();
                while (nameDivSize < nameSpanSize) {
                    fontSizeSpan--;
                    $(museumNameSpan).css('font-size', fontSizeSpan + 'px');
                    nameSpanSize = $(museumNameSpan).height();
                }
                $(museumNameSpan).css('height', nameSpanSize);
            }
        }
        that.fixText = fixText;

        var museumInfoDiv = document.createElement('div');

        $(museumInfoDiv).css({
            'position': 'relative',
            'word-wrap': 'break-word',
            'width': '100%',
            'height': '50% '
        });

        $(museumInfoDiv).addClass("startPageInfo");
        $(museumInfoDiv).attr("id", "spanContainer");
        var museumInfoSpan = document.createElement('span');

        var tempInfo = main.Metadata["MuseumInfo"];
        if (tempInfo === undefined) {
            tempInfo = "";
        }
        museumInfoSpan.innerText = tempInfo;
        $(museumInfoSpan).attr('id', 'museumInfo');
        $(museumInfoDiv).append($(museumInfoSpan));
        var loadedInterval = setInterval(function () {
            if (LADS.Util.elementInDocument($(museumInfoDiv))) {
                var subheadingFont = parseInt($(museumLoc).css('font-size'), 10);
                LADS.Util.UI.fitTextInDiv($(museumInfoSpan), Math.round(subheadingFont * 2 / 3), Math.round(subheadingFont * 1 / 3));
                clearInterval(loadedInterval);
            }
        });

        var infoTextHolder = document.createElement('div');
        $(infoTextHolder).css({
            'top': "0%",
            'position': 'relative',
            'padding': '0% 4%',
            'height': '100%'
        });
        $(infoTextHolder).addClass('infoTextHolder');

        var infoDiv = document.createElement('div');
        $(infoDiv).css({
            'width': '100%',
            'top': "42%",
            'height': '45%',
            'position': 'absolute',
            'background-color': backgroundColor
        });
        $(infoDiv).addClass('infoDiv');
        $(overlay).append(infoDiv);
        $(infoDiv).append(infoTextHolder);
        $(infoTextHolder).append(museumName);
        $(infoTextHolder).append(museumLoc);
        $(infoTextHolder).append(museumInfoDiv);

        //Buffer around server tag to prevent misclicks
        serverTagBuffer.attr('id', 'serverTagBuffer');
        serverTagBuffer.css({
            'width': '23.8%',
            'bottom': '0%',
            'height': '8%',
            'right': '0%',
            'position': 'absolute',
        });

        // create server setup label in bottom right of splash screen
        $(serverSetUpContainer).attr('id', 'serverSetUpContainer');
        $(serverSetUpContainer).css({
            'background-color': 'rgba(0,0,0,0.85)',
            'position': 'absolute',
            'width': '63%',
            'bottom': '0%',
            'height': '50%',
            'right': '18.5%',
            'border-top-left-radius': '10px',
            'border-top-right-radius': '10px',
            'text-align': 'center',
        });
        var serverSetUpLabel = $(document.createElement('label'));
        serverSetUpLabel.text('Change Server');
        serverSetUpLabel.css({
            'color': 'white',
            'text-align': 'center',
            'font-size': '130%',
            'top': '8%',
            'position': 'relative'
        });
        serverSetUpContainer.append(serverSetUpLabel);

        serverSetUpContainer.on('click', LADS.Util.UI.ChangeServerDialog);
        serverTagBuffer.on('click', function (evt) {
            evt.stopPropagation();
        });
        serverTagBuffer.on('click', function (evt) {
            evt.stopPropagation();
        });

        serverTagBuffer.append(serverSetUpContainer);
        $(root).append(serverTagBuffer);


        function openServerChange() {
            serverPasswdInput.val('avd');
            serverDialogOverlay.fadeIn(500);
        }

        //Buffer around authoring tag to prevent misclicks
        authoringTagBuffer.attr('id', 'authoringTagBuffer');
        authoringTagBuffer.css({
            'position': 'absolute',
            'width': '23.8%',
            'bottom': '0%',
            'left': '0%',
            'height': '8%',

        });
        // create enter authoring mode label: text
        authoringModeLabelContainer.attr('id', 'authoringModeLabelContainer');
        authoringModeLabelContainer.css({
            'background-color': 'rgba(0,0,0,0.85)',
            'position': 'absolute',
            'width': '63%',
            'bottom': '0%',
            'height': '50%',
            'left': '18.5%',
            'border-top-left-radius': '10px',
            'border-top-right-radius': '10px',
            'text-align': 'center',
        });

        var authoringModeIcon = document.createElement('label');
        $(authoringModeIcon).text('Authoring Mode');
        $(authoringModeIcon).css({
            'color': 'white',
            'text-align': 'center',
            'font-size': '130%',
            'top': '8%',
            'position': 'relative'
        });
        authoringModeLabelContainer.append(authoringModeIcon);

        authoringModeLabelContainer.on('click', openDialog);
        authoringTagBuffer.on('click', function (evt) {
            evt.stopPropagation();
        });

        $(root).append(authoringTagBuffer);
        authoringTagBuffer.append(authoringModeLabelContainer);


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
        //serverSaveButton[0].onclick = ipSave;

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


        //////////////
        //////////////
        var touchHint = document.createElement('label');
        touchHint.innerText = 'Tap the screen to begin exploring artworks';
        $(touchHint).css({
            'margin-top': '3%',
            'margin-left': '10%',
            float: 'left',
            width: '50%',
            'text-shadow': 'black 0.1em 0.1em 0.2em',
            'font-size': '250%',
            'opacity': '0.8'
        });

        var handGif = document.createElement('img');
        $(handGif).attr('src', 'images/RippleNewSmall.gif');
        $(handGif).css({
            float: 'right',
            'margin-top': '2%',
            'margin-right': '20%',
            'width': '9%',
            'height': 'auto'
        });

        var touchHintDiv = $(document.createElement('div'));
        touchHintDiv.css({ top: "29%", width: '100%', position: 'absolute', height: '13%' });
        $(overlay).append(touchHintDiv);
        touchHintDiv.append(touchHint);
        touchHintDiv.append(handGif);
        LADS.Util.fitText(touchHint, 2);

        handGif.onclick = switchPage;
        //if (startPageCallback)
        //    startPageCallback(that);

        function preventClickThrough(event) {
            event.cancelBubble = true;
        }

        //this handes the animation for opening/closing the div that holds the information about the project
        function expandInfo(event) {
            event.cancelBubble = true;
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
            //var exhibitions = new LADS.Layout.Exhibitions();
            var newCatalog = new LADS.Layout.NewCatalog();
            overlay.onclick = null; //prevent repeated clicks while switch occurs
            //LADS.Util.UI.slidePageLeft(exhibitions.getRoot());
            LADS.Util.UI.slidePageLeft(newCatalog.getRoot());
        }

        //opens the password dialog before allowing user to enter authoring mode
        function openDialog() {
            LADS.Auth.authenticate(enterAuthoringMode);
            if (localStorage.ip === "tagtestserver.cloudapp.net") {
                $("#password").attr('value', 'BrownGFX1');
            } else if (localStorage.ip === "10.116.71.58") {
                $("#password").attr('value', 'Browngfx1');
            }
            return;
        }

        function enterAuthoringMode() {
            overlay.onclick = null; //prevent repeated clicks while switch occurs
            authoringModeLabelContainer.off('click');
            // authoringMode = new LADS.Layout.ContentAuthoring();
            var authoringMode = new LADS.Authoring.NewSettingsView();
            LADS.Util.UI.slidePageLeft(authoringMode.getRoot());
        }

        // Uncomment following line if you want the startup window to always show
        // localStorage.hideStartupWindow = "";

        if (!hideFirstPage && !localStorage.hideStartupWindow) { // commented out for app store certification until we have server set-up package implemented

            var firstOverlay = $(document.createElement('div'));
            firstOverlay.css({
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: '100%',
                height: '100%',
                'background-color': 'rgba(0,0,0,0.6)',
                'z-index': 1000,
            });
            $(root).append(firstOverlay);

            var box = $(document.createElement('div'));
            box.css({
                'height': '20%', // changed this from 60% CERTIFICATION
                'width': '55%',
                'position': 'absolute',
                'top': '40%', // changed this from 20% CERTIFICATION
                'left': '25%',
                'background-color': 'black',
                'border': '3px double white',
            });
            firstOverlay.append(box);

            //var closeButton = $(document.createElement('img'));
            //closeButton.attr('src', 'images/icons/x.svg');
            //closeButton.css({
            //    'position': 'absolute',
            //    'right': '1%',
            //    'top': '1%',
            //    'width': '5%',
            //    'height': 'auto',
            //});
            //closeButton.click(function () {
            //    firstOverlay.detach();
            //});
            //box.append(closeButton);

            var checkDiv = $(document.createElement('div'));
            checkDiv.css({
                'position': 'absolute',
                'left': '4%',
                'bottom': '2%',
            });
            var checkBox = $(document.createElement('input'));
            checkBox.attr('type', 'checkbox');
            checkBox.prop('checked', false);
            checkBox.css({
                '-ms-transform': 'scale(1.3)',

            });
            checkBox.click(function (evt) {
                if (checkBox.prop('checked')) {
                    localStorage.hideStartupWindow = "true";
                } else {
                    localStorage.hideStartupWindow = "";
                }
                evt.stopPropagation();
            });
            checkDiv.click(function () {
                if (checkBox.prop('checked')) {
                    localStorage.hideStartupWindow = "";
                    checkBox.prop('checked', false);
                } else {
                    localStorage.hideStartupWindow = "true";
                    checkBox.prop('checked', true);
                }
            });
            var checkText = $(document.createElement('div'));
            checkText.css({
                'display': 'inline-block',
                'font-size': '120%',
            });
            checkText.text("Don't show this menu again");
            checkDiv.append(checkBox).append(checkText);
            box.append(checkDiv);

            var availSoonText = $(document.createElement('div'));
            availSoonText.css({
                'font-size': '120%',
                'position': 'absolute',
                'right': '1%',
                'bottom': '2%',
                'width': '50%',
            });
            availSoonText.html(
                "TAG Server will be available for download shortly.  Contact us for server setup at <a href='mailto:brown.touchartgallery@outlook.com'>brown.touchartgallery@outlook.com</a>."
                );
            box.append(availSoonText);

            var div1 = $(document.createElement('div'));
            div1.css({
                'position': 'absolute',
                'top': '8%',
                'left': '1%',
                'width': '93%',
                'height': '60%', //changed this from 22% while we only have one option CERTIFICATION
                'color': 'white',
            });
            divHighlight(div1);
            var goImage1 = $(document.createElement('img'));
            goImage1.attr('src', 'images/back.svg');
            goImage1.css({
                'height': '44%',
                'width': 'auto',
                'position': 'absolute',
                'right': '1%',
                'top': '5%', // 28
                '-ms-transform': 'scale(-1)',
            });
            div1.append(goImage1);
            var title1 = $(document.createElement('label'));
            title1.css({
                'font-size': '250%',
                'margin-left': '3%',
                'width': '80%',
            });
            var sub1 = $(document.createElement('label'));
            sub1.css({
                'font-size': '160%',
                'margin-left': '3%',
                'width': '80%',
            });
            div1.append(title1).append('<br>').append(sub1);

            var div2 = $(document.createElement('div'));
            div2.css({
                'position': 'absolute',
                'top': '32%',
                'left': '1%',
                'width': '93%',
                'height': '22%',
                'color': 'gray',
            });
            //divHighlight(div2);
            var goImage2 = $(document.createElement('img'));
            goImage2.attr('src', 'images/Back_gray.svg');
            goImage2.css({
                'height': '44%',
                'width': 'auto',
                'position': 'absolute',
                'right': '1%',
                'top': '5%', // 28
                '-ms-transform': 'scale(-1)',
            });
            div2.append(goImage2);
            var title2 = $(document.createElement('label'));
            title2.css({
                'font-size': '250%',
                'margin-left': '3%',
                'width': '80%',
            });
            var sub2 = $(document.createElement('label'));
            sub2.css({
                'font-size': '160%',
                'margin-left': '3%',
                'width': '80%',
            });
            div2.append(title2).append('<br>').append(sub2);

            var div3 = $(document.createElement('div'));
            div3.css({
                'position': 'absolute',
                'top': '56%',
                'left': '1%',
                'width': '93%',
                'height': '22%',
                'color': 'gray',
            });
            //divHighlight(div3);
            var goImage3 = $(document.createElement('img'));
            goImage3.attr('src', 'images/Back_gray.svg');
            goImage3.css({
                'height': '44%',
                'width': 'auto',
                'position': 'absolute',
                'right': '1%',
                'top': '5%', // 28
                '-ms-transform': 'scale(-1)',
            });
            div3.append(goImage3);
            var title3 = $(document.createElement('label'));
            title3.css({
                'font-size': '250%',
                'margin-left': '3%',
                'width': '80%',
            });
            var sub3 = $(document.createElement('label'));
            sub3.css({
                'font-size': '160%',
                'margin-left': '3%',
                'width': '80%',
            });
            div3.append(title3).append('<br>').append(sub3);

            title1.text('Try Out TAG Demo');
            sub1.text('');
            div1.click(function () {
                firstOverlay.detach();
                checkDataUsage();
            });

            title2.text('Set Up Your Own TAG Server');
            sub2.text('');

            title3.text('Connect to TAG Server');
            sub3.text('');

            box.append(div1);
            //box.append(div2);
            //box.append(div3);
        }
        function divHighlight(div) {
            div.mousedown(function () {
                div.css({
                    'background-color': 'white',
                    'color': 'black',
                });
            });
            div.mouseup(function () {
                div.css({
                    'background-color': 'black',
                    'color': 'white',
                });
            });
            div.mouseleave(function () {
                div.css({
                    'background-color': 'black',
                    'color': 'white',
                });
            });
        }
    }

    function checkDataUsage() {
        console.log('');
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