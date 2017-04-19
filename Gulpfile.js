let gulp          = require('gulp');
let browserSync   = require('browser-sync');
let sass          = require('gulp-sass');
let prefix        = require('gulp-autoprefixer');
let gutil         = require('gulp-util');
let browserify    = require('gulp-browserify');
let concat        = require('gulp-concat');
let clean         = require('gulp-clean');
let hb            = require('gulp-hb');

gulp.task('sass', ()=>{
  gulp.src('src/sass/main.sass')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(prefix(['>1%'], {cascade: false}))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('browserify', ()=>{
  gulp.src(['src/js/main.js'])
    .pipe(browserify({
      insertGlobals : true,
      debug: true
    }))
    .pipe(concat('main.js'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('browser-sync', ['sass'], ()=>{
  browserSync({
    server: {
      baseDir: './dist/'
    }
  })
})

gulp.task('html', ()=>{
  gulp.src('./src/**/*.html')
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('hbs', function () {
    return gulp
        .src('./src/hbs/templates/**/*.html')
        .pipe(hb({
            partials: './src/hbs/partials/**/*.hbs',
            helpers: './src/hbs/helpers/*.js',
            data: './src/hbs/data/**/*.{js,json}'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ()=>{
  gulp.watch('src/sass/**/*.sass', ['sass']);
  gulp.watch('src/js/**/*.js', ['browserify']);
  gulp.watch('src/hbs/templates/*.html', ['hbs','html']);
  gulp.watch('src/**/*.hbs', ['hbs', 'html']);
});

gulp.task('default', ['hbs','browser-sync','sass', 'browserify', 'watch']);
