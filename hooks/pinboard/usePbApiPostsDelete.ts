/* Delete a bookmark.
 */
import {usePbApiMutation} from './usePbApi';

const usePbApiPostsDelete = (params: {url: string}) => {
  const result = usePbApiMutation<any>('posts/delete', 'common', params);
  return result;
};

export default usePbApiPostsDelete;
