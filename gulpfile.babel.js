import gulp from 'gulp';

import {
    serve as DEV_SERVE,
    css as DEV_CSS,
    watchCss as DEV_WATCH_CSS,
    injectAssets as DEV_INJECT_ASSETS,
    buildTagPages as DEV_BUILD_TAG_PAGES,
    buildCategoryPages as DEV_BUILD_CATEGORY_PAGES,
    buildPostPages as DEV_BUILD_POST_PAGES,
    buildNunjucksPages as DEV_BUILD_NUNJUCKS_PAGES,
    nunjucks as DEV_NUNJUCKS,
    watchNunjucks as DEV_WATCH_NUNJUCKS
} from './tasks/development';

import {
    serve as DIST_SERVE,
    copyAndMoveFiles as DIST_COPY_FILES,
    css as DIST_CSS,
    js as DIST_JS,
    injectAssets as DIST_INJECT_ASSETS,
    nunjucks as DIST_NUNJUCKS
} from './tasks/production';

// Development Tasks

export const devServe = DEV_SERVE;
export const devCss = DEV_CSS;
export const watchCss = DEV_WATCH_CSS;
export const devInject = DEV_INJECT_ASSETS;
export const buildTagPages = DEV_BUILD_TAG_PAGES;
export const buildCategoryPages = DEV_BUILD_CATEGORY_PAGES;
export const buildPostPages = DEV_BUILD_POST_PAGES;
export const buildNunjucksPages = DEV_BUILD_NUNJUCKS_PAGES;
export const devNunjucks = DEV_NUNJUCKS;
export const watchNunjucks = DEV_WATCH_NUNJUCKS;

export const dev = gulp.series(devCss, devNunjucks, devInject);
export const watch = gulp.series(devCss, devNunjucks, devInject, gulp.parallel(watchCss, watchNunjucks));
export const buildPages = gulp.series(gulp.parallel(buildPostPages, buildCategoryPages, buildTagPages), devNunjucks);

// Production Tasks

export const distServe = DIST_SERVE;
export const distCopyFiles = DIST_COPY_FILES;
export const distCss = DIST_CSS;
export const distJs = DIST_JS;
export const distInject = DIST_INJECT_ASSETS;
export const distNunjucks = DIST_NUNJUCKS;

export const dist = gulp.series(distNunjucks, distCopyFiles, gulp.parallel(distCss, distJs), distInject);

export default devCss;