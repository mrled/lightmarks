/* Returns one or more posts on a single day matching the arguments.
 * If no date or url is given, date of most recent bookmark will be used.
 */
import {useContext} from 'react';
import {useQuery} from 'react-query';

import {AppConfigurationContext} from 'hooks/useAppConfiguration';
import {rqRateLimitParams} from 'lib/Pinboard';
import {optionalQueryStringWithQmark} from 'lib/Pinboard/util';

import {FauxFeedsAuthenticatedData} from '../../lib/Pinboard/FauxData';
import FakeableFetch from 'lib/FakeableFetch';

/* Take a list of tags and return Pinboard-style tag path components
 *
 * For example:
 *    tagListToComponents(["one", "two", "three"])
 * => "t:one/t:two/t:three"
 */
export const tagListToComponents = (tags: string[]) => {
  return tags.map((t) => `t:${t}`).join('/');
};

const feedsBase = 'https://feeds.pinboard.in/json';

export function usePbFeedsAuthenticatedQuery<ResultType>(
  endpoint: string,
  params: object,
  fauxDataKeyOverride?: string,
) {
  const {apiAuthTokenCredential, feedsTokenSecret, productionMode} = useContext(
    AppConfigurationContext,
  );

  const fauxDataKey =
    fauxDataKeyOverride !== undefined ? fauxDataKeyOverride : endpoint;
  const fauxData = productionMode
    ? undefined
    : FauxFeedsAuthenticatedData[fauxDataKey];

  const qs = optionalQueryStringWithQmark(params);
  const uri = `${feedsBase}/secret:${feedsTokenSecret}/u:${apiAuthTokenCredential?.username}/${endpoint}${qs}`;
  const headers = undefined;

  return useQuery<ResultType>(
    ['PinboardFeedsAuth', endpoint, headers, productionMode, params],
    () => FakeableFetch(uri, headers, fauxData),
    {
      ...rqRateLimitParams(''),
    },
  );
}

export function usePbFeedsUnauthenticatedQuery<ResultType>(
  endpoint: string,
  params: object,
  fauxDataKeyOverride?: string,
) {
  const {productionMode} = useContext(AppConfigurationContext);

  const fauxDataKey =
    fauxDataKeyOverride !== undefined ? fauxDataKeyOverride : endpoint;
  const fauxData = productionMode
    ? undefined
    : FauxFeedsAuthenticatedData[fauxDataKey];

  const qs = optionalQueryStringWithQmark(params);
  const uri = `${feedsBase}/${endpoint}${qs}`;
  const headers = undefined;

  return useQuery<ResultType>(
    ['PinboardFeedsNoAuth', endpoint, headers, productionMode, params],
    () => FakeableFetch(uri, headers, fauxData),
    {
      ...rqRateLimitParams(''),
    },
  );
}
