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

/* Return faux data in a fetch()-like way
 *
 * Consumers can use the returned Promise exactly the same way they could use a Promise from fetch().
 */
export const fauxFetch = (uri: string, fauxData: object): Promise<object> => {
  return new Promise((resolve, reject) => {
    if (fauxData) {
      console.debug(`Returning faux data for URI ${uri}`);
      resolve(fauxData);
    } else {
      reject(`No faux data to return for URI ${uri}`);
    }
  });
};

/* Perform a true fetch or a faux fetch, depending on the mode
 */
export const fetchOrReturnFaux = (
  mode: PinboardMode,
  fauxData: object,
  uri: string,
  headers?: {[key: string]: string},
) => {
  switch (mode) {
    case PinboardMode.Mock:
      return fauxFetch(uri, fauxData);
    case PinboardMode.Production:
      return fetch(uri, {headers}).then((result) => result.json());
  }
};
