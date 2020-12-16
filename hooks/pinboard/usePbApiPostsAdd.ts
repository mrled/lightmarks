/* Add a bookmark.
 */
import {YesOrNo} from 'lib/Pinboard/types';
import {usePbApiMutation} from './usePbApi';

const usePbApiPostsAdd = (params: {
  url: string;
  description: string;
  extended?: string;
  tags?: string[];
  dt?: string;
  replace?: YesOrNo;
  shared?: YesOrNo;
  toread?: YesOrNo;
}) => {
  const result = usePbApiMutation<any>('posts/add', 'common', params);
  console.debug(
    `usePbApiPostsAdd() result data: ${JSON.stringify(result[1].data)}:`,
  );
  return result;
};

export default usePbApiPostsAdd;
