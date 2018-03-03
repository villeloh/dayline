import { ThumbnailPipe } from './../../pipes/thumbnail/thumbnail';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ImgProvider } from './../../providers/ImgProvider';
import { DlImage } from './../../models/DlImage';
import { ImgListPage } from './../../pages/img-list/img-list';
import { Page } from 'ionic-angular/navigation/nav-util';
import { NavParams, NavController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * Presents a larger view of the image (with controls), upon clicking
 * it in the main image list view.
 */

@Component({
  selector: 'img-modal',
  templateUrl: 'img-modal.html'
})
export class ImgModalComponent {

  filename: string; // 'src' attribute value for the image in the modal
  file_id: number;
  description: string;
  dlImage: DlImage;
  imgListPage: any = ImgListPage;

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public imgProvider: ImgProvider,
    public navCtrl: NavController,
    private alertCtrl: AlertController) {

    this.dlImage = params.get('dlImage'); // entire image object... inefficient perhaps
    this.filename = this.dlImage.filename;
    this.file_id = this.dlImage.file_id;
    this.description = this.dlImage.description;
  }

  // maybe send back a blurb text; 'you deleted image_x!'?
  closeModal(info?: any) {

    this.viewCtrl.dismiss(info);
  }

  // called upon clicking a trashcan icon in the corner of the image
  delete(img: DlImage) {

    const id: number = img.file_id;

    let alert = this.alertCtrl.create({
      title: 'Delete Image',
      message: 'Are you sure you want to delete this image?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {

            // TODO: stay within the modal somehow...
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.imgProvider.deleteImage(id)
            .subscribe(res => {

              console.log("deleted img # " + id);
              this.navCtrl.setRoot(ImgListPage);
            },
            (error: HttpErrorResponse) => console.log(error.error.message));
          }
        }
      ]});
    alert.present();
  } // end delete()
} // end class
