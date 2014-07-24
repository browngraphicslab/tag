/**
 * This file takes care of compiling jade and stylus files and
 * building TAG.js by concatenating a collection of source js
 * files. The source files can be found in the JSSRC array below.
 * 
 * To use Grunt, run
 *
 *    $ grunt
 *
 * from the command line. You can also run
 *
 *    $ grunt watch
 *
 * which will watch for saved changes in any files in the WATCH
 * array below. WATCH contains all of the js files in JSSRC (when
 * any of our source files change, we want to recompile TAG.js)
 * as well as the styl and jade files (when these change, we want
 * to recompile respective css and html files).
 *
 * We use Grunt for a couple reasons:
 *   - it's a pain to always compile jade and stylus by hand
 *   - it's nice to be able to include a single js file (TAG.js)
 *     rather than a whole collection of them, and doing so lets us
 *     put all TAG code -- including third-party libraries we use --
 *     inside a contained scope, so our variables don't clobber those
 *     in the host site's code
 *
 * To look further into the second point above, you can take a look
 * at the "concat" task below. It concatenates a bunch of js files
 * together inside a "banner" and a "footer." The banner, which will
 * appear at the top of TAG.js, defines a function (TAG) that wraps all
 * of our code and declares some global variables. The footer appends a
 * closing curly brace to the very end of the file to finish the TAG
 * function.
 */

var JSSRC = [
		'tagcore/js/jQueryUI/js/jquery-1.7.1.js',                      // TAGCORE
		'tagcore/js/jQueryUI/js/jquery-ui-1.8.16.custom.min.js',       // TAGCORE
		'tagcore/js/jQueryUI/js/jquery.available.min.js',              // TAGCORE
		'tagcore/js/jQueryUI/js/jquery.fittext.js',                    // TAGCORE
		'tagcore/js/jQueryUI/js/jquery.autoSize.js',                   // TAGCORE
		'tagcore/js/jQueryUI/js/jquery.numeric.js',                    // TAGCORE

		'tagcore/js/seadragon/src/Seadragon.Core.js',                  // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.Config.js',                // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.Strings.js',               // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.Debug.js',                 // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.Profiler.js',              // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.Point.js',                 // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.Rect.js',                  // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.Spring.js',                // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.Utils.js',                 // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.MouseTracker.js',          // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.EventManager.js',          // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.ImageLoader.js',           // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.Buttons.js',               // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.TileSource.js',            // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.DisplayRect.js',           // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.DeepZoom.js',              // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.Viewport.js',              // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.Drawer.js',                // TAGCORE
		'tagcore/js/seadragon/src/Seadragon.Viewer.js',      

		'tagcore/js/RIN/web/lib/knockout-2.2.1.js',                    // TAGCORE
		'tagcore/js/utils/CryptoJS/rollups/sha1.js',                   // TAGCORE
		'tagcore/js/utils/CryptoJS/rollups/sha224.js',                 // TAGCORE
		'tagcore/js/utils/CryptoJS/rollups/sha256.js',                 // TAGCORE
		'tagcore/js/utils/CryptoJS/rollups/sha384.js',                 // TAGCORE
		'tagcore/js/utils/CryptoJS/rollups/sha512.js',                 // TAGCORE
		'tagcore/js/utils/jquery.getScrollbarWidth.js',                // TAGCORE
		'tagcore/js/utils/jquery.throttle-debounce.js',                // TAGCORE
		'tagcore/js/utils/jquery-css-transform.js',                    // TAGCORE
		'tagcore/js/utils/jquery-animate-css-transform.js',            // TAGCORE
		'tagcore/js/utils/jquery.xml2json.js',                         // TAGCORE
		'tagcore/js/utils/json2xml.js',                                // TAGCORE
		'tagcore/js/utils/jquery.hammer.js',                           // TAGCORE
		'tagcore/js/utils/hammer.js',                                  // TAGCORE
		'tagcore/js/utils/avltree.js',                                 // TAGCORE
		'tagcore/js/utils/avlnode.js',                                 // TAGCORE
		'tagcore/js/utils/binaryheap.js',                              // TAGCORE
		'tagcore/js/utils/dataholder.js',                              // TAGCORE
		'tagcore/js/utils/doubleLinkedList.js',                        // TAGCORE
		'tagcore/js/utils/hashtable.js',                               // TAGCORE
		'tagcore/js/d3/d3.v2.js',                                      // TAGCORE
		'tagcore/js/TAG/util/TAG.Util.js',                             // TAGCORE
		'tagcore/js/html2canvas/html2canvas.js',                       // TAGCORE
		'tagcore/js/utils/jquery.livequery.js',                        // TAGCORE
		'tagcore/js/Autolinker.js-master/dist/Autolinker.js',          // TAGCORE

		'tagcore/js/TAG/tourauthoring/TAG.TourAuthoring.Constants.js', // TAGCORE -- need to move from win8  
		'tagcore/js/TAG/util/TAG.Util.Constants.js',                   // TAGCORE
		'tagcore/js/TAG/util/TAG.Util.Splitscreen.js',                 // TAGCORE
		'tagcore/js/TAG/util/TAG.Util.IdleTimer.js',                   // TAGCORE
		'tagcore/js/TAG/worktop/Worktop.Database.js',                  // TAGCORE
		'tagcore/js/TAG/worktop/Worktop.Doq.js',                       // TAGCORE
		'tagcore/js/TAG/worktop/TAG.Worktop.Database.js',              // TAGCORE
		'tagcore/js/TAG/artmode/TAG.AnnotatedImage.js',      
		'tagcore/js/TAG/auth/TAG.Auth.js',                             // TAGCORE
		'tagcore/js/TAG/layout/TAG.Layout.StartPage.js',               // TAGCORE
		'tagcore/js/TAG/layout/TAG.Layout.ArtworkViewer.js',           // TAGCORE
		'tagcore/js/TAG/layout/TAG.Layout.CollectionsPage.js',         // TAGCORE
		'tagcore/js/TAG/layout/TAG.Layout.InternetFailurePage.js',     // TAGCORE
		'tagcore/js/TAG/layout/TAG.Layout.MetroSplitscreenMessage.js', // TAGCORE
		'tagcore/js/TAG/layout/TAG.Layout.TourPlayer.js',              // TAGCORE
		'tagcore/js/TAG/layout/TAG.Layout.VideoPlayer.js',             // TAGCORE
		'TAG/js/TAG/layout/TAG.Layout.ArtworkEditor.js',
		'TAG/js/TAG/layout/TAG.Layout.TourAuthoringNew.js',

		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Constants.js',          // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.TimeManager.js',        // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.UndoManager.js',        // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.ArtworkTrack.js',       // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.AudioTrack.js',         // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Viewer.js',             // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.ArtworkTrack.js',       // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Command.js',            // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.ComponentControls.js',  // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Display.js',            // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.EditorMenu.js',         // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.ImageTrack.js',         // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.InkablePart.js',        // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.InkAuthoring.js',       // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.InkController.js',      // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.InkTrack.js',           // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Keyframe.js',           // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.PlaybackControl.js',    // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Tests.js',              // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Timeline.js',           // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.TopMenu.js',            // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.TourOptions.js',        // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Track.js',              // TAGCORE -- need to move from win8
		'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.VideoTrack.js',         // TAGCORE -- need to move from win8

		'tagcore/js/TAG/authoring/TAG.Authoring.SettingsView.js',  // TAGCORE
		'tagcore/js/TAG/authoring/TAG.Authoring.FileUploader.js',  // TAGCORE
		'tagcore/js/TAG/authoring/jscolor/jscolor.js',             // TAGCORE

		'tagcore/js/popcorn.min.js',                               // TAGCORE
		'tagcore/js/popcorn.capture.js',                           // TAGCORE

		'tagcore/telemetry/telemetry.js',                          // TAGCORE
		
		'tagcore/js/tests.js',                                     // TAGCORE
		
		'tagcore/js/core.js'                                       // TAGCORE
	],
	WATCH = JSSRC.slice(); // WATCH will be a superset of JSSRC

// add additional files to WATCH
WATCH.push(
	'tagcore/html/*.jade',
	'tagcore/css/*.styl'
);

module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			options: {
				separator: '\n;\n',
				banner: 'var TAG_GLOBAL = function(tagInput) { \
					        \n    var tagPath            = tagInput.path, \
					        \n        containerId        = tagInput.containerId, \
					        \n        ip                 = tagInput.serverIp, \
					        \n        allowServerChange  = tagInput.allowServerChange, \
					        \n 		  allowAuthoringMode = tagInput.allowAuthoringMode, \
					        \n        idleDuration       = tagInput.idleDuration, \
					        \n        currentPage        = {}, // name and obj properties \
					        \n        INPUT_TOUR_ID      = tagInput.tourId, // to load to a tour \
					        \n        idleTimer; \n\n',
				footer: '};'
			},
			dist: {
				src: JSSRC,
				dest: 'tagcore/js/TAG.js'
			}
		},
		uglify: { // run this for ship builds
			my_target: {
				files: {
					'TAG/TAG-min.js': [
						'TAG/TAG-embed.js',
						'tagcore/js/TAG.js'
					]
				}
			}
		},
		stylus: {
			compile: {
				options: {
					compress: false // in ship builds, set this to "true"
				},
				files: {
					'tagcore/css/TAG.css': [
						'tagcore/css/common.styl',               // TAGCORE
						'tagcore/css/StartPage.styl',            // TAGCORE
						'tagcore/css/InternetFailurePage.styl',  // TAGCORE
						'tagcore/css/Artmode.styl',              // TAGCORE
						'tagcore/css/NewCatalog.styl',           // TAGCORE
						'tagcore/css/VideoPlayer.styl',          // TAGCORE
						'tagcore/css/TourPlayer.styl',           // TAGCORE
						'tagcore/css/General.styl',              // TAGCORE
						'tagcore/css/SettingsView.styl',         // TAGCORE
						'tagcore/css/Util.styl'                  // TAGCORE
					]
				}
			}
		},
		jade: {
			compile: {
				options: {
					pretty: true // in ship builds, set this to "false"
				},
				files: {
					'tagcore/html/StartPage.html':           'tagcore/html/StartPage.jade',           // TAGCORE
					'tagcore/html/InternetFailurePage.html': 'tagcore/html/InternetFailurePage.jade', // TAGCORE
					'tagcore/html/Artmode.html':             'tagcore/html/Artmode.jade',             // TAGCORE
					'tagcore/html/NewCatalog.html':          'tagcore/html/NewCatalog.jade',          // TAGCORE
					'tagcore/html/VideoPlayer.html':         'tagcore/html/VideoPlayer.jade',         // TAGCORE
					'tagcore/html/SettingsView.html':        'tagcore/html/SettingsView.jade',        // TAGCORE
					'tagcore/html/TourPlayer.html':          'tagcore/html/TourPlayer.jade'           // TAGCORE
				}
			}
		},
		watch: {
			files: WATCH,
			tasks: ['stylus', 'jade', 'concat']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jade', 'stylus', 'concat']); // normal calls to grunt will not run the "uglify" task
}
