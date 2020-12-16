/* Returns a list of dates with the number of posts at each date.
 */

import {
  OneToThreeStrings,
  TPinboardApiBookmarkResult,
  TPinboardApiBookmarkResultToPinboardBookmarkArr,
} from 'lib/Pinboard/types';
import ProcessedQueryResult from 'lib/ProcessedQueryResult';
import {usePbApiQuery} from './usePbApi';

const usePbApiPostsDates = (params: {tag?: OneToThreeStrings}) => {
  const result = usePbApiQuery<TPinboardApiBookmarkResult>(
    'posts/dates',
    'apiPostsDates',
    params,
  );

  return new ProcessedQueryResult(
    result,
    TPinboardApiBookmarkResultToPinboardBookmarkArr(result.data),
  );
};

export default usePbApiPostsDates;
