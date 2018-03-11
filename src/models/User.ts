
/**
 * Data model class for Users.
 */

export class User {

  private _username: string;
  private _password: string;
  private _email: string;

  constructor(username: string = '', password: string = '', email: string = '') {

    this.username = username;
    this.password = password;
    this.email = email;
  }

  // not sure if this is the format that these are supposed to take...
  // it complains about duplicate variables if I first make 'private username' etc
  set username (value) {
    this._username = value;
  }

  set password(value) {
    this._password = value;
  }

  set email(value) {
    this._email = value;
  }

  get username() {
    return this._username;
  }

  get password() {
    return this._password;
  }

  get email() {
    return this._email;
  }

} // end class
