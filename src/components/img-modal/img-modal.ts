import { ThumbnailPipe } from './../../pipes/thumbnail/thumbnail';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ImgProvider } from './../../providers/ImgProvider';
import { DlImage } from './../../models/DlImage';
import { ImgListPage } from './../../pages/img-list/img-list';
import { Page } from 'ionic-angular/navigation/nav-util';
import { NavParams, NavController, AlertController } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ElementRef } from '@angular/core/src/linker/element_ref';

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

  @ViewChild('descParagraph') descParagraph: any;

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
    // OR: display toast about deleting
  }

  // called upon clicking a trashcan icon in the corner of the image
  delete(img: DlImage) {

    const id: number = img.file_id;

    // technically this should be moved to Utils.ts, but since it's only used once, it might as well be here.
    const alert = this.alertCtrl.create({
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

update() {

  const prompt = this.alertCtrl.create({
    title: 'Change text',
    message: "Enter a new text for the image:",
    inputs: [
      {
        name: 'text',
        placeholder: this.description // ideally, the old text would be there in an editable form, but I'm not sure how to do that
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {

          const newText = data.text;

          this.imgProvider.updateImage(this.file_id, newText)
          .subscribe(res => {

            console.log(res['message']);

            this.description = newText;
            this.dlImage.description = newText;
          },
          (error: HttpErrorResponse) => console.log(error.error.message)
            // TODO: toast about failing to update image
          ); // end subscribe()
        } // end handler
      }
    ] // end buttons
  });
  prompt.present();
} // end update()

} // end class
