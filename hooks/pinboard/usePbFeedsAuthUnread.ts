/* Feed of user's own bookmarks that are marked as to read
 */

import {usePbFeedsUnauthenticatedQuery} from './usePbFeeds';

const usePbFeedsAuthUnread = (params: {count?: number}) => {
  return usePbFeedsUnauthenticatedQuery<any>('unread', {
    count: params.count,
  });
};

export default usePbFeedsAuthUnread;
