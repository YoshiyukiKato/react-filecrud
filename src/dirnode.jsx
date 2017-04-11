import React, { Component } from 'react';
import $ from 'jquery';
import { DropTarget, DragSource } from "react-dnd";

import { FileNode, FileNodeDnD } from "./filenode";
import SettingIcon from "./icons/setting";
import DirIcon from "./icons/directory";
import ToggleIcon from "./icons/toggle";

export class DirNode extends FileNode{
  constructor(props, context){
    super(props, context);
    this.state = Object.assign(this.initialState, props);
  }
  get initialState(){
    return {
      isChildrenOpen : false,
      isChangeNameOpen : false,
      prevName : null,
      newChild : null
    }
  }

  render(){
    const { connectDropTarget, connectDragSource, isDragging } = this.props;

    return connectDropTarget(connectDragSource(
      <div className="item-node dir-node">
        <div className="item-header">
          <div className={`item-children-toggle item-children-toggle-${this.state.isChildrenOpen ? "open" : "close"}`}
            onClick={this.toggleChildren.bind(this)}>
            <ToggleIcon/>
          </div>
          <div className="item-icon">
            <DirIcon/>
          </div>
          {this.renderName()}
          <div className="item-menu">
            <div className="item-menu-icon">
              <SettingIcon/>
            </div>
            <ul className="item-menu-list">
              <li onClick={this.openNewChild.bind(this, false)}>ファイルを追加</li>
              <li onClick={this.openNewChild.bind(this, true)}>ディレクトリを追加</li>
              <li onClick={this.openChangeName.bind(this)}>名前の変更</li>
              <li onClick={this.remove.bind(this)}>削除</li>
            </ul>
          </div>
        </div>
        <div className={`item-children item-children-${this.state.isChildrenOpen ? "open" : "close"}`}>
          {this.renderNewChild()}
          {this.renderChildren()}
        </div>
      </div>
    ));
  }

  renderChildren(){
    return this.state.data.children.map((child, index) => {
      //const ChildNode = child.children ? DirNode : FileNode;
      const ChildNode = child.children ? DirNodeDnD : FileNodeDnD;
      return <ChildNode key={child.name} data={child}
        parentName={this.props.data.name}
        change={this.changeChild.bind(this, index)}
        remove={this.removeChild.bind(this, index)}
        moveOut={this.moveChildOut.bind(this, index)}
        moveIn={this.moveChildIn.bind(this,index)}/>;
    });
  }

  renderNewChild(){
    return this.state.newChild ? <NewChild isDir={this.state.newChild.isDir}
      addChild={this.addChild.bind(this)}
      close={this.closeNewChild.bind(this)}/> : <div></div>;
  }

  toggleChildren(){
    this.setState({ isChildrenOpen : !this.state.isChildrenOpen });
  }

  openNewChild(isDir){
    this.setState({ newChild : { isDir : isDir }, isChildrenOpen : true });
  }
  
  closeNewChild(){
    this.setState({ newChild : null });
  }

  addChild(name, isDir){
    const newChild = isDir ? { name : name, children : [] } : { name : name };
    this.state.data.children.push(newChild);
    this.state.data.children = this.state.data.children.sort((a, b) => {
      if(!!a.children === !!b.children){
        return a.name > b.name;
      }else if(a.children){
        return false;
      }else{
        return true;
      }
    });
    this.setState({ data : this.state.data, newChild : null });
  }

  removeChild(index){
    this.state.data.children.splice(index, 1);
    this.setState({ children : this.state.data.children });
  }

  changeChild(index, child){
    this.state.data.children[index] = child;
    this.state.data.children = this.state.data.children.sort((a, b) => {
      if(!!a.children === !!b.children){
        return a.name > b.name;
      }else if(a.children){
        return false;
      }else{
        return true;
      }
    });
    this.setState({ children : this.state.data.children });
  }

  moveChildOut(index){
    const child = this.state.data.children.splice(index, 1);
    this.setState({ children : this.state.data.children });
    return child;
  }

  moveChildIn(index, grandChild){
    const child = this.state.data.children[index];
    child.children.push(grandChild);
    child.children = child.children.sort((a, b) => {
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

class NewChild extends Component{
  constructor(props) {
    super(props);
    this.state = { name : "" };
  }

  render(){
    return (
      <div className="item-node new-node">
        <input value={this.state.name}
          className="input"
          placeholder={`新しい${this.props.isDir ? "ディレクトリ" : "ファイル"}名`}
          onChange={this.changeName.bind(this)}/>
        <button className="button" onClick={this.ok.bind(this)}>作成</button>
        <button className="button" onClick={this.cancel.bind(this)}>キャンセル</button>
      </div>
    );
  }
  changeName(evt){
    this.setState({ name : evt.target.value });
  }

  ok(){
    this.props.addChild(this.state.name, this.props.isDir);
    this.props.close();
  }
  cancel(){
    this.props.close();
  }
}

//dnd setting

const dirSource = {
  beginDrag(props, monitor, component) {
    return props;
  },
  
  endDrag(props, monitor, component) {
    const { moved } = monitor.getDropResult() || {};
    if(moved) props.moveOut();
  },
};

/**
 * Specifies the props to inject into your component.
 */
function sourceCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const DirNodeDrag = DragSource('item-node', dirSource, sourceCollect)(DirNode);

const dirTarget = {
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }
    const item = monitor.getItem();
    if(props.data.name !== item.parentName){
      props.moveIn(item.data);
      return { moved: true };
    }
  }
}

function targetCollect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

export const DirNodeDnD = DropTarget('item-node', dirTarget, targetCollect)(DirNodeDrag);