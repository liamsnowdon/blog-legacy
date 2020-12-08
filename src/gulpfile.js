const fs = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const mqPacker = require('css-mqpacker');
const autoprefixer = require('autoprefixer');
const nunjucksRender = require('gulp-nunjucks-render');
const browserSync = require('browser-sync').create();

sass.compiler = require('dart-sass');

const nunjucksPageTemplates = require('./nunjucks-page-templates');

const postcssPlugins = [
    autoprefixer({ cascade: false }),
    mqPacker(),
    cssnano()
];

const manageEnvironment = (environment) => {
    const posts = JSON.parse(fs.readFileSync('./data/posts.json'));
    const tags = JSON.parse(fs.readFileSync('./data/tags.json'));
    const categories = JSON.parse(fs.readFileSync('./data/categories.json'));

    environment.addGlobal('data', {
        posts,
        tags,
        categories
    });

    environment.addFilter('getById', (array, id) => {
        return array.find(item => item.id === id);
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

function css () {
    return gulp.src('../assets/scss/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(postcssPlugins))
        .pipe(gulp.dest('../assets/css'));
}

function watchScss () {
    gulp.watch('../assets/scss/**/*.scss', css);
}

function createTagPages (cb) {
    const tags = JSON.parse(fs.readFileSync('./data/tags.json'));
    const tagTemplate = nunjucksPageTemplates.tag;

    tags.forEach(tag => {
        const content = tagTemplate.replace('<% TAG_ID %>', tag.id);

        fs.writeFileSync(`./pages/tags/${tag.file.split('.html')[0]}.njk`, content);
    });

    cb();
}

function createCategoryPages (cb) {
    const categories = JSON.parse(fs.readFileSync('./data/categories.json'));
    const categoryTemplate = nunjucksPageTemplates.category;

    categories.forEach(category => {
        const content = categoryTemplate
            .replace('<% CATEGORY_ID %>', category.id)
            .replace('<% CATEGORY_NAME %>', category.name);

        fs.writeFileSync(`./pages/categories/${category.file.split('.html')[0]}.njk`, content);
    });

    cb();
}

function createPostPages (cb) {
    const posts = JSON.parse(fs.readFileSync('./data/posts.json'));
    const postTemplate = nunjucksPageTemplates.post;

    posts.forEach(post => {
        const content = postTemplate.replace('<% POST_ID %>', post.id);

        fs.writeFileSync(`./pages/posts/${post.file.split('.html')[0]}.njk`, content);
    });

    cb();
}

function nunjucks () {
    // Gets .html and .njk files in pages
    return gulp.src('./pages/**/*.+(html|njk)')
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: ['./templates'],
            manageEnv: manageEnvironment
        }))
        .pipe(gulp.dest('../'));
}

function watchNunjucks () {
    gulp.watch([
        './pages/**/*.njk',
        './templates/**/*.njk',
        './data/posts.json',
        './data/categories.json',
        './data/tags.json'
    ], nunjucks);
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

exports.createPostPages = createPostPages;
exports.createCategoryPages = createCategoryPages;
exports.createTagPages = createTagPages;
exports.createNunjucksPages = gulp.parallel(createPostPages, createCategoryPages, createTagPages);
exports.nunjucks = nunjucks;
exports['nunjucks.build'] = gulp.series(gulp.parallel(createPostPages, createCategoryPages, createTagPages), nunjucks);

exports.sync = sync;
exports.css = css;
exports.watch = gulp.series(css, nunjucks, gulp.parallel(watchScss, watchNunjucks));
exports.default = css;