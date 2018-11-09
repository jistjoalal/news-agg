import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import App, { Search, Button, Table } from './App';

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('has a valid snapshot', () => {
    const component = renderer.create(<App />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Search', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search>Search</Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('has a valid snapshot', () => {
    const component = renderer.create(<Search>Search</Search>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Button', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button>Button</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('has a valid snapshot', () => {
    const component = renderer.create(<Button>Button</Button>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays the button text', () => {
    const element = shallow(<Button>hello</Button>);
    expect(element.props().children).toBe('hello');
  })
});

describe('Table', () => {
  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'x' }
    ]
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table { ...props } />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('has a valid snapshot', () => {
    const component = renderer.create(<Table { ...props } />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows two items in list', () => {
    const element = shallow(<Table { ...props } />);
    expect(element.find('.table-row').length).toBe(2);
  })
});