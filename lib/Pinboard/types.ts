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
function PinboardBookmarkFromTPinboardFeedsBookmark(
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
    return bookmark;
  } catch (err) {
    const msg = [
      'PinboardBookmarkFromTPinboardFeedsBookmark(): Failed to convert PinboardFeedsBookmark (1) to PinboardBookmark because of error: (2):',
      `1) ${JSON.stringify(obj).slice(0, 512)}`,
      `2) ${JSON.stringify(err)}`,
    ].join('\n');
    console.warn(msg);
    throw msg;
  }
}

/* Convert an array of TPinboardFeedsBookmark objects to an array of real PinboardBookmark objects
 */
export function TPinboardFeedsBookmarkListToPinboardBookmarkList(
  arr: TPinboardFeedsBookmark[] | undefined,
): PinboardBookmark[] {
  try {
    const bookmarks = arr?.map((bookmark) => {
      return PinboardBookmarkFromTPinboardFeedsBookmark(bookmark);
    });
    return bookmarks ? bookmarks : [];
  } catch (error) {
    const msg = [
      'TPinboardFeedsBookmarkListToPinboardBookmarkList(): Failed to convert PinboardFeedsBookmark array (1) to PinboardBookmark array because of error: (2):',
      `1) ${JSON.stringify(arr).slice(0, 512)}`,
      `2) ${JSON.stringify(error)}`,
    ].join('\n');
    console.warn(msg);
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
  apiResult: TPinboardApiBookmarkResult | undefined,
): PinboardBookmark[] {
  if (apiResult === undefined) {
    return [];
  }
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

/* Some Pinboard APIs return {"result":"something"}
 */
export type TPinboardResultString = {
  result: string;
};

/* The tags/get endpoint returns a JSON object.
 * The object keys are the tag names, and the values are the number of bookmarks with that tag.
 */
export type TTagsWithCount = {
  [key: string]: number;
};
// export type TTagsWithCount = Record<string, number>;

/* An object representing a single tag and its count
 * The TTagsWithCount type is intended to match the result of the tags/all endpoint,
 * while this class is used by my own code for a single tag name/count pair.
 */
export class TagWithCount {
  public constructor(public tag: string, public count: number) {}
}

/* Convert a TTagsWithCount to a TagWithCount[]
 */
export function TTagsWithCountToTagWithCountArr(
  ttagsWithCount: TTagsWithCount | undefined,
): TagWithCount[] {
  return ttagsWithCount
    ? Object.entries(ttagsWithCount).map(
        ([name, count]) => new TagWithCount(name, count),
      )
    : [];
}
