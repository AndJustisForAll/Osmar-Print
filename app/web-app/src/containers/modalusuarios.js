import React, { Component } from 'react';
import { createPortal } from 'react-dom';
var $ = require('jquery');



class ModalContainer extends Component {
	constructor(props){
		super(props);
		this.state = {id:0, name:0, lastname:0, username:0, level:0, password:""};
	}
	render(){
		return(
			createPortal(
				<div className="form-modal">
					<div className="form-modal">
						<form className="form" onSubmit={this.listo}>
						<h1>Add</h1>
							{
								this.props.dataModal.tipo == "Agregar" ?
								<div>
								<div className="form-group">
									<label>User</label>
									<input type="text" name ="username" className="form-control"/>
								</div>
								<div className="form-group">
									<label>Name</label>
									<input type="text" name ="name" className="form-control"/>
								</div>
								<div className="form-group">
									<label>Lastname</label>
									<input type="text" name ="lastname" className="form-control"/>
								</div>
								<div className="form-group">
									<label>Level</label>
									<input type="text" name ="level" className="form-control"
									onKeyPress={this.soloNumeros}/>
								</div>
								<div className="form-group">
									<label>Password</label>
									<input type="text" name ="password" className="form-control"/>
								</div>
								</div>
								:
								<div>
								<div className="form-group">
									<label>User</label>
									<input type="text" name ="username" className="form-control"
									onChange={this.onChange}
									value={this.state.username}/>
								</div>
								<div className="form-group">
									<label>Name</label>
									<input type="text" name ="name" className="form-control"
									onChange={this.onChange}
									value={this.state.name}/>
								</div>
								<div className="form-group">
									<label>Lastname</label>
									<input type="text" name ="lastname" className="form-control"
									onChange={this.onChange}
									value={this.state.lastname}/>
								</div>
								<div className="form-group">
									<label>Level</label>
									<input type="text" name ="level" className="form-control"
									onKeyPress={this.soloNumeros}
									onChange={this.onChange}
									value={this.state.level}/>
								</div>
								<div className="form-group">
									<label>Password</label>
									<input type="password" name ="password" className="form-control"
									onChange={this.onChange}
									value={this.state.password}/>
								</div>
								</div>
							}
							<button className="btn btn-warning" onClick={this.props.cerrarModal}>Close</button>
							<button className="btn btn-primary">Accept</button>
						</form>
					</div>
				</div>,
				document.getElementById('Modal')
				)
		)
	}
	soloNumeros=(e)=>{
    var key = window.event ? e.which : e.keyCode;
    if (key < 48 || key > 57) {
        //Usando la definición del DOM level 2, "return" NO funciona.
        e.preventDefault();
	}
    }
	componentDidMount=()=>{
		this.setState({
			id:this.props.dataModal.id,
			username:this.props.dataModal.username,
			name:this.props.dataModal.name,
			lastname:this.props.dataModal.lastname,
			level:this.props.dataModal.level
		})
	}
	onChange=(e)=>{
		this.setState({
			[e.target.name]:e.target.value
		})
	}
//	validacion=(_data)=>{
//		console.log(_data[0].name.value);
//		var error;
//		var vali = false;
//		if(_data[0].name.value == ""){
//			error = "Se requiere el nombre";
//			return {error, vali}
//		}
//		else{
//			if(_data[0].stock.value == ""){
//				error = "Se requiere una cantidad";
//				return {error, vali}
//			}
//			else{
//				if(_data[0].reorder.value == ""){
//					error = "Se requiere un reorden"
//					return {error, vali}
//				}
//				else{
//					vali = true;
//					return {error, vali}
//				}
//			}
//		}
//		return {error, vali}
//	}
	listo=(e)=>{
		e.preventDefault();
		var self = this;
		if(self.props.dataModal.tipo == "Agregar"){
			var data = $('.form').serialize();
			//var validacion = this.validacion(data);
			//if(validacion.vali){
			$.ajax({
				url:'/signup',
				type : "POST",
				data:data,
				success: function(){
					self.props.cerrarModal();
					self.props.Listar();
				},
				error: function(){
					alert('error al agregar');
				}
			});
		//	}
			//else{
			//	alert(validacion.error);
			//}
		}
		else{
			var data ={id:self.state.id, username:self.state.username, name:self.state.name, lastname:self.state.lastname, level:self.state.level, password:self.state.password};
			$.ajax({
				url:'/update_user',
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
