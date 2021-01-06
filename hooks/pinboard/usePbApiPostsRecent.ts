import {
  OneToThreeStrings,
  TPinboardApiBookmarkResult,
  TPinboardApiBookmarkResultToPinboardBookmarkArr,
} from 'lib/Pinboard/types';
import ProcessedQueryResult from 'lib/ProcessedQueryResult';
import {usePbApiQuery} from './usePbApi';

/* Returns one or more posts on a single day matching the arguments.
 * If no date or url is given, date of most recent bookmark will be used.
 */
const usePbApiPostsRecent = (params?: {
  tag?: OneToThreeStrings;
  count?: number;
}) => {
  const result = usePbApiQuery<TPinboardApiBookmarkResult>(
    'posts/recent',
    params || {},
  );

  return new ProcessedQueryResult(
    result,
    TPinboardApiBookmarkResultToPinboardBookmarkArr(result.data),
  );
};

export default usePbApiPostsRecent;
