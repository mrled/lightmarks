/* The most recent time any bookmark was added, updated or deleted.
 */
import {TPinboardApiPostsUpdateResult} from 'lib/Pinboard/types';
import ProcessedQueryResult from 'lib/ProcessedQueryResult';
import {usePbApiQuery} from './usePbApi';

const usePbApiPostsUpdate = () => {
  const result = usePbApiQuery<TPinboardApiPostsUpdateResult>(
    'posts/update',
    {},
  );
  const updateTime = result.data
    ? new Date(result.data.update_time)
    : undefined;
  return new ProcessedQueryResult(result, updateTime);
};

export default usePbApiPostsUpdate;
