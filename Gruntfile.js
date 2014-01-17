module.exports = function(grunt) {
	grunt.initConfig({
		stylus: {
			compile: {
				options: {
					compress: false
				},
				files: {
					'LADS/css/StartPage.css': 'LADS/css/StartPage.styl',
					'LADS/css/InternetFailurePage.css': 'LADS/css/InternetFailurePage.styl',
				    'LADS/css/Artmode.css': 'LADS/css/Artmode.styl',
					'LADS/css/NewCatalog.css': 'LADS/css/NewCatalog.styl',
					// 'LADS/css/VideoPlayer.css': 'LADS/css/VideoPlayer.styl',
					'LADS/css/TourPlayer.css': 'LADS/css/TourPlayer.styl',
					'LADS/css/General.css': 'LADS/css/General.styl'
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
					// 'LADS/html/VideoPlayer.html': 'LADS/html/VideoPlayer.jade',
					'LADS/html/TourPlayer.html': 'LADS/html/TourPlayer.jade'
				}
			}
		},
		watch: {
			files: ['LADS/html/*.jade', 'LADS/css/*.styl'],
			tasks: ['stylus', 'jade']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jade', 'stylus']);
}