
export interface InviteRequest {
  status: number;
  data?: {
    timeout?: {
      hours: number;
      minutes: number;
    }
    error?: {
      msg: string;
      data?: any
    }
  }
}

export interface SingupRequest {
  status: number;
  data?: {
    verify: boolean;
    exists: boolean;
    error: string|null
  }
}

export interface SigninRequest {
  status: number;
  data?: {
    notfound: boolean;
    signedin: boolean;
    error: string|null
  }
}

type InviteData = {
  alias: string;
  email: string;
  content: string;
}
type InviteTest = 'timeout'|'error';
type InvalidInvite = 'invalid'|'notexist'|'expired';
type InvalidAlias = 'exists'|'similar';

export default class ClientAPI {

  constructor() {}

  public canRequestInvite(delay?: number, test?: InviteTest) {
    return this._timedResolver<InviteRequest>(() => {

      if (test == 'timeout') {
        return {
          status: 202,
          data: {
            timeout: {
              hours: Math.floor(Math.random() * 23),
              minutes: Math.floor(Math.random() * 59),
            }
          }
        }
      }

      if (test == 'error') {
        return {
          status: 500,
          data: {
            error: {
              msg: 'Error Requesting Invite Form'
            }
          }
        }
      }

      return {
        status: 200
      }

    }, delay || 0)
  }


  public requestInvite(data: InviteData, delay?: number, test?: InviteTest) {
    return this._timedResolver<InviteRequest>(() => {

      if (test == 'timeout') {
        return {
          status: 202,
          data: {
            error: {
              msg: 'Sent Invite During Timeout'
            }
          }
        }
      }

      if (test == 'error') {
        return { status: 500 }
      }

      return { status: 200 }

    }, delay || 0);
  }


  public validateInvite(invite: string, delay?: number, test?: InvalidInvite) {
    return this._timedResolver(() => {

      let data = '';

      if (test ==  'invalid') data = 'invalid invite';
      if (test == 'notexist') data = 'invite not found';
      if (test ==  'expired') data = 'invite has expired';

      return {
        status: !data ? 200 : 400,
        data
      }

    }, delay || 0)
  }


  public validateAlias(alias: string, delay?: number, test?: InvalidAlias) {
    return this._timedResolver(() => {

      if (test == 'similar') {
        let percent = 50 + Math.floor(Math.random() * 50);
        return {
          status: 409,
          data: `${percent}% Match to Existing Name`
        }
      }

      if (test == 'exists') {
        return {
          status: 409,
          data: 'Name Already In Use'
        }
      }

      return {
        status: 200,
        data: 'Name Available!'
      }

    }, delay || 0)
  }


  public signup(alias: string, type: 'google'|'facebook', delay?: number, test?: 'email'|'exists'|'error') {
    return this._timedResolver<SingupRequest>(() => {

      if (test == 'email') {
        return {
          status: 403,
          data: {
            verify: true,
            exists: false,
            error: null
          }
        }
      }

      if (test == 'exists') {
        return {
          status: 403,
          data: {
            verify: false,
            exists: true,
            error: null
          }
        }
      }

      if (test == 'error') {
        return {
          status: 403,
          data: {
            verify: false,
            exists: false,
            error: 'some kind of auth chain issue maybe'
          }
        }
      }

      return {
        status: 200,
      }
    }, delay || 0)
  }


  public signin(type: 'google'|'facebook', delay?: number, test?: 'error'|'notfound'|'signedin') {
    return this._timedResolver<SigninRequest>(() => {
      if (test == 'notfound') {
        return {
          status: 403,
          data: {
            notfound: true,
            signedin: false,
            error: null
          }
        }
      }

      if (test == 'signedin') {
        return {
          status: 403,
          data: {
            notfound: false,
            signedin: true,
            error: null
          }
        }
      }

      if (test == 'error') {
        return {
          status: 403,
          data: {
            notfound: false,
            signedin: false,
            error: 'some kind of error occurred'
          }
        }
      }

      return {
        status: 200
      }

    }, delay || 0)
  }


  private _timedResolver<T>(cb: () => T, delay: number): Promise<T> {
    return new Promise((rs, rj) => {
      setTimeout(() => {
        rs(cb());
      }, delay);
    })
  }

}