import {FauxApiData} from './FauxData';
import {
  QueueName,
  optionalQueryStringWithQmark,
  queuedFetchOrReturnFaux,
} from './get';
import {
  IPinboardApi,
  IPinboardApiNotes,
  IPinboardApiPosts,
  IPinboardApiTags,
  IPinboardApiUser,
  PinboardApiPasswordCredential,
  PinboardApiTokenSecretCredential,
  PinboardMode,
  TPinboardApiBookmarkResult,
  TPinboardApiBookmarkResultToPinboardBookmarkArr,
  YesOrNo,
  isApiTokenSecretCredential,
  TPinboardApiBookmark,
  TPinboardApiBookmarkToPinboardBookmark,
  isApiPasswordCredential,
  TPinboardApiPostsUpdateResult,
  OneToThreeStrings,
} from './types';

/* The /posts/* routes for the Pinboard API
 */
class PinboardApiPosts implements IPinboardApiPosts {
  public constructor(readonly api: IPinboardApi) {}

  /* The most recent time any bookmark was added, updated or deleted.
   */
  public update = () => {
    return this.api
      .getJson<TPinboardApiPostsUpdateResult>('common', 'posts/update')
      .then((result) => new Date(result.update_time));
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
    return this.api.getJson('common', 'posts/add', params);
  };

  /* Delete a bookmark.
   */
  public delete(params: {url: string}) {
    return this.api.getJson('common', 'posts/delete', params);
  }

  /* Returns one or more posts on a single day matching the arguments.
   * If no date or url is given, date of most recent bookmark will be used.
   */
  public get(params: {tag?: string; dt?: string; url?: string; meta?: string}) {
    return this.api
      .getJson<TPinboardApiBookmarkResult>('common', 'posts/get', params)
      .then(TPinboardApiBookmarkResultToPinboardBookmarkArr);
  }

  /* Returns a list of dates with the number of posts at each date.
   */
  public dates(params: {tag?: string[]}) {
    return this.api.getJson('common', 'posts/dates', params);
  }

  /* Returns a list of the user's most recent posts, filtered by tag.
   * tag: up to 3 tags
   * count: default is 15, max is 100
   */
  public recent(params: {tag?: OneToThreeStrings; count?: number}) {
    return this.api
      .getJson<TPinboardApiBookmarkResult>(
        'apiPostsRecent',
        'posts/recent',
        params,
      )
      .then((result) => {
        console.log(
          `pinboard.api.posts.recent(): result: ${JSON.stringify(result)}`,
        );
        return result;
      })
      .then(TPinboardApiBookmarkResultToPinboardBookmarkArr);
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
    // Note that this endpoint gets a list of TPinboardApiBookmark objects,
    // NOT wrapped in a TPinboardApiBookmarkResult object.
    const dateRetrieved = new Date();
    return this.api
      .getJson<TPinboardApiBookmark[]>('apiPostsAll', 'posts/all', params)
      .then((result) =>
        result.map((bookmark) =>
          TPinboardApiBookmarkToPinboardBookmark(
            bookmark,
            this.api.credential ? this.api.credential.username : '(NONE)',
            dateRetrieved,
          ),
        ),
      );
  }

  /* Returns a list of popular tags and recommended tags for a given URL.
   * Popular tags are tags used site-wide for the url; recommended tags are drawn from the user's own tags.
   */
  public suggest(params: {url: string}) {
    return this.api.getJson('common', 'posts/suggest', params);
  }
}

/* The /tags/* routes for the Pinboard API
 */
class PinboardApiTags implements IPinboardApiTags {
  public constructor(readonly api: IPinboardApi) {}

  /* Returns a full list of the user's tags along with the number of times they were used.
   */
  public get() {
    return this.api.getJson('common', 'tags/get');
  }

  /* Delete an existing tag.
   */
  public delete(params: {tag: string}) {
    return this.api.getJson('common', 'tags/delete', params);
  }

  /* Rename an tag, or fold it in to an existing tag
   */
  public rename(params: {old: string; new: string}) {
    return this.api.getJson('common', 'tags/rename', params);
  }
}

/* The /user/* routes for the Pinboard API
 */
class PinboardApiUser implements IPinboardApiUser {
  public constructor(readonly api: IPinboardApi) {}

  /* Returns the user's secret RSS key (for viewing private feeds)
   */
  public secret() {
    return this.api.getJson('common', 'user/secret');
  }

  /* Returns the secret part of the user's API token
   * (for making API calls without a password)
   */
  public apiToken() {
    return this.api.getJson('common', 'user/api_token');
  }
}

/* The /notes/* routes for the Pinboard API
 */
class PinboardApiNotes implements IPinboardApiNotes {
  public constructor(readonly api: IPinboardApi) {}

  /* Returns a list of the user's notes
   */
  public list() {
    return this.api.getJson('common', 'notes/list');
  }

  /* Returns an individual user note. The hash property is a 20 character long sha1 hash of the note text.
   */
  public byId(id: string) {
    const endpoint = `notes/${id}`;
    return this.api.getJson('common', endpoint);
  }
}

/* The Pinboard API
 * <https://pinboard.in/api/>
 */
export class PinboardApi implements IPinboardApi {
  public apiMethod = 'https';
  public apiHost = 'api.pinboard.in';
  public apiPathPrefix = 'v1';

  public posts: IPinboardApiPosts;
  public tags: IPinboardApiTags;
  public user: IPinboardApiUser;
  public notes: IPinboardApiNotes;

  public constructor(
    readonly mode: PinboardMode,
    readonly credential?:
      | PinboardApiPasswordCredential
      | PinboardApiTokenSecretCredential,
  ) {
    this.posts = new PinboardApiPosts(this);
    this.tags = new PinboardApiTags(this);
    this.user = new PinboardApiUser(this);
    this.notes = new PinboardApiNotes(this);
  }

  /* An auth token consists of a username and a secret api token
   * An API token is the secret part of an auth token
   */
  public get authToken() {
    if (
      !this.credential ||
      !isApiTokenSecretCredential(this.credential) ||
      !this.credential.authTokenSecret
    ) {
      return '';
    } else {
      return `${this.credential.username}:${this.credential.authTokenSecret}`;
    }
  }

  /* True if credentials exist, false otherwise.
   * Credentials are NOT checked for validity.
   */
  public get loggedIn() {
    return typeof this.credential !== 'undefined';
  }

  /* Make requests with some type of credentials and convert the result to JSON
   */
  private getJsonWithTokenSecretCredential(
    queueName: QueueName,
    apiPath: string,
    credential: PinboardApiTokenSecretCredential,
    fauxData: object,
    query?: object,
  ): Promise<any> {
    const authToken = `${credential.username}:${credential.authTokenSecret}`;
    console.log(`Logging in with API token ${authToken}`);
    const qs = optionalQueryStringWithQmark(
      Object.assign({}, {auth_token: authToken, format: 'json'}, query),
    );
    const apiRoot = `${this.apiMethod}://${this.apiHost}/${this.apiPathPrefix}`;
    const uri = `${apiRoot}/${apiPath}${qs}`;
    const headers = {'Content-Type': 'application/json'};
    const result = queuedFetchOrReturnFaux(
      queueName,
      this.mode,
      fauxData,
      uri,
      headers,
    );
    console.log(
      `pinboard.api.getJsonWithApiTokenSecretCredential(): result: ${JSON.stringify(
        result,
      )}`,
    );
    return result;
  }
  private getJsonWithPasswordCredential(
    queueName: QueueName,
    apiPath: string,
    credential: PinboardApiPasswordCredential,
    fauxData: object,
    query?: object,
  ): Promise<any> {
    console.log(
      `Logging in with username/password ${credential.username}:${credential.password}`,
    );
    const qs = optionalQueryStringWithQmark(
      Object.assign({}, {format: 'json'}, query),
    );
    const apiRoot = `${this.apiMethod}://${credential.username}:${credential.password}@${this.apiHost}/${this.apiPathPrefix}`;
    const uri = `${apiRoot}/${apiPath}${qs}`;
    const headers = {'Content-Type': 'application/json'};
    const result = queuedFetchOrReturnFaux(
      queueName,
      this.mode,
      fauxData,
      uri,
      headers,
    );
    console.log(
      `pinboard.api.getJsonWithPasswordCredential(): result: ${JSON.stringify(
        result,
      )}`,
    );
    return result;
  }
  public getJsonWithAnyAuth<ResultT>(
    queueName: QueueName,
    apiPath: string,
    fauxData: object,
    query?: object,
  ): Promise<ResultT> {
    if (!this.credential) {
      return new Promise<any>((_resolve, reject) =>
        reject('API credential is undefined'),
      );
    } else if (isApiTokenSecretCredential(this.credential)) {
      return this.getJsonWithTokenSecretCredential(
        queueName,
        apiPath,
        this.credential,
        fauxData,
        query,
      );
    } else if (isApiPasswordCredential(this.credential)) {
      return this.getJsonWithPasswordCredential(
        queueName,
        apiPath,
        this.credential,
        fauxData,
        query,
      );
    } else {
      return new Promise<any>((_resolve, reject) =>
        reject('API credential of unknown type))'),
      );
    }
  }

  /* Call into backend functions to retrieve data from the API and convert it to a type.
   * Relies on backend functions to determine credential type,
   * retrieve data from the API using our credential,
   * return real data from the API or faux data from this project, etc.
   */
  public getJson<ResultT>(
    queueName: QueueName,
    apiPath: string,
    query?: object,
  ): Promise<ResultT> {
    return this.getJsonWithAnyAuth(
      queueName,
      apiPath,
      FauxApiData[apiPath],
      query,
    ).then((result) => {
      console.log(
        `pinboard.api.getJson(): result for ${JSON.stringify(
          apiPath,
        )} before typing: ${JSON.stringify(result)}`,
      );
      return result as ResultT;
    });
  }
}
