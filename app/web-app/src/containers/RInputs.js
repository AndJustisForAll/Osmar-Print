import React, { Component } from 'react';
import RInputLayout from './../components/RInputLayout.js'
import Salidas from './Salidas'
import Menu from "./../components/Menu"
var $ = require('jquery');

class RInputs extends Component {
	constructor(props){
		super(props);
		this.state={productos:[], pagina:1, paginas:0};
	}
	render(){
		return(
			<div>
				<Menu/>
			<div className="container">
			<RInputLayout listar={this.listar}>
			{
				this.state.productos.map((item)=>{

					return<Salidas listar={this.listar} {...item} key={item.id} />
				})
			}
		</RInputLayout>
				<div className="paginacion">
					<div>
						<ul className="pagination">
						  <li className="page-item"><a className="page-link" onClick={this.anterior}>Anterior</a></li>
						  <li className="page-item"><a className="page-link">{this.state.pagina}</a></li>
						  <li className="page-item"><a className="page-link" onClick={this.siguiente}>Siguiente</a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		)
	}
	anterior = () =>{
		if(this.state.pagina > 1){
			this.setState({
				pagina:(this.state.pagina -= 1)
			});
			this.listar();

		}
		console.log(this.state.pagina);
	}
	siguiente = () =>{
		if(this.state.pagina < this.state.paginas){
			this.setState({
				pagina:(this.state.pagina += 1)
			});
			this.listar();

		}
		console.log(this.state.pagina);
	}
	listar = () =>{
		var self = this;
		$.get({
			url:'/view_inputs/'+ this.state.pagina
		}).done((data)=>{
			self.setState({
				productos:data.result,
				paginas:(data.total/5)
			});
		})
	}
	componentDidMount(){
		this.listar();
	}
}

export default RInputs;
