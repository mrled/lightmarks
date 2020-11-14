const MockTags = require('./mocks.tags.get.json');

const FauxData: {[key: string]: object} = {
  'posts/update': {},
  'posts/add': {},
  'posts/delete': {},
  'posts/dates': {},
  'posts/recent': {},
  'posts/get': {},
  'posts/all': {},
  'posts/suggest': {},
  'tags/get': MockTags,
  'tags/delete': {},
  'tags/rename': {},
  'user/secret': {},
  'user/api_token': {},
  'notes/list': {},
};

export default FauxData;
