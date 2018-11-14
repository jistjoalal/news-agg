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

const Button = ({ children, ...rest }) => 
  <button { ...rest }>
    {children}
  </button>

const ButtonWithLoading = withLoading(Button);

/**
 * helpers
 */

const buttonStyles = active =>
  classNames('Button inline', {'active': active})

const DateString = ({ DATE }) => {
  return new Date(DATE*1000).toDateString();
}

// heart of the app!
const SOURCES = ['HN', 'Reddit'];

export { Button, withLoading, withError, SortArrow, ButtonWithLoading,
  buttonStyles, SourceIcon, DateString, SOURCES };
