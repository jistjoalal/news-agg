import React from 'react';

import { Button, ButtonWithLoading } from './generic';

const Footer = ({ isLoading, searchKey, fetchMore }) =>
  <div className="footer">
    <ButtonWithLoading
      className="button-clickable" isLoading={isLoading}
      onClick={() => fetchMore(searchKey)}
    >More
    </ButtonWithLoading>
    <a href="#top" className="backtotop">
      <Button className="button-clickable">
        Back to top
      </Button>
    </a>
  </div>

export default Footer;