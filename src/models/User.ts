
/**
 * Data model class for Users.
 */

export class User {

  private _username: string;
  private _password: string;
  private _email: string;

  constructor(username: string = '', password: string = '', email: string = '') {

    this._username = username;
    this._password = password;
    this._email = email;
  }

  // not sure if this is the format that these are supposed to take...
  // it complains about duplicate variables if I name the inner variables identically,
  // so I added underscores to them.
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
