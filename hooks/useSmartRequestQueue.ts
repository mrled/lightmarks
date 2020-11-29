import FakeableFetch from 'lib/FakeableFetch';
import {createContext, useState} from 'react';

import Queue from 'smart-request-balancer';

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
 * setDefaultQueueKey: Set the default smart request queue key. Params:
 *    newQueueKey: The new default queue key for the smart request queue
 * setQueueConfig: Creates a new queue with the provided configuration. Params:
 *    config: The new smart request queue config
 */
type SmartRequestQueueContextType = {
  // enqueue: (
  //   queuename: string,
  //   uri: string,
  //   headers: {[key: string]: string} | undefined,
  //   fauxdata: object | undefined,
  //   queuekey?: string,
  // ) => Promise<any>;
  enqueueFactory: (
    queueName: string,
    uri: string,
    headers: {[key: string]: string} | undefined,
    fauxData: object | undefined,
    queueKey?: string,
  ) => () => Promise<any>;
  queue: Queue;
  // setDefaultQueueKey: (newQueueKey: string) => void;
  // setQueueConfig: (config: object) => void;
};
export const SmartRequestQueueContext = createContext<SmartRequestQueueContextType>(
  {
    // enqueue: (_qn, _u, _f, _h, _k?) => {
    //   throw 'Trying to use default SmartRequestQueueContext';
    // },
    enqueueFactory: (_qn, _u, _f, _h, _k?) => {
      throw 'Trying to use default SmartRequestQueueContext';
    },
    queue: new Queue({}),
    // setDefaultQueueKey: (_n) => {
    //   throw 'Trying to use default SmartRequestQueueContext';
    // },
    // setQueueConfig: (_config) => {
    //   throw 'Trying to use default SmartRequestQueueContext';
    // },
  },
);

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

export function useSmartRequestQueue() {
  const [queue, setQueue] = useState(new Queue({}));
  const [defaultQueueKey, setDefaultQueueKey] = useState('');

  function setQueueConfig(config: object): void {
    setQueue(new Queue(config));
  }

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
    setDefaultQueueKey,
    setQueueConfig,
  };
}
