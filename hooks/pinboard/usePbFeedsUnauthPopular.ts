/* Feed of most popular public bookmarks
 */

import {
  TPinboardFeedsBookmark,
  TPinboardFeedsBookmarkListToPinboardBookmarkList,
} from 'lib/Pinboard/types';
import ProcessedQueryResult from 'lib/ProcessedQueryResult';
import {usePbFeedsUnauthenticatedQuery} from './usePbFeeds';

const usePbFeedsUnauthPopular = (params: {count?: number}) => {
  const result = usePbFeedsUnauthenticatedQuery<TPinboardFeedsBookmark[]>(
    'popular',
    params,
  );
  return new ProcessedQueryResult(
    result,
    TPinboardFeedsBookmarkListToPinboardBookmarkList(result.data),
  );
};

export default usePbFeedsUnauthPopular;
