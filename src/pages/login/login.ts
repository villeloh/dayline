import { ImgListPage } from './../img-list/img-list';
import { Page } from 'ionic-angular/navigation/nav-util';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { UserProvider } from './../../providers/UserProvider';
import { User } from './../../models/User';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: User = new User();
  imgListPage: Page = ImgListPage;

  constructor(
    public navCtrl: NavController,
    public userProvider: UserProvider) {
  }

  ionViewDidLoad() {
  }

  login(user: User) {

    // TODO: clear this mess with async / await...
    this.userProvider.loginUser(user)
    .subscribe(res => {

      localStorage.setItem('token', res['token']);

      this.userProvider.getUserInfo()
      .subscribe(user => {

        localStorage.setItem('user_id', user['user_id']); // set it once on login so it can be used anywhere
        this.navCtrl.setRoot(this.imgListPage);
      });
    },
    (error: HttpErrorResponse) => console.log(error.error.message));
  } // end login()
} // end class
