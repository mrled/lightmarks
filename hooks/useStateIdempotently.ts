/* A hook that uses state idempotently
 *
 * Only triple equality === is checked, so this is currently only useful
 * for simple values like strings and numbers.
 */

import {useState} from 'react';

function useStateIdempotently<T>(
  logLabel: string,
  initialValue: T,
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const logPrefix = `useStateIdempotently<T>(${logLabel}, ${initialValue})`;
  function setValueIdempotently(newValue: T) {
    if (newValue === value) {
      console.debug(
        `${logPrefix}: newValue equals existing value of ${JSON.stringify(
          value,
        )}`,
      );
    } else {
      console.debug(
        `${logPrefix}: setting newValue ${JSON.stringify(
          newValue,
        )} from old value ${JSON.stringify(value)}`,
      );
      setValue(newValue);
    }
  }
  return [value, setValueIdempotently];
}

export default useStateIdempotently;
