const ApiPostsGetMultiple = require('./mocks.api.posts.get.multiple.json');
const ApiPostsRecent = require('./mocks.api.posts.recent.json');
const ApiTagsGet = require('./mocks.api.tags.get.json');
const FeedsUnauthenticatedPopular = require('./mocks.feeds.unauthenticated.popular');
const FeedsUnauthenticatedRecent5 = require('./mocks.feeds.unauthenticated.recent.5.json');

export const FauxApiData: {[key: string]: object} = {
  'posts/update': {},
  'posts/add': {},
  'posts/delete': {},
  'posts/dates': {},
  'posts/recent': ApiPostsRecent,
  'posts/get': ApiPostsGetMultiple,
  'posts/all': {},
  'posts/suggest': {},
  'tags/get': ApiTagsGet,
  'tags/delete': {},
  'tags/rename': {},
  'user/secret': {},
  'user/api_token': {},
  'notes/list': {},
};

export const FauxFeedsAuthenticatedData: {[key: string]: object} = {};

export const FauxFeedsUnauthenticatedData: {[key: string]: object} = {
  recent: FeedsUnauthenticatedRecent5,
  popular: FeedsUnauthenticatedPopular,
};
