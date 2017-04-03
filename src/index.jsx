import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class DirNode extends Component{
  constructor(props){
    super(props);
    this.state = Object.assign(this.initialState, props);
  }
  get initialState(){
    return {
      isChildrenOpen : false,
      newNode : null
    }
  }

  render(){
    return (
      <div className="item-node dir-node">
        <div className={`item-children item-children-${this.state.isChildrenOpen ? "open" : "close"}`} onClick={}></div>
        <div className="item-icon"></div>
        <div className="item-name"><input value={this.state.data.name} onChange={this.handleChangeName}/></div>
        <div className="item-menu">
          <ul>
            <li onClick={this.openNewNode.bind(this, false)}>ファイルを追加</li>
            <li onClick={this.openNewNode.bind(this, true)}>ディレクトリを追加</li>
            <li onClick={this.changeName.bind(this)}>名前の変更</li>
            <li onClick={}>削除</li>
          </ul>
        </div>
        <div className="children">
          {this.renderNewNode()}
          {this.renderChildren()}
        </div>
      </div>
    );
  }

  renderChildren(){
    this.state.children.map((child, index) => {
      if(child.children) return <DirNode data={child} remove={this.removeChild.bind(this, index)}/>;
      else return <FileNode data={child} remove={this.removeChild.bind(this, index)}/>;
    });
  }
  renderNewNode(){
    return this.state.newNode ? <NewNode isDir={this.state.newNode.isDir}/> : <div></div>;
  }

  changeName(evt){
    const oldName = this.state.data.name;
    const newName = evt.target.value;
    this.state.data.name = newName;
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
    this.props.handleRemove();
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
    const newChild = isDir ? { name : "", children : [] } : { name : name };
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
        <input value={this.state.name} placeholder={`新しい${this.props.isDir ? "ディレクトリ" : "ファイル"}名`} onChange={this.handleChangeName}/>
        <button onClick={this.ok.bind(this)}>OK</button>
        <button onClick={this.cancel.bind(this)}>キャンセル</button>
      </div>
    );
  }
  handleNameChange(evt){
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
        <div className={`item-name item-name-change-${this.isChangeNameOpen ? "open" : "close"}`} onClick={}>
          <input value={this.state.data.name} onChange={this.changeName}/>
        </div>
        <div className="item-menu">
            <ul>
              <li onClick={}>名前の変更</li>
              <li onClick={this.remove.bind(this)}>削除</li>
            </ul>
        </div>
      </div>
    );
  }

  startChangeName(){

  }

  changeName(evt){
    const oldName = this.state.data.name;
    const newName = evt.target.value;
    this.state.data.name = newName;
    this.props.handleChange(this.state.data);
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
    this.props.handleRemove();
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

class RootNode extends Component{
  constructor(props) {
    super(props);
    //props.dirpath -> "/"
  }
  get initialState(){
    return {
      
    }
  }
  render(){
    return (<div></div>);
  }
}