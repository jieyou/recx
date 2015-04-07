module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint:{
            options:{
                asi:true,
                laxcomma:true,
                laxbreak:true
                // ,undef:true
            },
            all:['recx.js']
        },
        uglify: {
            options: {
                banner: '/*!\n'
                        + ' * author:jieyou\n'
                        + ' * see https://github.com/jieyou/recx\n'
                        + ' */\n'
            },
            build: {
                src:'recx.js',
                dest:'recx.min.js'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint','uglify']);
}