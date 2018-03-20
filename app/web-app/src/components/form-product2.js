import React, { Component } from 'react';
var $ = require('jquery');


class FormProduct extends Component {
	constructor(props){
		super(props);
	}
	render(){
		return(
			<tr>
				<td>{this.props.name}</td>
				<td>{this.props.stock}</td>
				<td>{this.props.reorder}</td>
				<td>
					<button
					className="btn btn-warning"
					onClick={(e)=>this.props.abrirModal({
						tipo: this.props.titleU,
						id:this.props.id,
						name:this.props.name,
						stock:this.props.stock,
						reorder:this.props.reorder
					})}>
					{this.props.update}
					</button>
				</td>
				<td>
					<button
					className="btn btn-danger"
					onClick={this.Eliminar}>
					{this.props.delete}
					</button>
				</td>
			</tr>
		)
	}

	Eliminar=()=>{
		var r = window.confirm("Esta seguro de eliminar el producto " + this.props.id + "-" +this.props.name);
		var self = this;
		if(r){
			$.ajax({
				url:"/delete_product/"+self.props.id,
				type:"POST",
				success:function(data){
					console.log(data)
					if(self.props.Contador < 2){
						 self.props.Anterior();
					}
				},
				error:function(error){
					console.log(error.responseText)
					alert('Algo salio mal');
				}
			});
		}
	}
}

export default FormProduct;
