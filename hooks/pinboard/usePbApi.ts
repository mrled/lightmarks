/* Returns one or more posts on a single day matching the arguments.
 * If no date or url is given, date of most recent bookmark will be used.
 */
import {useContext} from 'react';
import {useMutation, useQuery} from 'react-query';

import {AppConfigurationContext} from 'hooks/useAppConfiguration';
import {
  optionalQueryStringWithQmark,
  rqRateLimitParams,
} from 'lib/Pinboard/util';

import {FauxApiData} from '../../lib/Pinboard/FauxData';
import FakeableFetch from 'lib/FakeableFetch';

/* Common tasks that are needed for both usePbApiQuery and usePbApiMutation
 */
function usePbApiSetup(
  endpoint: string,
  params: object,
  fauxDataKeyOverride?: string,
) {
  const {apiAuthTokenCredential, productionMode} = useContext(
    AppConfigurationContext,
  );

  const fauxDataKey =
    fauxDataKeyOverride !== undefined ? fauxDataKeyOverride : endpoint;
  const fauxData = productionMode ? undefined : FauxApiData[fauxDataKey];

  const authToken = `${apiAuthTokenCredential?.username}:${apiAuthTokenCredential?.password}`;
  const uriParams = {
    auth_token: authToken,
    format: 'json',
    ...params,
  };
  const qs = optionalQueryStringWithQmark(uriParams);
  const uri = `https://api.pinboard.in/v1/${endpoint}${qs}`;
  const headers = undefined;

  return {productionMode, uri, headers, fauxData};
}

export function usePbApiQuery<ResultType>(
  endpoint: string,
  params: object,
  fauxDataKeyOverride?: string,
) {
  const {productionMode, uri, headers, fauxData} = usePbApiSetup(
    endpoint,
    params,
    fauxDataKeyOverride,
  );
  return useQuery<ResultType>(
    ['PinboardApi', endpoint, headers, productionMode, params],
    () => FakeableFetch(uri, headers, fauxData),
    {
      ...rqRateLimitParams(endpoint),
    },
  );
}

export function usePbApiMutation<ResultType>(
  endpoint: string,
  params: object,
  fauxDataKeyOverride?: string,
) {
  const {uri, headers, fauxData} = usePbApiSetup(
    endpoint,
    params,
    fauxDataKeyOverride,
  );
  return useMutation<ResultType>(() => FakeableFetch(uri, headers, fauxData));
}
