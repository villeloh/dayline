
/**
 * Data model class for custom image objects.
 */

export class DlImage {

  title: string;
  description: string;
  filename: string;
  file_id: number;
  user_id: number;
  time_added: string;
  thumbnails: Object;

  constructor(
    title: string = '', filename: string = '', description: string = '', time_added: string = '',
    user_id: number = 0, file_id: number = 0, thumbnails: Object = {}) {

    this.title = title;
    this.description = description;
    this.filename = filename;
    this.file_id = file_id;
    this.user_id = user_id;
    this.time_added = time_added;
    this.thumbnails = thumbnails;
  } // end constructor()

  alterDlImg(stat: string, newValue: string) {

    // only titles and descriptions will need to be altered
    if (stat === 'title' || stat === 'description') {
      this[stat] = newValue;
    } else {
      console.log('invalid stat while altering dlImage!');
    }
  } // end alterDlImg()

} // end class
