import { Utils } from './../utils/Utils';
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

  baseApiUrl = Utils.BASE_API_URL;

  // default options to use in requests... not sure if it's needed
  options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };

  constructor(public http: HttpClient) {
  }

  userNameFree(userName: string) {

    const url = this.baseApiUrl + 'users/username/' + userName;

    return this.http.get(url, this.options);
    // response contains: 'username', 'available'(boolean)
  } // end userNameFree()

  registerUser(user: User) {

    const url = this.baseApiUrl + 'users';

    return this.http.post(url, user, this.options);
  }

  loginUser(user: User) {

    const url = this.baseApiUrl + 'login';
    const body = `{ "username": "${user.username}", "password": "${user.password}" }`;

    return this.http.post(url, body, this.options);
  } // end loginUser()

  updateUser(user: User) {

    const url = this.baseApiUrl + 'users';
    const token = localStorage.getItem('token'); // to avoid duplicate code, this should be provided to all these methods somehow

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('x-access-token', token)
    };

    let request = {};
    // possible stats: 'username', 'password', 'email'

    // validation is done before calling this method, so these fields are either valid
    // or empty (due to the way in which the 'modify user' form works)
    if (user.username !== '') {
      request['username'] = user.username;
    }

    if (user.password !== '') {
      request['password'] = user.password;
    }

    if (user.email !== '') {
      request['email'] = user.email;
    }

    // if all the 'modify user' form fields are empty, the submit event is invalid and so this method will
    // never be reached. therefore, this put request should always be successful.
    return this.http.put(url, request, options);
  } // end updateUser()

  // this is implemented elsewhere atm... preserving this stub to remind me that it should be moved here
  logoutUser() {
  }

  // apparently this can't be done atm because we lack admin rights
  deleteUser() {
  }

  getUserInfo() {

    const token = localStorage.getItem('token') || ''; // non-ideal; should return 'empty' Observable if no token exists!

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('x-access-token', token)
    };

    return this.http.get(this.baseApiUrl + 'users/user', options);
  } // end getUserInfo()
} // end class
