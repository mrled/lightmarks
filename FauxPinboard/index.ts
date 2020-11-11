/* A faux Pinboard API client
 *
 * Adapted from https://github.com/maxmechanic/node-pinboard/blob/master/lib/index.ts
 *
 * Only as complete as I'm using in the app, for now
 */

// import MockTags from 'data/mocks.tags.json';
const MockTags = require('./data/mocks.tags.json');

type Callback = (err: Error | null, body: unknown) => void;
type GetResult = void | object;

interface Props {
  mockData: object;
}
type Get = (props: Props, cb: Callback) => Promise<object | void>;

const mockGet: Get = ({mockData}, cb) => {
  const promise = new Promise<GetResult>((resolve, reject) => {
    if (mockData) {
      console.debug('Returning mock data...');
      resolve(mockData);
    } else {
      reject('No results passed to mockGet');
    }
  });

  return cb
    ? promise
        .then((result: any) => cb(null, result))
        .catch((err: Error) => cb(err, null))
    : promise;
};

// const get: Get = ({mockfile}, cb) => {
//   // const promise = fs.promises
//   //   .readFile(`data/${mockfile}`)
//   //   .then((contents: string) => JSON.parse(contents));

//   const promise: Promise<GetResult> = new Promise((resolve, reject) => {
//     return import(`data/${mockfile}`);
//     // try {
//     //   //const mockfilePath = `./data/${mockfile}`;
//     //   //const mockfileData = require(mockfilePath);
//     //   //const mockfileData = require('./data/mocks.tags.json');
//     //   console.log(`Found mockfileData: ${mockfileData}`);
//     //   // console.log(mockfileData);
//     //   resolve(mockfileData);
//     // } catch (err) {
//     //   reject(err);
//     // }
//   });

//   return cb
//     ? promise
//         .then((result: any) => cb(null, result))
//         .catch((err: Error) => cb(err, null))
//     : promise;
// };

export default class Pinboard {
  public constructor(readonly token: string) {}

  public getTags(props: Props, cb: Callback) {
    return mockGet({...props, mockData: MockTags}, cb);
  }
}
