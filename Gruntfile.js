/**
 * This file takes care of minifying TAG.js. It uses a node
 * package called 'uglify' to do this; uglify minifies files
 * by doing things like changing variable names to single
 * characters and eliminating unnecessary whitespace.
 * 
 * To run, type
 *
 *    $ grunt
 *
 * The output will be TAG/TAG-min.js.
 */

module.exports = function(grunt) {
	grunt.initConfig({
		uglify: { // run this for ship builds
			my_target: {
				files: {
					'TAG/TAG-min.js': [
						'TAG/TAG-embed.js',
						'tagcore/js/TAG.js'
					]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['uglify']);
}
