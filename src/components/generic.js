import React from 'react';
import classNames from 'classnames';

//
/* general UI stuff */
//

// Font Awesome icons for sources
const ICON_FA = {
  'HN': 'hacker-news',
  'Reddit': 'reddit-alien'
}

const ICONS = ({ source }) => {
  const className = ICON_FA[source] ? `fa fa-${ICON_FA[source]}` : '';
  return className !== '' ?
    <i className={className}></i>
  : source
}

const SourceIcon = ({ source }) => 
  <ICONS source={source} />

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

const Button = ({ children, ...rest }) => 
  <button { ...rest }>
    {children}
  </button>

const buttonStyles = active =>
  classNames('Button inline', {'active': active})

// direction: true = up
const SortArrow = ({ show, direction }) => {

  const isUp = show && direction;
  const isDown = show && !direction;
  return (
    <span className="SortArrow">
      <Arrow show={isUp} direction={true} />
      <Arrow show={isDown} direction={false} />
    </span>
  )
}

const Arrow = ({ show, direction }) => {
  const className = classNames('fa', 
    {'fa-sort-desc': direction},
    {'fa-sort-asc': !direction},
    {'active': show},
  );
  return (
    <i className={className}></i>
  );
}

const DateString = ({ DATE }) => {
  return new Date(DATE*1000).toDateString();
}

const ButtonWithLoading = withLoading(Button);

export { Button, withLoading, withError, SortArrow,
  ButtonWithLoading, buttonStyles, SourceIcon };

//
/* Table UI */
//

// layout:
// lg md sm sm sm
const COLUMN_SIZES = {
  lg: {width: '44%'},
  md: {width: '20%'},
  sm: {width: '12%'}
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