/* Returns one or more posts on a single day matching the arguments.
 * If no date or url is given, date of most recent bookmark will be used.
 */
import {useContext} from 'react';
import {useQuery} from 'react-query';

import {AppConfigurationContext} from 'hooks/useAppConfiguration';
import {
  SmartRequestQueueContext,
  useSmartRequestQueueByContext,
} from 'hooks/useSmartRequestQueue';
import {optionalQueryStringWithQmark} from 'lib/Pinboard/util';

import {FauxFeedsAuthenticatedData} from '../../lib/Pinboard/FauxData';

/* Take a list of tags and return Pinboard-style tag path components
 *
 * For example:
 *    tagListToComponents(["one", "two", "three"])
 * => "t:one/t:two/t:three"
 */
export const tagListToComponents = (tags: string[]) => {
  return tags.map((t) => `t:${t}`).join('/');
};

export function usePbFeedsAuthenticatedQuery<ResultType>(
  endpoint: string,
  queueName: string,
  params: object,
  fauxDataKeyOverride?: string,
  onSuccess?: (data: ResultType) => any,
) {
  const {apiAuthTokenCredential, feedsTokenSecret, productionMode} = useContext(
    AppConfigurationContext,
  );
  const {enqueue} = useSmartRequestQueueByContext(SmartRequestQueueContext);

  const fauxDataKey =
    fauxDataKeyOverride !== undefined ? fauxDataKeyOverride : endpoint;
  const fauxData = productionMode
    ? undefined
    : FauxFeedsAuthenticatedData[fauxDataKey];

  const qs = optionalQueryStringWithQmark(params);
  const uri = `https://feeds.pinboard.in/json/secret:${feedsTokenSecret}/u:${apiAuthTokenCredential?.username}/${endpoint}${qs}`;
  const headers = undefined;

  let useQueryParams: any = {};
  if (onSuccess !== undefined) {
    useQueryParams.onSuccess = onSuccess;
  }
  return useQuery<ResultType>(
    ['PinboardFeedsAuth', endpoint, queueName, headers, productionMode, params],
    () => enqueue(queueName, uri, headers, fauxData),
    useQueryParams,
  );
}

export function usePbFeedsUnauthenticatedQuery<ResultType>(
  endpoint: string,
  queueName: string,
  params: object,
  fauxDataKeyOverride?: string,
  onSuccess?: (data: ResultType) => any,
) {
  const {productionMode} = useContext(AppConfigurationContext);
  const {enqueue} = useSmartRequestQueueByContext(SmartRequestQueueContext);

  const fauxDataKey =
    fauxDataKeyOverride !== undefined ? fauxDataKeyOverride : endpoint;
  const fauxData = productionMode
    ? undefined
    : FauxFeedsAuthenticatedData[fauxDataKey];

  const qs = optionalQueryStringWithQmark(params);
  const uri = `https://feeds.pinboard.in/json/${endpoint}${qs}`;
  const headers = undefined;

  let useQueryParams: any = {};
  if (onSuccess !== undefined) {
    useQueryParams.onSuccess = onSuccess;
  }
  return useQuery<ResultType>(
    [
      'PinboardFeedsNoAuth',
      endpoint,
      queueName,
      headers,
      productionMode,
      params,
    ],
    () => enqueue(queueName, uri, headers, fauxData),
    useQueryParams,
  );
}
