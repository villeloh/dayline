import { Utils } from './../../utils/Utils';
import { ImgListPage } from "./../img-list/img-list";
import { Page } from "ionic-angular/navigation/nav-util";
import { HttpErrorResponse } from "@angular/common/http/src/response";
import { UserProvider } from "./../../providers/UserProvider";
import { User } from "./../../models/User";
import { Component } from "@angular/core";
import { IonicPage, NavController, Events,  ToastController } from "ionic-angular";
import { FormBuilder, FormGroup } from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {

  user: User;
  imgListPage: Page = ImgListPage;
  loginForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public userProvider: UserProvider,
    public events: Events,
    public formBuilder: FormBuilder,
    private toastCtrl: ToastController
  ) {

    this.user = new User();

    this.loginForm = formBuilder.group({

      // no validation is needed when logging in
      userName: [""],
      passWord: [""]
    });
  } // end constructor()

  ionViewDidLoad() {
  }

  login(user: User) {

    if (user.username !== '' && user.password !== '') {

      this.userProvider.loginUser(user).subscribe(
        res => {
          localStorage.setItem("token", res["token"]);
          console.log('token: ' + localStorage.getItem('token') );

          this.userProvider.getUserInfo()
          .subscribe(userInfo => {

            localStorage.setItem("user_id", userInfo["user_id"]);
            this.navCtrl.setRoot(this.imgListPage);
            this.events.publish("loggedIn", true); // used to update the side-menu items (Logout, Login, etc)
          },
          (error: HttpErrorResponse) => console.log(error.error.message));
        },
        (error: HttpErrorResponse) => {

          console.log(error.error.message);
          Utils.toast(this.toastCtrl, 'Failed to log in! ' + error.error.message);
        }
      );
    } else {

      Utils.toast(this.toastCtrl, 'Please enter a valid username and password');
    } // end if-else
  } // end login()

} // end class
