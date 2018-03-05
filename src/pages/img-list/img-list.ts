import { Utils } from './../../utils/Utils';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ThumbnailPipe } from './../../pipes/thumbnail/thumbnail';
import { ImageBoxComponent } from './../../components/image-box/image-box';
import { DlImage } from './../../models/DlImage';
import { UserProvider } from './../../providers/UserProvider';
import { ImgProvider } from './../../providers/ImgProvider';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http/src/response';
import { ImgModalComponent } from '../../components/img-modal/img-modal';

@IonicPage()
@Component({
  selector: 'page-img-list',
  templateUrl: 'img-list.html',
})
export class ImgListPage {

  // not sure if this is correct...
  @ViewChild('imgHolder') imgHolder: any;

  imageList: DlImage[];
  baseApiUrl = 'http://media.mw.metropolia.fi/wbma/';

  file: File;
  lastUploadDate: Date;
  description: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public imgProvider: ImgProvider,
    public userProvider: UserProvider) {
  }

  ionViewDidLoad() {

    // TODO: implement caching so that the list is not re-fetched every time when re-entering the page

    this.imageList = [];
    this.buildImageList();
  }

  buildImageList() {

    let dlImg;

    const userId = Number(localStorage.getItem('user_id')) || 0; // should exist since we came here from login / register
    console.log("user_id: " + userId);

    this.imgProvider.getImagesByUserId(userId)
    .subscribe(imgs => {

      if (imgs.length !== 0) {

        // I'm using the title field to store the upload date... it's non-ideal, but fast & easy
        this.lastUploadDate = new Date(imgs[imgs.length-1]['title']);
        console.log('last upload date: ' + imgs[imgs.length-1]['title']);

        // to make the newer images appear on top, we must add the images in reverse order
        let j = 0;

        for (let i = imgs.length - 1; i >= 0; i--, j++) {

          dlImg = new DlImage(imgs[j]['title'], imgs[j]['filename'], imgs[j]['description'], imgs[j]['time_added'],
          imgs[j]['user_id'], imgs[j]['file_id'], imgs[j]['thumbnails']);
          this.imageList[i] = dlImg;
        }
      }
    }); // end subscribe()
  } // end buildImageList()

  upload() {

    const formattedDateStr = Utils.formattedDateStr();
    console.log('formattedDateStr: ' + formattedDateStr);
    const uploadDate = new Date(formattedDateStr);

    if (uploadDate >= this.lastUploadDate) {

      // TODO: display an alert about invalid upload date
    } else {

      const storedThis = this; // store a 'this' reference for use in the setTimeOut()

      const formData: FormData = new FormData();
      formData.append('file', this.file);
      formData.append('title', formattedDateStr);
      formData.append('description', this.description);

      this.imgProvider.uploadImage(formData)
      .subscribe(res => {

        console.log('Upload response: ' + JSON.stringify(res));

        this.imgProvider.getImageByImageId(res['file_id'])
        .subscribe(img => {

          console.log('image added at time: ' + img['time_added']);

          const dlImg = new DlImage(img['title'], img['filename'], img['description'], img['time_added'],
          img['user_id'], img['file_id'], img['thumbnails']);

          const delay = 150; // the delay is needed for the image to be properly 'set up' on the backend before displaying it

          setTimeout(function() {

            storedThis.imageList.unshift(dlImg); // add it as the first element of the array
          }, delay);
        });
      },
      (error: HttpErrorResponse) => console.log(error.error.message));
    } // end if-else

  } // end upload()

  getFile(event: any) {

    this.file = event.target.files[0];
  }

  presentModal(dlImage: DlImage) {

    let imgModal = this.modalCtrl.create(ImgModalComponent, { dlImage: dlImage });
    imgModal.present();
  }
} // end class
