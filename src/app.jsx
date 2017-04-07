import React, {Component} from 'react';
import $ from 'jquery';

import SettingIcon from "./icons/setting";
import DirIcon from "./icons/directory";
import FileIcon from "./icons/file";

export default class DirNode extends Component{
  constructor(props){
    super(props);
    this.state = Object.assign(this.initialState, props);
  }
  get initialState(){
    return {
      isChildrenOpen : false,
      isChangeNameOpen : false,
      newNode : null
    }
  }

  render(){
    const ItemIcon = this.state.data.children ? DirIcon : FileIcon;
    return (
      <div className="item-node dir-node">
        <div className={`item-children-toggle item-children-toggle-${this.state.isChildrenOpen ? "open" : "close"}`}
          onClick={this.toggleChildren.bind(this)}></div>
        <div className="item-icon">
          <ItemIcon/>
        </div>
        <div className={`item-name item-name-${this.state.isChangeNameOpen ? "open" : "close"}`}>
          <input value={this.state.data.name} onChange={this.changeName.bind(this)}/>
        </div>
        <div className="item-menu-icon">
          <SettingIcon/>
        </div>
        <div className="item-menu">
          <ul>
            <li onClick={this.openNewNode.bind(this, false)}>ファイルを追加</li>
            <li onClick={this.openNewNode.bind(this, true)}>ディレクトリを追加</li>
            <li onClick={this.openChangeName.bind(this)}>名前の変更</li>
            <li onClick={this.remove.bind(this)}>削除</li>
          </ul>
        </div>
        <div className={`item-children item-children-${this.state.isChildrenOpen ? "open" : "close"}`}>
          {this.renderNewNode()}
          {this.renderChildren()}
        </div>
      </div>
    );
  }

  renderChildren(){
    return this.state.data.children.map((child, index) => {
      const ChildNode = child.children ? DirNode : FileNode;
      return <ChildNode key={child.name} data={child}
        change={this.changeChild.bind(this, index)}
        remove={this.removeChild.bind(this, index)}/>;
    });
  }
  renderName(){

  }
  
  renderNewNode(){
    return this.state.newNode ? <NewNode isDir={this.state.newNode.isDir}
      addChild={this.addChild.bind(this)}
      close={this.closeNewNode.bind(this)}/> : <div></div>;
  }

  toggleChildren(){
    this.setState({ isChildrenOpen : !this.state.isChildrenOpen });
  }

  openChangeName(){
    this.setState({ isChangeNameOpen : true })
  }

  changeName(evt){
    const oldName = this.state.data.name;
    const newName = evt.target.value;
    this.state.data.name = newName;
    this.setState({ data : this.state.data });
    if(this.props.change) this.props.change(this.state.data);
    //サーバ側で権限周りの調整。相対パスは受け付けない仕様にする
    /*
    $.ajax({
      url : this.props.filecrudAPI,
      data : {
        oldPath : `${this.props.dirpath}/${oldName}`,
        newPath :  `${this.props.dirpath}/${newName}`
      },
      success : () => {
        this.setState({ name : newName });
      },
      error : (err) => {
        //エラー起きたら表示
        console.log(err);
      }
    });
    */
  }

  remove(evt){
    if(this.props.remove) this.props.remove();
    /*
    $.ajax({
      url : this.props.api,
      data : {
        path : `${this.props.dirpath}/${this.state.name}`,
      },
      success : () => {
        this.props.handleRemove();
      },
      error : (err) => {
        //エラー起きたら表示
        console.log(err);
      }
    });
    */
  }

  openNewNode(isDir){
    this.setState({ newNode : { isDir : isDir } });
  }
  
  closeNewNode(){
    this.setState({ newNode : null });
  }

  addChild(name, isDir){
    const newChild = isDir ? { name : name, children : [] } : { name : name };
    this.state.data.children.push(newChild);
    this.state.data.children = this.state.data.children.sort((a, b) => {
      return a.name > b.name;
    });
    this.setState({ data : this.state.data, newNode : null });
  }

  removeChild(index){
    this.state.data.children.splice(index, 1);
    this.setState({ children : this.state.data.children });
  }

  changeChild(index, child){
    this.state.data.children[index] = child;
    this.setState({ children : this.state.data.children });
  }
}

class NewNode extends Component{
  constructor(props) {
    super(props);
    this.state = { name : "" };
  }

  render(){
    return (
      <div className="item-node new-node">
        <input value={this.state.name}
          placeholder={`新しい${this.props.isDir ? "ディレクトリ" : "ファイル"}名`}
          onChange={this.changeName.bind(this)}/>
        <button onClick={this.ok.bind(this)}>OK</button>
        <button onClick={this.cancel.bind(this)}>キャンセル</button>
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

class FileNode extends Component{
  constructor(props) {
    super(props);
    this.state = props || {};
  }

  get initialState(){
    return {
      isChangeNameOpen : false
    };
  }

  render(){
    return (
      <div className={"item-node file-node"}>
        <div className="item-icon"></div>
        <div className={`item-name item-name-change-${this.isChangeNameOpen ? "open" : "close"}`} onClick={this.openChangeName.bind(this)}>
          <input value={this.props.data.name} onChange={this.changeName}/>
        </div>
        <div className="item-menu">
            <ul>
              <li onClick={this.openChangeName.bind(this)}>名前の変更</li>
              <li onClick={this.remove.bind(this)}>削除</li>
            </ul>
        </div>
      </div>
    );
  }

  openChangeName(){
    this.setState({ isChangeNameOpen : true })
  }

  changeName(evt){
    const oldName = this.state.data.name;
    const newName = evt.target.value;
    this.state.data.name = newName;
    this.props.change(this.state.data);
    this.setState({ data : this.state.data });
    //サーバ側で権限周りの調整。相対パスは受け付けない仕様にする
    /*
    $.ajax({
      url : this.props.filecrudAPI,
      data : {
        oldPath : `${this.props.dirpath}/${oldName}`,
        newPath :  `${this.props.dirpath}/${newName}`
      },
      success : () => {
        this.setState({ name : newName });
      },
      error : (err) => {
        //エラー起きたら表示
        console.log(err);
      }
    });
    */
  }

  remove(evt){
    this.props.remove();
    /*
    $.ajax({
      url : this.props.api,
      data : {
        path : `${this.props.dirpath}/${this.state.name}`,
      },
      success : () => {
        this.props.handleRemove();
      },
      error : (err) => {
        //エラー起きたら表示
        console.log(err);
      }
    });
    */
  }
}