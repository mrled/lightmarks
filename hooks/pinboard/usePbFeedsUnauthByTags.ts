/* Feed of public bookmarks tagged with the provided tags
 */

import {OneToThreeStrings} from 'lib/Pinboard/types';
import {
  tagListToComponents,
  usePbFeedsUnauthenticatedQuery,
} from './usePbFeeds';

const usePbFeedsUnauthByTags = (params: {
  tags: OneToThreeStrings;
  count?: number;
}) => {
  const endpoint = `${tagListToComponents(params.tags)}`;
  return usePbFeedsUnauthenticatedQuery<any>(endpoint, 'common', {
    count: params.count,
  });
};

export default usePbFeedsUnauthByTags;
