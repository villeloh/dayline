import { ImgListPage } from './../img-list/img-list';
import { Page } from 'ionic-angular/navigation/nav-util';
import { UserProvider } from './../../providers/UserProvider';
import { User } from './../../models/User';
import { Utils } from './../../utils/Utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http/src/response";
import { UpperCasePipe } from '@angular/common';

/**
 * Page for modifying user info.
 */

@IonicPage()
@Component({
  selector: 'page-modify-user',
  templateUrl: 'modify-user.html',
})
export class ModifyUserPage {

  user: User;
  usernameForPlaceholder: string;
  emailForPlaceholder: string;
  passwordForPlaceholder: string;
  modifyUserForm: FormGroup;
  imgListPage: Page = ImgListPage;
  submitAttempt: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public userProvider: UserProvider,
    public toastCtrl: ToastController
  ) {

    this.user = new User();
    this.submitAttempt = false;

    this.modifyUserForm = formBuilder.group({
      userName: ["", Utils.modUserNameValidators()],
      email: ["", Utils.modEmailValidators()],
      passWord: ["", Utils.modPwValidators()]
    });

    this.userProvider.getUserInfo()
    .subscribe(userInfo => {

      // I thought this might be better than using localStorage to store
      // username and email, but it *is* another request that slows down
      // the loading of the page... Also, it seems that password
      // cannot be accessed like this, probably for security reasons. Oh well.
      this.usernameForPlaceholder = userInfo["username"];
      this.emailForPlaceholder = userInfo['email'];
    },
    (error: HttpErrorResponse) => console.log(error.error.message));
  } // end constructor()

  ionViewDidLoad() {
  }

  updateUserInfo(user: User) {

    this.submitAttempt = true;

    if (!this.modifyUserForm.valid) {
      return;
    }

    if (user.username !== '' || user.email !== '' || user.password !== '') {

      this.userProvider.updateUser(user)
      .subscribe(res => {

        Utils.toast(this.toastCtrl, 'Updated User Data!');

        this.navCtrl.setRoot(this.imgListPage); // it's easiest to just return to the imgListPage after changes...
      },
      (error: HttpErrorResponse) => {

        // NOTE: the only reason for this error to occur should be that the username was already taken.
        // thus there's no need to check specifically for that with the userNameFree() method...
        // I tried to do that earlier and it resulted in a terrible mess. hopefully this will
        // work just fine...
        Utils.toast(this.toastCtrl, 'Username taken; please choose another one');

        // NOTE #2: the reason for the intermittent use of Toasts vs. notifying html elements
        // is simply lack of time toward the end of the project.

      }); // end subscribe()
    } // end if
  } // end updateUserInfo()

  exit() {

    this.navCtrl.setRoot(this.imgListPage);
  }

} // end class
