var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify');


// Load plugins
var $ = require('gulp-load-plugins')();

/* es6 */
gulp.task('es6', function() {

    return gulp.src('public/js/es6/*.js')
        .pipe($.plumber())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/ztimages/'));
});

gulp.task('watch', ['es6'], function() {
    gulp.watch(['src/js/es6_es5.js'], ['es6']);
});