"use strict";

var gulp = require('gulp'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  imagemin = require('gulp-imagemin'),
  iconfont = require('gulp-iconfont'),
  iconfontCss = require('gulp-iconfont-css'),
  sourcemaps = require('gulp-sourcemaps'),
  browserify = require('gulp-browserify'),
  babel = require("gulp-babel");

gulp.task('pug', function () {
  return gulp.src('./src/pug/*.pug')
    .pipe(pug())
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(gulp.dest('./public/'));
});

gulp.task('rebuild', ['pug'], function () {
  browserSync.reload();
});

gulp.task('css', function () {
  return gulp.src('./src/scss/' + '*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['./src/scss/'],
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write('.'))
    .on('error', sass.logError)
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('./public/css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('js', function() {
      gulp.src('./src/js/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(browserify())
      .pipe(concat('main.min.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/js/'))
      .pipe(browserSync.reload({
        stream: true
      }));
});

gulp.task('image', () =>
    gulp.src('./src/image/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/image/'))
        .pipe(browserSync.reload({
          stream: true
        }))
);

gulp.task('iconfont', function(){
  return gulp.src(['./src/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: 'Icons',
      path: './src/scss/icons/_icons_template.scss', 
      targetPath: '../../../src/scss/icons/_icons.scss', 
      fontPath: '../fonts/icons/' 
    }))
    .pipe(iconfont({
      prependUnicode: false,
      fontName: 'Icons',
      formats: ['ttf', 'eot', 'woff', 'woff2'], 
      normalize: true,
      fontHeight: 1001
    }))
    .pipe(gulp.dest('./public/fonts/icons/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browser-sync', ['css', 'js', 'image', 'iconfont', 'pug'], function () {
  browserSync({
    server: {
      baseDir: './public/'
    },
    notify: false
  });
});

gulp.task('watch', function () {
  gulp.watch('./src/scss/' + '**/*.scss', ['css']);
  gulp.watch('./src/**/*.pug', ['rebuild']);
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/image/*', ['image']);
  gulp.watch('./src/icons/*.svg', ['iconfont']);
});

gulp.task('build', ['css', 'js', 'image', 'iconfont', 'pug']);

gulp.task('default', ['browser-sync', 'watch']);
