/* Returns one or more posts on a single day matching the arguments.
 * If no date or url is given, date of most recent bookmark will be used.
 */
import {useContext} from 'react';
import {useMutation, useQuery} from 'react-query';

import {AppConfigurationContext} from 'hooks/useAppConfiguration';
import {
  SmartRequestQueueContext,
  useSmartRequestQueueByContext,
} from 'hooks/useSmartRequestQueue';
import {optionalQueryStringWithQmark} from 'lib/Pinboard/util';

import {FauxApiData} from '../../lib/Pinboard/FauxData';

function usePbApiSetup(
  endpoint: string,
  params: object,
  fauxDataKeyOverride?: string,
) {
  const {apiAuthTokenCredential, productionMode} = useContext(
    AppConfigurationContext,
  );
  const {enqueue} = useSmartRequestQueueByContext(SmartRequestQueueContext);

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

  return {productionMode, uri, headers, enqueue, fauxData};
}

export function usePbApiQuery<ResultType>(
  endpoint: string,
  queueName: string,
  params: object,
  fauxDataKeyOverride?: string,
) {
  const {productionMode, uri, headers, enqueue, fauxData} = usePbApiSetup(
    endpoint,
    params,
    fauxDataKeyOverride,
  );
  return useQuery<ResultType>(
    ['PinboardApi', endpoint, queueName, headers, productionMode, params],
    () => enqueue(queueName, uri, headers, fauxData),
  );
}

export function usePbApiMutation<ResultType>(
  endpoint: string,
  queueName: string,
  params: object,
  fauxDataKeyOverride?: string,
) {
  const {uri, headers, enqueue, fauxData} = usePbApiSetup(
    endpoint,
    params,
    fauxDataKeyOverride,
  );
  const result = useMutation<ResultType>(() =>
    enqueue(queueName, uri, headers, fauxData),
  );
  return result;
}

// /* A backend function for calling the Pinboard API.
//  *
//  * Arguments:
//  *  endpoint: The API endpoint to call, like 'posts/get'
//  *  queueName: The name of the smart queue to use for the query, like 'common'
//  *  params: Query string parameters, like { tags: ['one', 'two'] }
//  *  fauxDataKeyOverride:
//  *    If present, use as a key in FauxApiData.
//  *    Otherwise, use the endpoint.
//  */
// export function usePbApiQuery<ResultType>(
//   endpoint: string,
//   queueName: string,
//   params: object,
//   fauxDataKeyOverride?: string,
// ) {
//   const {productionMode} = useContext(AppConfigurationContext);
//   const {apiAuthTokenCredential} = useContext(AppConfigurationContext);
//   const {enqueue} = useSmartRequestQueueByContext(SmartRequestQueueContext);

//   const fauxDataKey =
//     fauxDataKeyOverride !== undefined ? fauxDataKeyOverride : endpoint;
//   const fauxData = productionMode ? undefined : FauxApiData[fauxDataKey];

//   const authToken = `${apiAuthTokenCredential?.username}:${apiAuthTokenCredential?.password}`;
//   const uriParams = {
//     auth_token: authToken,
//     format: 'json',
//     ...params,
//   };
//   const qs = optionalQueryStringWithQmark(uriParams);
//   const uri = `https://api.pinboard.in/v1/${endpoint}${qs}`;
//   const headers = undefined;
//   return useQuery<ResultType>(
//     ['PinboardApi', endpoint, queueName, headers, productionMode, params],
//     () => enqueue(queueName, uri, headers, fauxData),
//   );
// }

// export function usePbApiMutation<ResultType>(
//   endpoint: string,
//   queueName: string,
//   params: object,
// ) {
//   const {productionMode} = useContext(AppConfigurationContext);
//   const {apiAuthTokenCredential} = useContext(AppConfigurationContext);
//   const {enqueue} = useSmartRequestQueueByContext(SmartRequestQueueContext);

//   const fauxData = productionMode ? undefined : FauxApiData[endpoint];
//   const authToken = `${apiAuthTokenCredential?.username}:${apiAuthTokenCredential?.password}`;
//   const uriParams = {
//     auth_token: authToken,
//     format: 'json',
//     ...params,
//   };
//   const qs = optionalQueryStringWithQmark(uriParams);
//   const uri = `https://api.pinboard.in/v1/${endpoint}${qs}`;
//   const headers = undefined;
//   return useMutation<ResultType>(() =>
//     enqueue(queueName, uri, headers, fauxData),
//   );
// }
