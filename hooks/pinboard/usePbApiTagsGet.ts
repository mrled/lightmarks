/* Returns one or more posts on a single day matching the arguments.
 * If no date or url is given, date of most recent bookmark will be used.
 */
import {TTagsWithCount} from 'lib/Pinboard/types';
import {usePbApiQuery} from './usePbApi';

const usePbApiTagsGet = () => {
  return usePbApiQuery<TTagsWithCount>('tags/get', 'common', {});
};

export default usePbApiTagsGet;
