import {FauxApiData} from './FauxData';
import {fetchOrReturnFaux, optionalQueryStringWithQmark} from './get';
import {PinboardMode, YesOrNo} from './index';

type PinboardApiResult = Promise<object>;
type PinboardApiGet = (endpoint: string, query?: object) => PinboardApiResult;

/* The /posts/* routes for the Pinboard API
 */
class PinboardApiPosts {
  public constructor(readonly api: PinboardApi) {}

  /* The most recent time any bookmark was added, updated or deleted.
   */
  public update = () => {
    return this.api.getJsonTokenAuth('posts/update');
  };

  /* Add a bookmark.
   */
  public add = (params: {
    url: string;
    description: string;
    extended?: string;
    tags?: string[];
    dt?: string;
    replace?: YesOrNo;
    shared?: YesOrNo;
    toread?: boolean;
  }) => {
    return this.api.getJsonTokenAuth('posts/add', params);
  };

  /* Delete a bookmark.
   */
  public delete(params: {url: string}) {
    return this.api.getJsonTokenAuth('posts/delete', params);
  }

  /* Returns one or more posts on a single day matching the arguments.
   * If no date or url is given, date of most recent bookmark will be used.
   */
  public get(params: {tag?: string; dt?: string; url?: string; meta?: string}) {
    return this.api.getJsonTokenAuth('posts/get', params);
  }

  /* Returns a list of dates with the number of posts at each date.
   */
  public dates(params: {tag?: string[]}) {
    return this.api.getJsonTokenAuth('posts/dates', params);
  }

  /* Returns a list of the user's most recent posts, filtered by tag.
   */
  public recent(params: {tag?: string[]}) {
    return this.api.getJsonTokenAuth('posts/recent', params);
  }

  /* Returns all bookmarks in the user's account.
   */
  public all(params: {
    tag?: string;
    start?: string;
    results?: string;
    fromdt?: string;
    meta?: string;
  }) {
    return this.api.getJsonTokenAuth('posts/all', params);
  }

  /* Returns a list of popular tags and recommended tags for a given URL.
   * Popular tags are tags used site-wide for the url; recommended tags are drawn from the user's own tags.
   */
  public suggest(params: {url: string}) {
    return this.api.getJsonTokenAuth('posts/suggest', params);
  }
}

/* The /tags/* routes for the Pinboard API
 */
class PinboardApiTags {
  public constructor(readonly api: PinboardApi) {}

  /* Returns a full list of the user's tags along with the number of times they were used.
   */
  public get() {
    return this.api.getJsonTokenAuth('tags/get');
  }

  /* Delete an existing tag.
   */
  public delete(params: {tag: string}) {
    return this.api.getJsonTokenAuth('tags/delete', params);
  }

  /* Rename an tag, or fold it in to an existing tag
   */
  public rename(params: {old: string; new: string}) {
    return this.api.getJsonTokenAuth('tags/rename', params);
  }
}

/* The /user/* routes for the Pinboard API
 */
class PinboardApiUser {
  public constructor(readonly api: PinboardApi) {}

  /* Returns the user's secret RSS key (for viewing private feeds)
   */
  public secret() {
    return this.api.getJsonTokenAuth('user/secret');
  }

  /* Returns the secret part of the user's API token
   * (for making API calls without a password)
   * Unlike all other API calls, this one is done via user/password authentication
   */
  public apiToken() {
    return this.api.getJsonCredsAuth('user/api_token');
  }
}

/* The /notes/* routes for the Pinboard API
 */
class PinboardApiNotes {
  public constructor(readonly api: PinboardApi) {}

  /* Returns a list of the user's notes
   */
  public list() {
    return this.api.getJsonTokenAuth('notes/list');
  }

  /* Returns an individual user note. The hash property is a 20 character long sha1 hash of the note text.
   */
  public byId(id: string) {
    const endpoint = `notes/${id}`;
    return this.api.getJsonTokenAuth(endpoint);
  }
}

/* The Pinboard API
 */
export class PinboardApi {
  public apiMethod = 'https';
  public apiHost = 'api.pinboard.in';
  public apiPathPrefix = 'v1';

  public username: string = '';
  public password: string = '';

  /* An auth token consists of a username and a secret api token
   * An API token is the secret part of an auth token
   */
  public authTokenSecret: string = '';
  public get authToken() {
    if (!this.username || !this.authTokenSecret) {
      return '';
    } else {
      return `${this.username}:${this.authTokenSecret}`;
    }
  }

  public constructor(
    readonly mode: PinboardMode,
    username?: string,
    password?: string,
    authTokenSecret?: string,
  ) {
    if (username) {
      this.username = username;
    }
    if (password) {
      this.password = password;
    }
    if (authTokenSecret) {
      this.authTokenSecret = authTokenSecret;
    }
  }

  //   public getJsonTokenAuth: PinboardApiGet = (
  //     endpoint: string,
  //     query?: object,
  //   ) => {
  //     const qs = Object.assign(
  //       {},
  //       {auth_token: this.token, format: 'json'},
  //       query,
  //     );
  //     const headers = {'Content-Type': 'application/json'};
  //     const uri = `${this.apiRoot}/${endpoint}?${stringify(qs)}`;
  //     switch (this.mode) {
  //       case PinboardMode.Mock:
  //         const mockData = FauxApiData[endpoint];
  //         const fauxPromise: PinboardApiResult = new Promise(
  //           (resolve, reject) => {
  //             if (mockData) {
  //               console.debug(`Returning mock data for api endpoint ${endpoint}`);
  //               resolve(mockData);
  //             } else {
  //               reject(`No mock data to return for api endpoint ${endpoint}`);
  //             }
  //           },
  //         );
  //         return fauxPromise;
  //       case PinboardMode.Production:
  //         const realPromise = fetch(uri, {
  //           headers,
  //         }).then((result) => result.json());
  //         return realPromise;
  //     }
  //   };

  public getJsonCredsAuth: PinboardApiGet = (
    endpoint: string,
    query?: object,
  ) => {
    if (!this.username || !this.password) {
      return new Promise<object>((resolve, reject) =>
        reject('Missing username or password'),
      );
    }
    const qs = optionalQueryStringWithQmark(
      Object.assign({}, {format: 'json'}, query),
    );
    const apiRoot = `${this.apiMethod}://${this.username}:${this.password}@${this.apiHost}/${this.apiPathPrefix}`;
    const uri = `${apiRoot}/${endpoint}${qs}`;
    const headers = {'Content-Type': 'application/json'};
    return fetchOrReturnFaux(this.mode, FauxApiData[endpoint], uri, headers);
  };

  public getJsonTokenAuth: PinboardApiGet = (
    endpoint: string,
    query?: object,
  ) => {
    if (!this.authTokenSecret) {
      return new Promise<object>((resolve, reject) =>
        reject(
          [
            'Missing token.',
            `mode: ${this.mode}`,
            `username: ${this.username}`,
            `password: ${this.password}`,
            `authTokenSecret: ${this.authTokenSecret}`,
            `authToken: ${this.authToken}`,
          ].join('\n'),
        ),
      );
    }
    const qs = optionalQueryStringWithQmark(
      Object.assign(
        {},
        {auth_token: this.authTokenSecret, format: 'json'},
        query,
      ),
    );
    const apiRoot = `${this.apiMethod}://${this.apiHost}/${this.apiPathPrefix}`;
    const uri = `${apiRoot}/${endpoint}${qs}`;
    const headers = {'Content-Type': 'application/json'};
    return fetchOrReturnFaux(this.mode, FauxApiData[endpoint], uri, headers);
  };

  public posts = new PinboardApiPosts(this);
  public tags = new PinboardApiTags(this);
  public user = new PinboardApiUser(this);
  public notes = new PinboardApiNotes(this);
}
