import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import DirNode from './app';

const root = { name : "/", children : [] };

ReactDOM.render(<DirNode data={root}/>, document.querySelector("#wrapper"));