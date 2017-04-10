import React, {Component} from 'react';
import $ from 'jquery';

import FileNode from "./filenode";
import DirNode from "./dirnode";

import SettingIcon from "./icons/setting";
import DirIcon from "./icons/directory";
import ToggleIcon from "./icons/toggle";

export default class RootNode extends DirNode{
  constructor(props, context){
    super(props, context);
    console.log(this);
  }
  
  render(){
    return (
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