import {PinboardAggregates} from './aggregates';
import {PinboardApi} from './api';
import {PinboardFeeds} from './feeds';
import {
  IPinboard,
  IPinboardAggregates,
  IPinboardApi,
  IPinboardAuth,
  IPinboardFeeds,
  PinboardApiPasswordCredential,
  PinboardApiTokenSecretCredential,
  IPinboardCredential,
  PinboardFeedsRssSecretCredential,
  PinboardMode,
  isApiTokenSecretCredential,
  Fetcher,
} from './types';

/* Container for authentication-related tasks
 */
export class PinboardAuth implements IPinboardAuth {
  constructor(readonly pinboard: IPinboard) {}

  /* Get Pinboard token secret.
   * Requires existing username/password credential for the Pinboard API.
   */
  public apiTokenLogin(): Promise<any> {
    if (this.pinboard.apiCredential === undefined) {
      return new Promise((_resolve, reject) =>
        reject(
          'Cannot retrieve API token secret credential without API password credential',
        ),
      );
    } else if (isApiTokenSecretCredential(this.pinboard.apiCredential)) {
      return new Promise((_resolve, reject) =>
        reject('Already logged in with API credential'),
      );
    }
    const username = this.pinboard.apiCredential.username;

    return this.pinboard.api.user
      .apiToken()
      .then((result: any) => {
        const credential = {
          username,
          authTokenSecret: result.result,
          rssSecret: this.pinboard.feedsCredential
            ? this.pinboard.feedsCredential.rssSecret
            : undefined,
        };
        return new Pinboard(
          this.pinboard.fetcher,
          this.pinboard.mode,
          credential,
        );
      })
      .catch((err) => {
        console.error(
          `Failed to get Pinboard API token secret credential: ${err}`,
        );
        throw err;
      });
  }

  /* Get RSS secret for authenticated feeds on PinboardFeeds
   * Requires existing username/password or username/token secret credentials for the Pinboard API.
   */
  public feedsLogin(force = false): Promise<any> {
    if (this.pinboard.feedsCredential && !force) {
      return new Promise((_resolve, reject) =>
        reject('Already logged in with feeds credential'),
      );
    } else if (!this.pinboard.apiCredential) {
      return new Promise((_resolve, reject) =>
        reject('Cannot retrieve feeds credential without API credential'),
      );
    }
    const apiCredential = this.pinboard.apiCredential;
    return this.pinboard.api.user
      .secret()
      .then((result: any) => {
        const credential = Object.assign({}, apiCredential, {
          rssSecret: result.result,
        });
        return new Pinboard(
          this.pinboard.fetcher,
          this.pinboard.mode,
          credential,
        );
      })
      .catch((err) =>
        console.error(`Failed to get Pinboard RSS secret: ${err}`),
      );
  }
}

/* Container for interacting with all of Pinboard.
 * Includes authentication, the official API, and JSON feeds.
 */
export class Pinboard implements IPinboard {
  public readonly api: IPinboardApi;
  public readonly feeds: IPinboardFeeds;
  public readonly aggregates: IPinboardAggregates;
  public readonly auth: IPinboardAuth;
  public readonly apiCredential?:
    | PinboardApiPasswordCredential
    | PinboardApiTokenSecretCredential;
  public readonly feedsCredential?: PinboardFeedsRssSecretCredential;

  public constructor(
    readonly fetcher: Fetcher,
    readonly mode: PinboardMode,
    readonly credential?: IPinboardCredential,
  ) {
    this.auth = new PinboardAuth(this);
    console.debug(
      `Pinboard(): Pinboard credential: ${JSON.stringify(credential)}`,
    );
    if (credential !== undefined) {
      if (credential.authTokenSecret !== undefined) {
        console.debug('Pinboard(): Using API token secret credential');
        this.apiCredential = {
          username: credential.username,
          authTokenSecret: credential.authTokenSecret,
        };
      } else if (credential.password !== undefined) {
        console.debug('Pinboard(): Using API password credential');
        this.apiCredential = {
          username: credential.username,
          password: credential.password,
        };
      } else {
        console.debug('Pinboard(): No credential for the API');
      }
      if (credential.rssSecret !== undefined) {
        console.debug('Pinboard(): Using feeds secret credential');
        this.feedsCredential = {
          username: credential.username,
          rssSecret: credential.rssSecret,
        };
      } else {
        console.debug('Pinboard(): No credential for feeds');
      }
    } else {
      console.debug('Pinboard(): Created Pinboard with undefined credential');
    }

    this.api = new PinboardApi(fetcher, this.mode, this.apiCredential);
    this.feeds = new PinboardFeeds(fetcher, this.mode, this.feedsCredential);
    this.aggregates = new PinboardAggregates(this);
  }
}
