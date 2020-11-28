import Queue from 'smart-request-balancer';
import {stringify} from 'querystring';

import {PinboardMode} from './types';

/* Return a query string with leading question mark,
 * unless the query parameter is empty, in which case return an empty string
 */
export const optionalQueryStringWithQmark = (
  query: object | undefined,
): string => {
  if (typeof query === 'undefined') {
    return '';
  }
  const queryString = stringify(Object.assign({}, query));
  return queryString ? `?${queryString}` : '';
};

interface IFetchResult {
  ok: boolean;
  status: number;
  json(): object;
}

// Brutish, vulgar way to enable fetch logging its results
// TODO: use betterpins.settings.json or an in-app toggle for this
const ENABLE_FETCH_LOGGING = true;
// const FETCH_LOGGING_CHAR_LIMIT = 512;
const FETCH_LOGGING_CHAR_LIMIT = Number.MAX_SAFE_INTEGER;
function stupidLogger(msg: string): void {
  if (ENABLE_FETCH_LOGGING) {
    console.debug(msg.slice(0, FETCH_LOGGING_CHAR_LIMIT));
  }
}

/* Return faux data in a fetch()-like way
 *
 * Consumers can use the returned Promise exactly the same way they could use a Promise from fetch().
 */
function fauxFetch(uri: string, fauxData: object): Promise<IFetchResult> {
  return new Promise((resolve, reject) => {
    if (fauxData && fauxData !== {}) {
      const fauxDataPrettyPrinted = JSON.stringify(fauxData, null, '  ');
      stupidLogger(
        `fauxFetch(): Returning faux data of type ${typeof fauxData} for URI ${uri}:\n${JSON.stringify(
          fauxDataPrettyPrinted,
        )}`,
      );
      resolve({ok: true, status: 200, json: () => fauxData});
    } else {
      const msg = `No faux data to return for URI ${uri}`;
      console.error(`fauxFetch(): ${msg}`);
      reject(msg);
    }
  });
}

/* Perform a true fetch or a faux fetch, depending on the mode
 */
export function fetchOrReturnFaux(
  mode: PinboardMode,
  fauxData: object,
  uri: string,
  headers?: {[key: string]: string},
): Promise<any> {
  const fetchImplementation =
    mode === PinboardMode.Production
      ? () => fetch(uri, {headers})
      : () => fauxFetch(uri, fauxData);
  return fetchImplementation()
    .then((result) => {
      stupidLogger(
        `fetchOrReturnFaux() result: ${JSON.stringify(
          result,
          undefined,
          '  ',
        )}`,
      );
      return result;
    })
    .then((result) => result.json())
    .then((jsonResult) => {
      stupidLogger(
        `fetchOrReturnFaux() jsonResult: ${JSON.stringify(
          jsonResult,
          undefined,
          '  ',
        )}`,
      );
      return jsonResult;
    })
    .catch((err) => {
      console.error(`fetchOrReturnFaux() error: ${err}`);
      throw err;
    });
}

/* Break out the queue configuration so we can reference it later
 */
const queueConfig = {
  rules: {
    // Default queue: one request every 3 seconds
    common: {
      rate: 1,
      limit: 3,
      priority: 1,
    },
    // API's posts/recent call is more stringent: one request every minute
    apiPostsRecent: {
      rate: 1,
      limit: 60,
      priority: 1,
    },
    // API's posts/all call is still more stringent: one post every 5 minutes
    apiPostsAll: {
      rate: 1,
      limit: 300,
      priority: 1,
    },
  },
  retryTime: 9,
};

/* A smart-request-balancer queue.
 * We use this to conform with the Pinboard API's rate limits
 */
const queue = new Queue(queueConfig);

/* A QueueName must be the name of an existing queue, defined in the queueConfig object
 */
export type QueueName = keyof typeof queueConfig.rules;
type RetryFunction = (delaySecs?: number) => void;

export function queuedFetchOrReturnFaux(
  queueName: QueueName,
  mode: PinboardMode,
  fauxData: object,
  uri: string,
  headers?: {[key: string]: string},
): Promise<any> {
  /* The queue key is always the same.
   * smart-request-balancer was designed to have keyed queues,
   * where you can e.g. send X messages per second per user.
   * In this example, you might use the username as the key.
   * The Pinboard API doesn't have keyed queues, so we use a constant for the key.
   */
  const queueKey = 'PinboardQueueKey';

  /* The request function tries to get data, and must handle retries
   */
  const requestor = (retryFn: RetryFunction) =>
    fetchOrReturnFaux(mode, fauxData, uri, headers)
      .then((result) => {
        console.log(
          `fetchOrReturnFaux(): retryFn(): raw result: ${JSON.stringify(
            result,
          )}`,
        );
        return result;
      })
      .catch((error) => {
        if (error.response.status === 429) {
          return retryFn(error.response.data.parameters.retry_after * 2);
        }
      });

  return queue
    .request(requestor, queueKey, queueName)
    .then((response) => {
      console.log(
        `queuedFetchOrReturnFaux(): Returning response: ${JSON.stringify(
          response,
        )}`,
      );
      return response;
    })
    .catch((error) => {
      console.error(`queuedFetchOrReturnFaux(): error: ${error}`);
      throw error;
    });
}
