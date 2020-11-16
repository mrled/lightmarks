import {FauxFeedsData} from './FauxData';
import {fetchOrReturnFaux, optionalQueryStringWithQmark} from './get';
import {
  IPinboardFeeds,
  IPinboardFeedsAuthenticated,
  IPinboardFeedsUnauthenticated,
  OneToThreeStrings,
  PinboardFeedsRssSecretCredential,
  PinboardMode,
} from './types';

/* Take a list of tags and return Pinboard-style tag path components
 *
 * For example:
 *    tagListToComponents(["one", "two", "three"])
 * => "t:one/t:two/t:three"
 */
const tagListToComponents = (tags: string[]) => {
  return tags.map((t) => `t:${t}`).join('/');
};

/* Pinboard feeds that don't require authentication
 */
class PinboardFeedsUnauthenticated implements IPinboardFeedsUnauthenticated {
  public constructor(readonly feeds: PinboardFeeds) {}

  public recent(count = 50) {
    return this.feeds.getJsonPublic('recent', {count});
  }

  public popular(count = 50) {
    return this.feeds.getJsonPublic('popular', {count});
  }

  public byUser(user: string, count = 50, tags?: OneToThreeStrings) {
    const tagsComponent = tags ? `/${tagListToComponents(tags)}` : '';
    const endpoint = `u:${user}${tagsComponent}/`;
    return this.feeds.getJsonPublic(endpoint, {count});
  }

  public byTags(tags: OneToThreeStrings, count = 50) {
    const endpoint = `${tagListToComponents(tags)}/`;
    return this.feeds.getJsonPublic(endpoint, {count});
  }
}

/* Pinboard feeds that do require authentication
 */
class PinboardFeedsAuthenticated implements IPinboardFeedsAuthenticated {
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

/* Pinboard feeds
 * <https://pinboard.in/howto/#rss>
 */
export class PinboardFeeds implements IPinboardFeeds {
  public feedsRoot = 'https://feeds.pinboard.in';

  public constructor(
    readonly mode: PinboardMode,
    readonly auth?: PinboardFeedsRssSecretCredential,
  ) {}

  /* True if credentials exist, false otherwise.
   * Credentials are NOT checked for validity.
   */
  public get loggedIn() {
    return typeof this.auth !== 'undefined';
  }

  /* Get JSON results from the feeds host without authentication
   */
  public getJsonPublic: (endpoint: string, query?: object) => Promise<any> = (
    endpoint,
    query?,
  ) => {
    const queryString = optionalQueryStringWithQmark(query);
    const uri = `${this.feedsRoot}/json/${endpoint}${queryString}`;
    return fetchOrReturnFaux(this.mode, FauxFeedsData[endpoint], uri, {});
  };

  /* Get JSON results from the feeds host with authentication
   */
  public getJsonSecret: (endpoint: string, query?: object) => Promise<any> = (
    endpoint,
    query?,
  ) => {
    if (!this.auth) {
      return new Promise<object>((_resolve, reject) =>
        reject('Missing authentication.'),
      );
    }
    const queryString = optionalQueryStringWithQmark(query);
    const uri = `${this.feedsRoot}/json/secret:${this.auth.rssSecret}/u:${this.auth.username}/${endpoint}${queryString}`;
    return fetchOrReturnFaux(this.mode, FauxFeedsData[endpoint], uri, {});
  };

  public unauthenticated = new PinboardFeedsUnauthenticated(this);
  public authenticated = new PinboardFeedsAuthenticated(this);
}
