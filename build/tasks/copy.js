var gulp = require('gulp')
var gulpCopy = require('gulp-copy')
var connect = require('gulp-connect')
var config_styles = require('../config.js').copy_styles
var config_fonts = require('../config.js').copy_fonts

gulp.task('copy', function() {
  gulp.src(config_styles.src)
    .pipe(gulpCopy(config_styles.dest, { prefix: 2 }))
    .pipe(connect.reload());

  gulp.src(config_fonts.src)
    .pipe(gulpCopy(config_fonts.dest, { prefix: 2 }))
    .pipe(connect.reload());
})
