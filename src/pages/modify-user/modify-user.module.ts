import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifyUserPage } from './modify-user';

@NgModule({
  declarations: [
    ModifyUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ModifyUserPage),
  ],
})
export class ModifyUserPageModule {}
