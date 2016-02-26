import * as http from 'nanoajax';
import {inject} from 'aurelia-framework';
import * as encrypt from './helpers/cheap-encrypt';
import {ModernModal} from './helpers/modern-modal';
import {IRobot} from './helpers/robot-check';
import * as vtor from 'validator';


interface ILoginData {
  google_id?: string;
  facebook_id?: string;
  picture: string;
  email: string;
  email_verified?: boolean;
  nick: string;
  locale: string;
}

interface ILoginStatusObjs {
  sto: HTMLElement;
  stc: HTMLElement;
  chk?: HTMLElement;
}


export class Login {

  private _clientID = 'VOhiMrFfTsx2SSgoGOr25G8qa3J6W0yj';
  private _domain   = 'aedaeum.auth0.com';
  private _header   = 'WWW-Authenticate';
  private _robot: IRobot;

  private _validationTimeout = 0;

  private _objs: {
    avatar:       HTMLImageElement;
    email:        HTMLInputElement;
    nick:         HTMLInputElement;
    cansave:      HTMLElement;
    cansavec:     HTMLElement;
    emailCheck:   HTMLElement;
    emailInvalid: HTMLElement;
    emailErrorc:  HTMLElement;
    nickCheck:    HTMLElement;
    nickInvalid:  HTMLElement;
    nickErrorc:   HTMLElement;
    saveButton:   HTMLButtonElement;
  };

  private _classes = [
    '.avatar',
    '.nick',
    '.nick-check',
    '.nick-invalid',
    '.nick-error-container',
    '.email',
    '.email-check',
    '.email-invalid',
    '.email-error-container',
    '.can-save-container',
    '.can-save',
    '.save'
  ];

  private _lock: Auth0LockStatic;

  constructor(private _modal: ModernModal) {
    this._lock = new Auth0Lock(this._clientID, this._domain);


  }

  signup() {
    this._lock.once('signup success', () => {

    })
    this._lock.showSignup({

    }, () => {

    })

  }

  signIn() {

    // this._modal.show('modals/robot', 'I Robot Test', {
    //   objs: ['.try-again', '.text-container']
    // }, (o: any, loaded: boolean) => {

    //   if (!this._robot) {
    //     let objs = Array.prototype.slice.call(document.querySelectorAll('.node')) as HTMLElement[]
    //       , content = o['.text-container'] as HTMLElement
    //       , button = o['.try-again'] as HTMLElement;

    //     this._robot = new IRobot(objs, (res) => {

    //       if (res) {

    //       } else {
    //         content.classList.add('error');
    //         content.innerText = 'Sorry, try again!';
    //       }

    //     });

    //     setTimeout(() => {
    //       this._robot.start(600);
    //       button.addEventListener('click', () => {
    //         content.classList.remove('error');
    //         content.innerText = 'Click the circles in the order they blink.';
    //         this._robot.restart(600);
    //       });
    //     }, 700);
    //   }


    // });

    // let data = {
    //   email: "aelumen@gmail.com",
    //   locale: "en",
    //   nickname: "aelumen",
    //   picture: "https://lh4.googleusercontent.com/-jm9RnjaBMrI/AAAAAAAAAAI/AAAAAAAAAWQ/6K_OsI87w4g/photo.jpg",
    //   user_id: "google-oauth2|113221828266023013722"
    // }

    let data = {
      email: 'aelumen@gmail.com',
      locale: 'en',
      nickname: 'aelumen',
      picture: 'https://scontent.xx.fbcdn.net/hprofile-xtl1/v/t1.0-1/p50x50/1909949_10156451943195346_4119065300640329697_n.jpg?oh=ceef56f378b2dd26ad06dd418e3fe9bf&oe=56FC1166',
      user_id: 'facebook|10156229933700346'
    };

    if (data.user_id.indexOf('google') > -1) {
      data.picture = data.picture.split('photo.jpg')[0] + 's64-c-mo/photo.jpg';
    }
    else if (data.user_id.indexOf('facebook') > -1) {
      data.picture = 'https://graph.facebook.com/' + data.user_id.split('|')[1] + '/picture?width=64';
    }

    // this._test(data);

    // this._completeSignup(data);


    this._askForInvite();


    // this._lock.showSignin({
    //   rememberLastLogin: true
    // }, (err, profile, token) => {

    //   if (err) {
    //     console.log(err);
    //     return;
    //   }

    //   console.info(profile);

    //   localStorage.setItem('userToken', token);

    //   this._requestLogin(token).then((key: string) => {

    //     this._login(token, key, profile).then((res: [number, string]) => {
    //       console.log(res);
    //     });

    //   });

    // });
  }


  private _test(profile) {

    this._validateAPIURL('verifylogin', profile)
      .then((res) => {
        console.log('Success', res);
      })
      .catch((e) => {
        console.log('Error', e);
      });

  }



  private _requestLogin(token: string) {

    return new Promise((rs, rj) => {

      http.ajax({
        url: '/internal/loginrequest'
      },

      (code, res, req) => {

        let header = req.getResponseHeader(this._header)

          // Decode header from base64
          , data = atob(header)

          // Decode last 2 chars
          , salt = parseInt(data.substr(-2), 16)

          // Decode 2 chars before last 2 chars
          , saltRamp = parseInt(data.substr(-4, 2), 16) / 100;


        // Clean footers
        data = data.slice(0, -4);


        let decoded = '';
        for (let i = 0, s = salt; i < data.length; i += 2) {

          // Convert to ASCII code
          let alldata = parseInt(data[i] + data[i + 1], 16);

          // Convert to char
          decoded += String.fromCharCode(alldata - s);
          s = Math.floor(s * saltRamp);
        }

        rs(decoded);

      });

    });



  }


  private _validateAPIURL(url: string, data: string, token = '', hidden = false) {

    let headers = (token)
      ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain'
        }
      : {
          'Content-Type': 'text/plain'
        }
      , newData = '';

    url = `/internal/${url}`;

    return new Promise((rs, rj) => {

      if (hidden) {
        headers['WWW-Authenticate'] = data;
        newData = 'Hello World';
      }
      else newData = data;

      let ajaxOptions = {
        url,
        headers
      };

      if (newData) ajaxOptions['body'] = JSON.stringify(newData);

      http.ajax(ajaxOptions, (code, res, req) => {

        console.log(code, res);
        if (code == 200) {
          rs([code, JSON.parse(res)]);
        } else {
          rj(res);
        }

      });


    });



  }



  private _login(token: string, key: string, profile: Auth0UserProfile) {

    return new Promise((rs, rj) => {

      let data = encrypt.encode(key, JSON.stringify({
        user_id: profile.user_id,
        picture: profile.picture,
        email: profile.email,
        nickname: profile.nickname,
        locale: profile.locale
      }));

      console.log(data);

      http.ajax({
        url: '/internal/login',
        method: 'POST',
        body: 'Hello World!',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
          'WWW-Authenticate': data
        }
      }, (code, res, req) => {

        rs([code, res]);

      });

    });

  }



  private _askForInvite() {

    this._modal.show('modals/invite', 'Enter Invite Code', {
      '.invite-input': {
        events: [
          {
            name: 'keyup',
            trigger: (e, ol, objs) => {

            }
          }
        ]
      },
      '.submit': {
        events: [
          {
            name: 'click',
            trigger: (e, ol, objs) => {

              this
                ._validateAPIURL('validinvite', objs['.invite-input'].value)
                  .then((res) => {
                    console.log(res);
                  })
                  .catch(res => {
                    console.error(res);
                  });

            }
          }
        ]
      }
    });

  }




  private _completeSignup(data: ILoginData) {


    this._modal.show('modals/login', 'Complete Signup', {
      '.nick': {
        value: data.nickname,
        events: [
          {
            name: 'keyup',
            trigger: (e, ol, objs) => this._validateSignup(e, 'nick')
          }
        ]
      },
      '.email': {
        value: data.email,
        events: [
          {
            name: 'keyup',
            trigger: (e, ol, objs) => this._validateSignup(e, 'email')
          }
        ]
      },
      '.save': {
        events: [
          {
            name: 'click',
            trigger: () => console.log('Temporary')
          }
        ]
      },
      objs: this._classes
    }, (objs) => {
      this._populateLoginObjs(objs);

      this._objs.avatar.src = data.picture;
      this._canUserSave();

    });

  }


  private _validateSignup(e: KeyboardEvent, type: string) {

    // SHIFT, CTRL, CAPSLOCK
    if (e.which == 16 || e.which == 17 || e.which == 20) {
      return;
    }

    clearTimeout(this._validationTimeout);

    let objs: { stc: HTMLElement, sto: HTMLElement, chk: HTMLElement };

    this._validationTimeout = setTimeout(() => {

      // In case the timing failed
      clearTimeout(this._validationTimeout);

      let input = (e.target as HTMLInputElement).value;

      switch (type) {

        case 'email':
          objs =
          {
            stc: this._objs.emailErrorc,
            sto: this._objs.emailInvalid,
            chk: this._objs.emailCheck
          };

          if (input.length < 1 || !input) {
            this._setLoginStatus(objs, false, 'Please enter an email address.');
          }
          else if (vtor.isEmail(input)) {
            this._setLoginStatus(objs, true);
          } else {
            this._setLoginStatus(objs, false, 'That email is not correctly formatted.');
          }

        break;



        case 'nick':
          objs =
          {
            stc: this._objs.nickErrorc,
            sto: this._objs.nickInvalid,
            chk: this._objs.nickCheck
          };

          if (input.length < 1 || !input) {
            this._setLoginStatus(objs, false);
          }
          if (input.length < 4) {
            this._setLoginStatus(objs, false);
          }
          else if (vtor.matches(input, /^[a-zA-Z0-9]+$/g)) {
            this._setLoginStatus(objs, true);
          } else {
            console.log('invalid');
            this._setLoginStatus(objs, false);
          }
        break;


        default:
          throw 'AppLogin::validateSignup::Invalid Validation Type';

      }

      this._canUserSave();


    }, 500);






  }


  /**
   * Hide/Show the specified Account Setup status.
   *
   * @param objs - Container, Output, and Checkmark objects
   * @param status - Whether the status should be success or fail
   */
  private _setLoginStatus(objs: ILoginStatusObjs, status: boolean, content?: string) {

    let { stc, sto, chk } = objs;

    if (!status && !stc.classList.contains('open')) {
      if (content) {
        sto.innerHTML = content;
      }
      if (chk) chk.classList.add('invalid');
      stc.classList.add('open');
      setTimeout(() => {
        sto.classList.add('open');
      }, 50);
    }
    else if (status && stc.classList.contains('open')) {
      if (chk) chk.classList.remove('invalid');
      stc.classList.remove('open');
      sto.classList.remove('open');
    }
    else if (content && content != sto.innerText) {
      sto.classList.remove('open');
      setTimeout(() => {
        sto.innerHTML = content;
        sto.classList.add('open');
      }, 350);
    } else if (chk && status) {
      chk.classList.remove('invalid');
    } else if (chk && !status) {
      chk.classList.add('invalid');
    }
  }




  /**
   * Check if the user can save their changes
   * based on the username, email, and invite validation.
   */
  private _canUserSave() {

    let objs =
    {
      stc: this._objs.cansavec,
      sto: this._objs.cansave
    };

    if (this._objs.emailCheck.classList.contains('invalid') ||
        this._objs.nickCheck.classList.contains('invalid')) {
      this._setLoginStatus(objs, true);
      this._objs.saveButton.disabled = true;
    } else {
      this._setLoginStatus(objs, false);
      this._objs.saveButton.disabled = false;
    }

  }


  private _populateLoginObjs(objs: any) {
    for (let o in objs) {
      switch (vtor.ltrim(o, '.')) {
        case 'avatar': this._objs['avatar'] = objs[o]; break;
        case 'email': this._objs['email'] = objs[o]; break;
        case 'nick': this._objs['nick'] = objs[o]; break;
        case 'can-save': this._objs['cansave'] = objs[o]; break;
        case 'can-save-container': this._objs['cansavec'] = objs[o]; break;
        case 'email-check': this._objs['emailCheck'] = objs[o]; break;
        case 'email-invalid': this._objs['emailInvalid'] = objs[o]; break;
        case 'email-error-container': this._objs['emailErrorc'] = objs[o]; break;
        case 'nick-check': this._objs['nickCheck'] = objs[o]; break;
        case 'nick-invalid': this._objs['nickInvalid'] = objs[o];  break;
        case 'nick-error-container': this._objs['nickErrorc'] = objs[o]; break;
        case 'save': this._objs['saveButton'] = objs[o]; break;

        default:
          throw new Error('AppLogin::PopulateLoginObjs::Can\'t find ' + o + '\' in object list.');
      }
    }

    let i = 0
      , test = [] as string[];
    for (let k in this._objs) {
      test.push(k);
      i++;
    }
    if (i != this._classes.length) {
      console.log(test);
      console.log(this._classes);
      throw new Error('AppLogin::populateLoginObjs::Available Classes and Objs do not match');
    }

  }



  /**
   * Check if the specified nick already exists.
   */
  private checkUsername(name: string): Promise<boolean> {

    return new Promise((rs, rj) => {
      http.ajax({
        url: '/internal/validnick',
        method: 'POST',
        body: name,
        headers: {
          'Content-Type': 'text/plain'
        }
      }, (code, res, req) => {

        if (code == 200) rs((res == 'true') ? true : false);
        else             rj(res);
      });
    });

  }




}