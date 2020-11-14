/* Analyze real tag data in a file called tags.json.
 * I didn't want to publish my own real tags for test data,
 * but I did want mock data that looked like my tags.
 * Run this file like
 *    node analyze.tags.js
 */

const fs = require('fs');

const realtags = JSON.parse(fs.readFileSync('tags.json'));

const uniqChars = [...Object.keys(realtags).reduce((acc, cur) => acc + cur)]
  .filter((val, idx, self) => self.indexOf(val) === idx)
  .sort()
  .join('');

console.log(`Unique characters in tags: ${uniqChars}`);

let tagNums = {};
Object.values(realtags).forEach((tagCount) => {
  tagNums[tagCount] =
    // apparently these numbers got turned into strings at some point, oh well
    Object.keys(tagNums).indexOf(`${tagCount}`) > -1
      ? tagNums[tagCount] + 1
      : 1;
});
console.log(`Tags by count: ${tagNums}`);
Object.keys(tagNums).forEach((key) => console.log(`${key}: ${tagNums[key]}`));

var repl = require('repl');
var r = repl.start('node> ');
r.context.tagNums = tagNums;
