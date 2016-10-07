// Gulp
var gulp = require('gulp');
var gutil = require('gulp-util');
var gclean = require('gulp-clean');

// Main Server
var express = require('express');

// Webpack
var webpack = require('webpack');
var wpConfig = require('./webpack.config');
var wpProdConfig = require('./webpack.config.prod');

// Misc
var path = require('path');
var dns = require('dns');
var argv = require('yargs').argv;

// Clarify available options
gulp.task('what', function what () {
    console.log('');
    console.log('OPTIONS');
    console.log('-------');
    console.log('clean - empty build folder.');
    console.log('clean-prod - empty production folder.');
    console.log('build - build development bundle file');
    console.log('run - run node development server');
    console.log('build-prod - build production bundle file');
    console.log('run-prod - run node production server');
    console.log('run-prod-static - run production server by serving production folder');
    console.log('');
});

// Describe what each option does in detail
gulp.task('describe', function describe ()  {
    console.log('');
    console.log('DESCRIPTIONS');
    console.log('------------');
    if (argv.clean) {
        console.log('Empty `build` folder');
    }
    if (argv['clean-prod']) {
        console.log('Empty `production` folder');
    }
    if (argv.build) {
        console.log('[1] Compile and bundle');
        console.log('[2] Place in build folder');
    }
    if (argv.run) {
        console.log('[1] Compile and bundle with webpack');
        console.log('[2] Place in build folder');
        console.log('[3] Inject development middlewares');
        console.log('[4] Start Development Server');
    }
    if (argv['build-prod']) {
        console.log('[1] Compile and exlude development modules');
        console.log('[2] Uglify');
        console.log('[3] Webpack bundle');
        console.log('[4] Place in `production` folder');
    }
    if (argv['run-prod']) {
        console.log('[1] Start Node Production Server from `production` folder');
    }
    if (argv['run-prod-static']) {
        console.log('[1] Serve `production` folder statically with Simple HTTP Server');
    }
    console.log('');
});

gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(gclean());
});
gulp.task('clean-prod', function () {
    return gulp.src('production', {read: false})
        .pipe(gclean());
});

// Development
gulp.task('build', ['set-dev-node-env'], function (callback) {
    // run webpack
    webpack(wpConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors: true
        }));
        callback();
    });
});

var exec = require('child_process').exec,
    npmStart;
gulp.task('run', function (cb) {
    npmStart = exec('npm start');
    npmStart.stdout.on('data', function (data) {
        console.log(data);
    });
    npmStart.stderr.on('data', function (data) {
        console.log('Error: ' + data);
    });
    npmStart.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });
});

// Production
gulp.task('build-prod', ['copy-assets', 'set-prod-node-env'], function (callback) {
    // run webpack
    webpack(wpProdConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors: true
        }));
        callback();
    });
});
gulp.task('run-prod', function (cb) {
    console.log('Serving HTTP on 0.0.0.0 port 7090 ...');
    npmStart = exec('node server.prod');
    npmStart.stdout.on('data', function (data) {
        console.log(data);
    });
    npmStart.stderr.on('data', function (data) {
        console.log('Error: ' + data);
    });
    npmStart.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });
});
gulp.task('run-prod-static', function (cb) {
    console.log('Serving HTTP on 0.0.0.0 port 7090 ...');
    npmStart = exec('pushd ./production; python -m SimpleHTTPServer 7090; popd');
    npmStart.stdout.on('data', function (data) {
        console.log(data);
    });
    npmStart.stderr.on('data', function (data) {
        console.log('Error: ' + data);
    });
    npmStart.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });
});

var path = {
    ASSETS: [
        'src/index.html'
    ],
    DEST: 'production',
};
// Private tasks
gulp.task('copy-assets', [], function () {
    return gulp.src(path.ASSETS)
        .pipe(gulp.dest(path.DEST));
});
gulp.task('set-dev-node-env', function() {
    process.env.NODE_ENV = 'development';
});
gulp.task('set-prod-node-env', function() {
    process.env.NODE_ENV = 'production';
});

