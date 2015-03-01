module.exports = function(grunt) {

  /**
   * Initialize grunt
   */
  grunt.initConfig({

    /**
     * Read package.json
     */
    pkg: grunt.file.readJSON('package.json'),

    dirs: {
      remote: '/Users/sijo/public_html/slack_commands/'
    },

    sshconfig: {
      'trolla': grunt.file.readJSON('secrets.json'),
    },

    sftp: {
      deploy: {
        files: {
          // "./": "./**"
          "./": [
            "bin/**",
            "public/**",
            "routes/**",
            "views/**",
            "*.js",
            "*.json",
          ]
        },
        options: {
          config: 'trolla',
          path: '<%= dirs.remote %>',
          srcBasePath: "./",
          showProgress: true,
          createDirectories: true,
        }
      }
    },

    sshexec: {
      start: {
        options: {
          config: 'trolla',
        },
        command: [
          'cd <%= dirs.remote %>',
          'npm install --production',
          'export NODE_ENV=production',
          'forever restart slack-commands',
        ].join(' && '),
      },
    },

  });

  /**
   * Default Task
   * run `grunt`
   */
  grunt.registerTask('deploy', [
    'sftp:deploy',
    'sshexec:start',
  ]);

  /**
   * Load the plugins specified in `package.json`
   */
  grunt.loadNpmTasks('grunt-ssh');

};
