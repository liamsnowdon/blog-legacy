import fs from 'fs';
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import inject from 'gulp-inject';
import nunjucksRender from 'gulp-nunjucks-render';

import manageEnvironment from '../environment';
import Utilities from '../src/helpers/utilities';

browserSync.create();
sass.compiler = require('dart-sass');

/**
 * Plugins to use with PostCSS
 * 
 * autoprefixer - automatically adds prefixes to properties based on browserlist config
 */
const postcssPlugins = [
  autoprefixer({ cascade: false })
];

/**
 * Serve development via browsersync
 */
export const serve = () => {
  browserSync.init({
      server: {
          baseDir: './src',
          index: "index.html",
          // serveStaticOptions: {
          //   extensions: ["html"]        
          // }
      }
  });
};

/**
 * CSS files
 * 
 * 1. Compile Sass
 * 2. Pass through PostCSS plugins
 */
export const css = () => {
  return gulp.src('./src/assets/scss/styles.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss(postcssPlugins))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./src/assets/css'));
}

/**
 * Watches Sass files
 */
export const watchCss = () => {
  gulp.watch('./src/assets/scss/**/*.scss', css);
}

/**
 * Injects all javascript and css files into the html
 */
export const injectAssets = () => {
  const sources = gulp.src(['./src/assets/third-party/**/*.js', './src/assets/js/core.js', './src/assets/css/styles.css'], {read: false});
  const cacheBustVersion = `?v=${Utilities.generateTimestamp()}`;

  return gulp.src('./src/**/*.html')
    .pipe(inject(sources, { ignorePath: 'src', addSuffix: cacheBustVersion }))
    .pipe(gulp.dest('./src'));
};

/**
 * Creates tag pages with nunjucks
 * 
 * @param cb 
 */
export const buildTagPages = (cb) => {
  const tags = JSON.parse(fs.readFileSync('./src/data/tags.json'));
  const dir = './src/pages/tags';
  const tagTemplate = '{% extends "tag-base.njk" %}{% set tag = data.tags | getById(<% TAG_ID %>) %}';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  tags.forEach(tag => {
      const content = tagTemplate.replace(/<% TAG_ID %>/g, tag.id);

      fs.writeFileSync(`./src/pages/tags/${tag.file.split('.html')[0]}.njk`, content);
  });

  cb();
}

/**
* Creates category pages with nunjucks
* 
* @param cb 
*/
export const buildCategoryPages = (cb) => {
  const categories = JSON.parse(fs.readFileSync('./src/data/categories.json'));
  const dir = './src/pages/categories';
  const categoryTemplate = '{% extends "category-base.njk" %}{% set category = data.categories | getById(<% CATEGORY_ID %>) %}';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  categories.forEach(category => {
      const content = categoryTemplate.replace(/<% CATEGORY_ID %>/g, category.id);

      fs.writeFileSync(`./src/pages/categories/${category.file.split('.html')[0]}.njk`, content);
  });

  cb();
}

/**
* Creates post pages with nunjucks
* 
* @param cb 
*/
export const buildPostPages = (cb) => {
  const posts = JSON.parse(fs.readFileSync('./src/data/posts.json'));
  const dir = './src/pages/posts';
  const postTemplate = `{% extends "post-base.njk" %}{% set post = data.posts | getById(<% POST_ID %>) %}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  
  posts.forEach(post => {
      const content = postTemplate.replace(/<% POST_ID %>/g, post.id)

      fs.writeFileSync(`./src/pages/posts/${post.file.split('.html')[0]}.njk`, content);
  });

  cb();
}

/**
* Builds html files from nunjucks pages
*/
export const nunjucks = () => {
  // Gets .html and .njk files in pages
  return gulp.src('./src/pages/**/*.+(html|njk)')
      // Renders template with nunjucks
      .pipe(nunjucksRender({
          path: ['./src/templates'],
          manageEnv: manageEnvironment
      }))
      .pipe(gulp.dest('./src'));
}

/**
* Watches all files that nunjucks uses, including data.
*/
export const watchNunjucks = () => {
  gulp.watch([
      './src/pages/**/*.njk',
      './src/templates/**/*.njk',
      './src/data/posts.json',
      './src/data/categories.json',
      './src/data/tags.json'
  ], gulp.series(nunjucks, injectAssets));
}