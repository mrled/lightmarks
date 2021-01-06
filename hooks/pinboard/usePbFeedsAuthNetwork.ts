/* Feed of bookmarks in the user's network
 */

import {usePbFeedsUnauthenticatedQuery} from './usePbFeeds';

const usePbFeedsAuthNetwork = (params: {count?: number}) => {
  return usePbFeedsUnauthenticatedQuery<any>('network', {
    count: params.count,
  });
};

export default usePbFeedsAuthNetwork;
