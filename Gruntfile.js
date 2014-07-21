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
				src: [
					'tagcore/js/jQueryUI/js/jquery-1.7.1.js',                // TAGCORE
					'tagcore/js/jQueryUI/js/jquery-ui-1.8.16.custom.min.js', // TAGCORE
					'tagcore/js/jQueryUI/js/jquery.available.min.js',        // TAGCORE
					'tagcore/js/jQueryUI/js/jquery.fittext.js',              // TAGCORE
					'tagcore/js/jQueryUI/js/jquery.autoSize.js',             // TAGCORE
					'tagcore/js/jQueryUI/js/jquery.numeric.js',              // TAGCORE

					'tagcore/js/seadragon/src/Seadragon.Core.js',            // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.Config.js',          // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.Strings.js',         // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.Debug.js',           // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.Profiler.js',        // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.Point.js',           // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.Rect.js',            // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.Spring.js',          // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.Utils.js',           // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.MouseTracker.js',    // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.EventManager.js',    // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.ImageLoader.js',     // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.Buttons.js',         // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.TileSource.js',      // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.DisplayRect.js',     // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.DeepZoom.js',        // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.Viewport.js',        // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.Drawer.js',          // TAGCORE
					'tagcore/js/seadragon/src/Seadragon.Viewer.js',

					'tagcore/js/RIN/web/lib/knockout-2.2.1.js',              // TAGCORE
					'tagcore/js/utils/CryptoJS/rollups/sha1.js',             // TAGCORE
					'tagcore/js/utils/CryptoJS/rollups/sha224.js',           // TAGCORE
					'tagcore/js/utils/CryptoJS/rollups/sha256.js',           // TAGCORE
					'tagcore/js/utils/CryptoJS/rollups/sha384.js',           // TAGCORE
					'tagcore/js/utils/CryptoJS/rollups/sha512.js',           // TAGCORE
					'tagcore/js/utils/jquery.getScrollbarWidth.js',          // TAGCORE
					'tagcore/js/utils/jquery.throttle-debounce.js',          // TAGCORE
					'tagcore/js/utils/jquery-css-transform.js',              // TAGCORE
					'tagcore/js/utils/jquery-animate-css-transform.js',      // TAGCORE
					'tagcore/js/utils/jquery.xml2json.js',                   // TAGCORE
					'tagcore/js/utils/json2xml.js',                          // TAGCORE
					'tagcore/js/utils/jquery.hammer.js',                     // TAGCORE
					'tagcore/js/utils/hammer.js',                            // TAGCORE
					'tagcore/js/utils/avltree.js',                           // TAGCORE
					'tagcore/js/utils/avlnode.js',                           // TAGCORE
					'tagcore/js/utils/binaryheap.js',                        // TAGCORE
					'tagcore/js/utils/dataholder.js',                        // TAGCORE
					'tagcore/js/utils/doubleLinkedList.js',                  // TAGCORE
					'tagcore/js/utils/hashtable.js',                         // TAGCORE
					'tagcore/js/d3/d3.v2.js',                                // TAGCORE
					'tagcore/js/TAG/util/TAG.Util.js',                       // TAGCORE
					'tagcore/js/html2canvas/html2canvas.js',                 // TAGCORE
					'tagcore/js/utils/jquery.livequery.js',                  // TAGCORE
					'tagcore/js/Autolinker.js-master/dist/Autolinker.js',    // TAGCORE

					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Constants.js',
					'tagcore/js/TAG/util/TAG.Util.Constants.js',             // TAGCORE
					'tagcore/js/TAG/util/TAG.Util.Splitscreen.js',           // TAGCORE
					'tagcore/js/TAG/util/TAG.Util.IdleTimer.js',             // TAGCORE
					'tagcore/js/TAG/worktop/Worktop.Database.js',            // TAGCORE
					'tagcore/js/TAG/worktop/Worktop.Doq.js',                 // TAGCORE
					'tagcore/js/TAG/worktop/TAG.Worktop.Database.js',        // TAGCORE
					'TAG/js/TAG/artmode/TAG.AnnotatedImage.js',
					'tagcore/js/TAG/auth/TAG.Auth.js',                       // TAGCORE
					'tagcore/js/TAG/layout/TAG.Layout.StartPage.js',         // TAGCORE
					'TAG/js/TAG/layout/TAG.Layout.ArtworkViewer.js',
					'TAG/js/TAG/layout/TAG.Layout.CollectionsPage.js',
					'TAG/js/TAG/layout/TAG.Layout.InternetFailurePage.js',
					'TAG/js/TAG/layout/TAG.Layout.MetroSplitscreenMessage.js',
					'TAG/js/TAG/layout/TAG.Layout.TourPlayer.js',
					'TAG/js/TAG/layout/TAG.Layout.VideoPlayer.js',
					'TAG/js/TAG/layout/TAG.Layout.ArtworkEditor.js',
					'TAG/js/TAG/layout/TAG.Layout.TourAuthoringNew.js',
					
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Constants.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.TimeManager.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.UndoManager.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.ArtworkTrack.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.AudioTrack.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Viewer.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.ArtworkTrack.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Command.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.ComponentControls.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Display.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.EditorMenu.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.ImageTrack.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.InkablePart.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.InkAuthoring.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.InkController.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.InkTrack.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Keyframe.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.PlaybackControl.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Tests.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Timeline.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.TopMenu.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.TourOptions.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Track.js',
					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.VideoTrack.js',

					'TAG/js/TAG/authoring/TAG.Authoring.SettingsView.js',
					'TAG/js/TAG/authoring/TAG.Authoring.ButtonGroup.js',
					'TAG/js/TAG/authoring/TAG.Authoring.FileUploader.js',
					'TAG/js/TAG/authoring/jscolor/jscolor.js',

					'tagcore/js/popcorn.min.js',                               // TAGCORE
					'tagcore/js/popcorn.capture.js',                           // TAGCORE

					'TAG/telemetry/telemetry.js',
					
					'TAG/tests.js',
					
					'TAG/core.js'
				],
				dest: 'TAG/TAG.js'
			}
		},
		uglify: {
			my_target: {
				files: {
					'TAG/TAG-min.js': [
						'TAG/TAG-embed.js',
						'TAG/TAG.js'
						]
				}
			}
		},
		stylus: {
			compile: {
				options: {
					compress: false
				},
				files: {
					'TAG/css/TAG.css': [
						'TAG/css/common.styl',
						'tagcore/css/StartPage.styl', // in tagcore
						'TAG/css/InternetFailurePage.styl',
						'TAG/css/Artmode.styl',
						'TAG/css/NewCatalog.styl',
						'TAG/css/VideoPlayer.styl',
						'TAG/css/TourPlayer.styl',
						'TAG/css/General.styl',
						'TAG/css/SettingsView.styl',
						'TAG/css/Util.styl'
					]
				}
			}
		},
		jade: {
			compile: {
				options: {
					pretty: true
				},
				files: {
					'tagcore/html/StartPage.html': 'tagcore/html/StartPage.jade', // in tagcore
					'TAG/html/InternetFailurePage.html': 'TAG/html/InternetFailurePage.jade',
					'TAG/html/Artmode.html': 'TAG/html/Artmode.jade',
					'TAG/html/NewCatalog.html': 'TAG/html/NewCatalog.jade',
					'TAG/html/VideoPlayer.html': 'TAG/html/VideoPlayer.jade',
					'TAG/html/SettingsView.html': 'TAG/html/SettingsView.jade',
					'TAG/html/TourPlayer.html': 'TAG/html/TourPlayer.jade'
				}
			}
		},
		watch: {
			files: [
				'tagcore/html/*.jade',
				'tagcore/css/*.styl',

				'tagcore/js/jQueryUI/js/jquery-1.7.1.js',
				'tagcore/js/jQueryUI/js/jquery-ui-1.8.16.custom.min.js',
				'tagcore/js/jQueryUI/js/jquery.available.min.js',
				'tagcore/js/jQueryUI/js/jquery.fittext.js',
				'tagcore/js/jQueryUI/js/jquery.autoSize.js',
				'tagcore/js/jQueryUI/js/jquery.numeric.js',

				'tagcore/js/seadragon/src/Seadragon.Core.js',
				'tagcore/js/seadragon/src/Seadragon.Config.js',
				'tagcore/js/seadragon/src/Seadragon.Strings.js',
				'tagcore/js/seadragon/src/Seadragon.Debug.js',
				'tagcore/js/seadragon/src/Seadragon.Profiler.js',
				'tagcore/js/seadragon/src/Seadragon.Point.js',
				'tagcore/js/seadragon/src/Seadragon.Rect.js',
				'tagcore/js/seadragon/src/Seadragon.Spring.js',
				'tagcore/js/seadragon/src/Seadragon.Utils.js',
				'tagcore/js/seadragon/src/Seadragon.MouseTracker.js',
				'tagcore/js/seadragon/src/Seadragon.EventManager.js',
				'tagcore/js/seadragon/src/Seadragon.ImageLoader.js',
				'tagcore/js/seadragon/src/Seadragon.Buttons.js',
				'tagcore/js/seadragon/src/Seadragon.TileSource.js',
				'tagcore/js/seadragon/src/Seadragon.DisplayRect.js',
				'tagcore/js/seadragon/src/Seadragon.DeepZoom.js',
				'tagcore/js/seadragon/src/Seadragon.Viewport.js',
				'tagcore/js/seadragon/src/Seadragon.Drawer.js',
				'tagcore/js/seadragon/src/Seadragon.Viewer.js',

				'tagcore/js/RIN/web/lib/knockout-2.2.1.js',
				'tagcore/js/utils/CryptoJS/rollups/sha1.js',
				'tagcore/js/utils/CryptoJS/rollups/sha224.js',
				'tagcore/js/utils/CryptoJS/rollups/sha256.js',
				'tagcore/js/utils/CryptoJS/rollups/sha384.js',
				'tagcore/js/utils/CryptoJS/rollups/sha512.js',
				'tagcore/js/utils/jquery.getScrollbarWidth.js',
				'tagcore/js/utils/jquery.throttle-debounce.js',
				'tagcore/js/utils/jquery-css-transform.js',
				'tagcore/js/utils/jquery-animate-css-transform.js',
				'tagcore/js/utils/jquery.xml2json.js',
				'tagcore/js/utils/json2xml.js',
				'tagcore/js/utils/jquery.hammer.js',
				'tagcore/js/utils/hammer.js',
				'tagcore/js/utils/avltree.js',
				'tagcore/js/utils/avlnode.js',
				'tagcore/js/utils/binaryheap.js',
				'tagcore/js/utils/dataholder.js',
				'tagcore/js/utils/doubleLinkedList.js',
				'tagcore/js/utils/hashtable.js',
				'tagcore/js/d3/d3.v2.js',
				'tagcore/js/TAG/util/TAG.Util.js', // tagcore now
				'tagcore/js/html2canvas/html2canvas.js',
				'tagcore/js/utils/jquery.livequery.js',
				'tagcore/js/Autolinker.js-master/dist/Autolinker.js',
				
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Constants.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.TimeManager.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.UndoManager.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.ArtworkTrack.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.AudioTrack.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Viewer.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.ArtworkTrack.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Command.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.ComponentControls.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Display.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.EditorMenu.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.ImageTrack.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.InkablePart.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.InkAuthoring.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.InkController.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.InkTrack.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Keyframe.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.PlaybackControl.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Tests.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Timeline.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.TopMenu.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.TourOptions.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Track.js',
				'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.VideoTrack.js',



				'tagcore/js/TAG/util/TAG.Util.Constants.js',
				'tagcore/js/TAG/util/TAG.Util.Splitscreen.js',
				'tagcore/js/TAG/util/TAG.Util.IdleTimer.js',
				'tagcore/js/TAG/worktop/Worktop.Database.js', // TAGCORE
				'tagcore/js/TAG/worktop/Worktop.Doq.js',      // TAGCORE    
				'tagcore/js/TAG/worktop/TAG.Worktop.Database.js', // TAGCORE
				'TAG/js/TAG/artmode/TAG.AnnotatedImage.js',
				'tagcore/js/TAG/auth/TAG.Auth.js',
				
				'tagcore/js/TAG/layout/TAG.Layout.StartPage.js', // TAGCORE
				'TAG/js/TAG/layout/TAG.Layout.ArtworkViewer.js',
				'TAG/js/TAG/layout/TAG.Layout.CollectionsPage.js',
				'TAG/js/TAG/layout/TAG.Layout.InternetFailurePage.js',
				'TAG/js/TAG/layout/TAG.Layout.MetroSplitscreenMessage.js',
				'TAG/js/TAG/layout/TAG.Layout.TourPlayer.js',
				'TAG/js/TAG/layout/TAG.Layout.VideoPlayer.js',

				'TAG/js/TAG/authoring/TAG.Authoring.SettingsView.js',
				'TAG/js/TAG/authoring/TAG.Authoring.ButtonGroup.js',
				'TAG/js/TAG/authoring/TAG.Authoring.FileUploader.js',
				'TAG/js/TAG/authoring/jscolor/jscolor.js',

				'TAG/telemetry/telemetry.js',
				
				'TAG/tests.js',
				
				'TAG/core.js'
			],
			tasks: ['stylus', 'jade', 'concat']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jade', 'stylus', 'concat']);
}
