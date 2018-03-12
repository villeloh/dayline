import { Utils } from './../../utils/Utils';
import { ThumbnailPipe } from "./../../pipes/thumbnail/thumbnail";
import { HttpErrorResponse } from "@angular/common/http/src/response";
import { ImgProvider } from "./../../providers/ImgProvider";
import { DlImage } from "./../../models/DlImage";
import { ImgListPage } from "./../../pages/img-list/img-list";
import { NavParams, NavController, AlertController, ToastController } from "ionic-angular";
import { Component, ViewChild } from "@angular/core";
import { ViewController } from "ionic-angular/navigation/view-controller";

/**
 * Presents a larger view of the image (with controls), upon clicking
 * it in the main image list view.
 */

@Component({
  selector: "img-modal",
  templateUrl: "img-modal.html"
})
export class ImgModalComponent {
  filename: string; // 'src' attribute value for the image in the modal
  file_id: number;
  description: string;
  dlImage: DlImage;
  imgListPage: any = ImgListPage;

  @ViewChild("descParagraph") descParagraph: any;

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public imgProvider: ImgProvider,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.dlImage = params.get("dlImage");
    this.filename = this.dlImage.filename;
    this.file_id = this.dlImage.file_id;
    this.description = this.dlImage.description;
  } // end constructor()

  // Not used atm
  closeModal(info?: any) {
    this.viewCtrl.dismiss(info);
  }

  // called upon clicking a trashcan icon in the corner of the image
  delete(img: DlImage) {

    const id: number = img.file_id;

    // technically this should be moved to Utils.ts, but since
    // it's only used once, it might as well be here.
    const alert = this.alertCtrl.create({
      title: "Delete Image",
      message: "Are you sure you want to delete this image?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          handler: () => {
            // TODO: stay within the modal somehow...
          }
        },
        {
          text: "Yes",
          handler: () => {
            this.imgProvider.deleteImage(id)
            .subscribe(res => {

                Utils.toast(this.toastCtrl, 'Deleted Image!');
                this.navCtrl.setRoot(ImgListPage);
              },
              (error: HttpErrorResponse) => console.log(error.error.message)
            ); // end subscribe()
          }
        }
      ] // end buttons[]
    }); // end alert
    alert.present();
  } // end delete()

  update() {
    const prompt = this.alertCtrl.create({
      title: "Change Text",
      message: "Enter a new text for the image:",
      inputs: [
        {
          name: "text",
          placeholder: this.description
          // ideally, the old text would be there in an editable form,
          // but I'm not sure how to do that
        }
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {

          }
        },
        {
          text: "Save",
          handler: data => {

            const newText = data.text;

            this.imgProvider.updateImage(this.file_id, newText)
            .subscribe(res => {

                this.description = newText;
                this.dlImage.description = newText;
              },
              (error: HttpErrorResponse) => {

                console.log(error.error.message);
                Utils.toast(this.toastCtrl, 'Failed to Update Image!');
              }); // end subscribe()
          } // end handler
        }
      ] // end buttons[]
    });
    prompt.present();
  } // end update()

} // end class
