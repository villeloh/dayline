import { Utils } from './../../utils/Utils';
import { ImgListPage } from "./../img-list/img-list";
import { Page } from "ionic-angular/navigation/nav-util";
import { HttpErrorResponse } from "@angular/common/http/src/response";
import { UserProvider } from "./../../providers/UserProvider";
import { User } from "./../../models/User";
import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, Events } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  user: User;
  imgListPage: Page = ImgListPage;
  loginFormGroup: FormGroup;

  constructor(
    public navCtrl: NavController,
    public userProvider: UserProvider,
    public events: Events,
    public formBuilder: FormBuilder
  ) {

    this.user = new User();

    this.loginFormGroup = formBuilder.group({
      userName: ["", Utils.userNameValidators()],
      passWord: ["", Utils.pwValidators()]
    });
  } // end constructor()

  ionViewDidLoad() {
  }

  login(user: User) {
    // TODO: clear this mess with async / await...
    this.userProvider.loginUser(user).subscribe(
      res => {
        localStorage.setItem("token", res["token"]);
        console.log('token: ' + localStorage.getItem('token') );

        this.userProvider.getUserInfo()
        .subscribe(userInfo => {

          localStorage.setItem("user_id", userInfo["user_id"]);
          localStorage.setItem("username", userInfo["username"]); // used somewhere so it can't be deleted (TODO: search and remove!)
          this.navCtrl.setRoot(this.imgListPage);
          this.events.publish("loggedIn", true); // used to update the side-menu items (Logout, Login, etc)
        },
        (error: HttpErrorResponse) => console.log(error.error.message));
      },
      (error: HttpErrorResponse) => console.log(error.error.message)
    );
  } // end login()
} // end class
