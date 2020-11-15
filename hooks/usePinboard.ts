import {createContext, useState} from 'react';

import {Pinboard, PinboardMode} from 'lib/Pinboard';

const UnsetPinboardUser = 'UnsetPinboardUser';
// const UnsetPinboardSecret = 'UnsetPinboardSecret';
const DefaultPinboardDiagData = {
  username: UnsetPinboardUser,
  production: false,
  loggedIn: false,
};

export const PinboardContext = createContext(null);

interface PinboardDiagnosticData {
  username: string;
  production: boolean;
  loggedIn: boolean;
}

type PinboardLoginType = (
  production: boolean,
  username: string,
  credential: string,
  credentialIsPassword: boolean,
) => void;

/* Hook for logging in and using the Pinboard API
 *
 * Return value:
 *   pinboard: A Pinboard or FauxPinboard object, ready to be used
 *   pinboardLogin(): A function that can re-login to Pinboard
 *   diag: Diagnostic data to e.g. show the username that is logged in
 */
export default () => {
  const [pinboard, setPinboard] = useState<Pinboard>(
    new Pinboard(PinboardMode.Mock),
  );
  const [diag, setDiag] = useState<PinboardDiagnosticData>(
    DefaultPinboardDiagData,
  );

  const pinboardLogin: PinboardLoginType = (
    production: boolean,
    username: string,
    credential: string,
    credentialIsPassword = false,
  ) => {
    const mode = production ? PinboardMode.Production : PinboardMode.Mock;
    setPinboard(new Pinboard(mode));
    pinboard.api.username = username;
    if (credentialIsPassword) {
      pinboard.api.password = credential;
    } else {
      pinboard.api.authTokenSecret = credential;
    }
    setDiag({
      username: username,
      production: production,
      loggedIn: true,
    });
  };

  return [pinboard, pinboardLogin, diag] as const;
};
