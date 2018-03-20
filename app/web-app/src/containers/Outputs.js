import React, { Component } from 'react';
import OutputLayout from './../components/outputLayout'
import Product from './product'
var $ = require('jquery');

class Outputs extends Component {
	constructor(props){
		super(props);
		this.state={productos:[], pagina:1, paginas:0};
	}
	render(){
		return(
			<div className="container">
			<OutputLayout listar={this.listar}>
			{
				this.state.productos.map((item)=>{

					return<Product listar={this.listar} {...item} key={item.id} />
				})
			}
			</OutputLayout>
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
			url:'/products/'+ this.state.pagina
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

export default Outputs;
