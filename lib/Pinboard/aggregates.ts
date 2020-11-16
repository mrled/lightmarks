/* Aggregates: Doing something nice by combining multiple API calls
 */

import {IPinboard, IPinboardAggregates} from './types';

export class PinboardAggregates implements IPinboardAggregates {
  constructor(readonly pinboard: IPinboard) {}
}
