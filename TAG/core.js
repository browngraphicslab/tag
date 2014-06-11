﻿// TAG (Touch Art Gallery) does not collect or publish any personal information.
(function () {
    "use strict";

    function runTestScripts() { // called at end of init
        // TAG.TESTS.testEnterCollections();
        // TAG.TESTS.testSelectCollections();
        // TAG.TESTS.testSelectArtworks();
    }

    load(); // window.load is done in the html file

    function load() {
        var container;
        if(containerId && $('#'+containerId).length > 0) {
            container = $('#'+containerId);
        } else {
            console.log('no containerId specified, or the containerId does not match an element');
            return; // no TAG for you
        }
        localStorage.ip = ip || localStorage.ip || 'browntagserver.com';

        var positioning = container.css('position');
        if(positioning !== 'relative' && positioning !== 'absolute') {
            container.css('position', 'relative');
        }

        var tagRootContainer = $(document.createElement('div')).attr('id', 'tagRootContainer');
        container.append(tagRootContainer);

        var tagRootInnerContainer = $(document.createElement('div')).attr('id', 'tagRootInnerContainer');
        tagRootContainer.append(tagRootInnerContainer);
        var tagRoot = $(document.createElement('div')).attr('id', 'tagRoot');
        tagRootInnerContainer.append(tagRoot);
        var w = container.width();
        var h = container.height();
        var l = 0;
        if(w/h > 16/9) {
            l = (w - 16/9*h)/2;
            w = 16/9 * h;
        } else {
            h = 9/16 * w;
        }

        // debugger;
        tagRoot.css({
            'font-size': (w/9.6) + '%', // so font-size percentages for descendents work well
            height: h + "px",
            left: l + "px",
            'max-width': w + "px",
            'max-height': h + "px",
            width: w + "px"
        });

        $('#widthSlider').on('change', function(evt) {
            container.empty();
            var w = $(this).attr('value');
            $('#tagWidth').text(w);
            container.css('width', w + 'px');
        });

        $('#heightSlider').on('change', function(evt) {
            container.empty();
            var h = $(this).attr('value');
            $('#tagHeight').text(h);
            container.css({
                height: h + "px"
            });
        });

        $('#TAG_tb1').on('click', TAG.TESTS.testEnterCollections);
        $('#TAG_tb2').on('click', TAG.TESTS.testSelectCollections);
        $('#TAG_tb3').on('click', TAG.TESTS.testSelectArtworks);
        $('#TAG_tb4').on('click', TAG.TESTS.testDragArtwork);
        $('#TAG_cancelTest').on('click', TAG.TESTS.cancelTest);

        $('#refreshTAGButton').on('click', function(evt) { // currently doesn't work to refresh TAG if a tour has been played
            container.empty();
            $('#refreshTAGButton').off('click');
            $('#heightSlider').off('change');
            $('#widthSlider').off('change');
            $('[src='+tagPath+'"js/raphael.js"]').remove();
            $('[src='+tagPath+'"js/tagInk.js"]').remove();
            $('[src='+tagPath+'"js/RIN/web/lib/rin-core-1.0.js"]').remove();
            $('[href="css/TAG.css"]').remove();
            $('[src$="rin-experiences-1.0.js"]').remove();
            $('[src$="jquery.pxtouch.min.js"]').remove();
            $('[href$="themeResources/rin.css"]').remove();

            TAG_GLOBAL({
                path: tagPath,
                containerId: containerId,
                serverIp: ip
            });
        });

        init();

        // /* nbowditch _editted 2/23/2014 : stopped scrolling when over tag*/
        // /* NOTE: had to do this in 2 places for cross-browser support.
        //    for FF and IE, propogation had to be stopped inside the iframe.
        //    For chrome, it had to be stopped outside iframe.
        // */
        
        // var frameDiv = document.getElementById('tagRootContainer');

        // // $('body').on('scroll.b mousewheel.b MozMousePixelScroll.b DOMMouseScroll.b', function(e) {
        // //     e.stopPropagation();
        // //     e.stopImmediatePropagation();
        // //     e.preventDefault();
        // //     return false;
        // // });
        // // frameDiv.addEventListener('mousewheel', function (evt) {
        // //     evt.stopPropagation();
        // //     evt.preventDefault();
        // //     return false;
        // // });
        // // frameDiv.addEventListener('DOMMouseScroll', function (evt) {
        // //     evt.stopPropagation();
        // //     evt.preventDefault();
        // //     return false;
        // // });
        // // frameDiv.addEventListener('MozMousePixelScroll', function (evt) {
        // //     evt.stopPropagation();
        // //     evt.preventDefault();
        // //     return false;
        // // });
        


        // /* end nbowditch edit */
    }

    function init() {

        var TAGSCRIPTS = [
                'js/raphael.js',
                'js/tagInk.js',
                'js/RIN/web/lib/rin-core-1.0.js',
                'js/Autolinker.js-master/dist/Autolinker.js'
            ],
            i,
            oHead,
            oScript,
            oCss;

        tagPath = tagPath || '';

        if(tagPath.length > 0 && tagPath[tagPath.length - 1] !== '/') {
            tagPath += '/';
        }

        oHead = document.getElementsByTagName('head').item(0);
        for (i = 0; i < TAGSCRIPTS.length; i++) {
            oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = tagPath + TAGSCRIPTS[i];
            oHead.appendChild(oScript);
        }
        oCss = document.createElement("link");
        oCss.rel = "stylesheet";
        oCss.href = tagPath+"css/TAG.css";
        oHead.appendChild(oCss);


        var tagContainer = $('#tagRoot');

        $("body").css("-ms-touch-action","none");

        // set up idle timer restarting
        $('body').on('click.idleTimer', function() {
            TAG.Util.IdleTimer.restartTimer();
        });

       // if (checkInternetConnectivity())
        //     checkServerConnectivity();

        // defining a to-two-decimal-places function in Math
        Math.twoDecPlaces = function (x) {
            return Math.floor(x * 100) / 100;
        };

        /*
        * Debug Mode
        * for testing only, should be zero when you push changes
        * Options:
        * page = 0   (run TAG normally from splash screen)
        * page = "settings view"   (open to the authoring settings view menu)
        * page = "<tour name>"     (open to the given tour)
        */
        //var page = 'anqi';// 0 if you want to use TAG normally.
        var page = 0;
        //TAG.Worktop.Database.load();
        if (("" + page).toLowerCase() === "settings view") {
            //TAG.Worktop.Database.load();
            tagContainer.append((new TAG.Authoring.NewSettingsView()).getRoot());
        }
        else if (page) { // n.b. if your tour has the same name as an artwork, might fail
            //TAG.Worktop.Database.load();
            var found = false;
            TAG.Worktop.Database.getTours(function (tours) {
                $.each(tours, function (i, tour) {
                    if (tour.Name === page) {
                        TAG.Worktop.Database.getMain();
                        found = true;
                        tagContainer.append((new TAG.Layout.TourAuthoringNew(tour)).getRoot());
                        return false;
                    }
                });
                if (!found) {
                    currentPage.name = TAG.Util.Constants.pages.START_PAGE;
                    currentPage.obj  = null;
                    
                    TAG.Layout.StartPage(null, function (x) {
                        tagContainer.append(x);
                    });
                }
            });
        }
        else {
            currentPage.name = TAG.Util.Constants.pages.START_PAGE;
            currentPage.obj  = null;

            TAG.Layout.StartPage(null, function (page) {
                tagContainer.append(page);
            });
        }

        console.log('running test scripts');
        runTestScripts();
    }
    
    /*
     * The checkInternetConnectivity() method makes an ajax call to google.com. If it receives a response,
     * it does nothing since the computer is definitely connected to the internet. Otherwise, it appends the
     * InternetFailurePage.
     */
    function checkInternetConnectivity() {
        var err = false;
        var request = $.ajax({
            url: "http://google.com",
            dataType: "text",
            async: false,
            error: function () {
                $("body").append((new TAG.Layout.InternetFailurePage("No Internet")).getRoot());
                err = true;
            },
        });
        return !err;
    }

    /*
     * The checkServerConnectivity() method makes an ajax call to the server. If it receives a response,
     * it does nothing since the computer is definitely connected to the internet. Otherwise, it appends the
     * InternetFailurePage.
     * 
     * TODO: currently, the server URL is hardcoded since it cannot be fetched from the database since that
     * hasn't been instantiated. This must be changed.
     */
    // function checkServerConnectivity() {
    //     var request = $.ajax({
    //         url: "http://137.135.69.3:8080",
    //         dataType: "text",
    //         async: false,
    //         error: function(err) {
    //             $("body").append((new TAG.Layout.InternetFailurePage("Server Down")).getRoot());
    //             return false;
    //         },
    //     });
    //     return true;
    // }

    function testThing() {
        TAG.TESTS.timeline();
    }

    // WinJS.Application.start();
    // WinJS.Application.onsettings = function (args) {
    //     args.detail.applicationcommands = {
    //         "priv": {
    //             title: "Privacy Policy", href: "settings/privacy.html"
    //         }
    //     };
    //     WinJS.UI.SettingsFlyout.populateSettings(args);
    // };

    //var networkInformation = Windows.Networking.Connectivity.NetworkInformation;
    var lastOverlay;
    var dataLimitPrompted = false;

    // Windows.Networking.Connectivity.NetworkInformation.addEventListener('networkstatuschanged', function (evt) {

    //     if (!networkInformation.getInternetConnectionProfile()) {
    //         if (lastOverlay) lastOverlay.getRoot().detach();
    //         $("body").append((lastOverlay = new TAG.Layout.InternetFailurePage("Internet Lost", true)).getRoot());
    //     } else {
    //         switch (networkInformation.getInternetConnectionProfile().getNetworkConnectivityLevel()) {
    //             case Windows.Networking.Connectivity.NetworkConnectivityLevel.none:
    //             case Windows.Networking.Connectivity.NetworkConnectivityLevel.localAccess:
    //             case Windows.Networking.Connectivity.NetworkConnectivityLevel.constrainedInternetAccess:
    //                 if (lastOverlay) lastOverlay.getRoot().detach();
    //                 $("body").append((lastOverlay = new TAG.Layout.InternetFailurePage("Internet Lost", true)).getRoot());
    //                 break;
    //             case Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess:
    //                 if (lastOverlay) lastOverlay.getRoot().detach();
    //                 break;
    //         }
    //     }

    //     if (!dataLimitPrompted && !localStorage.acceptDataUsage && networkInformation.getInternetConnectionProfile() && networkInformation.getInternetConnectionProfile().getDataPlanStatus().dataLimitInMegabytes) {
    //         dataLimitPrompted = true;
    //         $("body").append(new TAG.Layout.InternetFailurePage("Data Limit", true).getRoot());
    //     }
    // });

    // window.addEventListener('resize', handleResize);

    // var splitOverlay;
    // function handleResize(evt) {
    //     var viewStates = Windows.UI.ViewManagement.ApplicationViewState;
    //     var newViewState = Windows.UI.ViewManagement.ApplicationView.value;
    //     switch (newViewState) {
    //         case viewStates.snapped:
    //         case viewStates.filled:
    //             if (!splitOverlay)
    //                 $("body").append(splitOverlay = new TAG.Layout.MetroSplitscreenMessage().getRoot());
    //             break;
    //         case viewStates.fullScreenLandscape:
    //             if (splitOverlay) {
    //                 splitOverlay.detach();
    //                 splitOverlay = null;
    //             }
    //             break;
    //     }
    // }

    $(document).ready(function (e) {
        //Debug.enableFirstChanceException(true);
        // WinJS.UI.processAll()
        //     .then(function () { init(); });

        var string = "";
        var unicorned, hodored;
        $(window).keydown(function (evt) {
            if (evt.char && typeof evt.char === 'string' && !hodored && !unicorned) {
                string = (string + evt.char).toLowerCase();
                if (string.indexOf('tagunicorn') !== -1) {
                    string = "";
                    unicorned = true;
                    $.each($('img'), function () {
                        var element = $(this);
                        var old = element.attr('src');
                        element.attr('src', 'images/unicorn.jpg');
                        setTimeout(function () {
                            element.attr('src', old);
                            unicorned = false;
                        }, 5000);
                    });
                    $.each($('*'), function () {
                        var element = $(this);

                        var color = element.prop("style").color;
                        var newColor = 'rgb(' + parseInt(Math.random() * 256,10) + ',' + parseInt(Math.random() * 256,10) + ',' + parseInt(Math.random() * 256,10) + ')';
                        element.css('color', newColor);
                        setTimeout(function () {
                            element.css('color', color);
                        }, 5000);

                        var bg = element.css('background-image');
                        if (bg.indexOf('url') !== -1) {
                            element.css('background-image', 'url("images/unicorn.jpg")');
                            setTimeout(function () {
                                element.css('background-image', bg);
                                unicorned = false;
                            }, 5000);
                        }
                    });
                } else if (string.indexOf('hodorhodorhodor') !== -1) {
                    string = "";
                    hodored = true;
                    $.each($('*'), function () {
                        var element = $(this);
                        try {
                            var oldHtml = element.html();
                            if ((oldHtml || oldHtml === '') && oldHtml.indexOf('<') === -1) {
                                element.html('Hodor');

                                setTimeout(function () {
                                    element.text(oldHtml);
                                    hodored = false;
                                }, 5000);
                            }
                        } catch (ex) { };
                    });
                }
            }
        });
    });
})();