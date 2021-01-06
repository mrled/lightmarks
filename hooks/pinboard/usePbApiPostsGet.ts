import {
  OneToThreeStrings,
  TPinboardApiBookmarkResult,
  TPinboardApiBookmarkResultToPinboardBookmarkArr,
  YesOrNo,
} from 'lib/Pinboard/types';
import ProcessedQueryResult from 'lib/ProcessedQueryResult';
import {usePbApiQuery} from './usePbApi';

/* Returns one or more posts on a single day matching the arguments.
 * If no date or url is given, date of most recent bookmark will be used.
 */
const usePbApiPostsGet = (params?: {
  tag?: OneToThreeStrings;
  dt?: string;
  url?: string;
  meta?: YesOrNo;
}) => {
  const result = usePbApiQuery<TPinboardApiBookmarkResult>(
    'posts/get',
    params || {},
  );

  return new ProcessedQueryResult(
    result,
    TPinboardApiBookmarkResultToPinboardBookmarkArr(result.data),
  );
};

export default usePbApiPostsGet;
