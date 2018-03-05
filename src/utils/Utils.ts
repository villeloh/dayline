
/**
 * Class that contains utility functions.
 */

export class Utils {

  // obtain a correctly formatted string for making storeable Dates
  static formattedDateStr(): string {

    const date = new Date(Date.now());
    let day = date.getUTCDate();
    let month = 1 + date.getUTCMonth(); // add 1 since months start from 0
    const year = date.getFullYear();
    let stringMonth: string;
    let stringDay: string; // these variables are needed because TypeScript doesn't like randomly casting numbers to strings -.-

    if (month < 10) {
      stringMonth = '0'+month;
    } else {
      stringMonth = month.toString();
    }

    if (day < 10) {
      stringDay = '0'+day;
    } else {
      stringDay = day.toString();
    }

    return year + '-' + stringMonth + '-' + stringDay; // should add 'Z' to make it UTC time... but it stops working if I do that!
  } // end formattedDateStr()
} // end class
