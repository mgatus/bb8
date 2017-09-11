var gulp = require('gulp'),
    beep    = require('beepbeep'),
    sass = require('gulp-sass'),
    cssComb = require('gulp-csscomb'),
    useref = require('gulp-useref'),
    runSequence = require('run-sequence'),
    gulpIf = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    colors  = require('colors'),
    browserSync = require('browser-sync').create();

gulp.task('sass',function(){
  return gulp.src('app/sass/*.sass')
  .pipe(plumber(function () {
            beep();
            console.log('[sass]'.bold.magenta + ' There was an issue compiling Sass\n'.bold.red);
            this.emit('end');
        }))
  .pipe(sass())
  .pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
	 }))
  .pipe(cssComb())
  .pipe(gulp.dest('app/css'))
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.reload({stream:true}))
});

gulp.task('watch',['browserSync','sass'], function () {
  gulp.watch('app/sass/*.sass',['sass']);
  gulp.watch('app/*.html', browserSync.reload);
});


gulp.task('browserSync',function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('useref',function () {
  return gulp.src('app/*.html')
  .pipe(useref())
  .pipe(gulpIf('css/*.css', minifyCss()))
  .pipe(gulp.dest('dist'))
});



gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref'],
    callback
  )
})

gulp.task('default',function (callback) {
  runSequence(['sass','browserSync','watch'],
    callback
  )
});
