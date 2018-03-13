import { Utils } from './../../utils/Utils';
import { ImgListPage } from './../img-list/img-list';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { UserProvider } from './../../providers/UserProvider';
import { LoginPage } from './../login/login';
import { RegisterPage } from './../register/register';
import { Component } from '@angular/core';
import { NavController, Events, ToastController } from 'ionic-angular';
import { Page } from 'ionic-angular/navigation/nav-util';

/**
 * Starting page of the app. Contains only the Login and Register buttons,
 * plus the app logo.
 */

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loginPage: any = LoginPage;
  registerPage: any = RegisterPage;
  imgListPage: any = ImgListPage;

  constructor(
    public navCtrl: NavController,
    public userProvider: UserProvider,
    public events: Events,
    public toastCtrl: ToastController
  ) {}

  ionViewDidLoad() {

    this.userProvider.getUserInfo()
    .subscribe(user => {

      localStorage.setItem('user_id', user['user_id']); // set it once on login so it can be used anywhere
      this.goToPage(this.imgListPage); // if there is a valid token, go directly to imgListPage
      this.events.publish('loggedIn', true);
    },
    (error: HttpErrorResponse) => {

      console.log(error.error.message);
      this.events.publish('loggedIn', false); // used to set the sidemenu items correctly
      Utils.toast(this.toastCtrl, Utils.WELCOME_MSG, 'bottom', 2000);
    });
  } // end ionViewDidLoad()

  goToPage(page: Page) {

    this.navCtrl.setRoot(page);
  }

} // end class
