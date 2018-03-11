import { AlertController } from "ionic-angular/components/alert/alert-controller";
import { ToastController } from 'ionic-angular';
import { Validators } from "@angular/forms";

/**
 * Class that contains utility functions.
 */

export class Utils {

  private static SPECIAL_CHARS = "\\!\\$\\&\\%\\+\\#\\\\\{\\}\\@\\/\\[\\]\\*\\;\\^\\'\\~\\<\\>\\|\\=\\`\\(\\)\\\"";

  // constants for use all over the app
  static get BASE_API_URL() {
    return 'http://media.mw.metropolia.fi/wbma/';
  }

  static get WELCOME_MSG() {
    return 'Welcome to Dayline!';
  }

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

  // used for informing the user of various things, e.g. failing to fill out forms properly.
  static simpleAlert(ctrl: AlertController, title: string, msg: string) {

    const alert = ctrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  } // end simpleAlert()

  // a simple toast that disappears after a delay
  static toast(toastCtrl: ToastController, msg: string, delay: number = 1200, pos: string = 'top') {

    // needing to pass this a ToastController is a bit awkward, but I'm not sure how the
    // logic would behave if I'd just create one. not to mention that it needs some
    // parameters that I'm not sure how to provide.

    const toast = toastCtrl.create({
      message: msg,
      duration: delay, // ms
      position: pos // options: top, bottom, middle
    });

    toast.onDidDismiss(() => {

      console.log('Dismissed toast');
    });

    toast.present();
  } // end toast()

  static userNameValidators(): Validators {

    return Validators.compose([
      Validators.maxLength(20),
      Validators.minLength(4),
      Validators.pattern('^[a-zA-Z0-9]+$'),
      Validators.required
    ]);
  } // end userNameValidators()

  static pwValidators(): Validators {

    // must contain 1 special character, 2 numbers, 2 small letters and 1 capital letter
    return Validators.compose([
      Validators.maxLength(15),
      Validators.minLength(6),
      Validators.pattern('^(?=.*['+this.SPECIAL_CHARS+']{1,})(?!.*\\s+)(?=.*[a-z]{2,})(?=.*[A-Z]{1,})(?=.*\\d{2,}).*$'),
      Validators.required
    ]);
  } // end pwValidators()

  static emailValidators(): Validators {

    return Validators.compose([
      Validators.maxLength(20),
      Validators.minLength(4),
      Validators.pattern('^[^'+this.SPECIAL_CHARS+'\\d\\s+][a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z0-9]{2,3}$'),
      Validators.required
    ]);
  } // end emailValidators()

} // end class
