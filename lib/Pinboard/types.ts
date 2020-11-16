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
  getJson(endpoint: string, query?: object): Promise<any>;

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
    tags?: string[];
    dt?: string;
    replace?: YesOrNo;
    shared?: YesOrNo;
    toread?: boolean;
  }): Promise<any>;
  delete(params: {url: string}): Promise<any>;
  get(params: {
    tag?: string;
    dt?: string;
    url?: string;
    meta?: string;
  }): Promise<any>;
  dates(params: {tag?: string[]}): Promise<any>;
  recent(params: {tag?: string[]}): Promise<any>;
  all(params: {
    tag?: string;
    start?: string;
    results?: string;
    fromdt?: string;
    meta?: string;
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
  recent(count: number): Promise<any>;
  popular(count: number): Promise<any>;
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
  getJsonPublic(endpoint: string, query?: object): Promise<any>;
  getJsonSecret(endpoint: string, query?: object): Promise<any>;
  unauthenticated: IPinboardFeedsUnauthenticated;
  authenticated: IPinboardFeedsAuthenticated;
}
