import { Page } from 'ionic-angular/navigation/nav-util';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  homePage: Page = HomePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

    // I'm not sure if this is a good way to implement logout...
    // when we arrive on this 'page', we leave immediately
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    this.navCtrl.push(this.homePage);
  }

}
