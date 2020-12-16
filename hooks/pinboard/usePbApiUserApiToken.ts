/* Returns the secret part of the user's API token
 * (for making API calls without a password)
 */

import {usePbApiQuery} from './usePbApi';

const usePbApiTagsGet = () => {
  return usePbApiQuery<any>('user/api_token', 'common', {});
};

export default usePbApiTagsGet;
