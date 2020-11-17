const MockTags = require('./mocks.api.tags.get.json');
const FeedsUnauthenticatedPopular = require('./mocks.feeds.unauthenticated.popular');

export const FauxApiData: {[key: string]: object} = {
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

export const FauxFeedsAuthenticatedData: {[key: string]: object} = {};

export const FauxFeedsUnauthenticatedData: {[key: string]: object} = {
  recent: {},
  popular: FeedsUnauthenticatedPopular,
};
