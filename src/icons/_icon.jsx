import React, { Component } from "react"


export default class Icon extends Component{
  constructor(props, context){
    super(props, context);
    this.state = Object.assign(this.initialState, this.props);

  }

  get initialState(){
    return {
      hover : false,
      color : "#000000",
      hoverColor : null,
      cursor : "default",
      width : "12",
      height : "12",
      viewBox : "0 0 24 24",
    }
  }
  
  render(){
    const style = {
      fill : this.state.hover ? (this.state.hoverColor || this.state.color) : this.state.color,
      cursor : this.state.cursor,
      transition : "all 0.2s",
      verticalAlign : "middle"
    };
    return (
      <svg style={style}
        width={this.state.width}
        height={this.state.height}
        viewBox={this.state.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        onClick={this.props.onClick}
        onMouseOver={this.handleMouseOver.bind(this)}
        onMouseOut={this.handleMouseOut.bind(this)}
      >
        {this.props.children}
      </svg>
    );
  }

  handleMouseOver(){
    this.setState({ hover : true })
  }
  handleMouseOut(){
    this.setState({ hover : false })
  }
}