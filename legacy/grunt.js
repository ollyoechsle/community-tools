/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({
        meta: {
            version: '1.0',
            banner: "/* Community Tools <%= meta.version %> */"
        },
        concat: {
            buses_css: {
                src: ['<banner:meta.banner>', 'src/css/buses.css', 'src/css/table.css', 'src/css/tabs.css', 'src/css/hselector.css'],
                dest: 'static/community-tools-buses-<%= meta.version %>.css'
            },
            buses: {
                src: ['<banner:meta.banner>', 'src/js/namespace.js', 'src/js/subscribable.js', 'src/js/hselector.js', 'src/js/buses/*.js'],
                dest: 'static/community-tools-buses-<%= meta.version %>.js'
            },
            weather: {
                src: ['<banner:meta.banner>', 'src/js/namespace.js', 'src/js/subscribable.js', 'src/js/weather/*.js'],
                dest: 'static/community-tools-weather-<%= meta.version %>.js'
            },
            weather_css: {
                src: ['<banner:meta.banner>', 'src/css/table.css', 'src/css/weather.css'],
                dest: 'static/community-tools-weather-<%= meta.version %>.css'
            },
            news: {
                src: ['<banner:meta.banner>', 'src/js/namespace.js', 'src/js/news/*.js'],
                dest: 'static/community-tools-news-<%= meta.version %>.js'
            },
            news_css: {
                src: ['<banner:meta.banner>', 'src/css/news.css'],
                dest: 'static/community-tools-news-<%= meta.version %>.css'
            }
        },
        min: {
            buses: {
                src: ['<config:concat.buses.dest>'],
                dest: 'static/community-tools-buses-<%= meta.version %>.min.js'
            },
            weather: {
                src: ['<config:concat.weather.dest>'],
                dest: 'static/community-tools-weather-<%= meta.version %>.min.js'
            },
            news: {
                src: ['<config:concat.news.dest>'],
                dest: 'static/community-tools-news-<%= meta.version %>.min.js'
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