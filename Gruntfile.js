module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			options: {
				separator: '\n;\n',
				banner: 'var TAG_GLOBAL = function(tagInput) { \
					        \n    var tagPath           = tagInput.path, \
					        \n        containerId       = tagInput.containerId, \
					        \n        ip                = tagInput.serverIp, \
					        \n        allowServerChange = tagInput.allowServerChange, \
					        \n 		  allowAuthoringMode = tagInput.allowAuthoringMode, \
					        \n        idleDuration      = tagInput.idleDuration, \
					        \n        currentPage       = {}, // name and obj properties \
					        \n        INPUT_TOUR_ID     = tagInput.tourId, // to load to a tour \
					        \n        idleTimer; \n\n',
				footer: '};'
			},
			dist: {
				src: [
					'TAG/js/jQueryUI/js/jquery-1.7.1.js',
					'TAG/js/jQueryUI/js/jquery-ui-1.8.16.custom.min.js',
					'TAG/js/jQueryUI/js/jquery.available.min.js',
					'TAG/js/jQueryUI/js/jquery.fittext.js',
					'TAG/js/jQueryUI/js/jquery.autoSize.js',
					'TAG/js/jQueryUI/js/jquery.numeric.js',

					'TAG/js/seadragon/src/Seadragon.Core.js',
					'TAG/js/seadragon/src/Seadragon.Config.js',
					'TAG/js/seadragon/src/Seadragon.Strings.js',
					'TAG/js/seadragon/src/Seadragon.Debug.js',
					'TAG/js/seadragon/src/Seadragon.Profiler.js',
					'TAG/js/seadragon/src/Seadragon.Point.js',
					'TAG/js/seadragon/src/Seadragon.Rect.js',
					'TAG/js/seadragon/src/Seadragon.Spring.js',
					'TAG/js/seadragon/src/Seadragon.Utils.js',
					'TAG/js/seadragon/src/Seadragon.MouseTracker.js',
					'TAG/js/seadragon/src/Seadragon.EventManager.js',
					'TAG/js/seadragon/src/Seadragon.ImageLoader.js',
					'TAG/js/seadragon/src/Seadragon.Buttons.js',
					'TAG/js/seadragon/src/Seadragon.TileSource.js',
					'TAG/js/seadragon/src/Seadragon.DisplayRect.js',
					'TAG/js/seadragon/src/Seadragon.DeepZoom.js',
					'TAG/js/seadragon/src/Seadragon.Viewport.js',
					'TAG/js/seadragon/src/Seadragon.Drawer.js',
					'TAG/js/seadragon/src/Seadragon.Viewer.js',

					'TAG/js/RIN/web/lib/knockout-2.2.1.js',
					'TAG/js/utils/CryptoJS/rollups/sha1.js',
					'TAG/js/utils/CryptoJS/rollups/sha224.js',
					'TAG/js/utils/CryptoJS/rollups/sha256.js',
					'TAG/js/utils/CryptoJS/rollups/sha384.js',
					'TAG/js/utils/CryptoJS/rollups/sha512.js',
					'TAG/js/utils/jquery.getScrollbarWidth.js',
					'TAG/js/utils/jquery.throttle-debounce.js',
					'TAG/js/utils/jquery-css-transform.js',
					'TAG/js/utils/jquery-animate-css-transform.js',
					'TAG/js/utils/jquery.xml2json.js',
					'TAG/js/utils/json2xml.js',
					'TAG/js/utils/jquery.hammer.js',
					'TAG/js/utils/hammer.js',
					'TAG/js/utils/avltree.js',
					'TAG/js/utils/avlnode.js',
					'TAG/js/utils/binaryheap.js',
					'TAG/js/utils/dataholder.js',
					'TAG/js/utils/doubleLinkedList.js',
					'TAG/js/utils/hashtable.js',
					'TAG/js/d3/d3.v2.js',
					'TAG/js/TAG/util/TAG.Util.js',
					'TAG/js/html2canvas/html2canvas.js',
					'TAG/js/utils/jquery.livequery.js',
					'TAG/js/Autolinker.js-master/dist/Autolinker.js',

					'TAG/js/TAG/tourauthoring/TAG.TourAuthoring.Constants.js',
					'TAG/js/TAG/util/TAG.Util.Constants.js',
					'TAG/js/TAG/util/TAG.Util.Splitscreen.js',
					'TAG/js/TAG/util/TAG.Util.IdleTimer.js',
					'TAG/js/TAG/worktop/Worktop.Database.js',
					'TAG/js/TAG/worktop/Worktop.Doq.js',
					'TAG/js/TAG/worktop/TAG.Worktop.Database.js',
					'TAG/js/TAG/artmode/TAG.AnnotatedImage.js',
					'TAG/js/TAG/auth/TAG.Auth.js',
					'TAG/js/TAG/layout/TAG.Layout.StartPage.js',
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

					'TAG/js/popcorn.min.js',
					'TAG/js/popcorn.capture.js',

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
						'TAG/css/StartPage.styl',
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
					'TAG/html/StartPage.html': 'TAG/html/StartPage.jade',
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
				'TAG/html/*.jade',
				'TAG/css/*.styl',

				'TAG/js/jQueryUI/js/jquery-1.7.1.js',
				'TAG/js/jQueryUI/js/jquery-ui-1.8.16.custom.min.js',
				'TAG/js/jQueryUI/js/jquery.available.min.js',
				'TAG/js/jQueryUI/js/jquery.fittext.js',
				'TAG/js/jQueryUI/js/jquery.autoSize.js',
				'TAG/js/jQueryUI/js/jquery.numeric.js',

				'TAG/js/seadragon/src/Seadragon.Core.js',
				'TAG/js/seadragon/src/Seadragon.Config.js',
				'TAG/js/seadragon/src/Seadragon.Strings.js',
				'TAG/js/seadragon/src/Seadragon.Debug.js',
				'TAG/js/seadragon/src/Seadragon.Profiler.js',
				'TAG/js/seadragon/src/Seadragon.Point.js',
				'TAG/js/seadragon/src/Seadragon.Rect.js',
				'TAG/js/seadragon/src/Seadragon.Spring.js',
				'TAG/js/seadragon/src/Seadragon.Utils.js',
				'TAG/js/seadragon/src/Seadragon.MouseTracker.js',
				'TAG/js/seadragon/src/Seadragon.EventManager.js',
				'TAG/js/seadragon/src/Seadragon.ImageLoader.js',
				'TAG/js/seadragon/src/Seadragon.Buttons.js',
				'TAG/js/seadragon/src/Seadragon.TileSource.js',
				'TAG/js/seadragon/src/Seadragon.DisplayRect.js',
				'TAG/js/seadragon/src/Seadragon.DeepZoom.js',
				'TAG/js/seadragon/src/Seadragon.Viewport.js',
				'TAG/js/seadragon/src/Seadragon.Drawer.js',
				'TAG/js/seadragon/src/Seadragon.Viewer.js',

				'TAG/js/RIN/web/lib/knockout-2.2.1.js',
				'TAG/js/utils/CryptoJS/rollups/sha1.js',
				'TAG/js/utils/CryptoJS/rollups/sha224.js',
				'TAG/js/utils/CryptoJS/rollups/sha256.js',
				'TAG/js/utils/CryptoJS/rollups/sha384.js',
				'TAG/js/utils/CryptoJS/rollups/sha512.js',
				'TAG/js/utils/jquery.getScrollbarWidth.js',
				'TAG/js/utils/jquery.throttle-debounce.js',
				'TAG/js/utils/jquery-css-transform.js',
				'TAG/js/utils/jquery-animate-css-transform.js',
				'TAG/js/utils/jquery.xml2json.js',
				'TAG/js/utils/json2xml.js',
				'TAG/js/utils/jquery.hammer.js',
				'TAG/js/utils/hammer.js',
				'TAG/js/utils/avltree.js',
				'TAG/js/utils/avlnode.js',
				'TAG/js/utils/binaryheap.js',
				'TAG/js/utils/dataholder.js',
				'TAG/js/utils/doubleLinkedList.js',
				'TAG/js/utils/hashtable.js',
				'TAG/js/d3/d3.v2.js',
				'TAG/js/TAG/util/TAG.Util.js',
				'TAG/js/html2canvas/html2canvas.js',
				'TAG/js/utils/jquery.livequery.js',
				'TAG/js/Autolinker.js-master/dist/Autolinker.js',
				
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



				'TAG/js/TAG/util/TAG.Util.Constants.js',
				'TAG/js/TAG/util/TAG.Util.Splitscreen.js',
				'TAG/js/TAG/util/TAG.Util.IdleTimer.js',
				'TAG/js/TAG/worktop/Worktop.Database.js',
				'TAG/js/TAG/worktop/Worktop.Doq.js',
				'TAG/js/TAG/worktop/TAG.Worktop.Database.js',
				'TAG/js/TAG/artmode/TAG.AnnotatedImage.js',
				'TAG/js/TAG/auth/TAG.Auth.js',
				
				'TAG/js/TAG/layout/TAG.Layout.StartPage.js',
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
