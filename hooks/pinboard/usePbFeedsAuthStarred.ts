/* Feed of the user's own bookmarks which they've starred
 */

import {usePbFeedsUnauthenticatedQuery} from './usePbFeeds';

const usePbFeedsAuthStarred = (params: {count?: number}) => {
  return usePbFeedsUnauthenticatedQuery<any>('starred', {
    count: params.count,
  });
};

export default usePbFeedsAuthStarred;
