'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);


  grunt.initConfig({
    // Project settings
    ToDoList: {
      server: 'server',
      dist: 'dist'
    },
    express: {
      options: {
        port: process.env.PORT || 3000
      },
      dev: {
        options: {
          script: '<%= ToDoList.server %>/app.js',
          debug: true
        }
      },
      test: {
        options: {
          script: '<%= ToDoList.server %>/app.js',
          port: 5000,
          debug: true
        }
      },
      prod: {
        options: {
          script: '<%= ToDoList.dist %>/app.js',
          node_env: 'production'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },
    watch: {
      jsTest: {
        files: ['test/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'mochaTest']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      express: {
        files: [
          '<%= ToDoList.server %>/**/**.js'
        ],
        tasks: ['jshint:server', 'mochaTest','express:dev'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        src: ['server/{,**/}**.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= ToDoList.dist %>/views/*',
            '<%= ToDoList.dist %>/public/*',
            '!<%= ToDoList.dist %>/public/.git*'
          ]
        }]
      }
    }, 

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [ {
          expand: true,
          dest: '<%= ToDoList.dist %>',
          src: [
            'package.json',
            '<%= ToDoList.server %>/**/**.js'
          ]
        }]
      }
    },

    
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/{,*/}*.js']
      }
    }

  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'express:prod', 'open', 'express-keepalive']);
    }

    grunt.task.run([
      'express:dev',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'express:test',
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'clean:dist'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};