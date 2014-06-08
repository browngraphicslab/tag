
(function () {
    "use strict";
    var UTILPATH = "js/";
    var UTILSCRIPTS = [         // the script filenames, in dependency order
        "raphael.js", // for easier svg manipulation (for inks)
        "tagInk.js", // TAG ink library
        "popcorn.min.js",
        "popcorn.capture.js",  // for video thumbnailing
        "jQueryUI/js/jquery-1.7.1.js",
        "jQueryUI/js/jquery-ui-1.8.16.custom.min.js",
        "jQueryUI/js/jquery.available.min.js",
        "jQueryUI/js/jquery.fittext.js",
        "jQueryUI/js/jquery.autoSize.js",
        "jQueryUI/js/jquery.numeric.js",
        "seadragon/seadragon-dev.js",
        "rin/web/lib/knockout-2.1.0.js",
        //"rin/web/lib/seadragon-0.8.9-rin.js",
        "utils/CryptoJS/rollups/sha1.js",
        "utils/CryptoJS/rollups/sha224.js",
        "utils/CryptoJS/rollups/sha256.js",
        "utils/CryptoJS/rollups/sha384.js",
        "utils/CryptoJS/rollups/sha512.js",
        "utils/jquery.getScrollbarWidth.js",
        "utils/jquery.throttle-debounce.js",
        "utils/jquery-css-transform.js",
        "utils/jquery-animate-css-transform.js",
        "utils/jquery.xml2json.js",
        "utils/json2xml.js",
        "utils/jquery.hammer.js",
        "utils/hammer.js",
        "utils/avltree.js",
        "utils/avlnode.js",
        "utils/binaryheap.js",
        "utils/dataholder.js",
        "utils/TwoStageTimer.js",        
		"utils/doubleLinkedList.js",
        "utils/hashtable.js",
        "d3/d3.v2.js",
        "TAG/util/TAG.Util.js", // Util is currently used in RIN
        "TAG/tourauthoring/TAG.TourAuthoring.InkAuthoring.js", // need this to load before rin js files
        "rin/web/lib/rin-core-1.0.js",
        "../js/utils/BMv7.CustomInfobox/V7CustomInfobox.js",
        "html2canvas/html2canvas.js",
        "utils/jquery.livequery.js",
        //"html2canvas/html2canvas.min.js",
        //"html2canvas/jquery.plugin.html2canvas.js"
    ];

    var TAGPATH = "js/TAG/";      // the path to the scripts, relative to HTML page
    var TAGSCRIPTS = [         // the script filenames, in dependency order
        //"util/TAG.Util.js",
        "util/TAG.Util.Constants.js",
        "util/TAG.Util.Splitscreen.js",

        //Worktop Document classes
        "worktop/Worktop.Database.js",
        "worktop/Worktop.Doq.js",
        "worktop/TAG.Worktop.Database.js",
        
        //Core UI classes
        "catalog/TAG.Catalog.Timeline.js",
        "catalog/TAG.Catalog.HeatMap.js",
        "authoring/jscolor/jscolor.js", 
        "authoring/TAG.Authoring.ButtonGroup.js",
        "authoring/TAG.Authoring.FileUploader.js",
        "authoring/TAG.Authoring.SettingsView.js",
        "authoring/TAG.Authoring.NewSettingsView.js",
        "artmode/TAG.AnnotatedImage.js",
        "catalog/TAG.Catalog.SearchAndFilter.js",

        //Auth classes
        "auth/TAG.Auth.js",

        //Tour Authoring classes
        "tourauthoring/TAG.TourAuthoring.ArtworkTrack.js",
        "tourauthoring/TAG.TourAuthoring.AudioTrack.js",
        "tourauthoring/TAG.TourAuthoring.Command.js",
        "tourauthoring/TAG.TourAuthoring.ComponentControls.js",
        "tourauthoring/TAG.TourAuthoring.Constants.js",
        "tourauthoring/TAG.TourAuthoring.EditorMenu.js",
        "tourauthoring/TAG.TourAuthoring.Display.js",
        "tourauthoring/TAG.TourAuthoring.InkTrack.js",
        "tourauthoring/TAG.TourAuthoring.ImageTrack.js",
        "tourauthoring/TAG.TourAuthoring.Keyframe.js",
        "tourauthoring/TAG.TourAuthoring.PlaybackControl.js",
        "tourauthoring/TAG.TourAuthoring.Tests.js",
        "tourauthoring/TAG.TourAuthoring.Timeline.js",
        "tourauthoring/TAG.TourAuthoring.TimeManager.js",
        "tourauthoring/TAG.TourAuthoring.TopMenu.js",
        //"tourauthoring/TAG.TourAuthoring.InkAuthoring.js", // already loading above
        "tourauthoring/TAG.TourAuthoring.TourOptions.js",
        "tourauthoring/TAG.TourAuthoring.Track.js",
        "tourauthoring/TAG.TourAuthoring.UndoManager.js",
        "tourauthoring/TAG.TourAuthoring.VideoTrack.js",
        "tourauthoring/TAG.TourAuthoring.Viewer.js",

        //Layout classes
        "layout/TAG.Layout.Catalog.js",
        "layout/TAG.Layout.StartPage.js",
        "layout/TAG.Layout.Artmode.js",
        "layout/TAG.Layout.Exhibitions.js",
        "layout/TAG.Layout.NewCatalog.js",
        "layout/TAG.Layout.TourAuthoringNew.js",
        "layout/TAG.Layout.ArtworkEditor.js",
        "layout/TAG.Layout.ContentAuthoring.js",
        "layout/TAG.Layout.InternetFailurePage.js",
        "layout/TAG.Layout.MetroSplitscreenMessage.js",
        'layout/TAG.Layout.TourPlayer.js',
        'layout/TAG.Layout.VideoPlayer.js',
    ];

    var oHead = document.getElementsByTagName('HEAD').item(0);
    for (var i = 0; i < UTILSCRIPTS.length; i++) {
        var oScript = document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src = UTILPATH + UTILSCRIPTS[i];
        oHead.appendChild(oScript);
    }
    for (var i = 0; i < TAGSCRIPTS.length; i++) {
        debugger;
        var oScript = document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src = TAGPATH + TAGSCRIPTS[i];
        oHead.appendChild(oScript);
    }
})();
