/* A hook and context for getting configuration data from UserSettings and Keychain
 */

import {createContext, useState} from 'react';

import {
  getCredential,
  getSetting,
  setCredential,
  setSetting,
  unsetCredential,
  unsetSetting,
} from 'lib/storage';

const StorageKeys = {
  ProductionMode: 'PinboardProductionMode',
  ApiPasswordCredential: 'PinboardApiPasswordCredential',
  ApiTokenCredential: 'PinboardApiTokenCredential',
  FeedsTokenCredential: 'PinboardFeedsTokenCredential',
};

type TSetWrapper<T> = (newValue: T) => Promise<void>;
type TUnsetWrapper = () => Promise<void>;

type TCredential = {
  username: string;
  password: string;
};

type TAppConfiguration = {
  productionMode: boolean;
  setProductionModeWrapper: (newValue: boolean) => Promise<void>;
  unsetProduction: () => Promise<void>;
  apiAuthTokenCredential: TCredential | undefined;
  setApiAuthTokenCredentialWrapper: (cred: TCredential) => Promise<void>;
  unsetApiAuthTokenCredential: () => Promise<void>;
  feedsTokenSecret: string | undefined;
  setFeedsTokenSecretWrapper: (newValue: string) => Promise<void>;
  unsetFeedsTokenSecret: () => Promise<void>;
};

const defaultAppConfigErrorMessage =
  'Using AppConfigurationContext before initialization';
const DefaultAppConfiguration = {
  productionMode: false,
  setProductionModeWrapper: (_v: boolean) => {
    throw defaultAppConfigErrorMessage;
  },
  unsetProduction: () => {
    throw defaultAppConfigErrorMessage;
  },
  apiAuthTokenCredential: undefined,
  setApiAuthTokenCredentialWrapper: (_v: TCredential) => {
    throw defaultAppConfigErrorMessage;
  },
  unsetApiAuthTokenCredential: () => {
    throw defaultAppConfigErrorMessage;
  },
  feedsTokenSecret: undefined,
  setFeedsTokenSecretWrapper: (_v: string) => {
    throw defaultAppConfigErrorMessage;
  },
  unsetFeedsTokenSecret: () => {
    throw defaultAppConfigErrorMessage;
  },
};

export const AppConfigurationContext = createContext<TAppConfiguration>(
  DefaultAppConfiguration,
);

export const useAppConfiguration = () => {
  const [firstRun, setFirstRun] = useState<boolean>(true);
  const [productionMode, setProductionMode] = useState<boolean | undefined>(
    undefined,
  );
  const [apiUsername, setApiUsername] = useState<string | undefined>(undefined);
  // const [apiPassword, setApiPassword] = useState<string | undefined>(undefined);
  const [apiTokenSecret, setApiTokenSecret] = useState<string | undefined>(
    undefined,
  );
  const [feedsTokenSecret, setFeedsTokenSecret] = useState<string | undefined>(
    undefined,
  );

  const apiAuthTokenCredential =
    apiUsername && apiTokenSecret
      ? {
          username: apiUsername,
          password: apiTokenSecret,
        }
      : undefined;

  const setProductionModeWrapper: TSetWrapper<boolean> = (newValue) => {
    setProductionMode(newValue);
    return setSetting(StorageKeys.ProductionMode, JSON.stringify(newValue));
  };
  const unsetProduction: TUnsetWrapper = () => {
    setProductionMode(undefined);
    return unsetSetting(StorageKeys.ProductionMode);
  };

  const setApiAuthTokenCredentialWrapper: TSetWrapper<TCredential> = (
    newValue,
  ) => {
    setApiUsername(newValue.username);
    setApiTokenSecret(newValue.password);
    return setCredential(
      StorageKeys.ApiTokenCredential,
      newValue.username,
      newValue.password,
    );
  };
  const unsetApiAuthTokenCredential: TUnsetWrapper = () => {
    setApiUsername(undefined);
    setApiTokenSecret(undefined);
    return unsetCredential(StorageKeys.ApiTokenCredential);
  };

  const setFeedsTokenSecretWrapper: TSetWrapper<string> = (newValue) => {
    setFeedsTokenSecret(newValue);
    return setCredential(
      StorageKeys.FeedsTokenCredential,
      'IgnoredUsername',
      newValue,
    );
  };
  const unsetFeedsTokenSecret: TUnsetWrapper = () => {
    setFeedsTokenSecret(undefined);
    return unsetCredential(StorageKeys.FeedsTokenCredential);
  };

  const setAppConfigFromStorage: () => Promise<void> = () => {
    const apiTokenSecretCredPromise = getCredential(
      StorageKeys.ApiTokenCredential,
    ).then((cred) => {
      setApiUsername(cred ? cred.username : undefined);
      setApiTokenSecret(cred ? cred.password : undefined);
    });
    const feedsSecretCredPromise = getCredential(
      StorageKeys.FeedsTokenCredential,
    ).then((cred) => {
      setFeedsTokenSecret(cred && cred.password ? cred.password : undefined);
    });
    const productionModePromise = getSetting(StorageKeys.ProductionMode).then(
      (result) => {
        setProductionMode(result && JSON.parse(result));
      },
    );
    return Promise.all([
      apiTokenSecretCredPromise,
      feedsSecretCredPromise,
      productionModePromise,
    ]).then((_results) => {});
  };

  return {
    firstRun,
    setFirstRun,
    setAppConfigFromStorage,
    productionMode,
    setProductionModeWrapper,
    unsetProduction,
    // apiPasswordCredential,
    // setApiPasswordCredentialWrapper,
    // unsetApiPasswordCredential,
    apiAuthTokenCredential,
    setApiAuthTokenCredentialWrapper,
    unsetApiAuthTokenCredential,
    feedsTokenSecret,
    setFeedsTokenSecretWrapper,
    unsetFeedsTokenSecret,
  };
};
