import { Utils } from './../utils/Utils';
import { User } from './../models/User';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Provides methods for user operations on the remote server.
 */

@Injectable()
export class UserProvider {

  baseApiUrl = Utils.BASE_API_URL;

  // default options to use in requests
  options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };

  constructor(public http: HttpClient) {
  }

  userNameFree(userName: string) {

    const url = this.baseApiUrl + 'users/username/' + userName;

    return this.http.get(url, this.options);
  } // end userNameFree()

  registerUser(user: User) {

    const url = this.baseApiUrl + 'users';
    const body = `{ "username": "${user.username}", "password": "${user.password}", "email": "${user.email}" }`;

    /* I can't just pass the User object here, because for some reason it uses
     * the internal field names ('_username', etc), which leads to a bad request
     * on the server-side. I could've just made the internal variables public
     * instead of using getters and setters, but it seemed a bit sloppy to me. */
    return this.http.post(url, body, this.options);
  } // end registerUser()

  loginUser(user: User) {

    const url = this.baseApiUrl + 'login';
    const body = `{ "username": "${user.username}", "password": "${user.password}" }`;

    return this.http.post(url, body, this.options);
  } // end loginUser()

  updateUser(user: User) {

    const url = this.baseApiUrl + 'users';
    const token = localStorage.getItem('token');

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('x-access-token', token)
    };

    let request = {};
    // possible stats: 'username', 'password', 'email'

    // validation is done before calling this method, so when we arrive here,
    // these fields are either valid or empty
    // (due to the way in which the 'modify user' form works)
    if (user.username !== '') {
      request['username'] = user.username;
    }

    if (user.password !== '') {
      request['password'] = user.password;
    }

    if (user.email !== '') {
      request['email'] = user.email;
    }

    // if all the 'modify user' form fields are empty, the submit event is invalid and
    // so this method will never be reached. therefore, this put request should always be successful.
    return this.http.put(url, request, options);
  } // end updateUser()

  getUserInfo() {

    // non-ideal; should return 'empty' Observable if no token exists!
    const token = localStorage.getItem('token') || '';

    const options = {

      headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('x-access-token', token)
    };

    return this.http.get(this.baseApiUrl + 'users/user', options);
  } // end getUserInfo()

  // NOTE: logging out is not present here, because it's implemented elsewhere
  // in a different manner (as there's no need for a request to the server)

  // NOTE #2: deleting a user is not present either, because apparently we lack
  // the admin rights that are required to do it

} // end class
