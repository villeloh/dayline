import { ImgListPage } from './../img-list/img-list';
import { Page } from 'ionic-angular/navigation/nav-util';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { UserProvider } from './../../providers/UserProvider';
import { User } from './../../models/User';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: User = new User();
  imgListPage: Page = ImgListPage;
  loginFormGroup: FormGroup;

  constructor(
    public navCtrl: NavController,
    public userProvider: UserProvider,
    public events: Events,
    public formBuilder: FormBuilder) {

    const userNameValidators = Validators.compose(
      [
        Validators.maxLength(20),
        Validators.minLength(3),
        Validators.pattern('[a-zA-Z0-9]*'),
        Validators.required
      ]);

    const pwValidators = Validators.compose(
      [
        Validators.maxLength(20),
        Validators.minLength(4),
        Validators.pattern('[a-zA-Z0-9]*'),
        Validators.required
      ]);

    this.loginFormGroup = formBuilder.group({

        userName: ['', userNameValidators],
        passWord: ['', pwValidators]
    });
  } // end constructor()

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
        this.events.publish('loggedIn', true); // used to update the side-menu items (Logout, Login, etc)
      });
    },
    (error: HttpErrorResponse) => console.log(error.error.message));
  } // end login()
} // end class
