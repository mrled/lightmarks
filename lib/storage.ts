import * as Keychain from 'react-native-keychain';
import DefaultPreference from 'react-native-default-preference';

export function getCredential(
  serviceName: string,
): Promise<false | Keychain.UserCredentials> {
  const resultPromise = Keychain.getGenericPassword({
    service: serviceName,
  })
    .then((value) => {
      console.log(
        `Retrieved Keychain credential '${serviceName}': ${JSON.stringify(
          value,
        )}`,
      );
      return value;
    })
    .catch((error) => {
      console.warn(
        `Error retrieving Keychain credential '${serviceName}': ${error}`,
      );
      throw error;
    });
  return resultPromise;
}

export function getSetting(name: string): Promise<string> {
  const resultPromise = DefaultPreference.get(name)
    .then((value) => {
      console.log(
        `Retrieved DefaultPreference '${name}': ${JSON.stringify(value)}`,
      );
      return value;
    })
    .catch((error) => {
      console.warn(`Error retrieving DefaultPreference '${name}': ${error}`);
      throw error;
    });
  return resultPromise;
}

export function unsetCredential(serviceName: string): Promise<void> {
  const resultPromise = Keychain.resetGenericPassword({
    service: 'PinboardApiTokenSecretCredential',
  })
    .then((_value) => {
      console.log(`Unset Keychain credential ${serviceName}`);
    })
    .catch((error) => {
      console.warn(
        `Error unsetting Keychain credential ${serviceName}: ${error}`,
      );
    });
  return resultPromise;
}

export function setCredential(
  serviceName: string,
  username: string,
  password: string,
): Promise<void> {
  const resultPromise = Keychain.setGenericPassword(username, password, {
    service: serviceName,
  })
    .then((_result) => {
      console.log(`Set credential '${serviceName}'`);
    })
    .catch((error) => {
      console.warn(`Error setting credential '${serviceName}': ${error}`);
      throw error;
    });
  return resultPromise;
}

export function setSetting(name: string, newValue: string): Promise<void> {
  return DefaultPreference.set(name, newValue)
    .then((_result) => {
      console.log(`Set setting '${name}' to '${newValue}'.`);
    })
    .catch((error) => {
      console.warn(
        `Error setting credential '${name}' to ${newValue}: ${error}`,
      );
      throw error;
    });
}

export function unsetSetting(name: string): Promise<void> {
  return DefaultPreference.clear(name)
    .then((_result) => {
      console.log(`Remove setting '${name}'.`);
    })
    .catch((error) => {
      console.warn(`Error setting credential '${name}': ${error}`);
      throw error;
    });
}
