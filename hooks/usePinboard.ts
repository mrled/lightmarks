import {createContext, useState} from 'react';

import useStateIdempotently from 'hooks/useStateIdempotently';
import {Pinboard, PinboardMode} from 'lib/Pinboard';
import {
  getCredential,
  getSetting,
  setCredential,
  setSetting,
  unsetCredential,
} from 'lib/storage';
import {Fetcher} from 'lib/Pinboard/types';

/* The application configuration that the user can save to persistent storage
 * (like to the keychain, UserDefaults, etc)
 */
type AppConfiguration = {
  mode: PinboardMode;
  username: string | undefined;
  apiTokenSecret: string | undefined;
  feedsTokenSecret: string | undefined;
};

/* React Context for managing Pinboard state
 */
type PinboardContextType = {
  pinboard: Pinboard | undefined;
  setAppConfiguration: (
    newMode: PinboardMode | undefined,
    newUsername: string | undefined,
    newApiTokenSecret: string | undefined,
  ) => Promise<any>;
  removeCredentials: () => Promise<any>;
};
export const PinboardContext = createContext<PinboardContextType>({
  pinboard: undefined,
  setAppConfiguration: (_newMode, _newUsername, _newApiTokenSecret) => {
    return new Promise<any>((_resolve, reject) =>
      reject('Pinboard context accessed outside of context provider'),
    );
  },
  removeCredentials: () => {
    return new Promise<any>((_resolve, reject) =>
      reject('Pinboard context accessed outside of context provider'),
    );
  },
});

/* Retrieve configuration from storage and return it as a Promise
 */
function getAppConfiguration(): Promise<AppConfiguration> {
  const apiCredPromise = getCredential('PinboardApiTokenSecretCredential');
  const feedsCredPromise = getCredential('PinboardFeedsRssSecretCredential');
  const modePromise = getSetting('PinboardMode');

  return Promise.all([apiCredPromise, feedsCredPromise, modePromise]).then(
    (results) => {
      const [apiCred, feedsCred, modeString] = results;
      const mode =
        modeString === 'production'
          ? PinboardMode.Production
          : PinboardMode.Mock;
      console.log(
        [
          'getAppConfiguration(): Retrieved credentials from storage',
          `Mode: ${mode}`,
          `API creds: ${JSON.stringify(apiCred)}`,
          `Feeds creds: ${JSON.stringify(feedsCred)}`,
        ].join('\n'),
      );
      return {
        mode: mode,
        username: apiCred ? apiCred.username : undefined,
        apiTokenSecret: apiCred ? apiCred.password : undefined,
        feedsTokenSecret: feedsCred ? feedsCred.password : undefined,
      };
    },
  );
}

/* Retrieve an RSS secret given a valid user
 * Use a temporary Pinboard object for this.
 */
function getRssSecret(
  fetcher: Fetcher,
  mode: PinboardMode,
  username: string,
  authTokenSecret: string,
): Promise<string> {
  // Create a temporary Pinboard object just to retrieve the RSS token
  // TODO: would be nice if there was a static function for this on Pinboard ?
  const tempPinboard = new Pinboard(fetcher, mode, {
    username,
    authTokenSecret,
  });

  // Retrieve the RSS token from the temp Pinboard object,
  // and setWhatever() calls to set values which will be used on the "real" Pinboard object
  // which is returned by usePinboard() and used by the rest of the app
  const apiGetRssSecretPromise = tempPinboard.api.user
    .secret()
    .then((rssSecret) => {
      console.log(`apiGetRssSecretPromise: Got result ${rssSecret}`);
      return rssSecret;
    });

  return apiGetRssSecretPromise;
}

/* Hook for logging in and using the Pinboard API
 *
 * Return value:
 *   firstRun:
 *      True if we have not yet run setConfigurationFromPersistentStorage
 *   pinboard:
 *      A Pinboard object
 *   setConfigurationFromPersistentStorage:
 *      Sets the Pinboard object from configuration in e.g. UserDefaults / Keychain
 *  setAppConfiguration:
 *      Sets the Pinboard object and persistent storage to new values
 *  removeCredentials:
 *      Removes existing configuration on both Pinboard object and persistent storage
 */
export function usePinboard() {
  const [firstRun, setFirstRun] = useStateIdempotently<boolean>(
    'firstRun',
    true,
  );
  const [mode, setMode] = useStateIdempotently<PinboardMode>(
    'mode',
    PinboardMode.Mock,
  );
  const [username, setUsername] = useStateIdempotently<string | undefined>(
    'username',
    undefined,
  );
  const [apiTokenSecret, setApiTokenSecret] = useStateIdempotently<
    string | undefined
  >('apiTokenSecret', undefined);
  const [rssSecret, setRssSecret] = useStateIdempotently<string | undefined>(
    'rssSecret',
    undefined,
  );
  const [pinboard, setPinboard] = useState<Pinboard | undefined>(undefined);

  /* Retrieve config from persistent storage and set the Pinboard object to use it
   */
  const setConfigurationFromPersistentStorage: () => void = () => {
    const oldFirstRun = firstRun;
    setFirstRun(false);

    // Note: You cannot see new new value of ${firstRun} until the NEXT render
    // <https://reactjs.org/docs/hooks-reference.html#usestate>
    //     During the initial render, the returned state (state) is the same as the value passed as the first argument (initialState).
    //     The setState function is used to update the state. It accepts a new state value and enqueues a re-render of the component.
    console.debug(
      `setConfigurationFromPersistentStorage(): Just set firstRun to false (was ${oldFirstRun})`,
    );

    getAppConfiguration()
      .then((config: AppConfiguration) => {
        setMode(config.mode ? config.mode : PinboardMode.Mock);
        setUsername(config.username);
        setApiTokenSecret(config.apiTokenSecret);
        setRssSecret(config.feedsTokenSecret);
      })
      .catch((reason) => {
        console.error(
          `setConfigurationFromPersistentStorage(): Failure: ${JSON.stringify(
            reason,
          )}`,
        );
        throw reason;
      });
  };

  /* Unset credentials in storage and memory.
   * Effectively logs out of Pinboard and forgets any saved credentials.
   */
  const removeCredentials: () => Promise<any> = () => {
    setUsername(undefined);
    setApiTokenSecret(undefined);
    setRssSecret(undefined);
    const apiCredPromise = unsetCredential('PinboardApiTokenSecretCredential');
    const feedsCredPromise = unsetCredential(
      'PinboardFeedsRssSecretCredential',
    );
    return Promise.all([apiCredPromise, feedsCredPromise]);
  };

  /* Update application configuration
   * Set React state and underlying storage
   * Will attempt to retrieve an RSS secret from the API.
   */
  const setAppConfiguration: (
    newMode: PinboardMode,
    newUsername: string | undefined,
    newApiTokenSecret: string | undefined,
  ) => Promise<any> = (newMode, newUsername, newApiTokenSecret) => {
    console.log(`Setting credentials to ${newUsername}:${newApiTokenSecret}`);

    // Set the local state FIRST
    setMode(newMode);
    setUsername(newUsername);
    setApiTokenSecret(newApiTokenSecret);

    // Handle the case where we are setting any of the credentials to null
    if (!newUsername || !newApiTokenSecret) {
      setUsername(undefined);
      setApiTokenSecret(undefined);
      setRssSecret(undefined);
      return Promise.all([
        unsetCredential('PinboardApiTokenSecretCredential'),
        unsetCredential('PinboardFeedsRssSecretCredential'),
      ]);
    }

    // Set the mode first
    // If we set the mode AFTER the HTTP request to get the RSS secret (below),
    // that'll work fine as long as the HTTP request succeeds,
    // but will fail to persist to local storage if the HTTP request fails
    const modeSettingPromise = setSetting('PinboardMode', newMode);

    // Retrieve the RSS token from the temp Pinboard object,
    // and setWhatever() calls to set values which will be used on the "real" Pinboard object
    // which is returned by usePinboard() and used by the rest of the app
    const rssSecretPromise = getRssSecret(
      newMode,
      newUsername,
      newApiTokenSecret,
    ).then((newRssSecret) => {
      setRssSecret(newRssSecret);
      setCredential(
        'PinboardFeedsRssSecretCredential',
        newUsername,
        newRssSecret,
      );
    });

    return Promise.all([
      modeSettingPromise,
      setCredential(
        'PinboardApiTokenSecretCredential',
        newUsername,
        newApiTokenSecret,
      ),
      rssSecretPromise,
    ]).then((_results) => {
      console.log('setAppConfiguration(): All promises resolved');
    });
  };

  /* Set a new Pinboard object idempotently.
   * If nothing changes, do nothing, to prevent a re-render loop.
   */
  const setPinboardIdempotently = (
    newMode: PinboardMode,
    newUsername?: string,
    newAuthTokenSecret?: string,
    newRssSecret?: string,
  ): void => {
    const eqMode = newMode === pinboard.mode;
    const eqUser = newUsername === pinboard.credential?.username;
    const eqTokenSec =
      newAuthTokenSecret === pinboard.credential?.authTokenSecret;
    const eqRssSec = newRssSecret === pinboard.credential?.rssSecret;

    function eqStr(a: any, b: any): string {
      const comparator = a === b ? '===' : '==>';
      return `${a} ${comparator} ${b}`;
    }

    if (eqMode && eqUser && eqTokenSec && eqRssSec) {
      console.debug(
        'setPinboardIdempotently(): Pinboard is already set, nothing to do',
      );
    } else {
      console.debug(
        [
          'setPinboardIdempotently(): Setting new Pinboard object',
          `mode: ${eqStr(pinboard.mode, newMode)}`,
          `username: ${eqStr(pinboard.credential?.username, newUsername)}`,
          `tokenSecret: ${eqStr(
            pinboard.credential?.authTokenSecret,
            newAuthTokenSecret,
          )}`,
          `rssSecret: ${eqStr(pinboard.credential?.rssSecret, newRssSecret)}`,
        ].join('\n'),
      );
      const credential = newUsername
        ? {
            username: newUsername,
            authTokenSecret: apiTokenSecret,
            rssSecret: newRssSecret,
          }
        : undefined;
      setPinboard(new Pinboard(newMode, credential));
    }
  };

  setPinboardIdempotently(mode, username, apiTokenSecret, rssSecret);

  return {
    firstRun,
    pinboard,
    setConfigurationFromPersistentStorage,
    setAppConfiguration,
    removeCredentials,
  };
}
