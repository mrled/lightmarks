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
