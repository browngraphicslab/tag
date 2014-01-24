/// <reference path="js/rin/web/narratives/TAGTest/layeringOrderBug.js" />
(function () {
    "use strict";

    window.onload = load;

    function load() {
        var container;
        if(containerId && $('#'+containerId).length > 0) {
            container = $('#'+containerId);
        } else {
            container = $('body');
        }
        localStorage.ip = ip || 'browntagserver.com';
        var tagRoot = $(document.createElement('div')).attr('id', 'tagRoot');
        container.append(tagRoot);
        init();
    }

    function init() {

        var UTILSCRIPTS = [
                'js/raphael.js',
                'js/tagInk.js',
                'js/RIN/web/lib/rin-core-1.0.js'
            ],
            UTILPATH = '',
            i,
            oHead,
            oScript,
            oCss;

        oHead = document.getElementsByTagName('head').item(0);
        for (i = 0; i < UTILSCRIPTS.length; i++) {
            oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = UTILPATH + UTILSCRIPTS[i];
            oHead.appendChild(oScript);
        }
        oCss = document.createElement("link");
        oCss.rel = "stylesheet";
        oCss.href = "css/TAG.css";
        oHead.appendChild(oCss);

        var tagContainer = $('#tagRoot') || $("body"); // TODO more general

        $('body').on('scroll', function(evt) {
            evt.preventDefault();
        });

        $('#widthSlider').on('change', function(evt) {
            var w = $(this).attr('value'),
                h = 9/16 * w;
            $('#tagWidth').text(w);
            $('#tagContainer').css({
                'width': w + 'px',
                'height': h + 'px',
		        'font-size': w/9.6 +'%'
            });
        });

        //window.location = 'js/RIN/web/reload-test.html';
        //window.location = 'js/RIN/web/test.html';
        //window.location = 'js/RIN/web/index.html';

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
        //LADS.Worktop.Database.load();
        if (("" + page).toLowerCase() === "settings view") {
            //LADS.Worktop.Database.load();
            tagContainer.append((new LADS.Authoring.NewSettingsView()).getRoot());
        }
        else if (page) { // n.b. if your tour has the same name as an artwork, might fail
            //LADS.Worktop.Database.load();
            var found = false;
            LADS.Worktop.Database.getTours(function (tours) {
                $.each(tours, function (i, tour) {
                    if (tour.Name === page) {
                        LADS.Worktop.Database.getMain();
                        found = true;
                        tagContainer.append((new LADS.Layout.TourAuthoringNew(tour)).getRoot());
                        return false;
                    }
                });
                if (!found) {
                    LADS.Layout.StartPage(null, function (x) {
                        tagContainer.append(x);
                    });
                }
            });
        }
        //else if (("" + page).substring(0, 3) === "art") { // n.b. if your art has the same name as a tour, might fail
        //    LADS.Worktop.Database.load();
        //    var artwork = LADS.Worktop.Database.getDoqByName(page.substring(4).trim());
        //    if (!artwork || artwork.Extension === ".txt") {
        //        LADS.Layout.StartPage(null, function (x) {
        //            $("body").append(x);
        //        });
        //    }
        //    else {
        //        $('body').append((new LADS.Layout.ArtworkEditor(artwork)).getRoot());
        //    }
        //}
        else {
            //$("body").append((new LADS.Layout.StartPage()).getRoot());
            
            LADS.Layout.StartPage(null, function (page) {
                tagContainer.append(page);
            });
        }
        //$("body").append((new LADS.Layout.ArtworkEditor()).getRoot());
        //LADS.Worktop.Database.load();
        //$("body").append((new LADS.Authoring.SettingsView()).getRoot());
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
                $("body").append((new LADS.Layout.InternetFailurePage("No Internet")).getRoot());
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
    function checkServerConnectivity() {
        var request = $.ajax({
            url: "http://137.135.69.3:8080",
            dataType: "text",
            async: false,
            error: function(err) {
                $("body").append((new LADS.Layout.InternetFailurePage("Server Down")).getRoot());
                return false;
            },
        });
        return true;
    }

    function testThing() {
        LADS.TESTS.timeline();
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
    //         $("body").append((lastOverlay = new LADS.Layout.InternetFailurePage("Internet Lost", true)).getRoot());
    //     } else {
    //         switch (networkInformation.getInternetConnectionProfile().getNetworkConnectivityLevel()) {
    //             case Windows.Networking.Connectivity.NetworkConnectivityLevel.none:
    //             case Windows.Networking.Connectivity.NetworkConnectivityLevel.localAccess:
    //             case Windows.Networking.Connectivity.NetworkConnectivityLevel.constrainedInternetAccess:
    //                 if (lastOverlay) lastOverlay.getRoot().detach();
    //                 $("body").append((lastOverlay = new LADS.Layout.InternetFailurePage("Internet Lost", true)).getRoot());
    //                 break;
    //             case Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess:
    //                 if (lastOverlay) lastOverlay.getRoot().detach();
    //                 break;
    //         }
    //     }

    //     if (!dataLimitPrompted && !localStorage.acceptDataUsage && networkInformation.getInternetConnectionProfile() && networkInformation.getInternetConnectionProfile().getDataPlanStatus().dataLimitInMegabytes) {
    //         dataLimitPrompted = true;
    //         $("body").append(new LADS.Layout.InternetFailurePage("Data Limit", true).getRoot());
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
    //                 $("body").append(splitOverlay = new LADS.Layout.MetroSplitscreenMessage().getRoot());
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
