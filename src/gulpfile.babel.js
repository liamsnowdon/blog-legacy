import fs from 'fs';
import gulp from 'gulp';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import mqPacker from 'css-mqpacker';
import autoprefixer from 'autoprefixer';
import nunjucksRender from 'gulp-nunjucks-render';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import merge from 'merge-stream';

import manageEnvironment from './environment';
import { tagTemplate, categoryTemplate, postTemplate } from './nunjucks-page-templates';

browserSync.create();

sass.compiler = require('dart-sass');

/**
 * Plugis to use with PostCSS
 * 
 * autoprefixer - automatically adds prefixes to properties based on browserlist config
 * mqPacker - merges all media queries into one
 * csssnano - minify
 */
const postcssPlugins = [
    autoprefixer({ cascade: false }),
    mqPacker(),
    cssnano()
];

/**
 * Better handling of errors when piping
 * 
 * @param {string} name 
 */
function createErrorHandler(name) {
    return function (err) {
        console.error(`Error from ${name} in task ${err.toString()}`);
    };
}

/**
 * CSS files
 * 
 * 1. Compile Sass
 * 2. Pass through PostCSS plugins
 */
export const css = () => {
    return gulp.src('./assets/scss/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(postcssPlugins))
        .pipe(gulp.dest('../assets/css'));
}

/**
 * JavaScript files
 * 
 * 1. Concatenate third party and core file
 * 2. Minify all JS
 */
export const js = () => {
    const core =  gulp.src(['./assets/third-party/**/*.js', './assets/js/core.js'])
        .pipe(concat('main.js'))
        .pipe(uglify().on('error', createErrorHandler('uglify')))
        .pipe(gulp.dest('../assets/js'));

    const pages = gulp.src('./assets/js/pages/*.js')
        .pipe(uglify().on('error', createErrorHandler('uglify')))
        .pipe(gulp.dest('../assets/js/pages'));

    return merge(core, pages);
}

/**
 * Watches JS and SCSS files
 */
export const watchAssets = () => {
    gulp.watch('./assets/scss/**/*.scss', css);
    gulp.watch(['./assets/third-party/**/*.js', './assets/js/**/*.js'], js);
}

/**
 * Creates tag pages with nunjucks
 * 
 * @param cb 
 */
export const createTagPages = (cb) => {
    const tags = JSON.parse(fs.readFileSync('./data/tags.json'));

    tags.forEach(tag => {
        const content = tagTemplate
            .replace(/<% TAG_ID %>/g, tag.id)
            .replace(/<% TAG_NAME %>/g, tag.name)
            .replace(/<% TAG_INTRO %>/g, tag.intro)
            .replace(/<% TAG_IMAGE_URL %>/g, tag.imageUrl)
            .replace(/<% TAG_FILE %>/g, tag.file);

        fs.writeFileSync(`./pages/tags/${tag.file.split('.html')[0]}.njk`, content);
    });

    cb();
}

/**
 * Creates category pages with nunjucks
 * 
 * @param cb 
 */
export const createCategoryPages = (cb) => {
    const categories = JSON.parse(fs.readFileSync('./data/categories.json'));

    categories.forEach(category => {
        const content = categoryTemplate
            .replace(/<% CATEGORY_ID %>/g, category.id)
            .replace(/<% CATEGORY_NAME %>/g, category.name)
            .replace(/<% CATEGORY_INTRO %>/g, category.intro)
            .replace(/<% CATEGORY_IMAGE_URL %>/g, category.imageUrl)
            .replace(/<% CATEGORY_FILE %>/g, category.file);

        fs.writeFileSync(`./pages/categories/${category.file.split('.html')[0]}.njk`, content);
    });

    cb();
}

/**
 * Creates post pages with nunjucks
 * 
 * @param cb 
 */
export const createPostPages = (cb) => {
    const posts = JSON.parse(fs.readFileSync('./data/posts.json'));
    const tags = JSON.parse(fs.readFileSync('./data/tags.json'));
    
    posts.forEach(post => {
        const articleTagPropertyTemplate = '<meta property="article:tag" content="<% content %>">';
        let articleTagPropertyHtmlString = '';

        let postTags = [];

        post.tags.forEach((tagId) => {            
            const matchedTag = tags.find(t => t.id === tagId);

            postTags.push(matchedTag);
        });

        postTags.forEach((tag) => {
            articleTagPropertyHtmlString += articleTagPropertyTemplate.replace('<% content %>', tag.name);
        });

        const content = postTemplate
            .replace(/<% POST_ID %>/g, post.id)
            .replace(/<% POST_TITLE %>/g, post.title)
            .replace(/<% POST_INTRO %>/g, post.intro)
            .replace(/<% POST_OG_IMAGE_URL %>/g, post.ogImageUrl)
            .replace(/<% POST_DATE_POSTED %>/g, post.datePosted)
            .replace(/<% POST_AUTHOR %>/g, post.author)
            .replace(/<% POST_FILE %>/g, post.file)
            .replace(/<% ARTICLE_TAGS %>/g, articleTagPropertyHtmlString ? articleTagPropertyHtmlString : '');

        fs.writeFileSync(`./pages/posts/${post.file.split('.html')[0]}.njk`, content);
    });

    cb();
}

/**
 * Builds html files from nunjucks pages
 */
export const nunjucks = () => {
    // Gets .html and .njk files in pages
    return gulp.src('./pages/**/*.+(html|njk)')
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: ['./templates'],
            manageEnv: manageEnvironment
        }))
        .pipe(gulp.dest('../'));
}

/**
 * Watches all files that nunjucks uses, including data.
 */
export const watchNunjucks = () => {
    gulp.watch([
        './pages/**/*.njk',
        './templates/**/*.njk',
        './data/posts.json',
        './data/categories.json',
        './data/tags.json'
    ], nunjucks);
}

/**
 * Initialises browser sync
 */
export const sync = () => {
    browserSync.init({
        server: {
            baseDir: '../',
            index: "index.html"
        }
    });
}

export const createNunjucksPages = gulp.parallel(createPostPages, createCategoryPages, createTagPages);
export const build = gulp.series(gulp.parallel(createPostPages, createCategoryPages, createTagPages), nunjucks);
export const watch = gulp.series(gulp.parallel(css, js), nunjucks, gulp.parallel(watchAssets, watchNunjucks));

export default gulp.parallel(css, js, nunjucks);