import {FauxFeedsData} from './FauxData';
import {fetchOrReturnFaux, optionalQueryStringWithQmark} from './get';
import {PinboardMode} from './index';

/* Pinboard API supports one, two, or three tags in several places
 */
type OneToThreeStrings = [string] | [string, string] | [string, string, string];

type PinboardFeedsResult = Promise<object>;
type PinboardFeedsGet = (
  endpoint: string,
  query?: object,
) => PinboardFeedsResult;

/* Take a list of tags and return Pinboard-style tag path components
 *
 * For example:
 *    tagListToComponents(["one", "two", "three"])
 * => "t:one/t:two/t:three"
 */
const tagListToComponents = (tags: string[]) => {
  return tags.map((t) => `t:${t}`).join('/');
};

class PinboardFeedsUnauthenticated {
  public constructor(readonly feeds: PinboardFeeds) {}

  public recent(count = 50) {
    return this.feeds.getJsonPublic('recent', {count});
  }

  public popular(count = 50) {
    return this.feeds.getJsonPublic('popular', {count});
  }

  public byUser(user: string, tags?: OneToThreeStrings, count = 50) {
    const tagsComponent = tags ? `/${tagListToComponents(tags)}` : '';
    const endpoint = `u:${user}${tagsComponent}/`;
    return this.feeds.getJsonPublic(endpoint, {count});
  }

  public byTags(tags: OneToThreeStrings, count = 50) {
    const endpoint = `${tagListToComponents(tags)}/`;
    return this.feeds.getJsonPublic(endpoint, {count});
  }
}

class PinboardFeedsAuthenticated {
  public constructor(readonly feeds: PinboardFeeds) {}

  public private(count = 50) {
    return this.feeds.getJsonSecret('secret/', {count});
  }
  public unread(count = 50) {
    return this.feeds.getJsonSecret('unread/', {count});
  }
  public untagged(count = 50) {
    return this.feeds.getJsonSecret('untagged/', {count});
  }
  public starred(count = 50) {
    return this.feeds.getJsonSecret('starred/', {count});
  }
  public network(count = 50) {
    return this.feeds.getJsonSecret('network/', {count});
  }
}

export class PinboardFeeds {
  public feedsRoot = 'https://feeds.pinboard.in';
  public username: string = '';
  public rssSecret: string = '';

  public constructor(readonly mode: PinboardMode) {}

  //   public getJsonPublic: PinboardFeedsGet = (
  //     endpoint: string,
  //     query?: object,
  //   ) => {
  //     const queryString = optionalQueryStringWithQmark(query);
  //     const uri = `${this.feedsRoot}/json/${endpoint}${queryString}`;
  //     switch (this.mode) {
  //       case PinboardMode.Mock:
  //         const mockData = FauxFeedsData[endpoint];
  //         return fauxFetch(uri, mockData);
  //       case PinboardMode.Production:
  //         return fetch(uri).then((result) => result.json());
  //     }
  //   };

  public getJsonPublic: PinboardFeedsGet = (
    endpoint: string,
    query?: object,
  ) => {
    const queryString = optionalQueryStringWithQmark(query);
    const uri = `${this.feedsRoot}/json/${endpoint}${queryString}`;
    return fetchOrReturnFaux(this.mode, FauxFeedsData[endpoint], uri, {});
  };

  public getJsonSecret: PinboardFeedsGet = (
    endpoint: string,
    query?: object,
  ) => {
    if (!this.username || !this.rssSecret) {
      return new Promise<object>((resolve, reject) =>
        reject('Missing username or RSS secret'),
      );
    }
    const queryString = optionalQueryStringWithQmark(query);
    const uri = `${this.feedsRoot}/json/secret:${this.rssSecret}/u:${this.username}/${endpoint}${queryString}`;
    return fetchOrReturnFaux(this.mode, FauxFeedsData[endpoint], uri, {});
  };

  public unauthenticated = new PinboardFeedsUnauthenticated(this);
  public authenticated = new PinboardFeedsAuthenticated(this);
}
