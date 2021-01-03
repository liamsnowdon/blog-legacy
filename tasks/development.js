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
import TagTemplate from '../src/constants/tag-template';
import CategoryTemplate from '../src/constants/category-template';
import PostTemplate from '../src/constants/post-template';

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
          index: "index.html"
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

  return gulp.src('./src/**/*.html')
    .pipe(inject(sources, { ignorePath: 'src' }))
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

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  tags.forEach(tag => {
      const content = TagTemplate
          .replace(/<% TAG_ID %>/g, tag.id)
          .replace(/<% TAG_NAME %>/g, tag.name)
          .replace(/<% TAG_INTRO %>/g, tag.intro)
          .replace(/<% TAG_IMAGE_URL %>/g, tag.imageUrl)
          .replace(/<% TAG_FILE %>/g, tag.file);

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

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  categories.forEach(category => {
      const content = CategoryTemplate
          .replace(/<% CATEGORY_ID %>/g, category.id)
          .replace(/<% CATEGORY_NAME %>/g, category.name)
          .replace(/<% CATEGORY_INTRO %>/g, category.intro)
          .replace(/<% CATEGORY_IMAGE_URL %>/g, category.imageUrl)
          .replace(/<% CATEGORY_FILE %>/g, category.file);

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
  const tags = JSON.parse(fs.readFileSync('./src/data/tags.json'));

  const dir = './src/pages/posts';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  
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

      const content = PostTemplate
          .replace(/<% POST_ID %>/g, post.id)
          .replace(/<% POST_TITLE %>/g, post.title)
          .replace(/<% POST_INTRO %>/g, post.intro)
          .replace(/<% POST_OG_IMAGE_URL %>/g, post.ogImageUrl)
          .replace(/<% POST_DATE_POSTED %>/g, post.datePosted)
          .replace(/<% POST_AUTHOR %>/g, post.author)
          .replace(/<% POST_FILE %>/g, post.file)
          .replace(/<% ARTICLE_TAGS %>/g, articleTagPropertyHtmlString ? articleTagPropertyHtmlString : '');

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