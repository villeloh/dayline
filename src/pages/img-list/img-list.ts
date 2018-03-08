import { Utils } from './../../utils/Utils';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ThumbnailPipe } from './../../pipes/thumbnail/thumbnail';
import { ImageBoxComponent } from './../../components/image-box/image-box';
import { DlImage } from './../../models/DlImage';
import { UserProvider } from './../../providers/UserProvider';
import { ImgProvider } from './../../providers/ImgProvider';
import { Component, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http/src/response';
import { ImgModalComponent } from '../../components/img-modal/img-modal';

@IonicPage()
@Component({
  selector: 'page-img-list',
  templateUrl: 'img-list.html',
})
export class ImgListPage {

  @ViewChild('imgHolder') imgHolder: any;
  @ViewChild('fileInputField') fileInputField: any;

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
    public userProvider: UserProvider,
    private renderer: Renderer) {
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
    let proceed: boolean;

    console.log('this.lastUploadDate: ' + this.lastUploadDate);

    if (this.lastUploadDate !== undefined && this.lastUploadDate !== null) {

      proceed = uploadDate.getTime() > this.lastUploadDate.getTime();
      console.log('proceed when images exist: ' + proceed);
    } else {
      proceed = true; // no images on the list
    }

    if (!proceed) {

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
          // NOTE: the delay would ideally depend on the size of the image / length of the upload process

          setTimeout(function() {

            storedThis.imageList.unshift(dlImg); // add it as the first element of the array
            storedThis.lastUploadDate = new Date(dlImg.title); // update the upload date (so we can't add a new image on the same day)
            console.log('inner lastUploadDate: ' + storedThis.lastUploadDate);
            // NOTE: this should be done differently somehow... Observe the list and do this whenever it changes?
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

  // workaround that I found online for styling the 'Browse' button
  browse(event: Event): void {

    // trigger click event of hidden 'Browse' button
    let clickEvent: MouseEvent = new MouseEvent("click", {bubbles: true});
    this.renderer.invokeElementMethod(

      this.fileInputField.nativeElement, "dispatchEvent", [clickEvent]);
  } // end browse()

} // end class
