import { ImgListPage } from './../img-list/img-list';
import { Page } from 'ionic-angular/navigation/nav-util';
import { UserProvider } from './../../providers/UserProvider';
import { User } from './../../models/User';
import { Utils } from './../../utils/Utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http/src/response";

/**
 * Page for modifying user info. It being a page is not really ideal
 * (could just be a modal instead), but due to the way
 * that navigation works, I chose to do it this way.
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
  modifyUserFormGroup: FormGroup;
  imgListPage: Page = ImgListPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public userProvider: UserProvider,
    public toastCtrl: ToastController
  ) {

    this.user = new User();

    this.modifyUserFormGroup = formBuilder.group({
      userName: ["", Utils.userNameValidators()],
      email: [""], // TODO: add validators!!
      passWord: ["", Utils.pwValidators()]
    });

    this.userProvider.getUserInfo()
    .subscribe(userInfo => {

      // I thought this might be better than using localStorage to store
      // email and password, but it is another request that slows down
      // the loading of the page...
      this.usernameForPlaceholder = userInfo["username"];
      this.emailForPlaceholder = userInfo['email'];
      this.passwordForPlaceholder = userInfo['password'];
    },
    (error: HttpErrorResponse) => console.log(error.error.message));
  } // end constructor()

  ionViewDidLoad() {
  }

  updateUserInfo(user: User) {

    this.userProvider.updateUser(user)
    .subscribe(res => {

      Utils.toast(this.toastCtrl, 'Updated User Data!');

      // the logic starts to get a little brittle here... since we can send the form
      // even with an empty username/email field, this check is needed again here
      // (even though it already exists in the UserProvider's updateUser() method)
      if (user.username !== '') {
        localStorage.setItem('username', user.username);
      }

      if (user.email !== '') {
        localStorage.setItem('email', user.email);
      }

      this.navCtrl.setRoot(this.imgListPage); // it's easiest to just return to the imgListPage after changes...
    },
    (error: HttpErrorResponse) => {

      // NOTE: the only reason for this error to occur should be that the username was already taken.
      // thus there's no need to check specifically for that with the userNameFree() method...
      // I tried to do that earlier and it resulted in a terrible mess. hopefully this will
      // work just fine...
      console.log(error.error.message);

      // TODO: warn about the username being already taken

    }); // end subscribe()
  } // end updateUserInfo()

} // end class
