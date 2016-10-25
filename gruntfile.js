'use strict';

var fs = require('fs');

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverViews: ['server-app-folder/views/**/*.*'],
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'server-app-folder/**/*.js', '!server-app-folder/tests/'],
		clientViews: ['public/modules/**/views/**/*.html'],
		clientJS: ['public/js/**/*.js', 'public/**/*.es6', '!public/**/*.compiled.js'],
		allES6: ['public/**/*.es6', 'server-app-folder/**/*.es6'],
		clientCSS: ['public/assets/**/*.css'],
		clientLESS: ['public/modules/**/less/*.less'],
		mochaTestsES6: ['server-app-folder/tests/**/*.es6'],
		mochaTests: ['server-app-folder/tests/**/*.js']
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
			// serverJS: {
			// 	files: watchFiles.serverJS,
			// 	tasks: ['jshint'],
			// 	options: {
			// 		livereload: true
			// 	}
			// },
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true
				}
			},
			// clientJS: {
			// 	files: watchFiles.clientJS,
			// 	tasks: ['jshint'],
			// 	options: {
			// 		livereload: true
			// 	}
			// },
			allES6: {
				files: watchFiles.allES6,
				tasks: ['build-es6', 'jshint'],
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
				tasks: ['build-less'],
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
						ext: '.js',
						extDot: 'last'
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
			server: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			buildSrc: ['build-less', 'build-es6'],
			minifySrc: ['cssmin', 'uglify'],
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
			},
			test: {
				NODE_ENV: 'test'
			},
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
			// TODO: seems like doing nothing?
			localConfig: {
				src: 'config/env/local.example.js',
				dest: 'config/env/local.js',
				filter: function() {
					return !fs.existsSync('config/env/local.js');
				}
			}
		},
		clean: {
			compiledJs: [
				'public/modules/**/*.js', 'public/modules/**/*.js.map',
				'server-app-folder/**/*.js', 'server-app-folder/**/*.js.map'
			]
		}
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-contrib-clean');

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
	grunt.registerTask('default', ['server']);
	grunt.registerTask('server', ['build', 'minify', 'env:development', 'concurrent:server']);

	// Development tasks - when external server is needed (e.g. debug through IDE)
	grunt.registerTask('dev', ['build', 'watch']);

	// Debug task.
	grunt.registerTask('debug', ['build', 'concurrent:debug']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['concurrent:buildSrc', 'lint']);
	grunt.registerTask('build-less', ['less']);
	grunt.registerTask('build-es6', ['clean:compiledJs', 'loadConfig', 'babel:es6', 'ngAnnotate']);
	grunt.registerTask('minify', ['concurrent:minifySrc']);

	// Test task.
	grunt.registerTask('test', [/*'copy:localConfig',*/ 'test:server', 'test:client']);
	grunt.registerTask('test:server', ['clean:compiledJs', 'babel:es6', 'env:test', 'mochaTest']);
	grunt.registerTask('test:client', ['clean:compiledJs', 'babel:es6', 'env:test', 'karma:unit']);
};
