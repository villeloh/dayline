import { Utils } from './../../utils/Utils';
import { Page } from 'ionic-angular/navigation/nav-util';
import { ImgListPage } from './../img-list/img-list';
import { UserProvider } from './../../providers/UserProvider';
import { User } from './../../models/User';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http/src/response';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

/**
 * Page for registering a new user. Upon successful registering,
 * user is immediately logged in and redirected to the main image list page.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  baseApiUrl = Utils.BASE_API_URL;

  user: User;
  imgListPage: Page = ImgListPage;
  registerForm: FormGroup;
  submitAttempt: boolean; // show a warning msg if you try to send an invalid form

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public events: Events,
    public formBuilder: FormBuilder,
    private toastCtrl: ToastController
  ) {

    this.user = new User();
    this.submitAttempt = false;

    this.registerForm = formBuilder.group({

      userName: ["", Utils.regUserNameValidators()],
      passWord: ["", Utils.regPwValidators()],
      email: ["", Utils.regEmailValidators()]
    });
  }

  ionViewDidLoad() {
  }

  register(user: User) {

    this.submitAttempt = true;

    if (!this.registerForm.valid) {
      return;
    }

    // four subscribes is a 'bit' much... TODO: clear this up somehow -.-
    // logging in the user gets the token, which is needed for getting id,
    // so the mess seems unavoidable...

    this.userProvider.userNameFree(user.username)
    .subscribe(res => {

      const userNameAvailable = res['available'];

      if (!userNameAvailable) {

        Utils.toast(this.toastCtrl, 'Username taken; please choose another one');

      } else {

        this.userProvider.registerUser(user)
        .subscribe(res => {

          console.log('Register response: ' + JSON.stringify(res));
          this.userProvider.loginUser(user)
          .subscribe(res => {

            localStorage.setItem('token', res['token']);

            this.userProvider.getUserInfo()
            .subscribe(user => {

              localStorage.setItem('user_id', user['user_id']); // set it once on login so it can be used anywhere
              this.navCtrl.setRoot(this.imgListPage);
              this.events.publish('loggedIn', true); // duplicate code with login.ts... not sure how to combine them atm
            });
          },
          (error: HttpErrorResponse) => console.log("error registering: " + error.error.message));
        }
        ,
        (error: HttpErrorResponse) => console.log("outer error registering: " + error.error.message)); // end register-subscribe()
      } // end if-else
    }); // end outer subscribe()
  } // end register()

} // end class
