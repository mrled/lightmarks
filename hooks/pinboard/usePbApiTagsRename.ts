/* Delete a bookmark.
 */
import {usePbApiMutation} from './usePbApi';

const usePbApiTagsDelete = (params: {old: string; new: string}) => {
  const result = usePbApiMutation<any>('tags/rename', params);
  return result;
};

export default usePbApiTagsDelete;
