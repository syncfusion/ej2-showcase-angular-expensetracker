global.config = global.config;

var print;
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var gulp = require('gulp');
var webpackGulp = require('webpack-stream');
var webpack = require('webpack');
var runSequence = require('run-sequence');
var webpackConfig = require("./webpack.config.js");
var clean = require("gulp-clean");
var shelljs = global.shelljs = global.shelljs || require('shelljs');
var config = require('./config.json');
var tsConfig = __dirname + '/tslint.json';
var sassConfig = __dirname + config.sasslintConfig;

/**
 * Lint source files using microsoft contributed tslint
 */
var tslintErrors = [];
gulp.task('ts-lint', function () {
    print = print || require('gulp-print');
    var tslint = require('gulp-tslint');
    var rootConfig = require(tsConfig);
    config.tslint = ['./src/app/**/*.ts', './src/app/*.ts', './src/app/**/*.component.ts', '!./src/app/**/*.d.ts', '!./src/app/**/*.ngfactory.d.ts', '!./src/app/**/*.ngfactory.ts'];
    return gulp.src(config.tslint)
        .pipe(print())
        .pipe(tslint({
            rulesDirectory: './node_modules/tslint-microsoft-contrib',
            configuration: rootConfig,
            formatter: 'prose'
        }))
        .pipe(tslint.report({ emitError: false }))
        .on('data', function (data) {
            if (data.tslint.failureCount) {
                var failures = data.tslint.failures;
                for (var i = 0; i < failures.length; i++) {
                    var fileName = failures[i].fileName;
                    var pos = failures[i].startPosition.lineAndCharacter;
                    var line = parseInt(pos.line) + 1;
                    var char = parseInt(pos.character) + 1;
                    var error = gutil.colors.cyan('[ts-lint] ==> ') + gutil.colors.white(fileName + ' [' + line + ',' + char + ']: ') +
                        gutil.colors.red(failures[i].failure);
                    tslintErrors.push(error);
                }
            }
        })
        .on('end', function () {
            if (tslintErrors.length) {
                for (var i = 0; i < tslintErrors.length; i++) {
                    gutil.log(tslintErrors[i]);
                }
                process.exit(1);
            }
        });
});

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
 * Lint scss files using gulp-sass-lint
 */
gulp.task('sass-lint', function () {
    print = print || require('gulp-print');
    var sasslint = require('gulp-sass-lint');
    return gulp.src(config.sasslint)
        .pipe(print())
        .pipe(sasslint({ configFile: sassConfig }))
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError());
});

/**
 * lint files of samples
 */
gulp.task('lint', function (done) {
    runSequence('sass-lint', 'ts-lint', done);
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

/**
 * Watch for sample and source and reload browser on changes
 */
gulp.task('watch', ['serve'], function () {
    var browserSync = require('browser-sync');
    var bs = browserSync.get('Essential TypeScript');

    gulp.watch(config.styles, ['styles', bs.reload]);
    gulp.watch(config.ts, ['build', bs.reload]);
});

/** 
 * pre-push hook gulp tasks
 */
gulp.task('pre-push');