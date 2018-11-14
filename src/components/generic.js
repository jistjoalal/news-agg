import React from 'react';
import classNames from 'classnames';

// generic.js:
// - components and helpers

/**
 * HOCS
 */

const withError = Component => ({ error, ...rest }) =>
  !error ? <Component { ...rest } />
  : <div className="interactions">
      <p>Something went wrong.</p>
    </div>

const withLoading = Component => ({ isLoading, ...rest }) =>
  !isLoading ? <Component { ...rest } />
  : <i className="fa fa-spinner fa-spin fa-3x"></i>

/**
 * Font Awesome
 */

const ICON_FA = {
  'HN': 'hacker-news',
  'Reddit': 'reddit-alien'
}

const ICONS = ({ source }) =>
  // default to text
  !ICON_FA[source] ? source
  : <i className={`fa fa-${ICON_FA[source]}`}></i>

const SourceIcon = ({ source }) => 
  <ICONS source={source} />

/**
 * clickables
 */

// direction: true = up
const SortArrow = ({ active, direction }) => {
  const isUp = active && direction;
  const isDown = active && !direction;
  return (
    <span className="SortArrow">
      <Arrow active={isUp} direction={true} />
      <Arrow active={isDown} direction={false} />
    </span>
  )
}

const Arrow = ({ active, direction }) => {
  const className = classNames('fa', 
    {'fa-sort-desc': direction},
    {'fa-sort-asc': !direction},
    {'active': active},
  );
  return (
    <i className={className}></i>
  );
}

const Button = ({ children, ...rest }) => 
  <button { ...rest }>
    {children}
  </button>

const ButtonWithLoading = withLoading(Button);

/**
 * helpers
 */

const DateString = ({ children, ...rest }) =>
  <span {...rest}>
    {new Date(+children*1000).toDateString()}
  </span>

// heart of the app!
const SOURCES = ['HN', 'Reddit'];

export { Button, withLoading, withError, SortArrow, ButtonWithLoading,
  SourceIcon, DateString, SOURCES };
