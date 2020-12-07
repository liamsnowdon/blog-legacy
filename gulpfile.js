const fs = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const mqPacker = require('css-mqpacker');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const nunjucksRender = require('gulp-nunjucks-render');
const browserSync = require('browser-sync').create();

sass.compiler = require('dart-sass');

const postcssPlugins = [
    autoprefixer({ cascade: false }),
    mqPacker(),
    cssnano()
];

const manageEnvironment = (environment) => {
    const posts = JSON.parse(fs.readFileSync('posts.json'));
    const tags = JSON.parse(fs.readFileSync('tags.json'));
    const categories = JSON.parse(fs.readFileSync('categories.json'));

    environment.addGlobal('data', {
        posts,
        tags,
        categories
    });

    environment.addFilter('longDate', (date) => {
        return longDate(date);
    });

    environment.addFilter('shortDate', (date) => {
        return shortDate(date);
    });

    environment.addFilter('includes', (arr, item) => {
        return arr.includes(item);
    });

    environment.addFilter('index', (arr, item) => {
        return arr.findIndex(function (i) { return i === item });
    });
};

function devCss () {
    return gulp.src('assets/scss/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(postcssPlugins))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/css'));
}

function prodCss () {
    return gulp.src('assets/scss/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(postcssPlugins))
        .pipe(gulp.dest('assets/css'));
}

function watchCss () {
    gulp.watch('assets/scss/**/*.scss', devCss);
}

function nunjucks () {
    // Gets .html and .njk files in pages
    return gulp.src('pages/**/*.+(html|njk)')
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: ['templates'],
            manageEnv: manageEnvironment
        }))
        .pipe(gulp.dest('./'));
}

function watchNunjucks () {
    gulp.watch(['pages/**/*.njk', 'templates/**/*.njk', 'data.json'], nunjucks);
}

function sync () {
    browserSync.init({
        server: {
            index: "index.html"
        }
    });
}

function longDate (date) {
    if (!date) return '';

    if (typeof date === 'string') {
        date = new Date(date);
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', "December"];

    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function shortDate (date) {
    if (!date) return '';

    if (typeof date === 'string') {
        date = new Date(date);
    }

    return `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
}

exports.nunjucks = nunjucks;
exports.sync = sync;
exports.dev = devCss;
exports.watch = gulp.series(devCss, nunjucks, gulp.parallel(watchCss, watchNunjucks));
exports.prod = prodCss;
exports.default = devCss;