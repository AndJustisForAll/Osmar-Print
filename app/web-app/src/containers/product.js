import React,{ Component } from 'react';
import './product.css';
var $ = require('jquery');

class Product extends Component{
	constructor(props){
		super(props);
	}

	Sumar = () =>{
		var data = {id_product:this.props.id, quantity:$('#'+this.props.id).val()}
		var self = this;

		if(data.value != '') {
			$.ajax({
				type : "POST",
				url:'/inputs_outputs',
				data: data,
				success: function(answer){
					if(answer == 'ok'){
						self.props.listar();
						$('#'+self.props.id).val('');
					}
					else{
						alert('error');
					}
				},
				error: function(){
					console.log('error en la conexion');
				}
			});
		}
		else
		{
			alert('ingrese un valor');
		}
	}
	render(){
		return(
			<tr>
				<td>{this.props.id} {this.props.name}</td>
				<td>{this.props.stock}</td>
				<td><input id={this.props.id} className="inputNumber" type="number" min="9"/></td>
				<td>
					<button
						onClick={this.Sumar}
						className="btn btn-primary">
						Listo
					</button>
				</td>
			</tr>
		)
	}
}

export default Product;
