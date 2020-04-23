import React, {Component,} from 'react';
import './entry.css'

class Entry extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:props.data,
    };
  }

  UNSAFE_componentWillReceiveProps(props){
    this.setState({
      data: props.data
    })
  }

  onTextAreaChange = e => {
    this.setState({
      data:e.target.value,
    })
  }

  updateData = ()=>{
    this.props.updateData(this.state.data)
  }


  render(){
    const { data } = this.state;
    return (
      <div className="entry">
        <div className="entry-top">
          <div className="button primary" onClick={this.updateData}>解析</div>
        </div>
        <textarea 
          className = "text-area"
          value = {data}
          onChange= {this.onTextAreaChange}
          >
        </textarea>
      </div>
    );
  }
}

export default Entry;