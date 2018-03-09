import { Utils } from './../../utils/Utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

/**
 * Pafe for modifying user info. It being a page is not really ideal
 * (could just be an alert or modal instead), but due to the way
 * that navigation works, I chose to do it this way.
 */

@IonicPage()
@Component({
  selector: 'page-modify-user',
  templateUrl: 'modify-user.html',
})
export class ModifyUserPage {

  modifyUserFormGroup: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder
  ) {

    this.modifyUserFormGroup = formBuilder.group({
      userName: ["", Utils.userNameValidators()],
      passWord: ["", Utils.pwValidators()]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModifyUserPage');
  }

}
