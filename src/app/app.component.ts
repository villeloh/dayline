import { UserProvider } from "./../providers/UserProvider";
import { RegisterPage } from "./../pages/register/register";
import { LoginPage } from "./../pages/login/login";
import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, Events } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { HomePage } from "../pages/home/home";
import { LogoutPage } from "../pages/logout/logout";
import { ModifyUserPage } from "../pages/modify-user/modify-user";

/** OVERALL APP DESCRIPTION
* 'DAYLINE -- an app for preserving one image every day of every year'.
* @author Ville Lohkovuori // same for every file...
* 02/03 2018
*/

/**
 * This class mainly controls the sidemenu, but
 * moving the functionality might cause some unneeded mayhem...
 */

@Component({
  templateUrl: "app.html"
})
export class MyApp {

  @ViewChild(Nav) nav: Nav; // the Nav that is marked '#content', I guess?

  rootPage: any = HomePage;

  private pages: Array<{ title: string; component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public userProvider: UserProvider,
    public events: Events
  ) {
    this.initializeApp();

    this.pages = [];

    this.events.subscribe("loggedIn", value => {
      this.setMenuItems(value);
    });
  } // end constructor()

  initializeApp() {

    this.platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  } // end initializeApp()

  openPage(page) {

    // Reset the content nav to have just this page.
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  // called whenever user state changes (event emitted on login/logout)
  setMenuItems(userLoggedIn: boolean) {

    if (userLoggedIn === true) {

      this.pages.length = 0;
      this.pages.push({ title: "Modify User", component: ModifyUserPage });
      this.pages.push({ title: "Logout", component: LogoutPage });
    } else {

      this.pages.length = 0;
      this.pages.push({ title: "Login", component: LoginPage });
      this.pages.push({ title: "Register", component: RegisterPage });
    }
  } // end setMenuItems()

} // end class
