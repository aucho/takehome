import React from 'react';
import "./treeNode.css";

class TreeNode extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      displayChild: true,
      colors: {
        "array": '#fb4',
        "object": '#28f',
        false: '#f00',
      },
    };
  }


  // UNSAFE_componentWillReceiveProps(nextProps){
  //   this.setState({
  //     isObject: this.isObject(nextProps.value)
  //   })
  // }

  /**
   * 根据value的类型显示下标
   */
  keySubscript=(value)=>{
    // 数组
    if(Array.isArray(value)){
      return <span className="subscript">
                {`[${value.length}]`}
              </span>
    }
    // json对象
    else if(value&&typeof(value)==='object')
      return <span className="subscript">
               {`{${Object.keys(value).length}}`}
             </span>
  }

  /**
   * 切换子节点显示状态
   */
  toggleChild=()=>{
    this.setState((state)=>{
      return{
        displayChild:!state.displayChild
      }
    })
  }

  /** 
   * 判断value类型  除"object"和"array"都返回false
   */
  isObject = (value)=>{
    if(Array.isArray(value))
      return 'array';
    // typeof(null)===object 
    else if(typeof(value)==='object'&&value!==null)
      return 'object';
    return false;
  }
  /**
   * value类型
   */

  valueType = (value)=>{
    if(Array.isArray(value))
      return 'array';
    else if(value === null)
      return 'null';
    else
      return typeof(value);
  }

  /**
   * 点击其他地方（onblur触发）向上传递 更新临时数据
   */
  cancleEdit = (e,keys,isKey,valueType="string")=>{
    // console.log(valueType)
    let operationData={
      keys,
    };
    e.stopPropagation();
    keys.shift();
    if(isKey){
      operationData.newKey = e.target.innerText;
      operationData.operation = "changeKey";
    }
    else{
      operationData.newValue = this.changeType(e.target.innerText,"string",valueType);
      operationData.operation = "changeValue";
      if (valueType==="boolean")
        e.target.innerText = operationData.newValue?"[true]":"[false]";
      else if (valueType==="null")
        e.target.innerText = "[null]"
      else
        e.target.innerText = operationData.newValue || '';
    }
    this.props.onTreeUpdate(operationData);
  }

  /**
   * 编辑该条数据
   */
  editItem = (e,keys,operation,valueType,value)=>{
    e.stopPropagation();
    keys.shift();
    let newValue = null;
    if (operation==="changeType"){
      newValue=this.changeType(value,valueType,e.target.value);
      operation = "changeValue";
    }
    this.props.onTreeUpdate({
      keys,
      operation,
      newValue,
      // curType:valueType || "unknown",
      // newType:e.target.value || null,
    })
  }

/**
 * 数据类型转换
 */
changeType = (data,curType,newType)=>{
  if (curType===newType) return data;
  switch(newType){
    case 'null': return null;
    case 'boolean': return Boolean(data);
    case 'number': return parseFloat(data);
    case 'string': 
      if (curType==='array'||curType==='object'){
        return JSON.stringify(data);
      }
      return String(data);
    case 'array': {
      let tempArr = [];
      if (curType==='object')
        for (let item in data){
          tempArr.push(data[item]);
        }
      if (curType==='string'){
        try{
          tempArr = JSON.parse(data)
          if (!Array.isArray(tempArr))
            tempArr = [];
        }
        catch(e){}
      }
      return tempArr;
    }
    case 'object': {
      let temp = {};
      if (curType==='array')
        data.forEach((item,index) => {
          temp[index]=item;
        });
      if (curType==='string'){
        try{
          temp = JSON.parse(data);
          if (Array.isArray(temp))
            temp = {};
        }
        catch(e){};
      }
      return temp;
    }
    default: return alert('something unexpected happened, have you done something strange?')

  }
}

  /**
   * 将子组件的的cancleEdit传到上一级
   */
  updateTreeData = (operationData)=>{
    this.props.onTreeUpdate(operationData);
  }


  render(){
    let { keyName, value, fatherKeys, fatherType } = this.props;
    const { displayChild, colors } = this.state;
    let options = ['array','object','string','number','boolean','null'];
    // 类型判断 特殊判断
    const isObject = this.isObject(value);
    const valueType = this.valueType(value);
    let isFirstObj = false,
    isEmptyLine = false;
    // 对于第一个treeNode
    if (!keyName && !fatherKeys && value) {
      keyName = isObject;
      fatherKeys=[];
      isFirstObj = true;
      options = ['array','object']
    }

    // 添加key到keys数组中
    const newKeys = JSON.parse(JSON.stringify(fatherKeys));
    if (keyName)
      newKeys.push(keyName);
    else
      isEmptyLine = true;
    return(
      <div className="tree-node">
        { !isEmptyLine? 
          // 键值对 或 数组位置和值 
          <div className={`key-val-pair ${isFirstObj?'first-obj ':''}${isObject?'clickable':''}`} onClick={this.toggleChild}>
            {/* key */}
            <div>
              <span className={`key ${fatherType==="array"?'array-key':''}`}
                suppressContentEditableWarning
                contentEditable={!isFirstObj&&fatherType!=="array"}
                style={{backgroundColor:colors[isObject]}}
                onClick={(e)=>{ e.stopPropagation() }}
                onBlur={(e)=>{this.cancleEdit(e,newKeys,true)}}>{keyName}</span>
              {this.keySubscript(value)}
            </div>
            {/* 根据value是否为对象(!isObject)来显示值 */}
            {
              !isObject&&
              <div className="value" 
                suppressContentEditableWarning
                contentEditable
                onBlur={(e)=>{this.cancleEdit(e,newKeys,false,valueType)}}>
                {valueType==="boolean"?(value?"[true]":"[false]"):value}
              </div>
            }
            <div style={{display:"flex", alignItems:"center"}}>
              {/* 显示数据类型和改变数据 */}
              <select className="value-type" 
                title="修改类型"
                onClick={e=>{e.stopPropagation()}}
                value={valueType}
                onChange={e=>{this.editItem(e,newKeys,"changeType",valueType,value)}}>
                {options.map((type=>{
                  return <option value={type} key={type}>{type}</option>
                }))}
              </select>
              {/* 删除按钮 */}
              {!isFirstObj&&<div className="edit-node" title="删除" onClick={ e=>{this.editItem(e,newKeys,"delete")}}>
                <span className="remove"></span>
              </div>}
            </div>
          </div>
          :
          // 空栏 用于添加新值
          <div className="key-val-pair empty-line" title="新增" onClick={e=>{this.editItem(e,newKeys,"add")}}>
            <div className="edit-node">+</div>
          </div>
        }
        {/* 子树 根据isObject确定 */}
        { isObject && displayChild &&
          Object.keys(value).map(key=>{
            return <TreeNode 
                      key={newKeys.join('') + key} 
                      value={value[key]}
                      keyName={key}
                      fatherKeys={newKeys}
                      fatherType = {isObject}
                      onTreeUpdate={this.updateTreeData}/>
          })
        }
        {/*  为子树增加空栏属性 用于添加新值 */}
        { 
          isObject && displayChild &&
          <TreeNode key={newKeys.join('') + 'treeAdderFORTHISUNIQUEOBJECT'}
            value={null} 
            keyName={null}
            fatherKeys={newKeys}
            fatherType = {isObject}
            onTreeUpdate={this.updateTreeData} />
        }
      </div>
    )
  }
}

export default TreeNode;