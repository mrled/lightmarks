/* Feed of user's own bookmarks that have no tags
 */

import {usePbFeedsUnauthenticatedQuery} from './usePbFeeds';

const usePbFeedsAuthUntagged = (params: {count?: number}) => {
  return usePbFeedsUnauthenticatedQuery<any>('untagged', {
    count: params.count,
  });
};

export default usePbFeedsAuthUntagged;
