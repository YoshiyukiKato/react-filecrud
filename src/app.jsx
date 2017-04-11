import React, {Component} from 'react';
import $ from 'jquery';
import HTML5Backend from 'react-dnd-html5-backend';
import { DropTarget } from "react-dnd";

import { FileNode, FileNodeDnD } from "./filenode";
import { DirNode, DirNodeDnD } from "./dirnode";

import SettingIcon from "./icons/setting";
import DirIcon from "./icons/directory";
import ToggleIcon from "./icons/toggle";

export class RootNode extends DirNode{
  constructor(props, context){
    super(props, context);
  }
  
  render(){
    const { connectDropTarget } = this.props;

    return connectDropTarget (
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
            </ul>
          </div>
        </div>
        <div className={`item-children item-children-${this.state.isChildrenOpen ? "open" : "close"}`}>
          {this.renderNewChild()}
          {this.renderChildren()}
        </div>
      </div>
    );
  }
}

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

export const RootNodeDnD = DropTarget('item-node', dirTarget, targetCollect)(RootNode);