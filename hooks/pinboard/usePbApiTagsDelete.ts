/* Delete a bookmark.
 */
import {usePbApiMutation} from './usePbApi';

const usePbApiTagsDelete = (params: {tag: string}) => {
  const result = usePbApiMutation<any>('tags/delete', 'common', params);
  return result;
};

export default usePbApiTagsDelete;
