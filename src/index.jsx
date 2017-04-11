import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { RootNode, RootNodeDnD } from './app';

const root = { name : "/", children : [] };
class Tree extends Component {
  constructor(props, context){
    super(props, context);
    this.state = this.initialState;
  }
  get initialState(){
    return {
      data : { name : "/", children : [] }
    }
  }
  
  render(){
    return <RootNodeDnD data={this.state.data} moveIn={this.moveChildIn.bind(this)}/>
  }
  
  moveChildIn(child){
    this.state.data.children.push(child);
    this.state.data.children = this.state.data.children.sort((a, b) => {
      if(!!a.children === !!b.children){
        return a.name > b.name;
      }else if(a.children){
        return false;
      }else{
        return true;
      }
    });
    this.setState({ data : this.state.data });
  }
}

const TreeDnD = DragDropContext(HTML5Backend)(Tree)

ReactDOM.render(<TreeDnD/>, document.querySelector("#wrapper"));