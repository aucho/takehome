import React from 'react';
import TreeNode from './component/treeNode'
import './showcase.css'
class Showcase extends React.Component {
  constructor(props){
    super(props);
    const treeData = JSON.parse(JSON.stringify(props.data||{}));
    this.state = {
      treeData,
      // copyData: JSON.stringify(props.data)
    };
  }

  // static getDerivedStateFromProps(nextProps,prevState){
  //   const {copyData} = prevState;
  //   const {data} = nextProps;
  //   const treeData = JSON.parse(JSON.stringify(data||{}));
  //   if (copyData!==JSON.stringify(data)){
  //     console.log("weeeeeeeeeeeeeeeeeeeeeeeeeee")
  //     return{
  //       treeData
  //     }      
  //   }
  //   return
  // }
  
  UNSAFE_componentWillReceiveProps(nextProps){
    if (JSON.stringify(this.props.data)!== JSON.stringify(nextProps.data)){
      // console.log('exe')
      const treeData = JSON.parse(JSON.stringify(nextProps.data||{}));
      this.setState({
        treeData
      })      
    }
  }

  
/**
 * 数据遍历
 * 每个key 和 value传入TreeNode（数组的话就是序号和值）
 * value 为对象或数组时 执行递归
 */
  // traverseData=(data, level=0)=>{
  //   let newArr = [];
  //   level++;
  //   if(typeof(data)!=="object") return data;
  //   if(Array.isArray(data))
  //     data.forEach((val, index)=>{
  //       newArr.push(<TreeNode 
  //                     key={index}
  //                     keys={index}
  //                     value={this.traverseData(data[index])}
  //                     level={level}></TreeNode>);
  //     })
  //   else{
  //     for(let keys in data)
  //       newArr.push(<TreeNode 
  //                     key={keys+level}
  //                     keys={keys}
  //                     value={this.traverseData(data[keys])}
  //                     level={level}></TreeNode>);      
  //   }
  //   return newArr;
  // }


/**
 * 递归遍历以更新数据 
 */
  updateData = (data, operationData)=> {
    let { keys, operation, newKey, newValue } = operationData;
    // 定位到最里面的键值对(add操作为倒数第二层)
    if(keys.length===1){
      // 更新key
      if(operation==="changeKey"&&newKey&&newKey!==keys[0]){
        data[newKey] = JSON.parse(JSON.stringify(data[keys[0]]));
        delete data[keys[0]];
      }
      // 更新value
      if(operation==="changeValue"){
        data[keys[0]]=newValue;
      }
      // 删除
      if(operation==="delete"){
        // console.log(data[keys[0]]);
        delete data[keys[0]];
      }
      // 添加
      if(operation==="add"){
        if(Array.isArray(data[keys[0]])){
          data[keys[0]].push("edit value here");
        }
        else if (data[keys[0]]&&typeof(data[keys[0]])==="object"){
          data[keys[0]]["EDIT KEY HERE"]="EDIT VALUE HERE";
        }
      }
      // 修改类型
      // if(operation==="changeType"){
      //   data[keys[0]] = this.changeType(data[keys[0]],curType,newType);
      //   console.log("---changed son---");
      //   console.log(data[keys[0]]);
      // }
      return
    }

    if (keys.length===0){
      // 更新value
      if(operation==="changeValue"){
        return newValue;
      }
    
      // 添加
      if(operation==="add"){
        if(Array.isArray(data)){
          data.push("EDIT VALUE HERE");
        }
        else if (data&&typeof(data)==="object"){
          data["EDIT KEY HERE"]="EDIT VALUE HERE";
        }
      }
      return
    }

    let nextKey = keys.shift();
    return this.updateData(data[nextKey], operationData);
  }
  /**
   * 更新数据 
   */

  updateTreeData = (operationData)=>{
    this.setState(state=>{
      let data = state.treeData;
      let temp = this.updateData(data, operationData);
      if (temp) data = temp;
      return{
        treeData: data,
      }
    })
    // console.log("---treeData---")
    // console.log(this.state.treeData);
    // console.log("---operationData---")
    // console.log(operationData);
  }

  resume=()=>{
    this.setState((state,props)=>{
      return {
        treeData: JSON.parse(JSON.stringify(props.data)),
      }
    })
  }

  updateToEntry=()=>{
    // console.log("a")
    this.props.updateData(this.state.treeData)
  }


  render(){
    const { treeData } = this.state;
    return(
      <div className="showcase">
        <div className="top">
          <div className="button primary" onClick={this.updateToEntry}>更新</div>
          <div className="button default" onClick={this.resume}>恢复</div>
        </div>
        <div className="tree">
          <TreeNode key="root" value={treeData} onTreeUpdate={this.updateTreeData}/>          
        </div>
      </div>
    )
  }
}

export default Showcase;