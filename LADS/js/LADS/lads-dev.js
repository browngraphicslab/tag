﻿
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
        "LADS/util/LADS.Util.js", // Util is currently used in RIN
        "LADS/tourauthoring/LADS.TourAuthoring.InkAuthoring.js", // need this to load before rin js files
        "rin/web/lib/rin-core-1.0.js",
        "../js/utils/BMv7.CustomInfobox/V7CustomInfobox.js",
        "html2canvas/html2canvas.js",
        "utils/jquery.livequery.js",
        //"html2canvas/html2canvas.min.js",
        //"html2canvas/jquery.plugin.html2canvas.js"
    ];

    var LADSPATH = "js/LADS/";      // the path to the scripts, relative to HTML page
    var LADSSCRIPTS = [         // the script filenames, in dependency order
        //"util/LADS.Util.js",
        "util/LADS.Util.Constants.js",
        "util/LADS.Util.Splitscreen.js",

        //Worktop Document classes
        "worktop/Worktop.Database.js",
        "worktop/Worktop.Doq.js",
        "worktop/LADS.Worktop.Database.js",
        
        //Core UI classes
        "catalog/LADS.Catalog.Timeline.js",
        "catalog/LADS.Catalog.HeatMap.js",
        "authoring/jscolor/jscolor.js", 
        "authoring/LADS.Authoring.ButtonGroup.js",
        "authoring/LADS.Authoring.FileUploader.js",
        "authoring/LADS.Authoring.SettingsView.js",
        "authoring/LADS.Authoring.NewSettingsView.js",
        "artmode/LADS.AnnotatedImage.js",
        "catalog/LADS.Catalog.SearchAndFilter.js",

        //Auth classes
        "auth/LADS.Auth.js",

        //Tour Authoring classes
        "tourauthoring/LADS.TourAuthoring.ArtworkTrack.js",
        "tourauthoring/LADS.TourAuthoring.AudioTrack.js",
        "tourauthoring/LADS.TourAuthoring.Command.js",
        "tourauthoring/LADS.TourAuthoring.ComponentControls.js",
        "tourauthoring/LADS.TourAuthoring.Constants.js",
        "tourauthoring/LADS.TourAuthoring.EditorMenu.js",
        "tourauthoring/LADS.TourAuthoring.Display.js",
        "tourauthoring/LADS.TourAuthoring.InkTrack.js",
        "tourauthoring/LADS.TourAuthoring.ImageTrack.js",
        "tourauthoring/LADS.TourAuthoring.Keyframe.js",
        "tourauthoring/LADS.TourAuthoring.PlaybackControl.js",
        "tourauthoring/LADS.TourAuthoring.Tests.js",
        "tourauthoring/LADS.TourAuthoring.Timeline.js",
        "tourauthoring/LADS.TourAuthoring.TimeManager.js",
        "tourauthoring/LADS.TourAuthoring.TopMenu.js",
        //"tourauthoring/LADS.TourAuthoring.InkAuthoring.js", // already loading above
        "tourauthoring/LADS.TourAuthoring.TourOptions.js",
        "tourauthoring/LADS.TourAuthoring.Track.js",
        "tourauthoring/LADS.TourAuthoring.UndoManager.js",
        "tourauthoring/LADS.TourAuthoring.VideoTrack.js",
        "tourauthoring/LADS.TourAuthoring.Viewer.js",

        //Layout classes
        "layout/LADS.Layout.Catalog.js",
        "layout/LADS.Layout.StartPage.js",
        "layout/LADS.Layout.Artmode.js",
        "layout/LADS.Layout.Exhibitions.js",
        "layout/LADS.Layout.NewCatalog.js",
        "layout/LADS.Layout.TourAuthoringNew.js",
        "layout/LADS.Layout.ArtworkEditor.js",
        "layout/LADS.Layout.ContentAuthoring.js",
        "layout/LADS.Layout.InternetFailurePage.js",
        "layout/LADS.Layout.MetroSplitscreenMessage.js",
        'layout/LADS.Layout.TourPlayer.js',
        'layout/LADS.Layout.VideoPlayer.js',
    ];

    var oHead = document.getElementsByTagName('HEAD').item(0);
    for (var i = 0; i < UTILSCRIPTS.length; i++) {
        var oScript = document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src = UTILPATH + UTILSCRIPTS[i];
        oHead.appendChild(oScript);
    }
    for (var i = 0; i < LADSSCRIPTS.length; i++) {
        debugger;
        var oScript = document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src = LADSPATH + LADSSCRIPTS[i];
        oHead.appendChild(oScript);
    }
})();
