import React, { Component } from 'react';
var $ = require('jquery');
class User extends Component {
	constructor(props){
		super(props);
	}
	render(){
		return(
			<tr>
				<td>{this.props.username}</td>
				<td>{this.props.name}</td>
				<td>{this.props.lastname}</td>
				<td>{this.props.level}</td>
				<td>
					<button
					className="btn btn-warning"
					onClick={(e)=>this.props.abrirModal({
						tipo:'Modificar',
						id:this.props.id_user,
						username:this.props.username,
						name:this.props.name,
						lastname:this.props.lastname,
						level:this.props.level
					})}>
					Update
					</button>
				</td>
				<td>
					<button
					className="btn btn-danger"
					onClick={this.Eliminar}>
					Delete
					</button>
				</td>
			</tr>
		)
	}
	Eliminar=()=>{
		var r = window.confirm("Esta seguro de eliminar el Usuario " + this.props.id_user + "-" +this.props.username);
		var self = this;
		if(r){
			$.ajax({
				url:"/delete_user/"+self.props.id_user,
				type:"POST",
				success:function(){
					self.props.Listar();
				},
				error:function(){
					alert('error al eliminar');
					console.log(self.props.id);
				}
			});
		}
	}
}

export default User;
