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
  : <LoadingIcon />

export { withError, withLoading };

/**
 * mini-components
 */

const LoadingIcon = () => <i className="fa fa-2x fa-circle-o-notch fa-spin"></i>;

// direction: true = up
const SortArrow = ({ active, direction }) => {
  const isUp = active && direction;
  const isDown = active && !direction;
  return (
    <span className="SortArrow">&nbsp;
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

export { Button, SortArrow, ButtonWithLoading, LoadingIcon };

/**
 * helpers
 */

const DateString = ({ children, ...rest }) =>
  <span {...rest}>
    {new Date(+children*1000).toDateString()}
  </span>

const SOURCES = ['HN', 'Reddit'];

export { DateString, SOURCES };
