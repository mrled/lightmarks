import FakeableFetch from 'lib/FakeableFetch';
import {createContext, useContext, useState} from 'react';

import Queue from 'smart-request-balancer';

/* The queue key is always the same.
 * smart-request-balancer was designed to have keyed queues,
 * where you can e.g. send X messages per second per user.
 * In this example, you might use the username as the key.
 * The Pinboard API doesn't have keyed queues, so we use a constant for the key.
 */
const defaultQueueKey = 'PinboardQueueKey';

/* Configure the smart request queue
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

/* The React context contains an enqueueFactory and the queue itself.
 * See hook documentation for more details.
 */
type SmartRequestQueueContextType = {
  enqueue: (
    queueName: string,
    uri: string,
    headers: {[key: string]: string} | undefined,
    fauxData: object | undefined,
    queueKey?: string,
  ) => Promise<any>;
  enqueueFactory: (
    queueName: string,
    uri: string,
    headers: {[key: string]: string} | undefined,
    fauxData: object | undefined,
    queueKey?: string,
  ) => () => Promise<any>;
  queue: Queue;
};
export const SmartRequestQueueContext = createContext<
  SmartRequestQueueContextType | undefined
>(undefined);

/* Pure-ish function to enqueue a request
 */
function pureEnqueue(
  queue: Queue,
  queueKey: string,
  queueName: string,
  uri: string,
  headers: {[key: string]: string} | undefined,
  fauxData: object | undefined,
): Promise<any> {
  const requestor = (retryFn: RetryFunction) => {
    return FakeableFetch(uri, headers, fauxData)
      .then((result) => {
        console.log(
          `pureEnqueue(): retryFn(): raw result: ${JSON.stringify(result)}`,
        );
        return result;
      })
      .catch((error) => {
        if (error.response.status === 429) {
          return retryFn(error.response.data.parameters.retry_after * 2);
        }
      });
  };

  return queue
    .request(requestor, queueKey, queueName)
    .then((response) => {
      console.log(
        `pureEnqueue(): Returning response: ${JSON.stringify(response)}`,
      );
      return response;
    })
    .catch((error) => {
      console.warn(`pureEnqueue(): error: ${error}`);
      throw error;
    });
}

/* A retry function retries the request after a variable delay
 */
type RetryFunction = (delaySecs?: number) => void;

/* The smart request queue context result
 *
 * enqueue: Adds a request to the queue. Params:
 *    queueName: The name of the queue (must be present in the queue config)
 *    uri: The URI to fetch
 *    headers: Headers to pass with the request
 *    fauxData: If present, will return this data back instead of making a network request
 *    queueKey: If present, will use this smart request queue key (rather than the default)
 * enqueueFactory: Returns a function that will enqueue a request.
 *    Intended for use as a query function with React Query.
 *    Params are the same as those for enqueue.
 * queue: The smart request queue
 */
export function useSmartRequestQueue() {
  const [queue] = useState(new Queue(queueConfig));

  function enqueue(
    queueName: string,
    uri: string,
    headers: {[key: string]: string} | undefined,
    fauxData: object | undefined,
    queueKey?: string,
  ): Promise<any> {
    const usingQueueKey = queueKey ? queueKey : defaultQueueKey;
    return pureEnqueue(queue, usingQueueKey, queueName, uri, headers, fauxData);
  }

  function enqueueFactory(
    queueName: string,
    uri: string,
    headers: {[key: string]: string} | undefined,
    fauxData: object | undefined,
    queueKey?: string,
  ): () => Promise<any> {
    return () => enqueue(queueName, uri, headers, fauxData, queueKey);
  }

  return {
    enqueue,
    enqueueFactory,
    queue,
  };
}

/* A nice wrapper function to avoid some boilerplate for all consumers
 */
export function useSmartRequestQueueByContext(
  context: React.Context<SmartRequestQueueContextType | undefined>,
) {
  if (context === undefined) {
    throw 'Context is undefined';
  }
  const smartReqQueue = useContext(context);
  if (smartReqQueue === undefined) {
    throw 'useContext(SmartRequestQueueContext) returning undefined';
  }
  return smartReqQueue;
}
