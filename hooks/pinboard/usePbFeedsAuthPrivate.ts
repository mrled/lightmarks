/* Feed of user's own bookmarks that are marked as private
 */

import {usePbFeedsUnauthenticatedQuery} from './usePbFeeds';

const usePbFeedsAuthNetwork = (params: {count?: number}) => {
  return usePbFeedsUnauthenticatedQuery<any>('secret', 'common', {
    count: params.count,
  });
};

export default usePbFeedsAuthNetwork;
