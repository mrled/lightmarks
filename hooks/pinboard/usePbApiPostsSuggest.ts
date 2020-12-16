/* Returns a list of popular tags and recommended tags for a given URL.
 * Popular tags are tags used site-wide for the url; recommended tags are drawn from the user's own tags.
 */
import {TPinboardApiBookmarkResult} from 'lib/Pinboard/types';
import {usePbApiQuery} from './usePbApi';

const usePbApiPostsSuggest = (params: {url: string}) => {
  const result = usePbApiQuery<TPinboardApiBookmarkResult>(
    'posts/suggest',
    'common',
    params,
  );
  // return new ProcessedQueryResult(
  //   result,
  //   TPinboardApiBookmarkResultToPinboardBookmarkArr(result.data),
  // );
  return result;
};

export default usePbApiPostsSuggest;
