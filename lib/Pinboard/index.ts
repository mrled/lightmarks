/* Pinboard API
 */

import {PinboardApi} from './api';
import {PinboardFeeds} from './feeds';

/* Are we running in production?
 */
export enum PinboardMode {
  Mock,
  Production,
}

export type YesOrNo = 'yes' | 'no';

export class Pinboard {
  public api: PinboardApi;
  public feeds: PinboardFeeds;

  public constructor(readonly mode: PinboardMode) {
    this.api = new PinboardApi(this.mode);
    this.feeds = new PinboardFeeds(this.mode);
  }
}
