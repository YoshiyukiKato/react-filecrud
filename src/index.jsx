import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import RootNode from './app';

const root = { name : "/", children : [] };

ReactDOM.render(<RootNode data={root}/>, document.querySelector("#wrapper"));