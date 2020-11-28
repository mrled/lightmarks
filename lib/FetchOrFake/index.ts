/* Fetch a resource via a URI, or return fake data for it
 */

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

interface IFetchResult {
  ok: boolean;
  status: number;
  json(): object;
}

/* Return faux data in a fetch()-like way
 *
 * Consumers can use the returned Promise exactly the same way they could use a Promise from fetch().
 */
// const fauxFetch: TFetcher = (uri, fauxData) => {
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

export type Fetcher = (
  uri: string,
  headers?: {[key: string]: string},
  fauxData?: object,
) => Promise<any>;

/* Perform a true fetch or a faux fetch, depending on the mode
 */
export function fetchOrFake(
  uri: string,
  headers?: {[key: string]: string},
  fauxData?: object,
): Promise<any> {
  const fetchImplementation =
    fauxData === undefined
      ? () => fetch(uri, {headers})
      : () => fauxFetch(uri, fauxData);
  return fetchImplementation()
    .then((result) => {
      stupidLogger(
        `fetchOrFake() result: ${JSON.stringify(result, undefined, '  ')}`,
      );
      return result;
    })
    .then((result) => result.json())
    .then((jsonResult) => {
      stupidLogger(
        `fetchOrFake() jsonResult: ${JSON.stringify(
          jsonResult,
          undefined,
          '  ',
        )}`,
      );
      return jsonResult;
    })
    .catch((err) => {
      console.error(`fetchOrFake() error: ${err}`);
      throw err;
    });
}
