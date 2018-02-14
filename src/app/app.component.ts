import { RegisterPage } from './../pages/register/register';
import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LogoutPage } from '../pages/logout/logout';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * This class actually controls the sidemenu, but renaming it now might cause some unneeded mayhem.
 */

@Component({
  templateUrl: 'app.html'
  // providers: [ ViewController ]
})
export class MyApp {

  @ViewChild(Nav) nav: Nav; // the Nav that is marked '#content', I guess?

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen) {

    this.initializeApp();

    // this.viewCtrl.showBackButton(false); // doesn't work for some reason...

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

    const id = localStorage.getItem('user_id');

    if ( id !== null && id !== undefined ) {

      this.pages.push({ title: 'Logout', component: LogoutPage });
    } else {

      this.pages.push({ title: 'Login', component: LoginPage });
      this.pages.push({ title: 'Register', component: RegisterPage });
    }
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
}
