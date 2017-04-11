import React, {Component} from 'react';
import $ from 'jquery';
import { DragSource } from "react-dnd";
import SettingIcon from "./icons/setting";
import FileIcon from "./icons/file";

export class FileNode extends Component{
  constructor(props, context) {
    super(props, context);
    this.state = Object.assign(this.initialState, props);
  }

  get initialState(){
    return {
      isChangeNameOpen : false
    };
  }

  render(){
    const { connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div className={"item-node file-node"}>
        <div className="item-header">
          <div className="item-icon">
            <FileIcon/>
          </div>
        {this.renderName()}
        <div className="item-menu">
            <div className="item-menu-icon">
              <SettingIcon/>
            </div>
            <ul className="item-menu-list">
              <li onClick={this.openChangeName.bind(this)}>名前の変更</li>
              <li onClick={this.remove.bind(this)}>削除</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  renderName(){
    if(this.state.isChangeNameOpen){
      return (
        <div className={`item-name item-name-${this.state.isChangeNameOpen ? "open" : "close"}`}>
          <input className="input" readOnly={false}
                 value={this.props.data.name}
                 onChange={this.changeName.bind(this)}/>
          <button className="button" onClick={this.ok.bind(this)}>変更</button>
          <button className="button" onClick={this.cancel.bind(this)}>キャンセル</button>
        </div>
      );
    }else{
      return (
        <div className={`item-name item-name-${this.state.isChangeNameOpen ? "open" : "close"}`}>
          <input className="input" readOnly={true} value={this.props.data.name}/>
        </div>
      );
    }
  }

  openChangeName(){
    this.setState({ prevName : this.state.data.name, isChangeNameOpen : true })
  }

  changeName(evt){
    const oldName = this.state.data.name;
    const newName = evt.target.value;
    this.state.data.name = newName;
    this.setState({ data : this.state.data });
  }

  ok(){
    if(this.props.change) this.props.change(this.state.data);
    this.setState({ prevName : null, isChangeNameOpen : false });
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
  
  cancel(){
    this.state.data.name = this.state.prevName;
    this.setState({ data : this.state.data, prevName : null, isChangeNameOpen : false });
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

  handleDrop(evt){
    console.log(evt);
  }
}

const fileSource = {
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

export const FileNodeDnD = DragSource('item-node', fileSource, sourceCollect)(FileNode);