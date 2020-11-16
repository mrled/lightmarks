import {createContext, useState} from 'react';

import {
  Pinboard,
  pinboardCredentialOptionalEq,
  IPinboardCredential,
  PinboardMode,
} from 'lib/Pinboard';

const PinboardDefault = new Pinboard(PinboardMode.Mock);

type PinboardContextType = {
  pinboard: Pinboard;
  pinboardLogin: (
    production: boolean,
    credential?: IPinboardCredential,
  ) => void;
};
export const PinboardContext = createContext<PinboardContextType>({
  pinboard: PinboardDefault,
  pinboardLogin: (_production, _credential) =>
    console.error('Pinboard context accessed outside of context provider'),
});

/* Hook for logging in and using the Pinboard API
 *
 * Return value:
 *   pinboard: A Pinboard or FauxPinboard object, ready to be used
 *   pinboardLogin(): A function that can re-login to Pinboard
 *   diag: Diagnostic data to e.g. show the username that is logged in
 */
export function usePinboard() {
  const [pinboard, setPinboard] = useState<Pinboard>(PinboardDefault);

  const pinboardLogin: (
    production: boolean,
    credential?: IPinboardCredential,
  ) => void = (production, credential?) => {
    const mode = production ? PinboardMode.Production : PinboardMode.Mock;
    console.debug(
      `pinboardLogin(): Using credential ${JSON.stringify(credential)}`,
    );
    if (
      mode === pinboard.mode &&
      pinboardCredentialOptionalEq(credential, pinboard.credential)
    ) {
      console.debug(
        [
          'Will not log into Pinboard',
          `new mode: ${mode}`,
          `old mode: ${pinboard.mode}`,
          `new credential: ${JSON.stringify(credential)}`,
          `old credential: ${JSON.stringify(pinboard.credential)}`,
        ].join('\n'),
      );
      console.debug('Will not log into Pinboard');
    } else {
      console.debug(
        `pinboardLogin(): Logging in to Pinboard. Mode: ${mode}; credential: ${JSON.stringify(
          credential,
        )}`,
      );
      const newPinboard = new Pinboard(mode, credential);
      console.debug(
        `pinboardLogin(): Created new Pinboard object with credential ${JSON.stringify(
          newPinboard.credential,
        )}`,
      );
      setPinboard(newPinboard);
    }
  };

  return {pinboard, pinboardLogin};
}
