/* Pinboard API
 */

import {stringify} from 'querystring';

import FauxData from './FauxData';

/* Are we running in production?
 */
export enum PinboardMode {
  Mock,
  Production,
}

export const pinboardToken = (user: string, secret: string) => {
  return `${user}:${secret}`;
};

type PinboardApiResult = Promise<object>;
type PinboardApiGet = (endpoint: string, query?: object) => PinboardApiResult;

type YesOrNo = 'yes' | 'no';

/* The /posts/* routes for the Pinboard API
 */
class PinboardPosts {
  public constructor(readonly pinboard: Pinboard) {}

  /* The most recent time any bookmark was added, updated or deleted.
   */
  public update = () => {
    return this.pinboard.getJsonAuthenticated('posts/update');
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
    return this.pinboard.getJsonAuthenticated('posts/add', params);
  };

  /* Delete a bookmark.
   */
  public delete(params: {url: string}) {
    return this.pinboard.getJsonAuthenticated('posts/delete', params);
  }

  /* Returns one or more posts on a single day matching the arguments.
   * If no date or url is given, date of most recent bookmark will be used.
   */
  public get(params: {tag?: string; dt?: string; url?: string; meta?: string}) {
    return this.pinboard.getJsonAuthenticated('posts/get', params);
  }

  /* Returns a list of dates with the number of posts at each date.
   */
  public dates(params: {tag?: string[]}) {
    return this.pinboard.getJsonAuthenticated('posts/dates', params);
  }

  /* Returns a list of the user's most recent posts, filtered by tag.
   */
  public recent(params: {tag?: string[]}) {
    return this.pinboard.getJsonAuthenticated('posts/recent', params);
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
    return this.pinboard.getJsonAuthenticated('posts/all', params);
  }

  /* Returns a list of popular tags and recommended tags for a given URL.
   * Popular tags are tags used site-wide for the url; recommended tags are drawn from the user's own tags.
   */
  public suggest(params: {url: string}) {
    return this.pinboard.getJsonAuthenticated('posts/suggest', params);
  }
}

/* The /tags/* routes for the Pinboard API
 */
class PinboardTags {
  public constructor(readonly pinboard: Pinboard) {}

  /* Returns a full list of the user's tags along with the number of times they were used.
   */
  public get() {
    return this.pinboard.getJsonAuthenticated('tags/get');
  }

  /* Delete an existing tag.
   */
  public delete(params: {tag: string}) {
    return this.pinboard.getJsonAuthenticated('tags/delete', params);
  }

  /* Rename an tag, or fold it in to an existing tag
   */
  public rename(params: {old: string; new: string}) {
    return this.pinboard.getJsonAuthenticated('tags/rename', params);
  }
}

/* The /user/* routes for the Pinboard API
 */
class PinboardUser {
  public constructor(readonly pinboard: Pinboard) {}

  /* Returns the user's secret RSS key (for viewing private feeds)
   */
  public secret() {
    return this.pinboard.getJsonAuthenticated('user/secret');
  }

  /* Returns the user's API token (for making API calls without a password)
   */
  public apiToken() {
    return this.pinboard.getJsonAuthenticated('user/api_token');
  }
}

/* The /notes/* routes for the Pinboard API
 */
class PinboardNotes {
  public constructor(readonly pinboard: Pinboard) {}

  /* Returns a list of the user's notes
   */
  public list() {
    return this.pinboard.getJsonAuthenticated('notes/list');
  }

  /* Returns an individual user note. The hash property is a 20 character long sha1 hash of the note text.
   */
  public byId(id: string) {
    const endpoint = `notes/${id}`;
    return this.pinboard.getJsonAuthenticated(endpoint);
  }
}

/* The Pinboard API
 */
export class Pinboard {
  /* Uses token available on [settings/password](https://pinboard.in/settings/password)
   */
  public constructor(readonly token: string, readonly mode: PinboardMode) {}

  public apiRoot = 'https://api.pinboard.in/v1';

  public getJsonAuthenticated: PinboardApiGet = (
    endpoint: string,
    query?: object,
  ) => {
    const qs = Object.assign(
      {},
      {auth_token: this.token, format: 'json'},
      query,
    );
    const headers = {'Content-Type': 'application/json'};
    switch (this.mode) {
      case PinboardMode.Mock:
        const mockData = FauxData[endpoint];
        const fauxPromise: PinboardApiResult = new Promise(
          (resolve, reject) => {
            if (mockData) {
              console.debug(`Returning mock data for endpoint ${endpoint}`);
              resolve(mockData);
            } else {
              reject(`No mock data to return for endpoint ${endpoint}`);
            }
          },
        );
        return fauxPromise;
      case PinboardMode.Production:
        const realPromise = fetch(
          `${this.apiRoot}/${endpoint}?${stringify(qs)}`,
          {
            headers,
          },
        ).then((result) => result.json());
        return realPromise;
    }
  };

  public posts = new PinboardPosts(this);
  public tags = new PinboardTags(this);
  public user = new PinboardUser(this);
  public notes = new PinboardNotes(this);
}
