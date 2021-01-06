/* Returns the user's secret RSS key (for viewing private feeds)
 */
import {TPinboardResultString} from 'lib/Pinboard/types';
import {usePbApiQuery} from './usePbApi';

const usePbApiTagsGet = () => {
  return usePbApiQuery<TPinboardResultString>('user/secret', {});
};

export default usePbApiTagsGet;
