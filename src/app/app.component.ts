import { Page } from 'ionic-angular/navigation/nav-util';
import { UserProvider } from "./../providers/UserProvider";
import { RegisterPage } from "./../pages/register/register";
import { LoginPage } from "./../pages/login/login";
import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, Events } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { HomePage } from "../pages/home/home";
import { LogoutPage } from "../pages/logout/logout";
import { ViewController } from "ionic-angular/navigation/view-controller";
import { ModifyUserPage } from "../pages/modify-user/modify-user";

/**
 * This class mainly controls the sidemenu, but renaming it now
 * (or moving the functionality) might cause some unneeded mayhem.
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

    // this.viewCtrl.showBackButton(false); // doesn't work for some reason...

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

    // Reset the content nav to have just this page
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


  // I didn't find a way to make these two methods work correctly...
  // making them static means we lose the reference to this.pages;
  // yet without that they can't be called from outside the class without
  // instantiating a new 'myApp', which seems all kinds of horrible.
  // A solution might be to make 'pages' static as well, but I'm not going to risk
  // that as I'm running out of time...

  // the items in the side menu need to be modified based on
  // what page the user is currently on.
  popMenuItem(title: string) {

    for (let item of this.pages) {
      if (item['title'] === title) {

        const index = this.pages.indexOf(item);
        this.pages.splice(index, 1);
        return;
      }
    }
  } // end popMenuItem()

  pushMenuItem(page: { title: string, component: Page }) {

    // the order of the menu items might get scrambled, but it's too much to avert right now
    this.pages.push(page);
  }

} // end class
