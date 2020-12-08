import fs from 'fs';
import Utilities from './utilities';

export default (environment) => {
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
};