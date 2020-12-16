/* Returns all bookmarks in the user's account.
 */

import {AppConfigurationContext} from 'hooks/useAppConfiguration';
import {
  OneToThreeStrings,
  TPinboardApiBookmark,
  TPinboardApiBookmarkToPinboardBookmark,
  YesOrNo,
} from 'lib/Pinboard/types';
import ProcessedQueryResult from 'lib/ProcessedQueryResult';
import {useContext} from 'react';
import {usePbApiQuery} from './usePbApi';

const usePbApiPostsAll = (params?: {
  tag?: OneToThreeStrings;
  start?: number;
  results?: number;
  fromdt?: string;
  todt?: string;
  meta?: YesOrNo;
}) => {
  const result = usePbApiQuery<TPinboardApiBookmark[]>(
    'posts/all',
    'apiPostsAll',
    params || {},
  );

  // Note that unlike other posts/ endpoints,
  // this endpoint gets a list of TPinboardApiBookmark objects,
  // NOT wrapped in a TPinboardApiBookmarkResult object.
  const dateRetrieved = new Date();
  const {apiAuthTokenCredential} = useContext(AppConfigurationContext);
  const username = apiAuthTokenCredential?.username || '(NONE)';
  const result2bookmarks = (bookmarks: TPinboardApiBookmark[]) =>
    bookmarks.map((bookmark) =>
      TPinboardApiBookmarkToPinboardBookmark(bookmark, username, dateRetrieved),
    );

  return new ProcessedQueryResult(result, result2bookmarks(result.data || []));
};

export default usePbApiPostsAll;
