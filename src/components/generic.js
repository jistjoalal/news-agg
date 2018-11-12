import React from 'react';
import { sortBy } from 'lodash';

/* UI stuff */
const Button = ({ onClick, className = '', children }) => 
  <button onClick={onClick} className={className}>
    {children}
  </button>

const Arrow = ({ direction }) =>
  <i className={`fa fa-arrow-${direction}`}></i>

const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ?
    <i className="fa fa-spinner fa-spin fa-3x"></i>
  : <Component { ...rest } />

const withError = Component => ({ error, ...rest }) =>
  error ?
    <div className="interactions">
      <p>Something went wrong.</p>
    </div>
  : <Component { ...rest } />

const withNull = Component => ({ show, ...rest }) =>
  show ?
    <Component { ...rest } />
  : null;

const SortArrow = withNull(Arrow);
const ButtonWithLoading = withLoading(Button);

export { Button, Arrow, withLoading, withError, withNull, SortArrow,
  ButtonWithLoading };

/* API stuff */

const HN_URL = (searchTerm, page) =>
  `https://hn.algolia.com/api/v1/search?query=${searchTerm}`
  + `&page=${page}&hitsPerPage=25`;

const REDDIT_URL = (searchTerm, after) =>
  `https://www.reddit.com/search.json?q=${searchTerm}&sort=top&count=25`
  + `&after=${after}`;

const withSource = source => {
  switch (source) {
    case 'HN': return HN_URL;
    case 'Reddit': return REDDIT_URL;
    default: return HN_URL;
  }
}

const COLUMN_SIZES = [{width: '40%'}, {width: '30%'}, {width: '10%'}];

const COLUMNS = {
  HN: {
    TITLE: 'title',
    DATE: 'created_at_i',
    COMMENTS: 'num_comments',
    POINTS: 'points',
    URL: 'url',
    ID: 'objectID',
    COMMENTS_URL: 'https://news.ycombinator.com/item?id='
  },
  Reddit: {
    TITLE: 'title',
    DATE: 'created',
    COMMENTS: 'num_comments',
    POINTS: 'score',
    URL: 'url',
    ID: 'id',
    COMMENTS_URL: 'https://news.ycombinator.com/item?id='
  }
};

const SORTS = source => {
  return {
    NONE: list => list,
    TITLE: list => sortBy(list, COLUMNS[source].TITLE),
    DATE: list => sortBy(list, COLUMNS[source].DATE),
    COMMENTS: list => sortBy(list, COLUMNS[source].COMMENTS).reverse(),
    POINTS: list => sortBy(list, COLUMNS[source].POINTS).reverse(),
  }
};

export { COLUMN_SIZES, COLUMNS, SORTS, withSource };