import React from 'react';

import { Button } from '../generic';

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

const TABLE_CELLS = {
  TSpan: ({ children, ...rest }) =>
    <span {...rest}>
      {children}
    </span>,

  TLink: ({ children, ...rest }) =>
    <a {...rest}>
      {children}
    </a>,

  TButton: ({ children, ...rest }) =>
    <Button className="Dismiss Button inline" {...rest}>
      {children}
    </Button>,

  TDate: ({ children, ...rest }) =>
    <span {...rest}>
      {new Date(+children*1000).toDateString()}
    </span>,
};

// returns a result object of data columns:
// {
//   GENERIC_COLUMN_NAME: specific_api_column_data,
//   ...
// }
// -used to output results in table
const itemBySource = ({ source, item }) => {
  let result = {};
  Object.entries(COLUMNS[source]).forEach(c => {
    result[c[0]] = item[c[1]];
  });
  result.COMMENTS_URL = commentsURL({ source, item })
  return result;
}

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


// returns the next page of stories from source
// - results[source][searchKey].page can contain different
//   data for each source
const sourceNextPage = (source, page) => {
  switch(source) {
    case 'HN': return page + 1;
    case 'Reddit': return page;
    default: return page;
  }
}

const unpackResponse = (source, response) => {
  switch(source) {
    case 'HN': return response;
    case 'Reddit':
      // -data: one level deeper than HN
      const { children, after } = response.data;
      return {
        // -hits: one level deeper than HN hits
        hits: children.map(c => c.data),
        // -page: uses ID pointer to next post instead of page,
        //   works the same though, just plug into url
        page: after
      }
    default: return {};
  }
}

// returns an API specific comments url
const commentsURL = ({ item, source }) => {
  switch (source) {
    default: return `https://news.ycombinator.com/item?id=${item.objectID}`
    case 'Reddit':
      const base = 'https://www.reddit.com/';
      return `${base}${item.subreddit_name_prefixed}/comments/${item.id}`;
  }
}

export { COLUMNS, COLUMN_SIZES, COLUMN_HEADERS, TABLE_CELLS,
  itemBySource, withSource, sourceNextPage, unpackResponse, commentsURL };