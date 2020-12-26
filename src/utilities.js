export default class Utilities {
  static longDate(date) {
    if (!date) return '';

    if (typeof date === 'string') {
      date = new Date(date);
    }

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return `${days[date.getDay()]} ${date.getDate()}${dateSuffix(
      date.getDate()
    )} ${months[date.getMonth()]} ${date.getFullYear()}`;

    function dateSuffix(date) {
      switch (date) {
        case 1:
        case 21:
        case 31:
          return 'st';
        case 2:
        case 22:
          return 'nd';
        case 3:
        case 23:
          return 'rd';
        default:
          return 'th';
      }
    }
  }

  static shortDate(date) {
    if (!date) return '';

    if (typeof date === 'string') {
      date = new Date(date);
    }

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  static generateTimestamp() {
    const date = new Date();

    return `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
  }

  static relatedPosts(arr, post) {
    const postTags = post.tags;
    let relatedPosts = [];

    if (!postTags || postTags.length === 0) {
      return relatedPosts;
    }

    // 1. Get all posts that have at least one of the same tags
    postTags.forEach((tag) => {
      const testPosts = arr.filter((post) => {
        return post.tags.includes(tag);
      });

      relatedPosts.push(...testPosts);
    });

    // 2. Remove the current post from the array
    relatedPosts = relatedPosts.filter((rlP) => rlP.id !== post.id);

    // 3. Remove duplicate post objects
    relatedPosts = [...new Set(relatedPosts)];

    // 4. Sort by date posted
    relatedPosts.sort((a, b) => {
      return new Date(b.datePosted) - new Date(a.datePosted);
    });

    return relatedPosts.slice(0, 5);
  }
}
