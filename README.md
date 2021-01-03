# Blog
Posts are tagged with keywords and belong to a category to make it easy to find information about a particular area.

## 1. Dev Setup
```bash
# install dependencies
npm install

# compile Sass and build html files from Nunjucks
npm run dev

# serve via browsersync in development mode
npm run serve

# build for production
npm run build

# serve via browsersync in production mode
npm run serve-prod
```

## 2. Using the Blog JSON Generator to create posts and tags
JSON data for posts and tags can be created by using the Blog JSON Generator. Posts and tags JSON data should be placed inside posts.json and tags.json, respectfully.

## 3. Gulp-built pages
A Gulp tasks builds the Nunjucks (.njk) files automatically for category, tag and post pages directly from JSON using its template in `nunjucks-page-templates.js`. The HTML files are then built with Nunjucks through Gulp like the rest of the pages. The category, tag and post directories are added to `.gitignore` for this reason.

## 4. Image Dimensions
1. Meta Image: 1200px x 627px
2. Header: 1300px x 400px
3. Thumbnail: 615px x 350px
