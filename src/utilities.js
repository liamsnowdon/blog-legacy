export default class Utilities {
  static longDate (date) {
    if (!date) return '';

    if (typeof date === 'string') {
      date = new Date(date);
    }
  
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', "December"];
  
    return `${days[date.getDay()]} ${date.getDate()}${dateSuffix(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}`;

    function dateSuffix (date) {
      switch (date) {
        case 1:
        case 21:
        case 31:
          return "st";
        case 2:
        case 22:
          return "nd";
        case 3:
        case 23:
          return "rd";
        default:
          return "th";
      };
    }
  }

    static shortDate (date) {
        if (!date) return '';

        if (typeof date === 'string') {
            date = new Date(date);
        }
    
        return `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
    }

    static generateTimestamp () {
        const date = new Date();

        return `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
    }
}