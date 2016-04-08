'use strict';

var fs = require('fs');

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverViews: ['app/views/**/*.*'],
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js', '!app/tests/'],
		clientViews: ['public/modules/**/views/**/*.html'],
		clientJS: ['public/js/**/*.js', 'public/**/*.es6', '!public/**/*.compiled.js'],
		allES6: ['public/**/*.es6', 'app/**/*.es6'],
		clientCSS: ['public/assets/**/*.css'],
		clientLESS: ['public/modules/**/less/*.less'],
		mochaTestsES6: ['app/tests/**/*.es6'],
		mochaTests: ['app/tests/**/*.js']
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverViews: {
				files: watchFiles.serverViews,
				options: {
					livereload: true
				}
			},
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			},
			clientLESS: {
				files: watchFiles.clientLESS,
				tasks: ['less', 'csslint'],
				options: {
					livereload: true
				}
			},
			mochaTests: {
				files: watchFiles.mochaTestsES6,
				tasks: ['test:server']
			}
		},
		less: {
			dist: {
				files: [{
					expand: true,
					src: watchFiles.clientLESS,
					ext: '.css',
					rename: function(base, src){
						return src.replace('/less/', '/css/');
					}
				}]
			}
		},
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.serverJS),
				options: {
					jshintrc: true
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			all: {
				src: watchFiles.clientCSS
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'public/dist/application.min.js': 'public/dist/application.js'
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'public/dist/application.min.css': '<%= applicationCSSFiles %>'
				}
			}
		},
		babel: {
			es6: {
				files: [
					{
						expand: true,
						src: watchFiles.allES6,
						ext: '.compiled.js'
					}
				]
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.serverViews.concat(watchFiles.serverJS)
				}
			}
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
		ngAnnotate: {
			production: {
				files: {
					'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		},
		env: {
			development: {
				NODE_ENV: 'development'
			},
			production: {
				NODE_ENV: 'production'
			}
		},
		mochaTest: {
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec',
				require: 'server.js'
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},
		copy: {
			localConfig: {
				src: 'config/env/local.example.js',
				dest: 'config/env/local.js',
				filter: function() {
					return !fs.existsSync('config/env/local.js');
				}
			}
		}
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
		var init = require('./config/init')();
		var config = require('./config/config');

		grunt.config.set('applicationJavaScriptFiles', config.assets.js);
		grunt.config.set('applicationCSSFiles', config.assets.css);
	});

	// Default task(s).
	grunt.registerTask('default', ['env:development', 'lint', 'copy:localConfig', 'concurrent:default']);

	// Debug task.
	grunt.registerTask('debug', ['lint', 'copy:localConfig', 'concurrent:debug']);

	// Lint task(s).
	grunt.registerTask('lint', ['less', 'jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['lint', 'babel:es6', 'loadConfig', 'ngAnnotate', 'uglify', 'cssmin']);

	// Test task.
	grunt.registerTask('test', ['copy:localConfig', 'test:server', 'test:client']);
	grunt.registerTask('test:server', ['babel:es6', 'env:development', 'mochaTest']);
	grunt.registerTask('test:client', ['env:development', 'karma:unit']);
};
