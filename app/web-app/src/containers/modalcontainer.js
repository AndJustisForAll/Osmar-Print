import React, { Component } from 'react';
import { createPortal } from 'react-dom';
var $ = require('jquery');

class ModalContainer extends Component {
	constructor(props){
		super(props);
		this.state = {id:0, name:0, stock:0, reorder:0};
	}
	render(){
		return(
			createPortal(
				<div className="form-modal">
					<div className="form-modal">
						<form className="form" onSubmit={this.listo}>
							{
								this.props.dataModal.tipo == "Agregar" || this.props.dataModal.tipo == "Add" ?

								<div>
								<h1>{this.props.title}</h1>
								<div className="form-group">
									<label>{this.props.name}</label>
									<input type="text" name ="name" className="form-control"/>
								</div>
								<div className="form-group">
									<label>{this.props.quantity}</label>
									<input type="text" name ="stock" className="form-control"/>
								</div>
								<div className="form-group">
									<label>{this.props.reorder}</label>
									<input type="text" name ="reorder" className="form-control"/>
								</div>
								</div>
								:
								<div>
								<h1>{this.props.titleU}</h1>
								<div className="form-group">
									<label>{this.props.name}</label>
									<input type="text" name ="name" className="form-control"
									onChange={this.onChange}
									value={this.state.name}/>
								</div>
								<div className="form-group">
									<label>{this.props.quantity}</label>
									<input type="text" name ="stock" className="form-control"
									onChange={this.onChange}
									value={this.state.stock}/>
								</div>
								<div className="form-group">
									<label>{this.props.reorder}</label>
									<input type="text" name ="reorder" className="form-control"
									onChange={this.onChange}
									value={this.state.reorder}/>
								</div>
								</div>
							}
							<div className="from-group">
								<button className="btn btn-warning button" onClick={this.props.cerrarModal}>{this.props.btnClose}</button>
								<button className="btn btn-primary button">{this.props.btnAccept}</button>
							</div>

						</form>
					</div>
				</div>,
				document.getElementById('Modal')
			)
		)
	}

	componentDidMount(){
		this.setState({
			id:this.props.dataModal.id,
			name:this.props.dataModal.name,
			stock:this.props.dataModal.stock,
			reorder:this.props.dataModal.reorder
		})
	}
	onChange=(e)=>{
		this.setState({
			[e.target.name]:e.target.value
		})
	}
	listo=(e)=>{
		e.preventDefault();
		var self = this;
		if(self.props.dataModal.tipo == "Agregar"){
			var data = $('.form').serialize();
			$.ajax({
				url:'/register_product',
				type : "POST",
				data:data,
				success: function(){
					console.log("hola")
					self.props.cerrarModal();
					self.props.Listar();
				},
				error: function(){
					alert('error al agregar');
				}
			});
		}
		else{
			var data ={id:self.state.id, name:self.state.name, stock:self.state.stock, reorder:self.state.reorder};
			$.ajax({
				url:'/update_product',
				type : "POST",
				data:data,
				success: function(){
					self.props.cerrarModal();
					self.props.Listar();
				},
				error: function(){
					alert('error al modificar');
				}
			});
		}
	}
}

export default ModalContainer;
