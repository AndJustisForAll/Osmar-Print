import React,{ Component } from 'react';
import './product.css';
var $ = require('jquery');

class Salidas extends Component{
	constructor(props){
		super(props);
	}

render(){
  return(
    <tr>
      <td>{this.props.id}</td>
      <td>{this.props.product}</td>
      <td>{this.props.quantity}</td>
      <td>{this.props.date}</td>
      <td>{this.props.username}</td>
    </tr>
  )
}
}

export default Salidas;
