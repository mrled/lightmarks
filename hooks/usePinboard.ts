import {createContext, useState} from 'react';

import {Pinboard, PinboardMode, pinboardToken} from 'lib/Pinboard';

const UnsetPinboardUser = 'UnsetPinboardUser';
const UnsetPinboardSecret = 'UnsetPinboardSecret';
const DefaultPinboardDiagData = {
  user: UnsetPinboardUser,
  secret: UnsetPinboardSecret,
  production: false,
  loggedIn: false,
};

export const PinboardContext = createContext(null);

interface PinboardDiagnosticData {
  user: string;
  secret: string;
  production: boolean;
  loggedIn: boolean;
}

type PinboardLoginType = (
  user: string,
  secret: string,
  production: boolean,
) => void;

/* Hook for logging in and using the Pinboard API
 *
 * Return value:
 *   pinboard: A Pinboard or FauxPinboard object, ready to be used
 *   pinboardLogin(): A function that can re-login to Pinboard
 *   diag: Diagnostic data to e.g. show the username that is logged in
 */
export default () => {
  // FIXME: should not have Pinboard | FauxPinboard, but I am being lazy now and not finishing the implementation of the Pinboard interface in FauxPinboard
  const [pinboard, setPinboard] = useState<Pinboard>(
    new Pinboard(
      pinboardToken(UnsetPinboardUser, UnsetPinboardSecret),
      PinboardMode.Mock,
    ),
  );
  const [diag, setDiag] = useState<PinboardDiagnosticData>(
    DefaultPinboardDiagData,
  );

  const pinboardLogin: PinboardLoginType = (
    user: string,
    secret: string,
    production: boolean,
  ) => {
    const token = pinboardToken(user, secret);
    const mode = production ? PinboardMode.Production : PinboardMode.Mock;
    console.debug(`Using token: ${token}`);
    setPinboard(new Pinboard(token, mode));
    setDiag({
      user: user,
      secret: secret,
      production: production,
      loggedIn: true,
    });
  };

  return [pinboard, pinboardLogin, diag] as const;
};
