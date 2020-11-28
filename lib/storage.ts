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
      console.error(
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
      console.error(`Error retrieving DefaultPreference '${name}': ${error}`);
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
      console.error(
        `Error unsetting Keychain credential ${serviceName}: ${error}`,
      );
    });
  return resultPromise;
}

export function setCredential(
  serviceName: string,
  username: string,
  password: string,
): Promise<false | Keychain.Result> {
  const resultPromise = Keychain.setGenericPassword(username, password, {
    service: serviceName,
  })
    .then((result) => {
      console.log(`Set credential '${serviceName}'`);
      return result;
    })
    .catch((error) => {
      console.error(`Error setting credential '${serviceName}': ${error}`);
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
      console.error(
        `Error setting credential '${name}' to ${newValue}: ${error}`,
      );
      throw error;
    });
}
