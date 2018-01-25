var path = require('path');
var proxy = require('http-proxy-middleware');
var gulp = require('gulp'),
    fs = require('graceful-fs'),
    cssMin = require('gulp-css'),
    htmlminify = require('gulp-html-minify'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    watch = require('gulp-watch'),
    tar = require('gulp-tar'),
    bump = require('gulp-bump'),
    clean = require('gulp-clean'),
    seq = require('run-sequence'),
    webserver = require('gulp-webserver');

var DEPENDENCIES = [
    //JS
    'jquery/dist/jquery.min.js',
    'bootstrap/dist/js/bootstrap.min.js',
    'angular/angular.min.js',
    'angular-ui-router/release/angular-ui-router.min.js',
    'angular-resource/angular-resource.min.js',
    'angular-aria/angular-aria.min.js',
    'angular-animate/angular-animate.min.js',
    'angular-sanitize/angular-sanitize.min.js',
    'ngStorage/ngStorage.min.js',
    'angular-touch/angular-touch.min.js',
    'angular-cookies/angular-cookies.min.js',
    'angular-modal-service/dst/angular-modal-service.min.js',
    'ng-csv/build/ng-csv.min.js',
    'angular-backtop/dist/angular-backtop.min.js',
    'ng-notifications-bar/dist/ngNotificationsBar.min.js',
    //CSS
    'bootstrap/dist/fonts/**',
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap/dist/css/bootstrap-theme.min.css',
    'font-awesome/css/font-awesome.min.css',
    'font-awesome/fonts/**',
    'angular-backtop/dist/angular-backtop.css',
    'ng-notifications-bar/dist/ngNotificationsBar.min.css',
];

gulp.task('clean', function () {
    return gulp.src('resource/*', { read: false })
        .pipe(clean());
});

gulp.task('minify-css', function () {
    return gulp.src('app/*/*.css')
        .pipe(cssMin())
        .pipe(gulp.dest('resource/'));
});

gulp.task('minify-html', function () {
    return gulp.src('app/**/*.html')
        .pipe(htmlminify())
        .pipe(gulp.dest('resource/'));
});

gulp.task('compress', function (cb) {
    pump([
        gulp.src('app/*/*/*.js'),
        uglify(),
        gulp.dest('resource/')
    ],
        cb
    );
});

gulp.task('bump-major', function () {
    return gulp.src('./package.json')
        .pipe(bump({ type: 'major' }))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-release', function () {
    return gulp.src('./package.json')
        .pipe(bump({ type: 'minor' }))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-dev', function (cb) {
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('images', function (cb) {
    return gulp.src('./app/images/*')
        .pipe(gulp.dest('resource/images'));
});

gulp.task('copy-favicon', function () {
    return gulp.src(['app/favicon.ico']).
        pipe(gulp.dest('resource/'));
});


gulp.task('copy-dependencies', function () {
    return gulp.src(DEPENDENCIES.map(function (x) { return './node_modules/' + x; }))
        .pipe(gulp.dest(function (file) {
            return path.join('resource/dependencies', path.dirname(file.path).split('/node_modules/')[1]);
        }));
});

gulp.task('copy-dependencies-dev', function () {
    return gulp.src(DEPENDENCIES.map(function (x) { return './node_modules/' + x; }))
        .pipe(gulp.dest(function (file) {
            return path.join('app/dependencies', path.dirname(file.path).split('/node_modules/')[1]);
        }));
});

gulp.task('tar', function () {
    return gulp.src('resource/**')
        .pipe(tar('rule-engine-ui-client.tar'))
        .pipe(gulp.dest('.'));
});

gulp.task('build', function (cb) {
    return seq('clean', ['compress', 'minify-css', 'minify-html', 'icons', 'copy-favicon', 'images', 'copy-dependencies'], cb);
});


gulp.task('version', function () {
    var pkg = require('./package.json');
    var fs = require('fs');
    return fs.writeFileSync('resource/version.txt', 'Version: ' + pkg.version + '.0 \nBuilt on: ' + new Date());
});

gulp.task('package', function (cb) {
    return seq('version', 'tar', cb);
});

gulp.task('default', function (cb) {
    return seq('build', cb);
});


/// Dev tasks

gulp.task('server-dev', function (cb) {
    gulp.src('./app')
        .pipe(webserver({
            port: 8000,
            livereload: true,
            open: true,
            middleware: proxy('/rule-engine-ldap-api-web', {
                target: 'https://mfaadm-apis-dev.kdc.capitalone.com',
                secure: false,
                ssl: {
                    strict: false
                },
                onProxyReq: function onProxyReq(proxyReq, req, res) {
                    proxyReq.setHeader('HTTP_USER', 'abc123');
                }
            })
        }));
});

gulp.task('dev', ['copy-dependencies-dev', 'server-dev']);

/**
 * @ngdoc function
 * @name PolicyAdmin.Build code as minify version
 * @description #  Gulp configuration for the Policy Admin UI
 * @Author Mrugesh patel - MQS618
 */
