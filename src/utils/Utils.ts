
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

    // the complaint about implicitly casting number to string is ugly, but this is by far the least
    // complicated way to achieve what I'm trying to do here, so, meh.
    if (month < 10) {
      month = '0'+month;
    }

    if (day < 10) {
      day = '0'+day;
    }

    return year + '-' + month + '-' + day; // should add 'Z' to make it UTC time... but it stops working if I do that!
  } // end formattedDateStr()
} // end class
