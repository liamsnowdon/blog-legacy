import gulp from 'gulp';

import {
    serve as DEV_SERVE,
    css as DEV_CSS,
    watchCss as DEV_WATCH_CSS,
    injectAssets as DEV_INJECT_ASSETS,
    buildTagPages as DEV_BUILD_TAG_PAGES,
    buildCategoryPages as DEV_BUILD_CATEGORY_PAGES,
    buildPostPages as DEV_BUILD_POST_PAGES,
    nunjucks as DEV_NUNJUCKS,
    watchNunjucks as DEV_WATCH_NUNJUCKS
} from './tasks/development';

import {
    serve as DIST_SERVE,
    copyAndMoveFiles as DIST_COPY_FILES,
    css as DIST_CSS,
    js as DIST_JS,
    injectAssets as DIST_INJECT_ASSETS,
    nunjucks as DIST_NUNJUCKS,
    createPortfolioJson as DIST_CREATE_PORTFOLIO_JSON,
    createSitemap as DIST_CREATE_SITEMAP
} from './tasks/production';

console.log(`CDN Host: ${process.env.CDN_HOST}`);

// Development Tasks

export const devServe = DEV_SERVE;
export const devCss = DEV_CSS;
export const watchCss = DEV_WATCH_CSS;
export const devInject = DEV_INJECT_ASSETS;
export const buildTagPages = DEV_BUILD_TAG_PAGES;
export const buildCategoryPages = DEV_BUILD_CATEGORY_PAGES;
export const buildPostPages = DEV_BUILD_POST_PAGES;
export const devNunjucks = DEV_NUNJUCKS;
export const watchNunjucks = DEV_WATCH_NUNJUCKS;
export const buildNunjucksPages = gulp.parallel(buildPostPages, buildCategoryPages, buildTagPages);
export const buildPages = gulp.series(gulp.parallel(buildPostPages, buildCategoryPages, buildTagPages), devNunjucks);

export const watch = gulp.series(devCss, buildPages, devInject, gulp.parallel(watchCss, watchNunjucks));

// Production Tasks

export const distServe = DIST_SERVE;
export const distCopyFiles = DIST_COPY_FILES;
export const distCss = DIST_CSS;
export const distJs = DIST_JS;
export const distInject = DIST_INJECT_ASSETS;
export const distNunjucks = DIST_NUNJUCKS;
export const createPortfolioJson = DIST_CREATE_PORTFOLIO_JSON;
export const createSitemap = DIST_CREATE_SITEMAP;


export const dev = gulp.series(devCss, buildPages, devInject);
export const dist = gulp.series(buildNunjucksPages, distNunjucks, distCopyFiles, createPortfolioJson, createSitemap, gulp.parallel(distCss, distJs), distInject);

export default devCss;