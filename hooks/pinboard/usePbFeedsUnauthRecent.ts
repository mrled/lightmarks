/* Feed of most recent public bookmarks
 */

import {
  TPinboardFeedsBookmark,
  TPinboardFeedsBookmarkListToPinboardBookmarkList,
} from 'lib/Pinboard/types';
import ProcessedQueryResult from 'lib/ProcessedQueryResult';
import {usePbFeedsUnauthenticatedQuery} from './usePbFeeds';

const usePbFeedsUnauthRecent = (params: {count?: number}) => {
  const result = usePbFeedsUnauthenticatedQuery<TPinboardFeedsBookmark[]>(
    'recent',
    params,
  );
  return new ProcessedQueryResult(
    result,
    TPinboardFeedsBookmarkListToPinboardBookmarkList(result.data),
  );
};

export default usePbFeedsUnauthRecent;
