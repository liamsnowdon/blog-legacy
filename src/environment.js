import fs from 'fs';
import Utilities from './utilities';

export default (environment) => {
    const posts = JSON.parse(fs.readFileSync('./data/posts.json'));
    const tags = JSON.parse(fs.readFileSync('./data/tags.json'));
    const categories = JSON.parse(fs.readFileSync('./data/categories.json'));
    const version = Utilities.generateTimestamp();

    environment.addGlobal('data', {
        posts,
        tags,
        categories,
        version: `?v=${version}`
    });

    environment.addFilter('getById', (array, id) => {
        return array.find(item => item.id === id);
    });

    environment.addFilter('longDate', (date) => {
        return Utilities.longDate(date);
    });

    environment.addFilter('shortDate', (date) => {
        return Utilities.shortDate(date);
    });

    environment.addFilter('includes', (arr, item) => {
        return arr.includes(item);
    });

    environment.addFilter('index', (arr, item) => {
        return arr.findIndex(function (i) { return i === item });
    });

    environment.addFilter('limitTo', (arr, limit) => {
        return arr.splice(0, limit);
    });

    environment.addFilter('categoryPosts', (arr, categoryId) => {
        return arr.filter(item => item.category === categoryId);
    });

    environment.addFilter('relatedPosts', (arr, post) => {
        return Utilities.relatedPosts(arr, post);
    });
};