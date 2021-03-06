import { Utils } from './../utils/Utils';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Provides methods for uploading, fetching, deleting and updating images to/from the server.
 */

@Injectable()
export class ImgProvider {

  baseApiUrl = Utils.BASE_API_URL;

  constructor(public http: HttpClient) {
  }

  getImagesByUserId(id: number) {

    // will only be called when the user is logged in, so no empty-check is needed
    const token = localStorage.getItem('token');

    const url = this.baseApiUrl + 'media/user/' + id;

    const options = {
      headers: new HttpHeaders()

      .set('Content-Type', 'application/json')
      .set('x-access-token', token)
    };

    return this.http.get<object[]>(url, options);
  } // end getImagesByUserId()

  getImageByImageId(id: number) {

    const url = this.baseApiUrl + 'media/' + id;

    const options = {

      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    return this.http.get<object>(url, options);
  } // end getImageByImageId()

  uploadImage(formData: FormData) {

    const url = this.baseApiUrl + 'media';

    // adding Content-Type: multipart/form-data gives an error...
    // while if it's left out, it's added
    // automatically without any problems. -.-
    const options = {

      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };

    return this.http.post(url, formData, options);
  } // end uploadImage()

  updateImage(imgId: number, desc: string) {

    const url = this.baseApiUrl + 'media/' + imgId;

    const options = {

      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };

    const request = { "description": desc };

    return this.http.put(url, request, options);
  } // end updateImage()

  deleteImage(imgId: number) {

    const url = this.baseApiUrl + 'media/' + imgId;

    const options = {

      headers: new HttpHeaders().set('x-access-token', localStorage.getItem('token'))
    };

    return this.http.delete(url, options);
  } // end deleteImage()

} // end class
