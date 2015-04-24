var gulp = require('gulp')
var gulpCopy = require('gulp-copy')
var connect = require('gulp-connect')
var config = require('../config.js').copy

gulp.task('copy', function() {
  gulp.src(config.src)
    .pipe(gulpCopy(config.dest, { prefix: 2 }))
    .pipe(connect.reload());
})
