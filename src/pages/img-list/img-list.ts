import { ThumbnailPipe } from './../../pipes/thumbnail/thumbnail';
import { ImageBoxComponent } from './../../components/image-box/image-box';
import { DlImage } from './../../models/DlImage';
import { UserProvider } from './../../providers/UserProvider';
import { ImgProvider } from './../../providers/ImgProvider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http/src/response';
import { ImgModalComponent } from '../../components/img-modal/img-modal';

@IonicPage()
@Component({
  selector: 'page-img-list',
  templateUrl: 'img-list.html',
})
export class ImgListPage {

  imageList: DlImage[];
  baseApiUrl = 'http://media.mw.metropolia.fi/wbma/';

  file: File;
  title: string;
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
    console.log("id: " + userId);

    this.imgProvider.getImagesByUserId(userId)
    .subscribe(imgs => {

      for (let i = 0; i < imgs.length; i++) {

        dlImg = new DlImage(imgs[i]['title'], imgs[i]['filename'], imgs[i]['description'], imgs[i]['time_added'],
        imgs[i]['user_id'], imgs[i]['file_id'], imgs[i]['thumbnails']);
        this.imageList[i] = dlImg;
      }
    }); // end subscribe()
  } // end buildImageList()

  upload() {

    const storedThis = this; // store a 'this' reference for use in the setTimeOut()

    const formData: FormData = new FormData();
    formData.append('file', this.file);
    formData.append('title', this.title);
    formData.append('description', this.description);

    this.imgProvider.uploadImage(formData)
    .subscribe(res => {

      console.log('Upload response: ' + JSON.stringify(res));

      const delay = 2000; // unworkable... it loads it alright, but this takes *way* too long!

      setTimeout(function() {

        storedThis.buildImageList(); // inefficient... should just add it to the page. caching etc is needed as well...
      }, delay);
    },
    (error: HttpErrorResponse) => console.log(error.error.message));
  } // end upload()

  getFile(event: any) {

    this.file = event.target.files[0];
  }

  presentModal(dlImage: DlImage) {

    let imgModal = this.modalCtrl.create(ImgModalComponent, { dlImage: dlImage });
    imgModal.present();
  }
} // end class
