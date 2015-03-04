module.exports = function(grunt) {

  /**
   * Initialize grunt
   */
  grunt.initConfig({

    /**
     * Read package.json
     */
    pkg: grunt.file.readJSON('package.json'),

    sshconfig: {
      'server': grunt.file.readJSON('secrets.json'),
    },

    sftp: {
      deploy: {
        files: {
          "./": [
            "bin/**",
            "public/**",
            "routes/**",
            "views/**",
            "*",
          ]
        },
        options: {
          config: 'server',
          path: '<%= sshconfig.server.path %>',
          srcBasePath: "./",
          showProgress: true,
          createDirectories: true,
        }
      }
    },

    sshexec: {
      options: {
        config: 'server',
      },
      start: {
        command: [
          'cd <%= sshconfig.server.path %>',
          'npm install --production',
          'export NODE_ENV=production',
          'forever start --append --uid <%= pkg.name %> bin/www',
        ].join(' && '),
      },
      restart: {
        command: [
          'cd <%= sshconfig.server.path %>',
          'npm install --production',
          'export NODE_ENV=production',
          'forever restart <%= pkg.name %>',
        ].join(' && '),
      },
    },
    stop: {
      command: [
        'forever stop <%= pkg.name %>',
      ].join(' && '),
    },

  });

  grunt.registerTask('deploy',
    function(arg) {
      var commands = ['sftp:deploy'];
      if (arg === 'start') {
        commands.push(['sshexec:start']);
      } else if (arg === 'restart') {
        commands.push(['sshexec:restart']);
      }
      return grunt.task.run(commands);
    });


  /**
   * Load the plugins specified in `package.json`
   */
  grunt.loadNpmTasks('grunt-ssh');

};
