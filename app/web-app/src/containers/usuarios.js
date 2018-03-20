import React, { Component } from 'react';
import Usuario from './../components/usuarios'
import ModalContainer from './modalusuarios';
import data from './../lenguage/users.json';
import Menu from "./../components/Menu"
var $ = require('jquery');

class Usuarios extends Component {
	constructor(props){
		super(props);
		this.state={usuarios:[], pagina:1, paginas:0, visto:false, dataModal:0, search:"", len: data.english};
	}

 componentWillMount(){
    if(this.state.len == "spanish")
    {
			console.log("hola")
      this.setState({
        len: data.espanol
      })
    }else if(this.state.len == "english"){
			console.log("holaaa")
      this.setState({
        len: data.english
      })
    }else{
			console.log(this.state.len)
		}
	}

	render(){
		return(
			<div>
			<Menu listar={this.listar} search={this.search}/>
				<div className="row">
					<div className="col-md-2 col-xs-2"></div>
					<div className="col-md-8 col-xs-8">
						<h1>Users</h1>
						<button className="btn btn-primary margin-abajo" onClick={(e)=>this.abrirModal({tipo:'Agregar'})}>Add</button>
					</div>
					<div className="col-md-2 col-xs-2">

					</div>
				</div>
				<div className="row">
					<div className="col-md-2 col-xs-2"></div>
						<div className="col-md-8 col-xs-8">

						</div>
					<div className="col-md-2 col-xs-2">

					</div>
				</div>
				<div className="row">

					<div className="col-md-2 col-xs-2"></div>
					<div className="col-md-8 col-xs-8">

						<table className='table'>
							<thead>
								<tr>
									<th>User</th>
									<th>Name</th>
									<th>Lastname</th>
									<th>Level</th>
									<th>Update</th>
									<th>Delete</th>
								</tr>
							</thead>
							<tbody>
						{
							this.state.usuarios.map((data)=>{
								return(
									<Usuario Listar={this.listar} abrirModal={this.abrirModal} {...data} key={data.id_user} />
								)
							})
						}
						</tbody>
						</table>
						<div className="paginacion">
							<div>
								<ul className="pagination">
								  <li className="page-item"><a className="page-link" onClick={this.anterior}>Back</a></li>
								  <li className="page-item"><a className="page-link">{this.state.pagina}</a></li>
								  <li className="page-item"><a className="page-link" onClick={this.siguiente}>Next</a></li>
								</ul>
							</div>
						</div>
						{
							this.state.visto && <ModalContainer Listar={this.listar} dataModal={this.state.dataModal} cerrarModal={this.cerrarModal}/>
						}
					</div>
					<div className="col-md-2 col-xs-2"></div>
				</div>
			</div>
		)
	}

	search = (e) =>{
		this.setState({
			search:e.target.value,
		})
	}

	cerrarModal = () =>{
		this.setState({
			visto:false
		});
	}

	abrirModal = (data) =>{
		this.setState({
			visto:true,
			dataModal:data
		});
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
		   url = `./usersByName/${this.state.pagina}/${this.state.search}`
		}else {
		   url = `./users/${this.state.pagina}`
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
							self.setState({
								usuarios: data.result,
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
		this.listar();
		console.log(this.props.lent)
	}
}

export default Usuarios;
