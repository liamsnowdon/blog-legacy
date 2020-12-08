import fs from 'fs';
import gulp from 'gulp';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import mqPacker from 'css-mqpacker';
import autoprefixer from 'autoprefixer';
import nunjucksRender from 'gulp-nunjucks-render';
import browserSync from 'browser-sync';

import manageEnvironment from './environment';
import { tagTemplate, categoryTemplate, postTemplate } from './nunjucks-page-templates';

browserSync.create();

sass.compiler = require('dart-sass');

const postcssPlugins = [
    autoprefixer({ cascade: false }),
    mqPacker(),
    cssnano()
];

export const css = () => {
    return gulp.src('../assets/scss/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(postcssPlugins))
        .pipe(gulp.dest('../assets/css'));
}

export const watchScss = () => {
    gulp.watch('../assets/scss/**/*.scss', css);
}

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
            .replace(/<% POST_IMAGE_URL %>/g, post.imageUrl)
            .replace(/<% POST_DATE_POSTED %>/g, post.datePosted)
            .replace(/<% POST_AUTHOR %>/g, post.author)
            .replace(/<% POST_FILE %>/g, post.file)
            .replace(/<% ARTICLE_TAGS %>/g, articleTagPropertyHtmlString ? articleTagPropertyHtmlString : '');

        fs.writeFileSync(`./pages/posts/${post.file.split('.html')[0]}.njk`, content);
    });

    cb();
}

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

export const watchNunjucks = () => {
    gulp.watch([
        './pages/**/*.njk',
        './templates/**/*.njk',
        './data/posts.json',
        './data/categories.json',
        './data/tags.json'
    ], nunjucks);
}

export const sync = () => {
    browserSync.init({
        server: {
            baseDir: '../',
            index: "index.html"
        }
    });
}

export const createNunjucksPages = gulp.parallel(createPostPages, createCategoryPages, createTagPages);
export const nunjucksBuild = gulp.series(gulp.parallel(createPostPages, createCategoryPages, createTagPages), nunjucks);
export const watch = gulp.series(css, nunjucks, gulp.parallel(watchScss, watchNunjucks));

export default css;