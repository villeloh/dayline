import { UserProvider } from './../../providers/UserProvider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
/**
 * Page for deleting a user. It could've been a modal as well, but
 * to preseve uniform functionality with the other menu buttons,
 * I made it into a page instead.
 *
 *  EDIT: I guess deleting users is impossible... preserving this class for now just in case it can be done.
 */

@IonicPage()
@Component({
  selector: 'page-delete',
  templateUrl: 'delete.html',
})
export class DeletePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public userProvider: UserProvider) {
  }

  ionViewDidLoad() {

    this.deleteUserAlert();
  }

  deleteUserAlert() {

    let alert = this.alertCtrl.create({
      title: 'Delete User',
      message: 'Are you sure you want to delete this image?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.userProvider.deleteUser();
          }
        }
      ]
    });
    alert.present();
  } // end deleteUserAlert()
} // end class
