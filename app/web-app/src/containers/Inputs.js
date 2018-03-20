import React, { Component } from 'react';
import InputLayout from './../components/inputLayout';
import Product from './product';
import './inputs.css';
var $ = require('jquery');

class Inputs extends Component {
	constructor(props){
		super(props);
		this.state={
			productos:[],
			pagina:1,
			paginas:0};
	}
	render(){
		return(
			<div className="container">

			<InputLayout listar={this.listar}>
				{
					this.state.productos.map((item)=>{

						return<Product listar={this.listar} {...item} key={item.id} />
					})
				}
			</InputLayout>
				<div className="paginacion">
					<div>
						<ul class="pagination">
						  <li class="page-item"><a class="page-link" onClick={this.anterior}>Anterior</a></li>
						  <li class="page-item"><a class="page-link">{this.state.pagina}</a></li>
						  <li class="page-item"><a class="page-link" onClick={this.siguiente}>Siguiente</a></li>
						</ul>
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
		console.log("Pagina: "+this.state.pagina);
	}

	listar = () =>{
		var self = this;
		$.get({
			url:'/products/' + self.state.pagina
		}).done((data)=>{
			self.setState({
				productos:data.result,
				paginas:(data.total/3)
			});
		})
	}
	componentDidMount(){
		this.listar();
	}
}

export default Inputs;
