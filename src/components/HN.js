

const DEFAULT_HPP = '25';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const HN_URL = (searchTerm, page) =>
  `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`
  + `&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;

export { HN_URL };