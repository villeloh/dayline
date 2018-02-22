import { ImgListPage } from './../pages/img-list/img-list';
import { NavController } from 'ionic-angular';
import { User } from './../models/User';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from 'ionic-angular/navigation/nav-util';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http/src/response';

/**
 * Provides methods for user operations on the remote server.
 */

@Injectable()
export class UserProvider {

  baseApiUrl = 'http://media.mw.metropolia.fi/wbma/';

  options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };

  constructor(public http: HttpClient) {
  }

  registerUser(user: User) {

    const url = this.baseApiUrl + 'users';

    return this.http.post(url, user, this.options);
  }

  loginUser(user: User) {

    const url = this.baseApiUrl + 'login';
    const body = `{ "username": "${user.username}", "password": "${user.password}" }`;

    return this.http.post(url, body, this.options);
  } // end loginUser()

  updateUser() {

  }

  logoutUser() {

  }

  deleteUser() {



  }

  getUserInfo() {

    const token = localStorage.getItem('token') || ''; // non-ideal; should return 'empty' Observable if no token!

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('x-access-token', token)
    };

    return this.http.get(this.baseApiUrl + 'users/user', options);
  } // end getUserInfo()
} // end class
