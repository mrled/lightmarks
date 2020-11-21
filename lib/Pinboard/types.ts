import {QueueName} from './get';

/* Are we running in production?
 */
export enum PinboardMode {
  Mock = 'Mock',
  Production = 'Production',
}

/* Pinboard API query strings sometimes require yes/no
 */
export type YesOrNo = 'yes' | 'no';

/* Pinboard API supports one, two, or three tags in several places
 */
export type OneToThreeStrings =
  | [string]
  | [string, string]
  | [string, string, string];

/* A username/password credential for the Pinboard API
 */
export type PinboardApiPasswordCredential = {
  username: string;
  password: string;
};

/* A username/token secret credential for the Pinboard API
 */
export type PinboardApiTokenSecretCredential = {
  username: string;
  authTokenSecret: string;
};

/* A username/RSS secret credential for Pinboard feeds
 */
export type PinboardFeedsRssSecretCredential = {
  username: string;
  rssSecret: string;
};

/* True if the input object is a PinboardApiPasswordCredential
 */
export function isApiPasswordCredential(
  cred: PinboardApiPasswordCredential | PinboardApiTokenSecretCredential,
): cred is PinboardApiPasswordCredential {
  return (cred as PinboardApiPasswordCredential).password !== undefined;
}

/* True if 'cred' is a PinboardApiTokenSecretCredential
 */
export function isApiTokenSecretCredential(
  cred: PinboardApiPasswordCredential | PinboardApiTokenSecretCredential,
): cred is PinboardApiTokenSecretCredential {
  return (
    (cred as PinboardApiTokenSecretCredential).authTokenSecret !== undefined
  );
}

/* A representation of one or more of Pinboard credential.
 * (Sometimes it is useful to package them together like this.)
 */
export interface IPinboardCredential {
  username: string;
  password?: string;
  authTokenSecret?: string;
  rssSecret?: string;
}

/* This class can be used on its own, but is really required for pinboardCredentialOptionalEq().
 */
export class PinboardCredential implements IPinboardCredential {
  public constructor(
    readonly username: string,
    readonly password?: string,
    readonly authTokenSecret?: string,
    readonly rssSecret?: string,
  ) {}
}

/* Compare whether two optional PinboardCredentialType objects are equal
 */
export function pinboardCredentialOptionalEq(
  cred1?: IPinboardCredential,
  cred2?: IPinboardCredential,
) {
  if (cred1 === cred2) {
    return true;
  } else if (cred1 === undefined || cred2 === undefined) {
    return false;
  } else {
    return Object.keys(PinboardCredential).every((property) => {
      const key = property as keyof IPinboardCredential;
      cred1[key] === cred2[key];
    });
  }
}

/* Interface for the Pinboard class
 */
export interface IPinboard {
  readonly api: IPinboardApi;
  readonly feeds: IPinboardFeeds;
  readonly aggregates: IPinboardAggregates;
  readonly auth: IPinboardAuth;
  readonly apiCredential?:
    | PinboardApiPasswordCredential
    | PinboardApiTokenSecretCredential;
  readonly feedsCredential?: PinboardFeedsRssSecretCredential;
  readonly mode: PinboardMode;
  readonly credential?: IPinboardCredential;
}

/* An interface for the .auth property of the Pinboard class
 * Helper functions for authenticating to Pinboard.
 */
export interface IPinboardAuth {
  pinboard: IPinboard;
  apiTokenLogin(): Promise<any>;
  feedsLogin(force: boolean): Promise<any>;
}

/* Interface for the .aggregates property of the Pinboard class
 * Currently empty; placeholder for future methods.
 * E.g. working with notes, which involve calling to the posts and notes APIs behind the scenes.
 */
export interface IPinboardAggregates {}

/* Interface for the .api property of the Pinboard class
 * Thin wrapper around the Pinboard API at https://api.pinboard.in
 */
export interface IPinboardApi {
  apiMethod: string;
  apiHost: string;
  apiPathPrefix: string;
  authToken: string;
  loggedIn: boolean;
  mode: PinboardMode;
  credential?: PinboardApiPasswordCredential | PinboardApiTokenSecretCredential;
  getJson<ResultT>(
    queueName: QueueName,
    endpoint: string,
    query?: object,
  ): Promise<ResultT>;

  posts: IPinboardApiPosts;
  tags: IPinboardApiTags;
  user: IPinboardApiUser;
  notes: IPinboardApiNotes;
}

/* Interface for the /posts/ route of the Pinboard API
 */
export interface IPinboardApiPosts {
  api: IPinboardApi;
  update(): Promise<any>;
  add(params: {
    url: string;
    description: string;
    extended?: string;
    tags?: OneToThreeStrings;
    dt?: string;
    replace?: YesOrNo;
    shared?: YesOrNo;
    toread?: YesOrNo;
  }): Promise<any>;
  delete(params: {url: string}): Promise<any>;
  get(params: {
    tag?: OneToThreeStrings;
    dt?: string;
    url?: string;
    meta?: YesOrNo;
  }): Promise<PinboardBookmark[]>;
  dates(params: {tag?: OneToThreeStrings}): Promise<any>;
  recent(params: {
    tag?: OneToThreeStrings;
    count?: number;
  }): Promise<PinboardBookmark[]>;
  all(params: {
    tag?: OneToThreeStrings;
    start?: number; // Offset value
    results?: number; // Number of results to return
    fromdt?: string; // Return only bookmarks created after this time
    todt?: string; // Return only bookmarks created before this time
    meta?: YesOrNo;
  }): Promise<any>;
  suggest(params: {url: string}): Promise<any>;
}

/* Interface for the /tags/ route of the Pinboard API
 */
export interface IPinboardApiTags {
  api: IPinboardApi;
  get(): Promise<any>;
  delete(params: {tag: string}): Promise<any>;
  rename(params: {old: string; new: string}): Promise<any>;
}

/* Interface for the /user/ route of the Pinboard API
 */
export interface IPinboardApiUser {
  api: IPinboardApi;
  secret(): Promise<any>;
  apiToken(): Promise<any>;
}

/* Interface for the /notes/ route of the Pinboard API
 */
export interface IPinboardApiNotes {
  api: IPinboardApi;
  list(): Promise<any>;
  byId(id: string): Promise<any>;
}

/* Interface for Pinboard feeds that do not require authentication
 */
export interface IPinboardFeedsUnauthenticated {
  readonly feeds: IPinboardFeeds;
  recent(count: number): Promise<Array<PinboardBookmark>>;
  popular(count: number): Promise<Array<PinboardBookmark>>;
  byUser(user: string, count: number, tags?: OneToThreeStrings): Promise<any>;
  byTags(tags: OneToThreeStrings, count: number): Promise<any>;
}

/* Interface for Pinboard feeds that require authentication
 */
export interface IPinboardFeedsAuthenticated {
  feeds: IPinboardFeeds;
  private(count: number): Promise<any>;
  unread(count: number): Promise<any>;
  untagged(count: number): Promise<any>;
  starred(count: number): Promise<any>;
  network(count: number): Promise<any>;
}

/* Interface for Pinboard feeds from https://feeds.pinboard.in
 */
export interface IPinboardFeeds {
  feedsRoot: string;
  mode: PinboardMode;
  auth?: PinboardFeedsRssSecretCredential;
  loggedIn: boolean;
  getJsonPublic<ResultT>(endpoint: string, query?: object): Promise<any>;
  getJsonSecret(endpoint: string, query?: object): Promise<any>;
  unauthenticated: IPinboardFeedsUnauthenticated;
  authenticated: IPinboardFeedsAuthenticated;
}

/* Bookmark objects retrieved from the JSON feed
 */
export type TPinboardFeedsBookmark = {
  // The URI
  u: string;

  // The "description", meaning the title for the bookmark (typically the title of the page)
  d: string;

  // The "notes", meaning the "extended description", meaning any notes the user has added
  n: string;

  // The date
  // At least for pinboard.feeds.unauthenticated.popular, this is the date the bookmark was RETRIEVED.
  // Is this true for other API calls? Requires further investigation
  dt: string;

  // The user that added the bookmark
  a: string;

  // Tags
  // If there are no tags, this will be an array containing a single empty string (sigh)
  t: Array<string>;
};

/* Response from the API
 */
export type TPinboardApiBookmark = {
  href: string;
  description: string;
  extended: string;
  meta: string;
  hash: string;
  time: string;
  shared: YesOrNo;
  toread: YesOrNo;
  tags: string; // Space separated
};
export type TPinboardApiBookmarkResult = {
  user: string;
  date: string;
  posts: Array<TPinboardApiBookmark>;
};
export type TPinboardApiPostsUpdateResult = {
  update_time: string;
};

type PinboardBookmarkParams = {
  uri: string;
  user: string;
  title: string;
  tags: Array<string>;
  dateRetrieved: Date;
  dateBookmarked?: Date;
  extendedDescription?: string;
  metaChangeDetection?: string;
  hash?: string;
  shared?: boolean;
  toread?: boolean;
};
export class PinboardBookmark {
  public readonly uri: string;
  public readonly user: string;
  public readonly title: string;
  public readonly tags: Array<string>;
  public readonly dateRetrieved: Date;
  public readonly dateBookmarked?: Date;
  public readonly extendedDescription?: string;
  public readonly metaChangeDetection?: string;
  public readonly hash?: string;
  public readonly shared?: boolean;
  public readonly toread?: boolean;
  public constructor(params: PinboardBookmarkParams) {
    this.uri = params.uri;
    this.user = params.user;
    this.title = params.title;
    this.tags = params.tags;
    this.dateRetrieved = params.dateRetrieved;
    this.dateBookmarked = params.dateBookmarked;
    this.extendedDescription = params.extendedDescription;
    this.metaChangeDetection = params.metaChangeDetection;
    this.hash = params.hash;
    this.shared = params.shared;
    this.toread = params.toread;
  }
}

/* Pinboard thinks that a on-item array containing a single zero-length string means "no tags".
 * We cannot fix this brokenness, we can only do our best to cope with it.
 */
function emptyTagsArrayToEmptyArray(arr: Array<string>): Array<string> {
  return arr.filter((tag) => tag !== '');
}

/* Convert a TPinboardFeedsBookmark to a real PinboardBookmark
 */
export function PinboardBookmarkFromTPinboardFeedsBookmark(
  obj: TPinboardFeedsBookmark,
): PinboardBookmark {
  try {
    const bookmark = new PinboardBookmark({
      uri: obj.u,
      user: obj.a,
      title: obj.d,
      dateRetrieved: new Date(obj.dt),
      extendedDescription: obj.n,
      tags: emptyTagsArrayToEmptyArray(obj.t),
      toread: false,
    });
    // console.log(
    //   `PinboardBookmarkFromTPinboardFeedsBookmark(): Created new bookmark from ${obj.u}`,
    // );
    return bookmark;
  } catch (err) {
    const msg = [
      'PinboardBookmarkFromTPinboardFeedsBookmark(): Failed to convert PinboardFeedsBookmark (1) to PinboardBookmark because of error: (2):',
      `1) ${JSON.stringify(obj).slice(0, 512)}`,
      `2) ${JSON.stringify(err)}`,
    ].join('\n');
    console.error(msg);
    throw msg;
  }
}

/* Convert an array of TPinboardFeedsBookmark objects to an array of real PinboardBookmark objects
 */
export function TPinboardFeedsBookmarkListToPinboardBookmarkList(
  arr: Array<TPinboardFeedsBookmark>,
): Array<PinboardBookmark> {
  try {
    const bookmarks = arr.map((bookmark) => {
      return PinboardBookmarkFromTPinboardFeedsBookmark(bookmark);
    });
    // console.log(
    //   `TPinboardFeedsBookmarkListToPinboardBookmarkList(): bookmarks: ${JSON.stringify(
    //     bookmarks,
    //   ).slice(0, 512)}`,
    // );
    return bookmarks;
  } catch (error) {
    const msg = [
      'TPinboardFeedsBookmarkListToPinboardBookmarkList(): Failed to convert PinboardFeedsBookmark array (1) to PinboardBookmark array because of error: (2):',
      `1) ${JSON.stringify(arr).slice(0, 512)}`,
      `2) ${JSON.stringify(error)}`,
    ].join('\n');
    console.error(msg);
    throw msg;
  }
}

/* Convert a TPinboardApiBookmark to a real PinboardBookmark
 */
export function TPinboardApiBookmarkToPinboardBookmark(
  post: TPinboardApiBookmark,
  user: string,
  dateRetrieved: string | Date,
): PinboardBookmark {
  return new PinboardBookmark({
    uri: post.href,
    user,
    title: post.description,
    dateRetrieved:
      dateRetrieved instanceof Date ? dateRetrieved : new Date(dateRetrieved),
    dateBookmarked: new Date(post.time),
    extendedDescription: post.extended,
    tags: emptyTagsArrayToEmptyArray(post.tags.split(' ')),
    metaChangeDetection: post.meta,
    hash: post.hash,
    shared: post.shared === 'yes',
    toread: post.toread === 'yes',
  });
}

/* Convert a TPinboardApiBookmarkResult to an array of real PinboardBookmark objects
 */
export function TPinboardApiBookmarkResultToPinboardBookmarkArr(
  apiResult: TPinboardApiBookmarkResult,
): Array<PinboardBookmark> {
  const bookmarks = apiResult.posts.map((post) =>
    TPinboardApiBookmarkToPinboardBookmark(
      post,
      apiResult.user,
      apiResult.date,
    ),
  );
  console.log(
    `TPinboardApiBookmarkResultToPinboardBookmarkArr(): bookmarks: ${bookmarks}`,
  );
  return bookmarks;
}
