/* Aggregates: Doing something nice by combining multiple API calls
 */

import {Pinboard} from './index';

export class PinboardAggregates {
  constructor(readonly pinboard: Pinboard) {}

  public apiTokenLogin(username: string, password: string, force = false) {
    if (this.pinboard.api.authToken && !force) {
      return true;
    }
    this.pinboard.api.username = username;
    this.pinboard.api.password = password;
    this.pinboard.api.user
      .apiToken()
      .then(
        (result: any) => (this.pinboard.api.authTokenSecret = result.result),
      );
  }

  public feedsLogin(force = false) {
    if (this.pinboard.feeds.rssSecret && !force) {
      return true;
    }
    this.pinboard.api.user
      .secret()
      .then((result: any) => (this.pinboard.feeds.rssSecret = result.result))
      .catch((err) =>
        console.error(`Failed to get Pinboard RSS secret: ${err}`),
      );
  }
}
