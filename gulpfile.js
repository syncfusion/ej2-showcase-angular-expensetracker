global.config = global.config;

var gulp = require('gulp');
var webpackGulp = require('webpack-stream');
var webpack = require('webpack');
var runSequence = require('run-sequence');
var webpackConfig = require("./webpack.config.js");
var clean = require("gulp-clean");
var shelljs = global.shelljs = global.shelljs || require('shelljs');

/**
 * Compile scss files
 */
gulp.task('styles', function() {
    var sass = require('gulp-sass');
    return gulp.src(['./src/assets/**/*.scss'], { base: './' })
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: './node_modules/@syncfusion/'
        }))
        .pipe(gulp.dest('.'));
});

/**
 * Bundle all module using webpack
 */
gulp.task('bundle', function (done) {
    webpack(webpackConfig, function (err) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        done();
    });
});

gulp.task('clear-all', function () {
    return gulp.src(['src/app/**/*.js.map', 'src/app/**/*.json', 'src/app/**/*.js', 'src/app/**/*.d.ts', 'src/app/**/*.ngfactory.ts', 'src/app/**/*.ngstyle.ts']).pipe(clean({ force: true }))
});

/**
 * Build ts and scss files
 */
gulp.task('build', function(done) {
    shelljs.exec('npm run build', function (exitCode) {
        done(exitCode);
    })
    runSequence('styles');
});

/**
 * Init the browser-sync for loading samples
 */
gulp.task('serve', ['build'], function (done) {
    var browserSync = require('browser-sync');
    var bs = browserSync.create('Essential TypeScript');
    var options = {
        server: {
            baseDir: './src'
        },
        ui: false
    };
    bs.init(options, done);
});