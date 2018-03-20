import React, { Component } from 'react'
import ModalContainer from './../containers/modalcontainer'
import FormProduct from './form-product2'
import  { Redirect } from 'react-router-dom'
import "./../containers/modal.css"
import data from './../lenguage/products.json';
import Menu from "./Menu"
var $ = require('jquery');

class Products extends Component {
	constructor(props){
		super(props);
		this.state={
			productos:[],
			pagina:1,
			paginas:0,
			modalVisible:false,
			dataModal:0,
			len: data.ingles,
			search:'',
		  menuEs: true,
		  menuEn: false};
	}

	render(){
		var contador = 0;

		return(
			<div>
			{
				this.state.menuEs && <Menu search={this.search} listar={this.listar} espanol={this.espanol} ingles={this.ingles} len={this.state.len.len}/>
			}
			{
				this.state.menuEn && <Menu search={this.search} listar={this.listar} espanol={this.espanol} ingles={this.ingles} len={this.state.len.len}/>
			}

			<div className="container" id="products">
		 	<br/>
				<h1>{this.state.len.title}</h1>
				<br/>
				<button className="btn btn-primary" onClick={(e)=>this.abrirModal({tipo:this.state.len.modal.title})}>{this.state.len.btnNew}</button>
				<table className='table'>
					<thead>
						<tr>
							<th>{this.state.len.headers.product}</th>
							<th>{this.state.len.headers.quantity}</th>
							<th>{this.state.len.headers.reorder}</th>
							<th>{this.state.len.headers.update}</th>
							<th>{this.state.len.headers.delete}</th>
						</tr>
					</thead>
					<tbody>
				{
					this.state.productos.map((data)=>{
						contador++;
						return(
							<FormProduct Contador={contador} Anterior={this.anterior} Listar={this.listar} abrirModal={this.abrirModal} {...data} key={data.id} update={this.state.len.btnUpdate} delete={this.state.len.btnDelete} titleU={this.state.len.modal.titleU}/>
						)
					})
				}
				</tbody>
				</table>
				<div>
					<div>
						<ul className="pagination">
						  <li className="page-item"><a className="page-link" onClick={this.anterior}>{this.state.len.back}</a></li>
						  <li className="page-item"><a className="page-link">{this.state.pagina}</a></li>
						  <li className="page-item"><a className="page-link" onClick={this.siguiente}>{this.state.len.next}</a></li>
						</ul>
					</div>
				</div>
			</div>
			{
				this.state.modalVisible && <ModalContainer Listar={this.listar} dataModal={this.state.dataModal} cerrarModal={this.cerrarModal} {...this.state.len.modal}/>
			}
		</div>
		)
	}

espanol = () => {
	this.setState({
		len: data.espanol,
		menuEs: true,
		menuEn: false
	})
}

ingles = () => {
	this.setState({
		len: data.ingles,
		menuEn: true,
		menuEs: false
	})
}


search = (e) =>{
	this.setState({
		search:e.target.value,
	})

}

	cerrarModal = () =>{
		this.setState({
			modalVisible:false
		});

	}
	abrirModal = (data) =>{
		this.setState({
			modalVisible:true,
			dataModal:data
		});
		console.log(this.state.modalVisible)
	}
	anterior = () =>{
		if(this.state.pagina > 1){
			this.setState({
				pagina:(this.state.pagina -= 1)
			});
			this.listar();
		}
	}

	siguiente = () =>{
		if(this.state.pagina < this.state.paginas){
			this.setState({
				pagina:(this.state.pagina += 1)
			});
			this.listar();
		}
	}

	listar = () =>{
		var self = this;
		let url
		if(this.state.search){
		   url = `./productsByName/${this.state.pagina}/${this.state.search}`
		}else {
		   url = `./products/${this.state.pagina}`
		}
		fetch(url,{
			credentials: "same-origin"
		})
		  .then(
		    function(response) {
		      if (response.status !== 200) {
		        console.log('Looks like there was a problem. Status Code: ' +
		          response.status);
		        return;
		      }
		      // Examine the text in the response
		      response.json().then(function(data) {
						console.log(data.result)
						console.log(self.state.search)
						console.log(url)
							self.setState({
								productos: data.result,
								paginas: data.total/3
							});
		      });
		    }
		  )
		  .catch(function(err) {
		    console.log('Fetch Error :-S', err);
		  });
	}

	componentDidMount(){
		console.log(this.state.len.len)
		this.listar();
	}
}

export default Products;
