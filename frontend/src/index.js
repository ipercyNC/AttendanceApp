import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const students = [
  {
    id:1,
    name: 'John Smith',
    transport: 'Car'
  },
  {
    id:2,
    name: 'Jake Smith',
    transport: 'Bus'
  },
  {
    id:3,
    name: 'Jessica Smith',
    transport: 'Car'
  },
  {
    id:4,
    name: 'Janet Smith',
    transport: 'Bus'
  }
];



ReactDOM.render(
  <App students={students} />,
  document.getElementById('root')
);