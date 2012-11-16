/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({
        meta:{
            version:'1.0',
            banner:"/* Community Tools <%= meta.version %> */"
        },
        concat:{
            dist:{
                src:['<banner:meta.banner>', 'src/namespace.js', 'src/*.js'],
                dest:'static/community-tools-<%= meta.version %>.js'
            }
        },
        min:{
            dist:{
                src:['<config:concat.dist.dest>'],
                dest:'static/comunity-tools-<%= meta.version %>.min.js'
            }
        },
        qunit: {
            all: ['test/tests.html']
        },
        server: {
            port: 8099,
            base: '.'
        }
    });

    grunt.registerTask('default', 'concat min');
    grunt.registerTask('test', 'default server qunit');

};