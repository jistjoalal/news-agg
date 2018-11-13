import React from 'react';
import classNames from 'classnames';

//
/* general UI stuff */
//

const Button = ({ children, ...rest }) => 
  <button { ...rest }>
    {children}
  </button>

const buttonStyles = active =>
  classNames('Button inline', {'Button active': active})

// direction: true = up
const Arrow = ({ direction }) =>
  <i className={`fa fa-arrow-${direction ? 'up' : 'down'}`}></i>

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

const DateString = ({ DATE }) => {
  return new Date(DATE*1000).toDateString();
}

const SortArrow = withNull(Arrow);
const ButtonWithLoading = withLoading(Button);

export { Button, Arrow, withLoading, withError, withNull, SortArrow,
  ButtonWithLoading, buttonStyles };

//
/* Table UI */
//

const COLUMN_SIZES = {
  lg: {width: '60%'},
  md: {width: '30%'},
  sm: {width: '10%'}
}
const COLUMN_HEADERS = {
  Title: COLUMN_SIZES.lg,
  Date: COLUMN_SIZES.md,
  Comments: COLUMN_SIZES.sm,
  Points: COLUMN_SIZES.sm,
}

export { COLUMN_SIZES, COLUMN_HEADERS };

//
/* API stuff */
//

const SOURCES = ['HN', 'Reddit'];

// returns search API url from HOF that takes API args
const withSource = source => {
  switch (source) {
    case 'HN': return HN_URL;
    case 'Reddit': return REDDIT_URL;
    default: return HN_URL;
  }
}
const HN_URL = (searchTerm, page) =>
  `https://hn.algolia.com/api/v1/search?query=${searchTerm}`
  + `&page=${page}&hitsPerPage=25`;
const REDDIT_URL = (searchTerm, after) =>
  `https://www.reddit.com/search.json?q=${searchTerm}&sort=top&count=25`
  + `&after=${after}`;

// returns an API specific comments url
const commentsURL = (item, source) => {
  switch (source) {
    default: return `https://news.ycombinator.com/item?id=${item.objectID}`
    case 'Reddit':
      const base = 'https://www.reddit.com/';
      return `${base}${item.subreddit_name_prefixed}/comments/${item.id}`;
  }
}

// returns a result object of data columns:
// {
//   GENERIC_COLUMN_NAME: specific_api_column_name,
//   ...
// }
// -used to output results in table
const itemBySource = ({ source, item }) => {
  let result = {};
  Object.entries(COLUMNS[source]).forEach(c => {
    result[c[0]] = item[c[1]];
  });
  return result;
}

// source specific API response columns
const COLUMNS = {
  HN: {
    TITLE: 'title',
    DATE: 'created_at_i',
    COMMENTS: 'num_comments',
    POINTS: 'points',
    URL: 'url',
    ID: 'objectID',
  },
  Reddit: {
    TITLE: 'title',
    DATE: 'created',
    COMMENTS: 'num_comments',
    POINTS: 'score',
    URL: 'url',
    ID: 'id',
  }
};

export { withSource, itemBySource, DateString, commentsURL, COLUMNS,
  SOURCES };