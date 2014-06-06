module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			options: {
				separator: '\n;\n',
				banner: 'var TAG = function(tagInput) { \
					        \n    tagPath = tagInput.path; \
					        \n    containerId = tagInput.containerId; \
					        \n    ip = tagInput.serverIp; \
					        \n    allowServerChange = tagInput.allowServerChange;\n',
				footer: '};'
			},
			dist: {
				src: [
					'LADS/js/jQueryUI/js/jquery-1.7.1.js',
					'LADS/js/jQueryUI/js/jquery-ui-1.8.16.custom.min.js',
					'LADS/js/jQueryUI/js/jquery.available.min.js',
					'LADS/js/jQueryUI/js/jquery.fittext.js',
					'LADS/js/jQueryUI/js/jquery.autoSize.js',
					'LADS/js/jQueryUI/js/jquery.numeric.js',

					'LADS/js/seadragon/src/Seadragon.Core.js',
					'LADS/js/seadragon/src/Seadragon.Config.js',
					'LADS/js/seadragon/src/Seadragon.Strings.js',
					'LADS/js/seadragon/src/Seadragon.Debug.js',
					'LADS/js/seadragon/src/Seadragon.Profiler.js',
					'LADS/js/seadragon/src/Seadragon.Point.js',
					'LADS/js/seadragon/src/Seadragon.Rect.js',
					'LADS/js/seadragon/src/Seadragon.Spring.js',
					'LADS/js/seadragon/src/Seadragon.Utils.js',
					'LADS/js/seadragon/src/Seadragon.MouseTracker.js',
					'LADS/js/seadragon/src/Seadragon.EventManager.js',
					'LADS/js/seadragon/src/Seadragon.ImageLoader.js',
					'LADS/js/seadragon/src/Seadragon.Buttons.js',
					'LADS/js/seadragon/src/Seadragon.TileSource.js',
					'LADS/js/seadragon/src/Seadragon.DisplayRect.js',
					'LADS/js/seadragon/src/Seadragon.DeepZoom.js',
					'LADS/js/seadragon/src/Seadragon.Viewport.js',
					'LADS/js/seadragon/src/Seadragon.Drawer.js',
					'LADS/js/seadragon/src/Seadragon.Viewer.js',

					'LADS/js/RIN/web/lib/knockout-2.2.1.js',
					'LADS/js/utils/CryptoJS/rollups/sha1.js',
					'LADS/js/utils/CryptoJS/rollups/sha224.js',
					'LADS/js/utils/CryptoJS/rollups/sha256.js',
					'LADS/js/utils/CryptoJS/rollups/sha384.js',
					'LADS/js/utils/CryptoJS/rollups/sha512.js',
					'LADS/js/utils/jquery.getScrollbarWidth.js',
					'LADS/js/utils/jquery.throttle-debounce.js',
					'LADS/js/utils/jquery-css-transform.js',
					'LADS/js/utils/jquery-animate-css-transform.js',
					'LADS/js/utils/jquery.xml2json.js',
					'LADS/js/utils/json2xml.js',
					'LADS/js/utils/jquery.hammer.js',
					'LADS/js/utils/hammer.js',
					'LADS/js/utils/avltree.js',
					'LADS/js/utils/avlnode.js',
					'LADS/js/utils/binaryheap.js',
					'LADS/js/utils/dataholder.js',
					'LADS/js/utils/TwoStageTimer.js',
					'LADS/js/utils/doubleLinkedList.js',
					'LADS/js/utils/hashtable.js',
					'LADS/js/d3/d3.v2.js',
					'LADS/js/LADS/util/LADS.Util.js',
					'LADS/js/html2canvas/html2canvas.js',
					'LADS/js/utils/jquery.livequery.js',

					'LADS/js/LADS/tourauthoring/LADS.TourAuthoring.Constants.js',
					'LADS/js/LADS/util/LADS.Util.Constants.js',
					'LADS/js/LADS/util/LADS.Util.Splitscreen.js',
					'LADS/js/LADS/worktop/Worktop.Database.js',
					'LADS/js/LADS/worktop/Worktop.Doq.js',
					'LADS/js/LADS/worktop/LADS.Worktop.Database.js',
					'LADS/js/LADS/artmode/LADS.AnnotatedImage.js',
					'LADS/js/LADS/auth/LADS.Auth.js',

					'LADS/js/LADS/layout/LADS.Layout.StartPage.js',
					'LADS/js/LADS/layout/LADS.Layout.Artmode.js',
					'LADS/js/LADS/layout/LADS.Layout.NewCatalog.js',
					'LADS/js/LADS/layout/LADS.Layout.InternetFailurePage.js',
					'LADS/js/LADS/layout/LADS.Layout.MetroSplitscreenMessage.js',
					'LADS/js/LADS/layout/LADS.Layout.TourPlayer.js',
					'LADS/js/LADS/layout/LADS.Layout.VideoPlayer.js',
					
					'LADS/js/LADS/authoring/LADS.Authoring.SettingsView.js',
					'LADS/js/LADS/authoring/LADS.Authoring.ButtonGroup.js',
					'LADS/js/LADS/authoring/LADS.Authoring.FileUploader.js',
					'LADS/js/LADS/authoring/jscolor/jscolor.js',

					'LADS/js/popcorn.min.js',
					'LADS/js/popcorn.capture.js',
					
					'LADS/tests.js',
					
					'LADS/core.js'
				],
				dest: 'LADS/TAG.js'
			}
		},
		uglify: {
			my_target: {
				files: {
					'LADS/TAG-min.js': ['LADS/TAG.js']
				}
			}
		},
		stylus: {
			compile: {
				options: {
					compress: false
				},
				files: {
					'LADS/css/TAG.css': [
						'LADS/css/common.styl',
						'LADS/css/StartPage.styl',
						'LADS/css/InternetFailurePage.styl',
						'LADS/css/Artmode.styl',
						'LADS/css/SettingsView.styl',
						'LADS/css/NewCatalog.styl',
						'LADS/css/VideoPlayer.styl',
						'LADS/css/TourPlayer.styl',
						'LADS/css/General.styl'

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
					'LADS/html/StartPage.html': 'LADS/html/StartPage.jade',
					'LADS/html/InternetFailurePage.html': 'LADS/html/InternetFailurePage.jade',
					'LADS/html/Artmode.html': 'LADS/html/Artmode.jade',
					'LADS/html/NewCatalog.html': 'LADS/html/NewCatalog.jade',
					'LADS/html/VideoPlayer.html': 'LADS/html/VideoPlayer.jade',
					'LADS/html/TourPlayer.html': 'LADS/html/TourPlayer.jade',
					'LADS/html/SettingsView.html':'LADS/html/SettingsView.jade'
				}
			}
		},
		watch: {
			files: [
				'LADS/html/*.jade',
				'LADS/css/*.styl',

				'LADS/js/jQueryUI/js/jquery-1.7.1.js',
				'LADS/js/jQueryUI/js/jquery-ui-1.8.16.custom.min.js',
				'LADS/js/jQueryUI/js/jquery.available.min.js',
				'LADS/js/jQueryUI/js/jquery.fittext.js',
				'LADS/js/jQueryUI/js/jquery.autoSize.js',
				'LADS/js/jQueryUI/js/jquery.numeric.js',

				'LADS/js/seadragon/src/Seadragon.Core.js',
				'LADS/js/seadragon/src/Seadragon.Config.js',
				'LADS/js/seadragon/src/Seadragon.Strings.js',
				'LADS/js/seadragon/src/Seadragon.Debug.js',
				'LADS/js/seadragon/src/Seadragon.Profiler.js',
				'LADS/js/seadragon/src/Seadragon.Point.js',
				'LADS/js/seadragon/src/Seadragon.Rect.js',
				'LADS/js/seadragon/src/Seadragon.Spring.js',
				'LADS/js/seadragon/src/Seadragon.Utils.js',
				'LADS/js/seadragon/src/Seadragon.MouseTracker.js',
				'LADS/js/seadragon/src/Seadragon.EventManager.js',
				'LADS/js/seadragon/src/Seadragon.ImageLoader.js',
				'LADS/js/seadragon/src/Seadragon.Buttons.js',
				'LADS/js/seadragon/src/Seadragon.TileSource.js',
				'LADS/js/seadragon/src/Seadragon.DisplayRect.js',
				'LADS/js/seadragon/src/Seadragon.DeepZoom.js',
				'LADS/js/seadragon/src/Seadragon.Viewport.js',
				'LADS/js/seadragon/src/Seadragon.Drawer.js',
				'LADS/js/seadragon/src/Seadragon.Viewer.js',

				'LADS/js/RIN/web/lib/knockout-2.2.1.js',
				'LADS/js/utils/CryptoJS/rollups/sha1.js',
				'LADS/js/utils/CryptoJS/rollups/sha224.js',
				'LADS/js/utils/CryptoJS/rollups/sha256.js',
				'LADS/js/utils/CryptoJS/rollups/sha384.js',
				'LADS/js/utils/CryptoJS/rollups/sha512.js',
				'LADS/js/utils/jquery.getScrollbarWidth.js',
				'LADS/js/utils/jquery.throttle-debounce.js',
				'LADS/js/utils/jquery-css-transform.js',
				'LADS/js/utils/jquery-animate-css-transform.js',
				'LADS/js/utils/jquery.xml2json.js',
				'LADS/js/utils/json2xml.js',
				'LADS/js/utils/jquery.hammer.js',
				'LADS/js/utils/hammer.js',
				'LADS/js/utils/avltree.js',
				'LADS/js/utils/avlnode.js',
				'LADS/js/utils/binaryheap.js',
				'LADS/js/utils/dataholder.js',
				'LADS/js/utils/TwoStageTimer.js',
				'LADS/js/utils/doubleLinkedList.js',
				'LADS/js/utils/hashtable.js',
				'LADS/js/d3/d3.v2.js',
				'LADS/js/LADS/util/LADS.Util.js',
				'LADS/js/html2canvas/html2canvas.js',
				'LADS/js/utils/jquery.livequery.js',

				'LADS/js/LADS/tourauthoring/LADS.TourAuthoring.Constants.js',
				'LADS/js/LADS/util/LADS.Util.Constants.js',
				'LADS/js/LADS/util/LADS.Util.Splitscreen.js',
				'LADS/js/LADS/worktop/Worktop.Database.js',
				'LADS/js/LADS/worktop/Worktop.Doq.js',
				'LADS/js/LADS/worktop/LADS.Worktop.Database.js',
				'LADS/js/LADS/artmode/LADS.AnnotatedImage.js',
				'LADS/js/LADS/auth/LADS.Auth.js',
				
				'LADS/js/LADS/layout/LADS.Layout.StartPage.js',
				'LADS/js/LADS/layout/LADS.Layout.Artmode.js',
				'LADS/js/LADS/layout/LADS.Layout.NewCatalog.js',
				'LADS/js/LADS/layout/LADS.Layout.InternetFailurePage.js',
				'LADS/js/LADS/layout/LADS.Layout.MetroSplitscreenMessage.js',
				'LADS/js/LADS/layout/LADS.Layout.TourPlayer.js',
				'LADS/js/LADS/layout/LADS.Layout.VideoPlayer.js',

				'LADS/js/LADS/authoring/LADS.Authoring.SettingsView.js',
				'LADS/js/LADS/authoring/LADS.Authoring.ButtonGroup.js',
				'LADS/js/LADS/authoring/LADS.Authoring.FileUploader.js',
				'LADS/js/LADS/authoring/jscolor/jscolor.js',
				
				'LADS/tests.js',
				
				'LADS/core.js'
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
