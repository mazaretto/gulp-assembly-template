'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var config = {
    server: {
        baseDir: "./dist"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "LiveReload success"
};

var path = {
    build: { 
        html: 'dist/',
        js: 'dist/assets/js/',
        css: 'dist/assets/css/',
        img: 'dist/assets/img/',
        fonts: 'dist/assets/fonts/'
    },
    src: { 
        html: 'app/*.html', 
        js: 'app/assets/js/main.js',
        style: 'app/assets/sass/main.scss',
        img: 'app/assets/img/*.*', 
        fonts: 'app/assets/fonts/*.*'
    },
    watch: { 
        html: 'app/*.html',
        js: 'app/assets/js/*.js',
        style: 'app/assets/sass/*.scss',
        img: 'app/assets/img/*.*',
        fonts: 'app/assets/fonts/*.*'
    },
    clean: './app'
};


gulp.task('html:build', function() {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream:true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js)) 
        .pipe(reload({stream: true})); 
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) 
        .pipe(sass()) 
        .pipe(prefixer({
            browsers: ['last 2 versions'],
            cascade: false
        })) 
        .pipe(cssmin()) 
        .pipe(gulp.dest(path.build.css)) 
        .pipe(reload({stream: true}));
});

gulp.task('es6', function() {
    return gulp.src(path.src.js)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(path.build.js))
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) 
        .pipe(imagemin({ 
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('toES', ['es6'], function() {
    gulp.watch(path.src.js,['es6']);
});

gulp.task('watch', function() {
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
        gulp.start('webserver');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
        gulp.start('webserver');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('toES');
        gulp.start('js:build');
        gulp.start('webserver');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
        gulp.start('webserver');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
        gulp.start('webserver');
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);