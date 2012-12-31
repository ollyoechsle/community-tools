/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({
        meta:{
            version:'1.0',
            banner:"/* Community Tools <%= meta.version %> */"
        },
        concat:{
            buses:{
                src:['<banner:meta.banner>', 'src/namespace.js', 'src/subscribable.js', 'src/hselector.js', 'src/buses/*.js'],
                dest:'static/community-tools-buses-<%= meta.version %>.js'
            },
            weather:{
                src:['<banner:meta.banner>', 'src/namespace.js', 'src/hselector.js', 'src/weather/*.js'],
                dest:'static/community-tools-weather-<%= meta.version %>.js'
            },
            news:{
                src:['<banner:meta.banner>', 'src/namespace.js', 'src/news/*.js'],
                dest:'static/community-tools-news-<%= meta.version %>.js'
            }
        },
        min:{
            buses:{
                src:['<config:concat.buses.dest>'],
                dest:'static/community-tools-buses-<%= meta.version %>.min.js'
            },
            weather:{
                src:['<config:concat.weather.dest>'],
                dest:'static/community-tools-weather-<%= meta.version %>.min.js'
            },
            news:{
                src:['<config:concat.news.dest>'],
                dest:'static/community-tools-news-<%= meta.version %>.min.js'
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