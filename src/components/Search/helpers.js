import React from 'react';

const SOURCES = ['HN', 'Reddit'];

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


export { SourceIcon, SOURCES };