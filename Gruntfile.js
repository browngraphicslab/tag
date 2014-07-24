/**
 * This gruntfile contains only a task to minify TAG. The node
 * package used to do this is called "uglify," and it minifies
 * by doing things like renaming variables to only one character
 * and eliminating extra whitespace.
 * 
 * To run, type
 *
 *    $ grunt
 *
 * from the command line. The output will be TAG/TAG-min.js.
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
