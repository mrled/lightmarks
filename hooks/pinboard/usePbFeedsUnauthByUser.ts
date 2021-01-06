/* Feed of public bookmarks from the passed user
 */

import {OneToThreeStrings, TPinboardFeedsBookmark} from 'lib/Pinboard/types';
import {
  tagListToComponents,
  usePbFeedsUnauthenticatedQuery,
} from './usePbFeeds';

const usePbFeedsUnauthByUser = (params: {
  user: string;
  tags?: OneToThreeStrings;
  count?: number;
}) => {
  const tagsComponent = params.tags
    ? `/${tagListToComponents(params.tags)}`
    : '';
  const endpoint = `u:${params.user}${tagsComponent}/`;
  return usePbFeedsUnauthenticatedQuery<TPinboardFeedsBookmark[]>(endpoint, {
    count: params.count,
  });
};

export default usePbFeedsUnauthByUser;
