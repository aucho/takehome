import React, { Component } from "react";
import Showcase from "./showcase/showcase"
import Entry from "./entry/entry"
import "./styles.css";

export class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      entryData: '["hello",{"apple":1},{"banana":["ba","na",1]}]', // 给entry的数据 赋个初值
      treeData: [] // 给showcase的数据 上面的字符串版本
    }
  }

  updateEntryData = treeData=>{
    try{
      console.log(treeData);
      const entryData = JSON.stringify(treeData)
      this.setState({
        entryData,
      })
    }
    catch(e){
      alert("Somthing wrong occured, what have you done?")
    }
  }

  updateTreeData = entryData=>{
    try{
      const treeData = JSON.parse(entryData)
      this.setState({
        treeData
      })
    }
    catch(e){
      alert("数据格式错误，请检查")
    }
  }

  render(){
    return (
      <div>
        <Entry updateData={this.updateTreeData} data={this.state.entryData} />
        <Showcase updateData={this.updateEntryData} data={this.state.treeData} />
      </div>
    );
  }
}
