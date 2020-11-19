/* Given some results from the public feeds API,
 * make a file in the format of the private posts/all API call.
 */

const {execSync} = require('child_process');

const FeedsUnauthenticatedPopular = require('./mocks.feeds.unauthenticated.popular');

const md5 = (input) => execSync('md5', {input: input}).toString().trim();
const rand = (max) => Math.floor(Math.random() * Math.floor(max));

const curDate = new Date();
const fauxPostsAll = FeedsUnauthenticatedPopular.map((bookmark) => {
  return {
    href: bookmark.u,
    description: bookmark.d,
    extended: bookmark.n,
    meta: md5(`${bookmark.u}${curDate}`), // just making this up
    hash: md5(bookmark.u), // just making this up
    time: bookmark.dt,
    shared: rand(10) > 0, // 1 in 10 bookmarks will be private
    toread: rand(10) < 1, // 1 in 10 bookmarks will be marked toread
    tags: bookmark.t.join(' '),
  };
});

console.log(JSON.stringify(fauxPostsAll, undefined, '  '));

/* example input:
  {
    "u": "http://blog.spencermounta.in/2020/should-we-stop/index.html",
    "d": "•",
    "n": "",
    "dt": "2020-11-16T05:47:01Z",
    "a": "tedw",
    "t": ["web", "future", "software"]
  },

  example output:
  {"href":"https:\/\/github.com\/str4d\/rage","description":"str4d\/rage: A simple, secure and modern encryption tool (and Rust library) with small explicit keys, no config options, and UNIX-style composability.","extended":"","meta":"65546da9436fa614d05d1626cb5ba874","hash":"4e29e9e1e7f1c071649f03ad891b0f83","time":"2020-11-14T02:44:19Z","shared":"yes","toread":"no","tags":"security crypto"},
*/
