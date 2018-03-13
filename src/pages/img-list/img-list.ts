import { Utils } from './../../utils/Utils';
import { ThumbnailPipe } from './../../pipes/thumbnail/thumbnail';
import { ImageBoxComponent } from './../../components/image-box/image-box';
import { DlImage } from './../../models/DlImage';
import { UserProvider } from './../../providers/UserProvider';
import { ImgProvider } from './../../providers/ImgProvider';
import { Component, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ImgModalComponent } from '../../components/img-modal/img-modal';

/**
 * Main image list page; the 'core' of the app.
 * You can add and remove images and edit their
 * description from here.
 */

@IonicPage()
@Component({
  selector: 'page-img-list',
  templateUrl: 'img-list.html',
})
export class ImgListPage {

  @ViewChild('imgHolder') imgHolder: any;
  @ViewChild('fileInputField') fileInputField: any;

  imageList: DlImage[];
  baseApiUrl = Utils.BASE_API_URL;
  file: File;
  lastUploadDate: Date;
  description: string;
  noImages: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public imgProvider: ImgProvider,
    public userProvider: UserProvider,
    private renderer: Renderer,
    private toastCtrl: ToastController
  ) {
    this.noImages = false;
  }

  ionViewDidLoad() {

    this.imageList = [];
    this.buildImageList();
  }

  buildImageList() {

    let dlImg;

    // should exist since we came here from login / register
    const userId = Number(localStorage.getItem('user_id')) || 0;

    this.imgProvider.getImagesByUserId(userId)
    .subscribe(imgs => {

      if (imgs.length !== 0) {

        // I'm using the title field to store the upload date... it's non-ideal, but fast & easy
        this.lastUploadDate = new Date(imgs[imgs.length-1]['title']);

        // to make the newer images appear on top, we must add the images in reverse order
        let j = 0;

        for (let i = imgs.length - 1; i >= 0; i--, j++) {

          dlImg = new DlImage(imgs[j]['title'], imgs[j]['filename'], imgs[j]['description'], imgs[j]['time_added'],
          imgs[j]['user_id'], imgs[j]['file_id'], imgs[j]['thumbnails']);
          this.imageList[i] = dlImg;
        }
      } else {

        // if there are no images, display a msg about uploading a new one
        this.noImages = true;
      }
    }); // end subscribe()
  } // end buildImageList()

  upload() {

    const formattedDateStr = Utils.formattedDateStr();
    const uploadDate = new Date(formattedDateStr);
    let proceed: boolean;

    if (this.lastUploadDate !== undefined && this.lastUploadDate !== null) {

      proceed = uploadDate.getTime() > this.lastUploadDate.getTime();
    } else {
      proceed = true; // no images on the list
    }

    if (!proceed) {

      Utils.toast(this.toastCtrl, "You've already added an image today!");
    } else {

      const storedThis = this; // store a 'this' reference for use in the setTimeOut()

      const formData: FormData = new FormData();
      formData.append('file', this.file);
      formData.append('title', formattedDateStr);
      formData.append('description', this.description);

      this.imgProvider.uploadImage(formData)
      .subscribe(res => {

        this.imgProvider.getImageByImageId(res['file_id'])
        .subscribe(img => {

          const dlImg = new DlImage(img['title'], img['filename'], img['description'], img['time_added'],
          img['user_id'], img['file_id'], img['thumbnails']);

          const delay = 2000; // the delay is needed for the image to be properly 'set up' on the backend before displaying it
          // NOTE: the delay would ideally depend on the size of the image / length of the upload process
          // 2 s is unacceptable in a real app, but I need to be sure that it works...

          setTimeout(function() {

            storedThis.imageList.unshift(dlImg); // add it as the first element of the array
            storedThis.lastUploadDate = new Date(dlImg.title); // update the upload date (so we can't add a new image on the same day)
            storedThis.noImages = false;
          }, delay);
        }); // end inner subscribe()
      },
      (error: HttpErrorResponse) => console.log(error.error.message)); // end outer subscribe()
    } // end if-else
  } // end upload()

  getFile(event: any) {

    this.file = event.target.files[0];
  }

  presentModal(dlImage: DlImage) {

    let imgModal = this.modalCtrl.create(ImgModalComponent, { dlImage: dlImage });
    imgModal.present();
  }

  // workaround that I found online for styling the 'Browse' button
  browse(event: Event): void {

    // trigger click event of hidden 'Browse' button
    let clickEvent: MouseEvent = new MouseEvent("click", {bubbles: true});
    this.renderer.invokeElementMethod(

      this.fileInputField.nativeElement, "dispatchEvent", [clickEvent]);
  } // end browse()

} // end class
